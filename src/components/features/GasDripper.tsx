"use client";

import React, { useState } from "react";
import { useWallets } from "@/context/WalletContext";
import { ethers } from "ethers";
import { Zap, ArrowRight, Check, Square, Droplet, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

const CHAINS = [
    { name: "Sepolia", rpc: "https://rpc.sepolia.org", chainId: 11155111 },
    { name: "Holesky", rpc: "https://ethereum-holesky-rpc.publicnode.com", chainId: 17000 },
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
            setLogs((prev) => [...prev, `[INFO] Source Balance: ${ethers.formatEther(balance)} ETH`]);

            const valueToSend = ethers.parseEther(amount);
            let nonce = await provider.getTransactionCount(wallet.address);

            for (const target of selectedWallets) {
                setLogs((prev) => [...prev, `[TX] Targeting ${target.substring(0, 6)}...`]);
                const tx = await wallet.sendTransaction({
                    to: target,
                    value: valueToSend,
                    nonce: nonce++
                });
                setLogs((prev) => [...prev, `[OK] Hash: ${tx.hash.substring(0, 10)}...`]);
            }
            setStatus("DONE");
            setLogs((prev) => [...prev, "[SUCCESS] Operation Complete."]);
        } catch (error: any) {
            console.error(error);
            setStatus("ERROR");
            setLogs((prev) => [...prev, `[ERR] ${error.message || "Unknown error"}`]);
        }
    };

    return (
        <div className="border border-zinc-800 bg-black overflow-hidden relative">
            {/* Header */}
            <div className="bg-zinc-900/50 p-4 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-100 flex items-center gap-2">
                    <Droplet size={16} className="text-blue-500" fill="currentColor" /> Gas Drip
                </h2>
                <div className="text-[10px] text-zinc-500 uppercase font-bold border border-zinc-800 px-2 py-1">
                    Mode: Batch Disperse
                </div>
            </div>

            <div className="p-6 space-y-6">

                {/* Network Select */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                        <label className="text-[9px] uppercase font-bold text-zinc-600 block mb-1 group-focus-within:text-blue-400">Target Network</label>
                        <div className="relative">
                            <select
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 font-mono text-xs focus:border-blue-500 outline-none appearance-none"
                                value={selectedChain.name}
                                onChange={(e) => setSelectedChain(CHAINS.find(c => c.name === e.target.value) || CHAINS[0])}
                            >
                                {CHAINS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                            <div className="absolute right-3 top-2.5 pointer-events-none text-zinc-600">
                                <ArrowRight size={12} className="rotate-90" />
                            </div>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="group">
                        <label className="text-[9px] uppercase font-bold text-zinc-600 block mb-1 group-focus-within:text-blue-400">Amount (ETH)</label>
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 font-mono text-xs focus:border-blue-500 outline-none placeholder:text-zinc-800"
                            placeholder="0.0"
                        />
                    </div>
                </div>

                {/* Source Key */}
                <div className="group">
                    <label className="text-[9px] uppercase font-bold text-zinc-600 block mb-1 group-focus-within:text-blue-400">Source Private Key</label>
                    <input
                        type="password"
                        value={sourceKey}
                        onChange={(e) => setSourceKey(e.target.value)}
                        placeholder="0x..."
                        className="w-full bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 font-mono text-xs focus:border-blue-500 outline-none placeholder:text-zinc-800 transition-colors"
                    />
                </div>


                {/* Target Selection */}
                <div>
                    <div className="flex justify-between items-end mb-2 border-b border-zinc-800 pb-1">
                        <label className="text-[9px] uppercase font-bold text-zinc-600 block">Targets</label>
                        <button onClick={selectAll} className="text-[9px] uppercase font-bold text-blue-500 hover:text-blue-400">
                            {selectedWallets.length === wallets.length ? "[Clear]" : "[Select All]"}
                        </button>
                    </div>

                    <div className="max-h-40 overflow-y-auto border border-zinc-800 bg-zinc-950 p-1 space-y-0.5 custom-scrollbar">
                        {wallets.length === 0 && <div className="text-zinc-700 text-xs p-2 text-center">No targets available.</div>}
                        {wallets.map(w => (
                            <div key={w.address}
                                onClick={() => toggleWallet(w.address)}
                                className={cn(
                                    "flex items-center gap-3 cursor-pointer p-2 transition-colors border border-transparent",
                                    selectedWallets.includes(w.address) ? "bg-blue-900/10 border-blue-900/30 text-blue-200" : "hover:bg-zinc-900 text-zinc-500"
                                )}
                            >
                                <div className={cn("w-3 h-3 border flex items-center justify-center", selectedWallets.includes(w.address) ? "border-blue-500 bg-blue-500 text-black" : "border-zinc-700")}>
                                    {selectedWallets.includes(w.address) && <Check size={8} strokeWidth={4} />}
                                </div>
                                <span className="text-xs font-mono truncate hidden md:block">{w.address}</span>
                                <span className="text-xs font-mono truncate md:hidden">{w.address.substring(0, 8)}...</span>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={executeDrip}
                    disabled={status === "EXECUTING" || selectedWallets.length === 0}
                    className="w-full py-3 bg-white text-black text-xs font-bold uppercase hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed tracking-widest flex items-center justify-center gap-2"
                >
                    {status === "EXECUTING" ? <Zap className="animate-pulse" size={14} /> : <Zap size={14} fill="black" />}
                    {status === "EXECUTING" ? "Transmitting..." : `Initiate Transfer (${selectedWallets.length})`}
                </button>

                {/* Logs Console */}
                <div className="bg-black border border-zinc-800 p-3 h-[120px] text-[10px] font-mono whitespace-pre-wrap overflow-y-auto custom-scrollbar shadow-inner shadow-black">
                    {logs.length === 0 ? <span className="text-zinc-700 opacity-50 block pt-10 text-center">_ SYSTEM IDLE _</span> : logs.map((l, i) => (
                        <div key={i} className="text-zinc-400 border-l mb-1 pl-2 border-zinc-800">
                            <span className="text-zinc-600 mr-2">{i.toString().padStart(2, '0')}</span>
                            {l}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
