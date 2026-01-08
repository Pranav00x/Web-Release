"use client";

import React from "react";
import { useWallets } from "@/context/WalletContext";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const WalletCreator = () => {
    const { createWallet, isLoading } = useWallets();
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        await new Promise((resolve) => setTimeout(resolve, 600));
        createWallet();
        setIsGenerating(false);
    };

    return (
        <div className="glass-card rounded-[32px] p-8 relative overflow-hidden group">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform group-hover:scale-110 duration-700"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none transition-transform group-hover:scale-110 duration-700"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-blue-500/30">
                            Generator V1
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 leading-tight">Create Identity</h2>
                    <p className="text-slate-400 font-medium max-w-md">
                        Generate instant, disposable EVM keypairs. Secured locally in your browser.
                    </p>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || isLoading}
                    className={cn(
                        "whitespace-nowrap py-4 px-8 rounded-[24px] font-bold text-base transition-all flex items-center gap-3 shadow-xl group/btn",
                        isGenerating
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                            : "bg-white text-slate-900 hover:scale-[1.02] active:scale-[0.98] shadow-white/10"
                    )}
                >
                    {isGenerating ? (
                        <> <Loader2 className="animate-spin" size={20} /> Forging... </>
                    ) : (
                        <>
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover/btn:rotate-180 transition-transform duration-500">
                                <Plus size={16} strokeWidth={3} />
                            </div>
                            Create Wallet
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
