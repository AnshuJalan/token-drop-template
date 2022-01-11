import smartpy as sp

MerkleHashes = sp.io.import_script_from_url("file:helpers/merkle_hashes.py")
MerkleTree = sp.io.import_script_from_url("file:utils/merkle_tree.py").MerkleTree
Errors = sp.io.import_script_from_url("file:utils/errors.py")
Addresses = sp.io.import_script_from_url("file:helpers/addresses.py")
FA12 = sp.io.import_script_from_url("file:tokens/fa12.py")


class Types:
    CLAIM_PARAMS = sp.TRecord(proof=sp.TList(sp.TBytes), leaf=sp.TBytes).layout(("proof", "leaf"))

    LEAF_DATA = sp.TRecord(address=sp.TAddress, value=sp.TNat).layout(("address", "value"))

    TRANSFER_PARAMS = sp.TRecord(address=sp.TAddress, value=sp.TNat).layout(("address", "value"))


class TokenDropFA12(sp.Contract):
    def __init__(
        self,
        admin=Addresses.ADMIN,
        token_address=Addresses.TOKEN,
        merkle_root=sp.bytes("0x00"),
        claimed=sp.big_map(l={}, tkey=sp.TAddress, tvalue=sp.TUnit),
    ):
        self.init(
            admin=admin,
            token_address=token_address,
            merkle_root=merkle_root,
            claimed=claimed,
        )

    @sp.entry_point
    def claim(self, params):
        sp.set_type(params, Types.CLAIM_PARAMS)

        # Verify that the user has not already claimed
        sp.verify(~self.data.claimed.contains(sp.sender), Errors.ADDRESS_HAS_ALREADY_CLAIMED)

        # Verify that the computed merkle root from proof matches the actual merkle root
        sp.verify(
            MerkleTree.compute_merkle_root(params.proof, params.leaf) == self.data.merkle_root,
            Errors.INVALID_MERKLE_PROOF,
        )

        # Unpack leaf data
        leaf_data = sp.unpack(params.leaf, Types.LEAF_DATA).open_some(Errors.INVALID_LEAF)

        # Verify that the address provided in the leaf matches the sender
        sp.verify(leaf_data.address == sp.sender, Errors.LEAF_ADDRESS_DOES_NOT_MATCH_SENDER)

        # Transfer tokens to the sender (claimer)
        c_token = sp.contract(
            sp.TRecord(from_=sp.TAddress, to_=sp.TAddress, value=sp.TNat).layout(
                (
                    "from_ as from",
                    ("to_ as to", "value"),
                )
            ),
            self.data.token_address,
            "transfer",
        ).open_some()
        sp.transfer(
            sp.record(from_=sp.self_address, to_=sp.sender, value=leaf_data.value),
            sp.tez(0),
            c_token,
        )

        # Mark as claimed
        self.data.claimed[sp.sender] = sp.unit

    @sp.entry_point
    def transfer_tokens(self, params):
        sp.set_type(params, Types.TRANSFER_PARAMS)

        # Verify the sender is admin
        sp.verify(sp.sender == self.data.admin, Errors.NOT_AUTHORISED)

        # Transfer tokens to specified address
        c_token = sp.contract(
            sp.TRecord(from_=sp.TAddress, to_=sp.TAddress, value=sp.TNat).layout(
                (
                    "from_ as from",
                    ("to_ as to", "value"),
                )
            ),
            self.data.token_address,
            "transfer",
        ).open_some()
        sp.transfer(
            sp.record(from_=sp.self_address, to_=params.address, value=params.value),
            sp.tez(0),
            c_token,
        )


if __name__ == "__main__":
    ########
    # claim
    ########
    @sp.add_test(name="claim transfers tokens correctly")
    def test():
        scenario = sp.test_scenario()

        token = FA12.FA12(Addresses.ADMIN)
        drop = TokenDropFA12(token_address=token.address, merkle_root=MerkleHashes.MERKLE_ROOT)

        scenario += token
        scenario += drop

        # Mint tokens for drop contract
        scenario += token.mint(address=drop.address, value=1000).run(sender=Addresses.ADMIN)

        # when ALICE tries to claim her tokens
        scenario += drop.claim(proof=MerkleHashes.PROOF_ALICE, leaf=MerkleHashes.LEAF_DATA_ALICE).run(
            sender=Addresses.ALICE
        )

        # ALICE receives correct number of tokens
        scenario.verify(token.data.balances[Addresses.ALICE].balance == 100)

        # when BOB tries to claim her tokens
        scenario += drop.claim(proof=MerkleHashes.PROOF_BOB, leaf=MerkleHashes.LEAF_DATA_BOB).run(sender=Addresses.BOB)

        # BOB receives correct number of tokens
        scenario.verify(token.data.balances[Addresses.BOB].balance == 200)

        # Correct storage updates take place in drop contract
        scenario.verify(drop.data.claimed.contains(Addresses.ALICE))
        scenario.verify(drop.data.claimed.contains(Addresses.BOB))

    @sp.add_test(name="claim fails if address has already claimed")
    def test():
        scenario = sp.test_scenario()

        drop = TokenDropFA12(
            merkle_root=MerkleHashes.MERKLE_ROOT,
            claimed=sp.big_map(l={Addresses.ALICE: sp.unit}),
        )

        scenario += drop

        # when ALICE tries to claim her tokens it fails
        scenario += drop.claim(proof=MerkleHashes.PROOF_ALICE, leaf=MerkleHashes.LEAF_DATA_ALICE).run(
            sender=Addresses.ALICE, valid=False, exception=Errors.ADDRESS_HAS_ALREADY_CLAIMED
        )

    @sp.add_test(name="claim fails if bad proof is provided")
    def test():
        scenario = sp.test_scenario()

        drop = TokenDropFA12(merkle_root=MerkleHashes.MERKLE_ROOT)

        scenario += drop

        # when ALICE tries to claim her tokens with BOB's proof
        scenario += drop.claim(proof=MerkleHashes.PROOF_BOB, leaf=MerkleHashes.LEAF_DATA_ALICE).run(
            sender=Addresses.ALICE, valid=False, exception=Errors.INVALID_MERKLE_PROOF
        )

    @sp.add_test(name="claim fails if sender sends incorrect address in leaf")
    def test():
        scenario = sp.test_scenario()

        drop = TokenDropFA12(merkle_root=MerkleHashes.MERKLE_ROOT)

        scenario += drop

        # when ALICE tries to claim her tokens with BOB's address
        scenario += drop.claim(proof=MerkleHashes.PROOF_BOB, leaf=MerkleHashes.LEAF_DATA_BOB).run(
            sender=Addresses.ALICE, valid=False, exception=Errors.LEAF_ADDRESS_DOES_NOT_MATCH_SENDER
        )

    ##################
    # transfer_tokens
    ##################
    @sp.add_test(name="transfer_tokens works correctly")
    def test():
        scenario = sp.test_scenario()

        token = FA12.FA12(Addresses.ADMIN)
        drop = TokenDropFA12(token_address=token.address, merkle_root=MerkleHashes.MERKLE_ROOT)

        scenario += token
        scenario += drop

        # Mint tokens for drop contract
        scenario += token.mint(address=drop.address, value=1000).run(sender=Addresses.ADMIN)

        # when ADMIN tries to transfer tokens to ALICE
        scenario += drop.transfer_tokens(address=Addresses.ALICE, value=100).run(sender=Addresses.ADMIN)

        # ALICE receives correct number of tokens
        scenario.verify(token.data.balances[Addresses.ALICE].balance == 100)

    sp.add_compilation_target("token_drop_fa12", TokenDropFA12())
