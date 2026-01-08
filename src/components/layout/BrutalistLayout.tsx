import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Terminal, ShieldAlert, Cpu, Flame } from "lucide-react";

interface BrutalistLayoutProps {
    children: ReactNode;
}

const BrutalistLayout: React.FC<BrutalistLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-black text-white font-mono selection:bg-white selection:text-black flex flex-col">
            {/* Top Header */}
            <header className="border-b-2 border-white p-4 flex justify-between items-center sticky top-0 bg-black z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold border border-white">
                        <Flame size={20} strokeWidth={3} />
                    </div>
                    <h1 className="text-xl font-bold tracking-tighter uppercase">
                        BURNER_LAB_v1.0
                    </h1>
                </div>
                <div className="flex gap-4 text-xs font-bold uppercase">
                    <span className="border border-white px-2 py-1 hover:bg-white hover:text-black cursor-pointer transition-none">
                        [Status: ONLINE]
                    </span>
                    <span className="border border-white px-2 py-1 text-red-500 border-red-500 hover:bg-red-500 hover:text-white cursor-pointer transition-none flex items-center gap-1">
                        <ShieldAlert size={12} /> TESTING ONLY
                    </span>
                </div>
            </header>

            {/* Main Grid */}
            <div className="flex flex-1 flex-col md:flex-row">
                {/* Sidebar */}
                <nav className="w-full md:w-64 border-b-2 md:border-b-0 md:border-r-2 border-white p-4 flex flex-col gap-4">
                    <div className="text-xs text-gray-400 uppercase border-b border-gray-800 pb-2 mb-2">
                        Modules
                    </div>

                    <NavItem label="Wallet Gen" active />
                    <NavItem label="Gas Drip" />
                    <NavItem label="NFT Minter" />
                    <NavItem label="RPC Manager" />

                    <div className="mt-auto border-t-2 border-white pt-4">
                        <div className="text-[10px] uppercase text-gray-500 leading-tight">
                            Warning: Private keys stored in local storage.
                            Do not use for high value assets.
                            <br />
                            <br />
                            System ID: {Math.floor(Math.random() * 999999)}
                        </div>
                    </div>
                </nav>

                {/* Content Area */}
                <main className="flex-1 p-0 bg-black relative overflow-hidden">
                    {children}
                </main>
            </div>

            <footer className="border-t-2 border-white p-2 text-center text-[10px] uppercase">
                NO WARRANTIES · USE AT YOUR OWN RISK · DEGEN UTILITIES INC.
            </footer>
        </div>
    );
};

const NavItem = ({ label, active = false }: { label: string; active?: boolean }) => (
    <button
        className={cn(
            "w-full text-left p-3 border-2 border-white font-bold uppercase hover:bg-white hover:text-black transition-none focus:outline-none flex items-center justify-between group",
            active ? "bg-white text-black" : "bg-black text-white"
        )}
    >
        {label}
        <span className={cn("inline-block w-2 h-2 bg-current opacity-0 group-hover:opacity-100", active && "opacity-100")}></span>
    </button>
);

export default BrutalistLayout;
