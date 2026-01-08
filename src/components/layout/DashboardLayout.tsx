import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Wallet, Droplets, Zap, ChevronRight, Settings, Beaker } from "lucide-react";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row">

            {/* Sidebar */}
            <aside className="w-full md:w-72 bg-zinc-900/50 border-r border-zinc-800/50 flex flex-col h-screen fixed top-0 left-0 hidden md:flex">
                {/* Brand */}
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <Beaker size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight tracking-tight">Burner Lab</h1>
                            <p className="text-xs text-zinc-500 font-medium">Disposable EVM Tools</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1">
                    <p className="px-3 text-xs font-semibold text-zinc-500 mb-2 mt-4 uppercase tracking-wider">Platform</p>
                    <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active />
                    <NavItem icon={<Wallet size={20} />} label="Wallets" />
                    <p className="px-3 text-xs font-semibold text-zinc-500 mb-2 mt-8 uppercase tracking-wider">Tools</p>
                    <NavItem icon={<Droplets size={20} />} label="Gas Drip" />
                    <NavItem icon={<Zap size={20} />} label="Contract Calls" />
                </nav>

                {/* User / Footer */}
                <div className="p-4 border-t border-zinc-800/50 bg-zinc-900/30">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-bold">
                            ME
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Local Session</p>
                            <p className="text-xs text-zinc-500 truncate">Testnet Operator</p>
                        </div>
                        <Settings size={16} className="text-zinc-500" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 bg-zinc-950 min-h-screen">
                {/* Header - Mobile Only for now, but good for title */}
                <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
                    <h2 className="text-sm font-semibold text-zinc-200">Dashboard</h2>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs text-zinc-500 font-medium">System Operational</span>
                    </div>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>

        </div>
    );
};

const NavItem = ({ label, active, icon }: { label: string; active?: boolean, icon: React.ReactNode }) => (
    <button
        className={cn(
            "w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center gap-3 group",
            active
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
        )}
    >
        {icon}
        <span className="flex-1">{label}</span>
        {active && <ChevronRight size={14} className="opacity-50" />}
    </button>
);

export default DashboardLayout;
