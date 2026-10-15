
export const StandardERC20ABI = [
    { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "string" }] },
    { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "string" }] },
    { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint8" }] },
    { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
    { type: "function", name: "maxSupply", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
    { type: "function", name: "amountPerMint", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
    { type: "function", name: "mintFee", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
    { type: "function", name: "mintProcess", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint64" }] },
    {
        type: "function",
        name: "balanceOf",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
    { type: "function", name: "mint", stateMutability: "payable", inputs: [], outputs: [] },
    {
        type: "function",
        name: "transfer",
        stateMutability: "nonpayable",
        inputs: [
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
    },
] as const