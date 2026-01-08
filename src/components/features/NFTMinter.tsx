"use client";

import React, { useState } from "react";
import { useWallets } from "@/context/WalletContext";
import { ethers } from "ethers";
import { Target, Zap, Activity, Box, Code } from "lucide-react";
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
        <div className="border border-zinc-800 bg-black relative">
            {/* Header */}
            <div className="bg-zinc-900/50 p-4 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-100 flex items-center gap-2">
                    <Box size={16} className="text-purple-500" fill="currentColor" /> Raw Execution
                </h2>
                <div className="text-[10px] text-zinc-500 uppercase font-bold border border-zinc-800 px-2 py-1">
                    Mode: Contract Write
                </div>
            </div>

            <div className="p-6 space-y-5">

                {/* RPC Override */}
                <div className="group">
                    <label className="text-[9px] uppercase font-bold text-zinc-600 block mb-1 group-focus-within:text-purple-400">RPC Gateway</label>
                    <input
                        value={rpcUrl}
                        onChange={(e) => setRpcUrl(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 font-mono text-xs focus:border-purple-500 outline-none"
                    />
                </div>

                {/* Executor */}
                <div className="group">
                    <label className="text-[9px] uppercase font-bold text-zinc-600 block mb-1 group-focus-within:text-purple-400">Executor Identity</label>
                    <select
                        className="w-full bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 font-mono text-xs focus:border-purple-500 outline-none"
                        value={selectedWalletIdx}
                        onChange={(e) => setSelectedWalletIdx(Number(e.target.value))}
                    >
                        {wallets.length === 0 && <option>No identities found</option>}
                        {wallets.map((w, i) => (
                            <option key={w.address} value={i}>{i} - {w.address.substring(0, 6)}... ({w.name})</option>
                        ))}
                    </select>
                </div>

                <div className="my-4 border-t border-zinc-800 border-dashed"></div>

                {/* Contract */}
                <div className="group">
                    <label className="text-[9px] uppercase font-bold text-zinc-600 block mb-1 group-focus-within:text-purple-400">Target Contract</label>
                    <input
                        value={contractAddress}
                        onChange={e => setContractAddress(e.target.value)}
                        placeholder="0x..."
                        className="w-full bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 font-mono text-xs focus:border-purple-500 outline-none"
                    />
                </div>

                {/* Function Sig */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                        <label className="text-[9px] uppercase font-bold text-zinc-600 block mb-1 group-focus-within:text-purple-400">Function Sig</label>
                        <div className="relative">
                            <Code size={12} className="absolute left-2 top-2.5 text-zinc-600" />
                            <input
                                value={funcSig}
                                onChange={e => setFuncSig(e.target.value)}
                                placeholder="mint(uint256)"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 pl-7 text-zinc-300 font-semibold font-mono text-xs focus:border-purple-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="group">
                        <label className="text-[9px] uppercase font-bold text-zinc-600 block mb-1 group-focus-within:text-purple-400">Value (ETH)</label>
                        <input
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            placeholder="0.0"
                            className="w-full bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 font-mono text-xs focus:border-purple-500 outline-none"
                        />
                    </div>
                </div>

                {/* Args */}
                <div className="group">
                    <label className="text-[9px] uppercase font-bold text-zinc-600 block mb-1 group-focus-within:text-purple-400">Arguments (comma sep)</label>
                    <textarea
                        value={args}
                        onChange={e => setArgs(e.target.value)}
                        placeholder="1, 0x123..."
                        rows={2}
                        className="w-full bg-zinc-950 border border-zinc-800 p-2 text-zinc-300 font-mono text-xs focus:border-purple-500 outline-none resize-none"
                    />
                </div>

                <button
                    onClick={handleMint}
                    disabled={!contractAddress || wallets.length === 0}
                    className="w-full py-4 bg-transparent border border-zinc-600 text-zinc-300 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-900/10 font-bold uppercase flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Zap size={16} /> Execute Call
                </button>

                {status && (
                    <div className="bg-zinc-950 p-3 text-[10px] font-mono break-all border-l-2 border-purple-500 shadow-lg">
                        <span className={status.startsWith("ERROR") ? "text-red-500" : "text-purple-400"}>
                            {status}
                        </span>
                    </div>
                )}

            </div>
        </div>
    );
};
