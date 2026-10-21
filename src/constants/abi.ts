
export const TokenFactoryABI = [
    {
        type: "function",
        name: "createStandardToken",
        stateMutability: "nonpayable",
        inputs: [
            { name: "name", type: "string", internalType: "string" },
            { name: "symbol", type: "string", internalType: "string" },
            { name: "initialSupply", type: "uint256", internalType: "uint256" },
            { name: "maxSupply", type: "uint256", internalType: "uint256" },
            { name: "amountPerMint", type: "uint256", internalType: "uint256" },
            { name: "mintFee", type: "uint256", internalType: "uint256" },
        ],
        outputs: [{ name: "", type: "address", internalType: "address" }],
    },
    {
        type: "event",
        name: "TokenDeployed",
        anonymous: false,
        inputs: [
            { name: "owner", type: "address", indexed: true, internalType: "address" },
            { name: "newToken", type: "address", indexed: false, internalType: "address" },
            { name: "name", type: "string", indexed: false, internalType: "string" },
            { name: "symbol", type: "string", indexed: false, internalType: "string" },
            { name: "maxSupply", type: "uint256", indexed: false, internalType: "uint256" },
            { name: "amountPerMint", type: "uint256", indexed: false, internalType: "uint256" },
            { name: "mintFee", type: "uint256", indexed: false, internalType: "uint256" },
        ],
    },
] as const