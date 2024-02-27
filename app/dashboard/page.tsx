"use client"

import React from 'react';
import { useWallet } from '@sei-js/react';

export default function dash() {
  
  const { accounts } = useWallet();
  const userWalletAddress = accounts?.[0]?.address;

  return (
    <main className="flex flex-col items-center justify-center">
      <section className="text-center mt-52">
        {userWalletAddress ? (
          <>
            <p className='text-light-1 text-small-medium sm:text-body-semibold mb-4'>Welcome <span className='text-primary-500'>{userWalletAddress}</span> </p>
            <p className='text-light-1 text-small-medium sm:text-body-semibold mb-12'>Thank you for your participation in this project</p>        
            <button className='rounded-lg px-3 py-2 text-light-1 transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 bg-primary-600 border border-primary-600 hover:border-white text-small-medium sm:text-body-semibold hover:bg-primary-500 duration-200'> Claim your share </button>
          </>
        ) : (
          <p className='text-light-1 text-small-medium sm:text-body-semibold mt-20'>Please, connect your wallet.</p>
        )}
      </section>
    </main>
  );
}
