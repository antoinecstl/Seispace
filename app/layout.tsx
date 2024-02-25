"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import { SeiWalletProvider } from "@sei-js/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <><link rel="icon" href="/favicon.ico" sizes="any" /><html lang='en'>
      <body className={inter.className}>
        <SeiWalletProvider
          chainConfiguration={{
            chainId: 'atlantic-2',
            restUrl: 'http://localhost:3000/',
            rpcUrl: 'http://localhost:3000/'
          }}
          wallets={['compass']}
          autoConnect='compass'>
          <Topbar />

          <main className='flex flex-row'>
            <LeftSidebar />
            <section className='main-container mt-4 mb-4'>
              <div className='w-full'>{children}</div>
            </section>
            {/* @ts-ignore */}
          </main>
        </SeiWalletProvider>
      </body>
    </html></>
    
  );
}
