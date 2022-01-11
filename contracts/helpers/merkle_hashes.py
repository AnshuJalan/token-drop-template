import smartpy as sp

Addresses = sp.io.import_script_from_url("file:helpers/addresses.py")

# Generated using the utility provided at: https://github.com/AnshuJalan/token-drop-template/deploy/utilites/merkleTree.ts
MERKLE_ROOT = sp.bytes("0x83e3763b42f4e89fbf5cb200c15ce03f2fe116c912fa7098f9970ff8d3db2ca3")
PROOF_ALICE = [
    sp.bytes("0x6fd53a9cbed7131f073ffb7c5e98bbb862ec36ea760b66067656f6091949e4f2"),
    sp.bytes("0x2800b79312399df0116736073b3c468fb4ebd3c791624bdcc1db2d3cbe5ffc58"),
]
PROOF_BOB = [
    sp.bytes("0x4ef76d73abb14194755febcf8830493a021ef08c5477823e409ecb1aac86de79"),
    sp.bytes("0x2800b79312399df0116736073b3c468fb4ebd3c791624bdcc1db2d3cbe5ffc58"),
]
PROOF_JOHN = [
    sp.bytes("0x8630b4452805c75bdab9da5d09dc1cfd4fcbd971e397af31fab3ee7421ae745a"),
    sp.bytes("0x555a4df967eca2f3e44cb4930abd5ca5202d0b76a822bd30cbaea05dbec40d02"),
]
PROOF_MIKE = [
    sp.bytes("0x803d9cd47ab3a3997d8a4fee2f2fc0bcc032fb57211490cbb2cb90c44c5c2db2"),
    sp.bytes("0x555a4df967eca2f3e44cb4930abd5ca5202d0b76a822bd30cbaea05dbec40d02"),
]


# Type specification
#   address: Tezos address of the claimer
#   value: Number of tokens the claimer is eligible to receive
LEAF_DATA_ALICE = sp.pack(sp.record(address=Addresses.ALICE, value=sp.nat(100)))
LEAF_DATA_BOB = sp.pack(sp.record(address=Addresses.BOB, value=sp.nat(200)))
LEAF_DATA_MIKE = sp.pack(sp.record(address=Addresses.MIKE, value=sp.nat(300)))
LEAF_DATA_JOHN = sp.pack(sp.record(address=Addresses.JOHN, value=sp.nat(400)))
