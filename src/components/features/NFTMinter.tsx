"use client";

import React, { useState } from "react";
import { useWallets } from "@/context/WalletContext";
import { ethers } from "ethers";
import { Target, Zap, Activity } from "lucide-react";

export const NFTMinter = () => {
    const { wallets } = useWallets();
    const [contractAddress, setContractAddress] = useState("");
    const [funcSig, setFuncSig] = useState("mint(uint256)");
    const [args, setArgs] = useState("1");
    const [value, setValue] = useState("0");
    const [selectedWalletIdx, setSelectedWalletIdx] = useState(0);
    const [status, setStatus] = useState("");

    // Default RPC for now (e.g. Sepolia), ideally shared context for network
    const [rpcUrl, setRpcUrl] = useState("https://rpc.sepolia.org");

    const handleMint = async () => {
        const walletData = wallets[selectedWalletIdx];
        if (!walletData || !contractAddress) return;

        setStatus("PREPARING");
        try {
            const provider = new ethers.JsonRpcProvider(rpcUrl);
            const wallet = new ethers.Wallet(walletData.privateKey, provider);

            // Simple Interface construction
            // "function mint(uint256)" -> Interface
            // If user puts just signature, we can try to guess.
            // Or if they put full ABI, parse it.
            // For 'Hacker' feel, function signature input is cool.

            const iface = new ethers.Interface([`function ${funcSig}`]);
            const funcName = funcSig.split("(")[0];

            // Parse args - assuming comma separated for simple types
            // This is a naive implementation but fits 'burner' lab vibe
            const parsedArgs = args.split(",").map(a => a.trim());

            const data = iface.encodeFunctionData(funcName, parsedArgs);

            setStatus("SENDING");
            const tx = await wallet.sendTransaction({
                to: contractAddress,
                data,
                value: ethers.parseEther(value)
            });

            setStatus(`SENT: ${tx.hash}`);

        } catch (e: any) {
            console.error(e);
            setStatus(`ERROR: ${e.message}`);
        }
    };

    return (
        <div className="border-2 border-white p-6">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
                <Target size={24} /> Precision Mint
            </h2>

            <div className="space-y-4">
                {/* RPC Override (Generic) */}
                <div>
                    <label className="text-[10px] uppercase text-gray-500 block mb-1">RPC URL</label>
                    <input
                        value={rpcUrl}
                        onChange={(e) => setRpcUrl(e.target.value)}
                        className="w-full bg-black border border-zinc-700 p-2 text-white font-mono text-xs"
                    />
                </div>

                {/* Executor */}
                <div>
                    <label className="text-[10px] uppercase text-gray-500 block mb-1">Executor Wallet</label>
                    <select
                        className="w-full bg-black border border-white p-2 text-white font-mono rounded-none"
                        value={selectedWalletIdx}
                        onChange={(e) => setSelectedWalletIdx(Number(e.target.value))}
                    >
                        {wallets.map((w, i) => (
                            <option key={w.address} value={i}>{w.name} - {w.address.substring(0, 8)}... </option>
                        ))}
                    </select>
                </div>

                {/* Contract */}
                <div>
                    <label className="text-[10px] uppercase text-gray-500 block mb-1">Contract Address</label>
                    <input
                        value={contractAddress}
                        onChange={e => setContractAddress(e.target.value)}
                        placeholder="0x..."
                        className="w-full bg-black border border-zinc-700 p-2 text-white font-mono"
                    />
                </div>

                {/* Function Sig */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] uppercase text-gray-500 block mb-1">Function Sig</label>
                        <input
                            value={funcSig}
                            onChange={e => setFuncSig(e.target.value)}
                            placeholder="mint(uint256)"
                            className="w-full bg-black border border-zinc-700 p-2 text-white font-mono"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase text-gray-500 block mb-1">Value (ETH)</label>
                        <input
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            placeholder="0.0"
                            className="w-full bg-black border border-zinc-700 p-2 text-white font-mono"
                        />
                    </div>
                </div>

                {/* Args */}
                <div>
                    <label className="text-[10px] uppercase text-gray-500 block mb-1">Arguments (comma sep)</label>
                    <input
                        value={args}
                        onChange={e => setArgs(e.target.value)}
                        placeholder="1"
                        className="w-full bg-black border border-zinc-700 p-2 text-white font-mono"
                    />
                </div>

                <button
                    onClick={handleMint}
                    className="w-full py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-bold uppercase flex items-center justify-center gap-2"
                >
                    <Zap size={20} /> EXECUTE TX
                </button>

                {status && (
                    <div className="bg-zinc-900 p-2 text-[10px] font-mono break-all border-l-2 border-white">
                        <span className={status.startsWith("ERROR") ? "text-red-500" : "text-green-500"}>
                            {status}
                        </span>
                    </div>
                )}

            </div>
        </div>
    );
};
