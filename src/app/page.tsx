import { WalletCreator } from "@/components/features/WalletCreator";
import { WalletList } from "@/components/features/WalletList";
import { GasDripper } from "@/components/features/GasDripper";
import { NFTMinter } from "@/components/features/NFTMinter";

export default function Home() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Management */}
        <div className="xl:col-span-7 space-y-6">
          <WalletCreator />
          <WalletList />
        </div>

        {/* Right Column: Operations */}
        <div className="xl:col-span-5 space-y-6">
          <GasDripper />
          <NFTMinter />
        </div>
      </div>
    </div>
  );
}
