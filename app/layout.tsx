"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import { SeiWalletProvider } from "@sei-js/react";
import Bottombar from "@/components/shared/Bottombar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboardPage = pathname === "/dashboard";

  return (
    <><link rel="icon" href="/favicon.ico" sizes="any" /><html lang='en'>
      <body className={inter.className}>
        <SeiWalletProvider
          chainConfiguration={{
            chainId: 'atlantic-2',
            restUrl: 'https://sei-testnet-api.polkachu.com/',
            rpcUrl: 'https://sei-testnet-rpc.polkachu.com/'
          }}
          wallets={['compass']}
          autoConnect='compass'>
          <Topbar />

          <main className='flex flex-row'>
            {!isDashboardPage && <LeftSidebar />}
            <section className='main-container mt-4 mb-4'>
              <div className='w-full'>{children}</div>
            </section>
          </main>
          {!isDashboardPage && <Bottombar/>}
        </SeiWalletProvider>
      </body>
    </html></>
  );
}
