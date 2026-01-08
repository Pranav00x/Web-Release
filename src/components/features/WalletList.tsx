"use client";

import React, { useState } from "react";
import { useWallets, BurnerWallet } from "@/context/WalletContext";
import { Copy, Trash2, Eye, EyeOff, Terminal, Shield, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export const WalletList = () => {
    const { wallets, deleteWallet } = useWallets();

    if (wallets.length === 0) {
        return (
            <div className="border border-dashed border-zinc-800 p-12 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                        <Terminal size={32} className="text-zinc-700" />
                    </div>
                </div>
                <h3 className="text-zinc-300 font-bold uppercase tracking-widest mb-2">No Active Subjects</h3>
                <p className="text-zinc-600 text-xs font-mono max-w-xs mx-auto">
                    The local database is empty. Generate a new identity to begin operations.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Wallet size={16} />
                    Active Subjects
                    <span className="bg-zinc-800 text-white px-2 py-0.5 text-xs rounded-full">{wallets.length}</span>
                </h3>
                <span className="text-[10px] text-zinc-600 font-bold bg-zinc-900 px-2 py-1 border border-zinc-800">
                    LOCAL_STORAGE_MODE
                </span>
            </div>

            <div className="grid gap-4">
                {wallets.map((wallet) => (
                    <WalletItem key={wallet.address} wallet={wallet} onDelete={() => deleteWallet(wallet.address)} />
                ))}
            </div>
        </div>
    );
};

const WalletItem = ({ wallet, onDelete }: { wallet: BurnerWallet; onDelete: () => void }) => {
    const [showKey, setShowKey] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 1500);
    };

    return (
        <div className="group relative bg-black border border-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/10">

            {/* Header / ID */}
            <div className="px-4 py-3 bg-zinc-900/30 border-b border-zinc-800 flex justify-between items-center bg-[url('/noise.png')]">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-zinc-300 uppercase">{wallet.name || "Unknown Subject"}</span>
                </div>
                <button
                    onClick={onDelete}
                    className="text-zinc-600 hover:text-red-500 transition-colors p-1"
                    title="Surrender Identity"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <div className="p-4 space-y-4">
                {/* Address Row */}
                <div>
                    <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider mb-1 block flex items-center gap-1">
                        Address
                    </label>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-zinc-950 border border-zinc-800 p-2 font-mono text-xs text-zinc-300 truncate hover:text-white transition-colors select-all">
                            {wallet.address}
                        </div>
                        <button
                            onClick={() => copyToClipboard(wallet.address, "addr")}
                            className={cn(
                                "px-3 py-1 text-[10px] font-bold uppercase border border-zinc-700 hover:bg-zinc-800 transition-all min-w-[60px]",
                                copied === "addr" ? "bg-emerald-900 border-emerald-500 text-emerald-400" : "text-zinc-500"
                            )}
                        >
                            {copied === "addr" ? "OK" : "CPY"}
                        </button>
                    </div>
                </div>

                {/* Key Row */}
                <div>
                    <label className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider mb-1 block flex items-center gap-1">
                        <Shield size={10} className={showKey ? "text-red-500" : "text-zinc-600"} />
                        Private Key
                    </label>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-zinc-950 border border-zinc-800 p-2 font-mono text-xs relative overflow-hidden group/key">
                            {/* Obscure Layer */}
                            <div className={cn(
                                "absolute inset-0 bg-zinc-950 flex items-center px-2 transition-all duration-200 cursor-pointer",
                                showKey ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
                            )} onClick={() => setShowKey(true)}>
                                <span className="text-zinc-700 tracking-[0.5em]">**************************</span>
                            </div>

                            <span className={cn("text-red-400 select-all", !showKey && "opacity-0")}>
                                {wallet.privateKey}
                            </span>
                        </div>

                        <button
                            onClick={() => setShowKey(!showKey)}
                            className="p-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-500"
                        >
                            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>

                        <button
                            onClick={() => copyToClipboard(wallet.privateKey, "key")}
                            className={cn(
                                "px-3 py-1 text-[10px] font-bold uppercase border border-zinc-700 hover:bg-zinc-800 transition-all min-w-[60px]",
                                copied === "key" ? "bg-emerald-900 border-emerald-500 text-emerald-400" : "text-zinc-500"
                            )}
                        >
                            {copied === "key" ? "OK" : "CPY"}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};
