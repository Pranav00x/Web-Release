import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LayoutGrid, WalletCards, Droplets, Zap, Sparkles, LogOut, Menu } from "lucide-react";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">

            {/* Sidebar - Floating Style */}
            <aside className="hidden md:flex w-72 flex-col p-4 fixed h-full z-20">
                <div className="bg-slate-900/90 backdrop-blur-xl rounded-[32px] border border-white/5 h-full flex flex-col shadow-2xl shadow-black/20">
                    {/* Brand */}
                    <div className="p-8 pb-4">
                        <div className="flex items-center gap-3 text-white">
                            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <Sparkles size={20} fill="white" className="text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">Burner.fi</span>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-4 space-y-2 mt-4">
                        <NavItem icon={<LayoutGrid size={20} />} label="Dashboard" active />
                        <NavItem icon={<WalletCards size={20} />} label="Wallets" />
                        <NavItem icon={<Droplets size={20} />} label="Gas Dispenser" />
                        <NavItem icon={<Zap size={20} />} label="Interact" />
                    </nav>

                    {/* User */}
                    <div className="p-4 mt-auto">
                        <div className="bg-slate-800/50 rounded-3xl p-4 flex items-center gap-3 border border-white/5 hover:bg-slate-800 transition-colors cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-slate-900 font-bold text-sm">
                                OP
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-sm text-slate-200">Testnet Op</p>
                                <p className="text-xs text-slate-500 truncate">Local Session</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 min-h-screen p-4 md:p-6 overflow-x-hidden">

                {/* Mobile Header */}
                <header className="md:hidden mb-6 flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-white/5">
                    <div className="flex items-center gap-2 text-white font-bold">
                        <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
                            <Sparkles size={16} fill="white" />
                        </div>
                        Burner.fi
                    </div>
                    <button className="p-2 bg-slate-800 rounded-xl text-slate-300">
                        <Menu size={20} />
                    </button>
                </header>

                <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>

        </div>
    );
};

const NavItem = ({ label, active, icon }: { label: string; active?: boolean, icon: React.ReactNode }) => (
    <button
        className={cn(
            "w-full text-left px-5 py-4 rounded-[20px] font-bold text-sm transition-all flex items-center gap-4 group",
            active
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl shadow-blue-500/20"
                : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
        )}
    >
        <span className={cn("transition-transform group-hover:scale-110 duration-200", active && "scale-110")}>
            {icon}
        </span>
        {label}
    </button>
);

export default DashboardLayout;
