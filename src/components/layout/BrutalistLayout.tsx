import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Terminal, ShieldAlert, Zap, Box, Activity, Layers, Flame } from "lucide-react";

interface BrutalistLayoutProps {
    children: ReactNode;
}

const BrutalistLayout: React.FC<BrutalistLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-black text-zinc-300 font-mono flex flex-col md:flex-row overflow-hidden">

            {/* Sidebar - Fixed Width */}
            <aside className="w-full md:w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col h-screen z-10">

                {/* Brand */}
                <div className="p-6 border-b border-zinc-800 bg-black">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-white text-black p-1">
                            <Flame size={16} strokeWidth={3} />
                        </div>
                        <h1 className="text-white font-bold tracking-tight text-lg leading-none">
                            BURNER<br /><span className="text-zinc-500">LAB_v1</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] uppercase text-emerald-500">
                        <span className="w-2 h-2 bg-emerald-500 animate-pulse block"></span>
                        System Online
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    <div className="px-2 py-4 text-xs font-bold text-zinc-600 uppercase tracking-widest">Modules</div>
                    <NavItem icon={<Activity size={16} />} label="Dashboard" active />
                    <NavItem icon={<Zap size={16} />} label="Gas Drip" />
                    <NavItem icon={<Box size={16} />} label="NFT Minter" />
                    <NavItem icon={<Layers size={16} />} label="Batcher" badge="WIP" />
                </nav>

                {/* Footer Info */}
                <div className="p-4 border-t border-zinc-800 text-[10px] text-zinc-600 bg-black">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert size={12} className="text-amber-500" />
                        <span className="text-amber-500 font-bold">UNSAFE ENV</span>
                    </div>
                    <p className="leading-relaxed opacity-60">
                        Keys stored in browser.<br />
                        Clear cache to nuke.<br />
                        Do not use real funds.
                    </p>
                </div>
            </aside>

            {/* Main Content - Scrollable */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-zinc-950 relative">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 panel-bg opacity-20 pointer-events-none"></div>

                {/* Top Bar */}
                <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur-sm z-10">
                    <div className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                        <Terminal size={14} />
                        <span>/ root / workspace / active_session</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] uppercase border border-zinc-700 px-2 py-1 text-zinc-400">
                            Network: Global
                        </span>
                    </div>
                </header>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-0">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>

        </div>
    );
};

const NavItem = ({ label, active, icon, badge }: { label: string; active?: boolean, icon: React.ReactNode, badge?: string }) => (
    <button
        className={cn(
            "w-full text-left px-3 py-2 text-sm font-bold uppercase transition-colors flex items-center justify-between group border border-transparent hover:border-zinc-700 hover:bg-zinc-900",
            active ? "bg-zinc-900 border-zinc-700 text-white" : "text-zinc-500 hover:text-white"
        )}
    >
        <div className="flex items-center gap-3">
            {icon}
            {label}
        </div>
        {badge && <span className="text-[9px] bg-zinc-800 px-1 text-zinc-400">{badge}</span>}
    </button>
);

export default BrutalistLayout;
