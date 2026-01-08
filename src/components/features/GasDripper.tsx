"use client";

import React, { useState } from "react";
import { useWallets } from "@/context/WalletContext";
import { ethers } from "ethers";
import { Zap, ArrowRight, Check, Droplets, Wallet as WalletIcon, ChevronDown } from "lucide-react";
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
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center">
                <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                    <Droplets size={18} className="text-blue-500" /> Gas Drip
                </h2>
                <span className="text-xs font-medium text-zinc-500 bg-zinc-800/50 px-2.5 py-1 rounded-full">
                    Batch Transfer
                </span>
            </div>

            <div className="p-6 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400">Network</label>
                        <div className="relative">
                            <select
                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none appearance-none transition-all"
                                value={selectedChain.name}
                                onChange={(e) => setSelectedChain(CHAINS.find(c => c.name === e.target.value) || CHAINS[0])}
                            >
                                {CHAINS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-3 text-zinc-500 pointer-events-none" size={14} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400">Amount per Wallet (ETH)</label>
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                            placeholder="0.01"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Source Private Key (Sender)</label>
                    <div className="relative">
                        <input
                            type="password"
                            value={sourceKey}
                            onChange={(e) => setSourceKey(e.target.value)}
                            placeholder="Enter private key starting with 0x..."
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-2.5 pl-10 text-zinc-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-zinc-700"
                        />
                        <WalletIcon className="absolute left-3 top-2.5 text-zinc-500" size={16} />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-medium text-zinc-400">Recipients</label>
                        <button onClick={selectAll} className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">
                            {selectedWallets.length === wallets.length ? "Deselect All" : "Select All Available"}
                        </button>
                    </div>

                    <div className="max-h-48 overflow-y-auto border border-zinc-800 rounded-lg bg-zinc-950/50 p-2 space-y-1">
                        {wallets.length === 0 && <div className="text-zinc-600 text-sm p-4 text-center">No active wallets found.</div>}
                        {wallets.map(w => (
                            <div key={w.address}
                                onClick={() => toggleWallet(w.address)}
                                className={cn(
                                    "flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all border border-transparent",
                                    selectedWallets.includes(w.address)
                                        ? "bg-blue-500/10 border-blue-500/20 text-zinc-200"
                                        : "hover:bg-zinc-800/50 text-zinc-500"
                                )}
                            >
                                <div className={cn(
                                    "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                    selectedWallets.includes(w.address) ? "border-blue-500 bg-blue-500 text-white" : "border-zinc-700"
                                )}>
                                    {selectedWallets.includes(w.address) && <Check size={10} strokeWidth={3} />}
                                </div>

                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <span className="text-xs font-mono truncate">{w.address}</span>
                                    {w.name && <span className="text-[10px] bg-zinc-800 px-1.5 rounded text-zinc-400 truncate">{w.name}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={executeDrip}
                    disabled={status === "EXECUTING" || selectedWallets.length === 0}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                >
                    {status === "EXECUTING" ? <Zap className="animate-pulse" size={16} /> : <Zap size={16} />}
                    {status === "EXECUTING" ? "Processing Batch..." : `Send ${amount} ETH to ${selectedWallets.length} Wallets`}
                </button>

                {/* Logs Console */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 h-40 overflow-y-auto font-mono text-xs">
                    {logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-700 space-y-2 opacity-60">
                            <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-pulse"></div>
                            <span>Ready to execute transaction sequence...</span>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {logs.map((l, i) => (
                                <div key={i} className={cn("flex gap-2", l.includes("Error") ? "text-red-400" : "text-zinc-400")}>
                                    <span className="text-zinc-700 select-none">›</span>
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
