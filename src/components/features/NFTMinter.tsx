"use client";

import React, { useState } from "react";
import { useWallets } from "@/context/WalletContext";
import { ethers } from "ethers";
import { Target, Zap, Code, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export const NFTMinter = () => {
    const { wallets } = useWallets();
    const [contractAddress, setContractAddress] = useState("");
    const [funcSig, setFuncSig] = useState("mint(uint256)");
    const [args, setArgs] = useState("1");
    const [value, setValue] = useState("0");
    const [selectedWalletIdx, setSelectedWalletIdx] = useState(0);
    const [status, setStatus] = useState("");
    const [rpcUrl, setRpcUrl] = useState("https://rpc.sepolia.org");

    const handleMint = async () => {
        // ... same logic
        const walletData = wallets[selectedWalletIdx];
        if (!walletData || !contractAddress) return;

        setStatus("PREPARING");
        try {
            const provider = new ethers.JsonRpcProvider(rpcUrl);
            const wallet = new ethers.Wallet(walletData.privateKey, provider);
            const iface = new ethers.Interface([`function ${funcSig}`]);
            const funcName = funcSig.split("(")[0];
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
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center">
                <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                    <Zap size={18} className="text-purple-500" /> Contract Interaction
                </h2>
                <span className="text-xs font-medium text-zinc-500 bg-zinc-800/50 px-2.5 py-1 rounded-full">
                    Low-Level Call
                </span>
            </div>

            <div className="p-6 space-y-6">

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Target RPC Node</label>
                    <input
                        value={rpcUrl}
                        onChange={(e) => setRpcUrl(e.target.value)}
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 outline-none transition-all placeholder:text-zinc-700 font-mono"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Executor Wallet</label>
                    <div className="relative">
                        <select
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 outline-none appearance-none transition-all"
                            value={selectedWalletIdx}
                            onChange={(e) => setSelectedWalletIdx(Number(e.target.value))}
                        >
                            {wallets.length === 0 && <option>No wallets available</option>}
                            {wallets.map((w, i) => (
                                <option key={w.address} value={i}>{w.name || `Wallet #${i + 1}`} ({w.address.substring(0, 8)}...)</option>
                            ))}
                        </select>
                        <ChevronRight className="absolute right-3 top-3 text-zinc-500 pointer-events-none rotate-90" size={14} />
                    </div>
                </div>

                <div className="h-px bg-zinc-800/50 w-full border-t border-dashed border-zinc-800"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400">Contract Address</label>
                        <input
                            value={contractAddress}
                            onChange={e => setContractAddress(e.target.value)}
                            placeholder="0x..."
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 outline-none transition-all placeholder:text-zinc-700 font-mono"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400">Value (Wei/ETH)</label>
                        <input
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            placeholder="0.0"
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 outline-none transition-all placeholder:text-zinc-700"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400">Function Signature</label>
                        <div className="relative">
                            <Code size={14} className="absolute left-3 top-2.5 text-zinc-500" />
                            <input
                                value={funcSig}
                                onChange={e => setFuncSig(e.target.value)}
                                placeholder="mint(uint256)"
                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-2.5 pl-9 text-zinc-200 text-sm font-semibold font-mono focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 outline-none transition-all placeholder:text-zinc-700"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400">Arguments (Comma Separated)</label>
                        <input
                            value={args}
                            onChange={e => setArgs(e.target.value)}
                            placeholder="1, 0x123..."
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-sm font-mono focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 outline-none transition-all placeholder:text-zinc-700"
                        />
                    </div>
                </div>

                <button
                    onClick={handleMint}
                    disabled={!contractAddress || wallets.length === 0}
                    className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 hover:text-white text-zinc-200 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                        <Play size={10} fill="currentColor" className="text-purple-400 group-hover:text-white" />
                    </div>
                    Execute Transaction
                </button>

                {status && (
                    <div className={cn(
                        "p-4 rounded-lg text-xs font-mono break-all border",
                        status.startsWith("ERROR")
                            ? "bg-red-500/10 border-red-500/20 text-red-300"
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                    )}>
                        {status}
                    </div>
                )}

            </div>
        </div>
    );
};
