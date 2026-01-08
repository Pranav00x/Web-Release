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
        // Add artificial delay for "hacker" feel
        await new Promise((resolve) => setTimeout(resolve, 600));
        createWallet();
        setIsGenerating(false);
    };

    return (
        <div className="border-2 border-white p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
                <span className="w-3 h-3 bg-white block"></span>
                Identity Fabrication
            </h2>
            <p className="text-sm text-gray-400 mb-6 font-mono">
                Generate disposable EVM credentials. Keys are stored locally.
                <br />Warning: Irreversible upon surrender.
            </p>

            <button
                onClick={handleGenerate}
                disabled={isGenerating || isLoading}
                className={cn(
                    "w-full py-4 text-lg font-bold uppercase border-2 border-white transition-all flex items-center justify-center gap-2 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black",
                    isGenerating ? "opacity-50 cursor-not-allowed bg-white text-black" : "bg-black text-white"
                )}
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="animate-spin" /> FABRICATING...
                    </>
                ) : (
                    <>
                        <Plus size={24} strokeWidth={3} /> GENERATE IDENTITY
                    </>
                )}
            </button>
        </div>
    );
};
