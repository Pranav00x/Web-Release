"use client";

import React, { useState } from "react";
import { useWallets } from "@/context/WalletContext";
import { ethers } from "ethers";
import { Zap, Code, ChevronRight, Play, Box } from "lucide-react";
import { cn } from "@/lib/utils";

export const NFTMinter = () => {
    // ... logic remains identical
    const { wallets } = useWallets();
    const [contractAddress, setContractAddress] = useState("");
    const [funcSig, setFuncSig] = useState("mint(uint256)");
    const [args, setArgs] = useState("1");
    const [value, setValue] = useState("0");
    const [selectedWalletIdx, setSelectedWalletIdx] = useState(0);
    const [status, setStatus] = useState("");
    const [rpcUrl, setRpcUrl] = useState("https://rpc.sepolia.org");

    const handleMint = async () => {
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
        <div className="glass-card rounded-[32px] overflow-hidden shadow-2xl shadow-black/20">
            <div className="p-8 pb-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-purple-500/10 to-transparent">
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-purple-500 rounded-xl shadow-lg shadow-purple-500/20">
                        <Box size={20} fill="white" className="text-white" />
                    </div>
                    Smart Contract Call
                </h2>
                <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-4 py-2 rounded-full border border-purple-500/20">
                    Advanced
                </span>
            </div>

            <div className="p-8 space-y-8">

                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">RPC Endpoint</label>
                    <input
                        value={rpcUrl}
                        onChange={(e) => setRpcUrl(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-[20px] p-4 text-slate-200 text-sm font-medium focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder:text-slate-700 font-mono"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">Executor Wallet</label>
                    <div className="relative group">
                        <select
                            className="w-full bg-slate-900 border border-slate-800 rounded-[20px] p-4 text-slate-200 text-sm font-bold focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none appearance-none transition-all cursor-pointer hover:bg-slate-800"
                            value={selectedWalletIdx}
                            onChange={(e) => setSelectedWalletIdx(Number(e.target.value))}
                        >
                            {wallets.length === 0 && <option>No identities available</option>}
                            {wallets.map((w, i) => (
                                <option key={w.address} value={i}>{w.name || `Identity #${i + 1}`} ({w.address.substring(0, 6)}...)</option>
                            ))}
                        </select>
                        <ChevronRight className="absolute right-5 top-5 text-slate-500 pointer-events-none rotate-90 group-hover:text-white transition-colors" size={16} />
                    </div>
                </div>

                <div className="h-px bg-white/5 w-full border-t border-dashed border-white/5"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-3">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">Contract Address</label>
                        <input
                            value={contractAddress}
                            onChange={e => setContractAddress(e.target.value)}
                            placeholder="0x..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-[20px] p-4 text-slate-200 text-sm font-mono focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder:text-slate-700"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">Value (ETH)</label>
                        <input
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            placeholder="0.0"
                            className="w-full bg-slate-900 border border-slate-800 rounded-[20px] p-4 text-slate-200 text-sm font-mono focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder:text-slate-700"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">Function Signature</label>
                        <div className="relative">
                            <Code size={16} className="absolute left-4 top-4 text-slate-500" />
                            <input
                                value={funcSig}
                                onChange={e => setFuncSig(e.target.value)}
                                placeholder="mint(uint256)"
                                className="w-full bg-slate-900 border border-slate-800 rounded-[20px] p-4 pl-12 text-slate-200 text-sm font-bold font-mono focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder:text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">Arguments</label>
                        <input
                            value={args}
                            onChange={e => setArgs(e.target.value)}
                            placeholder="1, 0x123..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-[20px] p-4 text-slate-200 text-sm font-mono focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder:text-slate-700"
                        />
                    </div>
                </div>

                <button
                    onClick={handleMint}
                    disabled={!contractAddress || wallets.length === 0}
                    className="w-full py-5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-[24px] text-base font-bold shadow-xl shadow-purple-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play size={12} fill="white" className="text-white" />
                    </div>
                    Execute Transaction
                </button>

                {status && (
                    <div className={cn(
                        "p-4 rounded-[20px] text-xs font-mono break-all border shadow-lg",
                        status.startsWith("ERROR")
                            ? "bg-rose-500/10 border-rose-500/20 text-rose-300"
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                    )}>
                        <span className="font-bold opacity-50 block mb-1 uppercase tracking-widest text-[10px]">Result</span>
                        {status}
                    </div>
                )}

            </div>
        </div>
    );
};
