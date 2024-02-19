"use client"
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { WalletConnectButton, useWallet, } from '@sei-js/react';

function Topbar() {
 
  return (
    <nav className='topbar mt-2'>
        <Link href='/' className='flex items-center gap-4'>
            <Image src='/target.svg' alt='logo' width={40} height={40}/>
            <p className='text-heading3-bold text-light-1'>Sei-Fi</p>
        </Link>

        <div className='flex items-center gap-1 text-white'>
            <div className='flex gap-6 mr-4'>
                <Link href='https://twitter.com/SeiFiNFT' className="mt-1 hover:opacity-50 duration-300">
                    <Image src='/X_logo_2023.svg' alt='logo' width={26} height={26}/>
                </Link>
                <Link href='https://discord.gg/seifi' className="hover:opacity-50 duration-300">
                    <Image src='/discord.svg' alt='logo' width={30} height={30}/>
                </Link>
            </div>
            <div className="bg-primary-600 hover:bg-primary-500 duration-300 px-2 py-1 rounded-xl">
                <WalletConnectButton/>
            </div>
        </div>
    </nav>
    
  );
}

export default Topbar;
