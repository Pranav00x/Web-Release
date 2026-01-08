import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import BrutalistLayout from "@/components/layout/BrutalistLayout";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";

export const metadata: Metadata = {
  title: "BURNER_LAB_v1",
  description: "Disposable EVM Wallet Generator and Testnet Farmer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-mono bg-zinc-950 text-zinc-100 antialiased selection:bg-zinc-100 selection:text-black">
        <Providers>
          <BrutalistLayout>
            {children}
          </BrutalistLayout>
        </Providers>
      </body>
    </html>
  );
}
