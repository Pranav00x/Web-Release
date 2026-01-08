"use client";

import React from "react";
import { useWallets } from "@/context/WalletContext";
import { Plus, Loader2, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";

export const WalletCreator = () => {
    const { createWallet, isLoading } = useWallets();
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        await new Promise((resolve) => setTimeout(resolve, 800)); // Cinematic delay
        createWallet();
        setIsGenerating(false);
    };

    return (
        <div className="border border-zinc-800 bg-black p-1 relative group overflow-hidden">
            {/* Decor */}
            <div className="absolute top-0 right-0 p-2 opacity-20">
                <Fingerprint size={100} strokeWidth={0.5} />
            </div>

            <div className="border border-zinc-800 p-6 relative z-10 bg-zinc-950/50 backdrop-blur-sm">
                <h2 className="text-xl font-bold mb-2 uppercase text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-emerald-500 block"></span>
                    Identity Forge
                </h2>
                <p className="text-sm text-zinc-500 mb-8 max-w-sm leading-relaxed">
                    Initialize new cryptographic keypairs locally.
                    <span className="block mt-2 text-zinc-600 text-xs text-balance">
                        Entropy is gathered from browser standard crypto API.
                    </span>
                </p>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || isLoading}
                    className={cn(
                        "w-full py-4 text-sm font-bold uppercase tracking-widest border border-zinc-600 transition-all flex items-center justify-center gap-3 relative overflow-hidden group/btn hover:border-emerald-500",
                        isGenerating ? "bg-zinc-900 text-zinc-500 cursor-not-allowed" : "bg-white text-black hover:bg-emerald-500 hover:text-black"
                    )}
                >
                    {/* Button Scanline */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1s_infinite]"></div>

                    {isGenerating ? (
                        <>
                            <Loader2 className="animate-spin" size={16} />
                            <span className="animate-pulse">Forging Keys...</span>
                        </>
                    ) : (
                        <>
                            <Plus size={18} strokeWidth={3} /> Invoke New Identity
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
