"use client";

import React, { useState } from "react";
import { useWallets, BurnerWallet } from "@/context/WalletContext";
import { Copy, Trash2, Eye, EyeOff, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export const WalletList = () => {
    const { wallets, deleteWallet } = useWallets();

    if (wallets.length === 0) {
        return (
            <div className="border-2 border-dashed border-gray-700 p-12 text-center text-gray-500 font-mono uppercase">
                <Terminal size={48} className="mx-auto mb-4 opacity-50" />
                No Active Identities Found.
                <br />
                Initialize generation sequence.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-white pb-2 mb-4">
                <h3 className="text-lg font-bold uppercase">Active Identities [{wallets.length}]</h3>
                <span className="text-xs text-gray-400">LOCAL_STORAGE</span>
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
        <div className="border-2 border-white p-4 relative group hover:bg-zinc-900 transition-colors">
            <div className="absolute top-2 right-2 flex gap-2">
                <button
                    onClick={onDelete}
                    className="p-1 hover:bg-red-600 hover:text-white border border-transparent hover:border-red-600 transition-none"
                    title="Surrender Identity"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="space-y-3 pr-8">
                {/* Address */}
                <div>
                    <label className="text-[10px] uppercase text-gray-500 block mb-1">Public Address</label>
                    <div className="flex items-center gap-2">
                        <code className="bg-zinc-900 px-2 py-1 text-sm md:text-base border border-zinc-700 w-full truncate font-mono">
                            {wallet.address}
                        </code>
                        <button
                            onClick={() => copyToClipboard(wallet.address, "addr")}
                            className={cn(
                                "px-2 py-1 text-xs font-bold border border-white hover:bg-white hover:text-black uppercase",
                                copied === "addr" ? "bg-white text-black" : ""
                            )}
                        >
                            {copied === "addr" ? "COPIED" : "COPY"}
                        </button>
                    </div>
                </div>

                {/* Private Key */}
                <div>
                    <label className="text-[10px] uppercase text-gray-500 block mb-1">Private Key (Unsafe)</label>
                    <div className="flex items-center gap-2">
                        <code className={cn(
                            "bg-zinc-900 px-2 py-1 text-sm md:text-base border border-zinc-700 w-full truncate font-mono transition-filter",
                            showKey ? "blur-0 text-red-500" : "blur-sm text-gray-600 select-none"
                        )}>
                            {showKey ? wallet.privateKey : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}
                        </code>
                        <button
                            onClick={() => setShowKey(!showKey)}
                            className="p-1 border border-zinc-700 hover:border-white hover:bg-white hover:text-black"
                        >
                            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                            onClick={() => copyToClipboard(wallet.privateKey, "key")}
                            className={cn(
                                "px-2 py-1 text-xs font-bold border border-white hover:bg-white hover:text-black uppercase",
                                copied === "key" ? "bg-white text-black" : ""
                            )}
                        >
                            {copied === "key" ? "COPIED" : "COPY"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-2 pt-2 border-t border-zinc-800 flex justify-between items-center text-[10px] text-gray-400 uppercase">
                <span>Created: {new Date(wallet.createdAt).toLocaleTimeString()}</span>
                <span>{wallet.name}</span>
            </div>
        </div>
    );
};
