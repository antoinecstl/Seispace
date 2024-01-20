"use client"
import Image from "next/image";
import Link from "next/link";
import { SeiWalletProvider, useWallet, WalletConnectButton } from '@sei-js/react';

function Topbar() {
    const { offlineSigner, connectedWallet, accounts } = useWallet();
  return (
    <SeiWalletProvider
      chainConfiguration={{
        chainId: 'atlantic-2',
        restUrl: 'http://localhost:3000/',
        rpcUrl: 'http://localhost:3000/'
      }} 
      wallets={['compass']} 
      autoConnect='compass'>
    <nav className='topbar mt-2'>
        <Link href='/' className='flex items-center gap-4'>
            <Image src='/target.svg' alt='logo' width={32} height={32} />
            <p className='text-heading3-bold text-light-1'>Seispace</p>
        </Link>

        <div className='flex items-center gap-1 text-white'>
            <div className='flex gap-6 ml-2'>
                <Link href='https://twitter.com/SeiSpaceHub' className="mt-1">
                    <Image src='/X_logo_2023.svg' alt='logo' width={26} height={26}/>
                </Link>
                <Link href='https://twitter.com/SeiSpaceHub' >
                    <Image src='/discord.svg' alt='logo' width={30} height={30}/>
                </Link>
            </div>
            <div>
                {!connectedWallet ? <WalletConnectButton /> : <p>connected to: {connectedWallet}</p>}
        </div>
        </div>
    </nav>
    </SeiWalletProvider>
  );
}

export default Topbar;
