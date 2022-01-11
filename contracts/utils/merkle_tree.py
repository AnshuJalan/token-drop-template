# Utility to compute the root of a merkle tree in logarithmic time using a proof-path array

import smartpy as sp

class MerkleTree:

    @staticmethod
    def compute_merkle_root(proof, leaf):
        computed_hash = sp.local("computed_hash", sp.sha256(leaf))

        sp.for proof_element in proof:
            sp.if computed_hash.value < proof_element:
                computed_hash.value = sp.sha256(computed_hash.value + proof_element)
            sp.else:
                computed_hash.value = sp.sha256(proof_element + computed_hash.value)
            
        return computed_hash.value