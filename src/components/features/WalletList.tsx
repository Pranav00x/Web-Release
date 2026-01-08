"use client";

import React, { useState } from "react";
import { useWallets, BurnerWallet } from "@/context/WalletContext";
import { Copy, Trash2, Eye, EyeOff, Wallet, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const WalletList = () => {
    const { wallets, deleteWallet } = useWallets();

    if (wallets.length === 0) {
        return (
            <div className="border border-dashed border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-zinc-900/30">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <Wallet className="text-zinc-500" size={20} />
                </div>
                <h3 className="text-zinc-300 font-medium text-sm">No wallets created</h3>
                <p className="text-zinc-500 text-xs mt-1 max-w-xs">
                    Get started by generating your first burner wallet above.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-sm font-semibold text-zinc-400">Your Wallets ({wallets.length})</h3>
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full font-medium">
                    Browser Storage
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
        <div className="group bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700 hover:shadow-lg transition-all duration-200">

            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                        {wallet.address.substring(2, 4)}
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-zinc-100">{wallet.name || "Untitled Wallet"}</h4>
                        <p className="text-xs text-zinc-500">Created just now</p>
                    </div>
                </div>
                <button
                    onClick={onDelete}
                    className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                    title="Delete Wallet"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="space-y-3 bg-zinc-950/50 rounded-lg p-3 border border-zinc-800/50">
                {/* Address */}
                <div className="flex items-center justify-between gap-3 group/addr">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider mb-0.5">Address</p>
                        <code className="text-xs text-zinc-300 font-mono truncate block">
                            {wallet.address}
                        </code>
                    </div>
                    <button
                        onClick={() => copyToClipboard(wallet.address, "addr")}
                        className={cn(
                            "p-1.5 rounded-md transition-all",
                            copied === "addr" ? "bg-emerald-500/10 text-emerald-500" : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                        )}
                    >
                        {copied === "addr" ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                </div>

                <div className="h-px bg-zinc-800/50 w-full"></div>

                {/* Key */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider mb-0.5 flex items-center gap-1">
                            Private Key
                            {showKey && <span className="text-red-500 text-[9px] bg-red-500/10 px-1 rounded ml-2">UNSAFE</span>}
                        </p>
                        <div className="relative">
                            <code className={cn(
                                "text-xs font-mono truncate block transition-all duration-300",
                                showKey ? "text-zinc-300" : "text-zinc-600 blur-[2px] select-none"
                            )}>
                                {showKey ? wallet.privateKey : "0x................................................"}
                            </code>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setShowKey(!showKey)}
                            className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                        >
                            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                            onClick={() => copyToClipboard(wallet.privateKey, "key")}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                copied === "key" ? "bg-emerald-500/10 text-emerald-500" : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                            )}
                        >
                            {copied === "key" ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
