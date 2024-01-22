"use client"

import React, { useState, useMemo } from 'react';
import Wheel from '@/components/Wheel';
import { handleUserBet } from '@/lib/action/UserJoin.action';
import { useWallet } from '@sei-js/react';

const playerData = {
  'player1': { name: 'Joueur 1', bet: 8, color: '#f82' },
  'player2': { name: 'Joueur 2', bet: 8, color: '#0bf' },
};

export default function Home() {
  
  const [betAmount, setBetAmount] = useState('');
  const { accounts } = useWallet();
  const walletAccount = useMemo(() => accounts?.[0], [accounts]);
  const handleSetBetAmount = (amount: React.SetStateAction<string>) => {
    setBetAmount(amount);
  };

  const submitBet = async () => {
    // Ici, vous pouvez récupérer l'ID de l'utilisateur si nécessaire
    const betAmountNumber = parseFloat(betAmount);
    if (!isNaN(betAmountNumber)) {
      await handleUserBet(walletAccount?.address , betAmountNumber);
      // Vous pouvez ajouter d'autres actions après l'envoi du pari, comme réinitialiser l'input
      setBetAmount('');
    } else {
      // Gérer le cas où la valeur saisie n'est pas un nombre valide
      console.error('Invalid bet amount');
    }
  };


  return (
    <main className="flex flex-col items-center">
      <div className="">
        <h1 className="text-heading3-bold text-light-1 select-none">Welcome to Seispace Shuffle</h1>     
      </div>
      <div className="mt-8 p-8 rounded-3xl">
        <Wheel players={playerData} />
      </div>
      <div className="mt-4 flex items-center">
        <div className='grid grid-cols-3 mr-2'>
          <button onClick={() => handleSetBetAmount('5')} className="bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-body-semibold hover:bg-primary-500 duration-200 p-2 mx-1 rounded-md">5 $SEI</button>
          <button onClick={() => handleSetBetAmount('10')} className="bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-body-semibold hover:bg-primary-500 duration-200 p-2 mx-1 rounded-md">10 $SEI</button>
          <button onClick={() => handleSetBetAmount('25')} className="bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-body-semibold hover:bg-primary-500 duration-200 p-2 mx-1 rounded-md">25 $SEI</button>
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
    </main>
  );
}
