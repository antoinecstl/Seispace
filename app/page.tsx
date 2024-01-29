"use client"

import React, { useState, useMemo } from 'react';
import Wheel from '@/components/Wheel';
import { handleUserBet, playerData } from '@/lib/action/UserJoin.action';
import { useWallet } from '@sei-js/react';


export default function Home() {
  
  const [betAmount, setBetAmount] = useState('');
  const [playernb, setPlayernb] = useState(0);
  const { accounts } = useWallet();
  const walletAccount = useMemo(() => accounts?.[0], [accounts]);
  const handleSetBetAmount = (amount: React.SetStateAction<string>) => {
    setBetAmount(amount);
  };

  const submitBet = async () => {
    const betAmountNumber = parseFloat(betAmount);
    if (!isNaN(betAmountNumber)) {
      const numberOfPlayers = await handleUserBet(walletAccount?.address, betAmountNumber);
      setPlayernb(numberOfPlayers);
      setBetAmount('');
    } else {
      // Gérer le cas où la valeur saisie n'est pas un nombre valide
      console.error('Invalid bet amount');
    }
  };


  return (
    <main className="flex flex-col items-center">
      <section>
        <div className="">
          <h1 className="text-heading3-bold text-light-1 select-none">Welcome to Sei-Fi Shuffle</h1>     
        </div>
        <div className="mt-8 p-8 rounded-3xl">
          <Wheel players={playerData} />
        </div>
        <div className="mt-4 flex items-center">
          <div className='grid grid-cols-3 mr-2'>
            <button onClick={() => handleSetBetAmount('5')} className="transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-body-semibold hover:bg-primary-500 duration-200 p-2 mx-1 rounded-md">5 $SEI</button>
            <button onClick={() => handleSetBetAmount('10')} className="transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-body-semibold hover:bg-primary-500 duration-200 p-2 mx-1 rounded-md">10 $SEI</button>
            <button onClick={() => handleSetBetAmount('25')} className="transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-body-semibold hover:bg-primary-500 duration-200 p-2 mx-1 rounded-md">25 $SEI</button>
          </div>
          <input
            className="p-2 rounded-lg bg-slate-950 w-44 text-light-1 text-body-medium text-center border border-primary-500 hover:border-white"
            type="number"
            placeholder="$SEI Bet Amount"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
          />
          <button onClick={submitBet} className="bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-body-semibold hover:bg-primary-500 duration-200 p-2 mx-1 rounded-md">Bet</button>
        </div>
      </section>
      <section className='bg-gray-950'>
        <div className='custom-scrollbar rightsidebar'>
          <div className='flex flex-1 flex-col justify-start'>
            <h3 className='text-heading4-medium max-xl:text-body-medium text-light-1'>
              Players
            </h3>

            <div className='mt-7 max-xl:mt-4 flex flex-col gap-9'>
      
                <p className='!text-base-regular text-light-3'>
                    Players : {}
                </p>
        
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
