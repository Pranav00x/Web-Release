"use client";

import React from "react";
import { useWallets } from "@/context/WalletContext";
import { Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const WalletCreator = () => {
    const { createWallet, isLoading } = useWallets();
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        createWallet();
        setIsGenerating(false);
    };

    return (
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

            <div className="relative z-10">
                <h2 className="text-lg font-semibold text-white mb-2">Create New Wallet</h2>
                <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                    Generate a new EVM-compatible wallet instantly. Keys are generated client-side and never leave your browser.
                </p>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || isLoading}
                    className={cn(
                        "w-full py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                        isGenerating
                            ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
                            : "bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/5 active:scale-[0.98]"
                    )}
                >
                    {isGenerating ? (
                        <> <Loader2 className="animate-spin" size={18} /> Generating... </>
                    ) : (
                        <> <Plus size={18} /> Generate Wallet </>
                    )}
                </button>
            </div>
        </div>
    );
};
