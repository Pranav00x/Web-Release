"use client";

import React, { useState } from "react";
import { useWallets } from "@/context/WalletContext";
import { ethers } from "ethers";
import { Zap, Check, Droplets, ChevronDown, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const CHAINS = [
    { name: "Sepolia Testnet", rpc: "https://rpc.sepolia.org", chainId: 11155111 },
    { name: "Holesky Testnet", rpc: "https://ethereum-holesky-rpc.publicnode.com", chainId: 17000 },
    { name: "Base Sepolia", rpc: "https://sepolia.base.org", chainId: 84532 },
    { name: "Arbitrum Sepolia", rpc: "https://sepolia-rollup.arbitrum.io/rpc", chainId: 421614 },
];

export const GasDripper = () => {
    const { wallets } = useWallets();
    const [sourceKey, setSourceKey] = useState("");
    const [amount, setAmount] = useState("0.01");
    const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
    const [status, setStatus] = useState<string>("IDLE");
    const [logs, setLogs] = useState<string[]>([]);
    const [selectedChain, setSelectedChain] = useState(CHAINS[0]);

    // ... same helpers ...
    const toggleWallet = (addr: string) => {
        if (selectedWallets.includes(addr)) {
            setSelectedWallets(selectedWallets.filter((a) => a !== addr));
        } else {
            setSelectedWallets([...selectedWallets, addr]);
        }
    };

    const selectAll = () => {
        if (selectedWallets.length === wallets.length) {
            setSelectedWallets([]);
        } else {
            setSelectedWallets(wallets.map((w) => w.address));
        }
    };

    const executeDrip = async () => {
        if (!sourceKey || selectedWallets.length === 0) return;
        setStatus("EXECUTING");
        setLogs([]);

        try {
            const provider = new ethers.JsonRpcProvider(selectedChain.rpc);
            const wallet = new ethers.Wallet(sourceKey, provider);

            const balance = await provider.getBalance(wallet.address);
            setLogs((prev) => [...prev, `Checking Source Balance: ${ethers.formatEther(balance)} ETH`]);

            const valueToSend = ethers.parseEther(amount);
            let nonce = await provider.getTransactionCount(wallet.address);

            for (const target of selectedWallets) {
                setLogs((prev) => [...prev, `Sending ${amount} ETH to ${target.substring(0, 6)}...`]);
                const tx = await wallet.sendTransaction({
                    to: target,
                    value: valueToSend,
                    nonce: nonce++
                });
                setLogs((prev) => [...prev, `✓ Transaction sent: ${tx.hash.substring(0, 8)}...`]);
            }
            setStatus("DONE");
            setLogs((prev) => [...prev, "All transfers completed successfully."]);
        } catch (error: any) {
            console.error(error);
            setStatus("ERROR");
            setLogs((prev) => [...prev, `❌ Error: ${error.message || "Unknown error"}`]);
        }
    };

    return (
        <div className="glass-card rounded-[32px] overflow-hidden shadow-2xl shadow-black/20">
            <div className="p-8 pb-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-transparent">
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20">
                        <Droplets size={20} fill="white" className="text-white" />
                    </div>
                    Gas Dispenser
                </h2>
                <span className="text-xs font-bold text-blue-300 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/20">
                    Batch Mode
                </span>
            </div>

            <div className="p-8 space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">Network</label>
                        <div className="relative group">
                            <select
                                className="w-full bg-slate-900 border border-slate-800 rounded-[20px] p-4 text-slate-200 text-sm font-bold focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none transition-all cursor-pointer hover:bg-slate-800"
                                value={selectedChain.name}
                                onChange={(e) => setSelectedChain(CHAINS.find(c => c.name === e.target.value) || CHAINS[0])}
                            >
                                {CHAINS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-5 top-5 text-slate-500 pointer-events-none group-hover:text-white transition-colors" size={16} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">Amount (ETH)</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-[20px] p-4 text-slate-200 text-sm font-bold focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-700"
                                placeholder="0.01"
                            />
                            <span className="absolute right-5 top-4 text-slate-500 font-bold text-sm pointer-events-none">ETH</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">Source Information</label>
                    <input
                        type="password"
                        value={sourceKey}
                        onChange={(e) => setSourceKey(e.target.value)}
                        placeholder="Paste Sender Private Key (0x...)"
                        className="w-full bg-slate-900 border border-slate-800 rounded-[20px] p-4 text-slate-200 text-sm font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Recipients</label>
                        <button onClick={selectAll} className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wide">
                            {selectedWallets.length === wallets.length ? "Deselect All" : "Select All"}
                        </button>
                    </div>

                    <div className="h-48 overflow-y-auto border border-slate-800 rounded-[24px] bg-slate-950/30 p-2 space-y-1">
                        {wallets.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2">
                                <p className="text-sm font-medium">No active wallets</p>
                            </div>
                        )}
                        {wallets.map(w => (
                            <div key={w.address}
                                onClick={() => toggleWallet(w.address)}
                                className={cn(
                                    "flex items-center gap-4 cursor-pointer p-3 rounded-[16px] transition-all border border-transparent group",
                                    selectedWallets.includes(w.address)
                                        ? "bg-blue-500/20 border-blue-500/30"
                                        : "hover:bg-slate-800/50"
                                )}
                            >
                                <div className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                    selectedWallets.includes(w.address) ? "border-blue-500 bg-blue-500 text-white scale-110" : "border-slate-600 group-hover:border-slate-400"
                                )}>
                                    {selectedWallets.includes(w.address) && <Check size={12} strokeWidth={4} />}
                                </div>

                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className={cn("text-xs font-mono font-medium truncate transition-colors", selectedWallets.includes(w.address) ? "text-blue-200" : "text-slate-400")}>{w.address}</span>
                                    {w.name && <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-bold truncate">{w.name}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={executeDrip}
                    disabled={status === "EXECUTING" || selectedWallets.length === 0}
                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-[24px] text-base font-bold shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-3"
                >
                    {status === "EXECUTING" ? <Zap className="animate-pulse" size={20} /> : <Rocket size={20} />}
                    {status === "EXECUTING" ? "Processing Batch..." : `Launch Drop (${selectedWallets.length})`}
                </button>

                {/* Logs Console */}
                <div className="bg-black/40 border border-white/5 rounded-[24px] p-6 h-48 overflow-y-auto font-mono text-xs shadow-inner">
                    {logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-700 space-y-3">
                            <div className="w-2 h-2 bg-slate-800 rounded-full animate-ping"></div>
                            <span className="font-bold uppercase tracking-widest text-[10px]">System Standby</span>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {logs.map((l, i) => (
                                <div key={i} className={cn("flex gap-3", l.includes("Error") ? "text-rose-400" : "text-slate-400")}>
                                    <span className="text-slate-700 select-none">[{new Date().toLocaleTimeString()}]</span>
                                    <span>{l}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
