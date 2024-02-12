"use client"

import React, { useState, useMemo } from 'react';
import Wheel from '@/components/Wheel';
import { handleUserBet } from '@/lib/action/UserJoin.action';
import { useWallet } from '@sei-js/react';


export default function Home() {
  
  const [betAmount, setBetAmount] = useState('');
  const { accounts } = useWallet();
  const walletAccount = useMemo(() => accounts?.[0], [accounts]);
  const handleSetBetAmount = (amount: React.SetStateAction<string>) => {
    setBetAmount(amount);
  };

  const submitBet = async () => {
    const betAmountNumber = parseFloat(betAmount);
    if (!isNaN(betAmountNumber)) {
      handleUserBet(walletAccount?.address, betAmountNumber);
      setBetAmount(''); 
    } else {
      // Gérer le cas où la valeur saisie n'est pas un nombre valide
      console.error('Invalid bet amount');
    }
  };


  return (
    <main className="flex flex-col items-center justify-center">
      <section className="text-center">
        <div className="mt-8 mb-16">
          <h1 className="text-heading3-bold text-light-1 select-none">Welcome to Sei-Fi Shuffle</h1>     
        </div>
        <div className="mt-8 mb-20 pt-8 px-2 rounded-3xl items-center">
          <Wheel />
        </div>
        <div className="flex justify-center">
          <div className='grid grid-cols-3 gap-4'>
            <button onClick={() => handleSetBetAmount('5')} className="transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-body-semibold hover:bg-primary-500 duration-200 p-2 rounded-md">5 $SEI</button>
            <button onClick={() => handleSetBetAmount('10')} className="transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-body-semibold hover:bg-primary-500 duration-200 p-2 rounded-md">10 $SEI</button>
            <button onClick={() => handleSetBetAmount('25')} className="transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-body-semibold hover:bg-primary-500 duration-200 p-2 rounded-md">25 $SEI</button>
          </div>
          <input
            className="p-2 mx-4 rounded-lg bg-slate-950 w-44 text-light-1 text-body-medium text-center border border-primary-500 hover:border-white"
            type="number"
            placeholder="$SEI Bet Amount"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
          />
          <button onClick={submitBet} className="bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-body-semibold hover:bg-primary-500 duration-200 p-2 rounded-md">Bet</button>
        </div>
      </section>
    </main>
  );
}