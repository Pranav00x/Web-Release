"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

// --- Types ---
export interface BurnerWallet {
  address: string;
  privateKey: string;
  createdAt: number;
  name?: string;
}

interface WalletContextType {
  wallets: BurnerWallet[];
  createWallet: () => void;
  deleteWallet: (address: string) => void;
  importWallet: (privateKey: string) => void;
  isLoading: boolean;
}

// --- Context ---
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// --- Storage Key ---
const STORAGE_KEY = "burner_wallets_v1";

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wallets, setWallets] = useState<BurnerWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWallets(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load wallets", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to local storage whenever wallets change (and not loading)
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
    }
  }, [wallets, isLoading]);

  const createWallet = () => {
    try {
      const wallet = ethers.Wallet.createRandom();
      const newWallet: BurnerWallet = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        createdAt: Date.now(),
        name: `Burner #${wallets.length + 1}`,
      };
      setWallets((prev) => [...prev, newWallet]);
    } catch (e) {
      console.error("Wallet generation failed", e);
    }
  };

  const deleteWallet = (address: string) => {
    setWallets((prev) => prev.filter((w) => w.address !== address));
  };

  const importWallet = (privateKey: string) => {
    try {
      const wallet = new ethers.Wallet(privateKey);
      const newWallet: BurnerWallet = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        createdAt: Date.now(),
        name: `Imported #${wallets.length + 1}`,
      };
      // Prevent duplicates
      if (wallets.some((w) => w.address === newWallet.address)) {
        alert("Wallet already exists");
        return;
      }
      setWallets((prev) => [...prev, newWallet]);
    } catch (e) {
      alert("Invalid Private Key");
    }
  };

  return (
    <WalletContext.Provider
      value={{ wallets, createWallet, deleteWallet, importWallet, isLoading }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallets = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallets must be used within a WalletProvider");
  }
  return context;
};
