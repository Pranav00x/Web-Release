import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import BrutalistLayout from "@/components/layout/BrutalistLayout";

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
      <body>
        <Providers>
          <BrutalistLayout>
            {children}
          </BrutalistLayout>
        </Providers>
      </body>
    </html>
  );
}
