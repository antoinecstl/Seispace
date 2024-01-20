"use client"
import Wheel from '@/components/Wheel';
import { useWallet, WalletConnectButton } from '@sei-js/react';

export default function Home() {
  const { offlineSigner, connectedWallet, accounts } = useWallet();
  return (
    
    <main className="flex flex-col items-center">
      <div className="">
        <h1 className="text-heading3-bold text-light-1">Welcome to Seispace Shuffle</h1>
      </div>
      <div className="mt-14 p-8 rounded-3xl">
      <Wheel/>
      </div>
    </main>
  );
}
