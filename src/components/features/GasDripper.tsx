"use client";

import React, { useState } from "react";
import { useWallets } from "@/context/WalletContext";
import { ethers } from "ethers";
import { Fuel, ArrowRight, CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";

// Minimal ERC20 ABI or just use formatEther
// For native gas, we don't need ABI.

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
            setLogs((prev) => [...prev, `Source Balance: ${ethers.formatEther(balance)} ETH`]);

            const valueToSend = ethers.parseEther(amount);
            let nonce = await provider.getTransactionCount(wallet.address);

            for (const target of selectedWallets) {
                setLogs((prev) => [...prev, `Preparing tx to ${target.substring(0, 6)}...`]);
                const tx = await wallet.sendTransaction({
                    to: target,
                    value: valueToSend,
                    nonce: nonce++
                });
                setLogs((prev) => [...prev, `Sent! Hash: ${tx.hash.substring(0, 10)}...`]);
                // We don't await confirmation strictly to be faster, or we could.
                // Let's await logic for "burner" speed? Nah, async is better for "drip".
                // But nonce management is tricky if not awaited or managed carefully.
                // With simple nonce increment it works.
            }
            setStatus("DONE");
            setLogs((prev) => [...prev, "All transactions submitted."]);
        } catch (error: any) {
            console.error(error);
            setStatus("ERROR");
            setLogs((prev) => [...prev, `Error: ${error.message || "Unknown error"}`]);
        }
    };

    return (
        <div className="border-2 border-white p-6">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
                <Fuel size={24} /> Gas Dispersal Unit
            </h2>

            <div className="space-y-4">

                {/* Network Select */}
                <div>
                    <label className="text-[10px] uppercase text-gray-500 block mb-1">Target Network</label>
                    <select
                        className="w-full bg-black border border-white p-2 text-white font-mono rounded-none focus:outline-none"
                        value={selectedChain.name}
                        onChange={(e) => setSelectedChain(CHAINS.find(c => c.name === e.target.value) || CHAINS[0])}
                    >
                        {CHAINS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                </div>

                {/* Source Key */}
                <div>
                    <label className="text-[10px] uppercase text-gray-500 block mb-1">Source Private Key</label>
                    <input
                        type="password"
                        value={sourceKey}
                        onChange={(e) => setSourceKey(e.target.value)}
                        placeholder="0x..."
                        className="w-full bg-black border border-zinc-700 p-2 text-white font-mono focus:border-white outline-none rounded-none"
                    />
                </div>

                {/* Amount */}
                <div>
                    <label className="text-[10px] uppercase text-gray-500 block mb-1">Amount per Wallet (ETH)</label>
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-black border border-zinc-700 p-2 text-white font-mono focus:border-white outline-none rounded-none"
                    />
                </div>

                {/* Target Selection */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] uppercase text-gray-500 block">Select Targets</label>
                        <button onClick={selectAll} className="text-[10px] uppercase underline text-white">
                            {selectedWallets.length === wallets.length ? "Deselect All" : "Select All"}
                        </button>
                    </div>

                    <div className="max-h-40 overflow-y-auto border border-zinc-700 p-2 space-y-1 custom-scrollbar">
                        {wallets.length === 0 && <span className="text-gray-600 text-xs">No local wallets available.</span>}
                        {wallets.map(w => (
                            <div key={w.address}
                                onClick={() => toggleWallet(w.address)}
                                className="flex items-center gap-2 cursor-pointer hover:bg-zinc-900 p-1"
                            >
                                {selectedWallets.includes(w.address) ? <CheckSquare size={14} /> : <Square size={14} />}
                                <span className="text-xs font-mono">{w.address}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={executeDrip}
                    disabled={status === "EXECUTING"}
                    className="w-full py-3 bg-white text-black font-bold uppercase hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === "EXECUTING" ? "Processing..." : `INITIATE_DROP (${selectedWallets.length})`}
                </button>

                {/* Logs Console */}
                <div className="bg-zinc-950 border border-zinc-800 p-2 min-h-[100px] text-[10px] font-mono whitespace-pre-wrap overflow-y-auto max-h-40">
                    {logs.length === 0 ? <span className="text-zinc-700">{">"} Ready to transmit...</span> : logs.map((l, i) => <div key={i}>{">"} {l}</div>)}
                </div>
            </div>
        </div>
    );
};
