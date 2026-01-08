"use client";

import React, { useState } from "react";
import { useWallets, BurnerWallet } from "@/context/WalletContext";
import { Copy, Trash2, Eye, EyeOff, Wallet, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const WalletList = () => {
    const { wallets, deleteWallet } = useWallets();

    if (wallets.length === 0) {
        return (
            <div className="glass-card rounded-[32px] p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 ring-4 ring-slate-800/20">
                    <Wallet className="text-slate-500" size={24} />
                </div>
                <h3 className="text-slate-200 font-bold text-lg mb-2">No Active Wallets</h3>
                <p className="text-slate-500 font-medium max-w-xs">
                    Your secure local vault is empty. Create your first Identity above.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
                <h3 className="text-lg font-bold text-slate-200">Active Identities</h3>
                <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1.5 rounded-full font-bold border border-white/5">
                    {wallets.length} Ready
                </span>
            </div>

            <div className="grid gap-4">
                {wallets.map((wallet, idx) => (
                    <WalletItem key={wallet.address} wallet={wallet} idx={idx} onDelete={() => deleteWallet(wallet.address)} />
                ))}
            </div>
        </div>
    );
};

const WalletItem = ({ wallet, idx, onDelete }: { wallet: BurnerWallet; idx: number; onDelete: () => void }) => {
    const [showKey, setShowKey] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 1500);
    };

    // Generate a predictable gradient based on address char
    const gradients = [
        "from-pink-500 to-rose-500",
        "from-blue-500 to-cyan-500",
        "from-emerald-500 to-teal-500",
        "from-orange-500 to-amber-500",
        "from-purple-500 to-indigo-500"
    ];
    const gradient = gradients[idx % gradients.length];

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-[28px] p-6 hover:border-slate-700 hover:shadow-xl transition-all duration-300 relative group overflow-hidden">

            {/* Top Decoration */}
            <div className={cn("absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r opacity-80", gradient)}></div>

            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm shadow-lg", gradient)}>
                        #{idx + 1}
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-white mb-0.5">{wallet.name || "Untitled Identity"}</h4>
                        <p className="text-xs text-slate-500 font-medium">Added Today • {new Date(wallet.createdAt).toLocaleTimeString()}</p>
                    </div>
                </div>
                <button
                    onClick={onDelete}
                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="space-y-4">
                {/* Address */}
                <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/50 flex items-center justify-between gap-4 group/field hover:border-slate-700 transition-colors">
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">Public Address</p>
                        <code className="text-sm text-slate-300 font-mono truncate block">
                            {wallet.address}
                        </code>
                    </div>
                    <button
                        onClick={() => copyToClipboard(wallet.address, "addr")}
                        className={cn(
                            "w-10 h-10 flex items-center justify-center rounded-xl transition-all font-bold",
                            copied === "addr" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                        )}
                    >
                        {copied === "addr" ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                </div>

                {/* Private Key */}
                <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/50 flex items-center justify-between gap-4 group/field hover:border-slate-700 transition-colors">
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1 flex items-center gap-2">
                            Private Key
                            {showKey && <span className="text-red-400 text-[9px] bg-red-400/10 px-2 py-0.5 rounded-full">UNSAFE</span>}
                        </p>
                        <code className={cn(
                            "text-sm font-mono truncate block transition-all",
                            showKey ? "text-rose-400" : "text-slate-600 blur-[4px] select-none"
                        )}>
                            {showKey ? wallet.privateKey : "0x................................................"}
                        </code>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowKey(!showKey)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
                        >
                            {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button
                            onClick={() => copyToClipboard(wallet.privateKey, "key")}
                            className={cn(
                                "w-10 h-10 flex items-center justify-center rounded-xl transition-all font-bold",
                                copied === "key" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                            )}
                        >
                            {copied === "key" ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
