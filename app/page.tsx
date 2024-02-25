"use client"

import React, { useState, useMemo } from 'react';
import Wheel from '@/components/Wheel';
import { handleUserBet } from '@/lib/action/UserJoin.action';
import { useWallet } from '@sei-js/react';

export default function Home() {
  
  const [betAmount, setBetAmount] = useState('');
  const { accounts } = useWallet();
  const walletAccount = useMemo(() => accounts?.[0], [accounts]);
  
  const handleSetBetAmount = (amount: string) => {
    // Permet d'effacer le champ en mettant à jour directement avec une chaîne vide
    if (amount === '') {
      setBetAmount('');
      return;
    }
    // Convertit la valeur en nombre pour vérifier si elle est négative
    const amountNumber = parseFloat(amount);
    // Vérifie si la valeur est un nombre et non négative avant de la définir
    if (!isNaN(amountNumber) && amountNumber >= 0) {
      setBetAmount(amount);
    }
  };

  const submitBet = async () => {
    const betAmountNumber = parseFloat(betAmount);
    // Vérifie si betAmountNumber est un nombre, non NaN et non négatif avant de soumettre
    if (!isNaN(betAmountNumber) && betAmountNumber >= 0) {
      handleUserBet(walletAccount?.address, betAmountNumber);
      setBetAmount(''); 
    } else {
      // Gérer le cas où la valeur saisie n'est pas un nombre valide ou est négative
      console.error('Invalid or negative bet amount');
      setBetAmount('')
    }
  };

  return (
    <main className="flex flex-col items-center justify-center">
      <section className="text-center">
        
        <div className="mt-8 mb-6 sm:mb-20 pt-8 items-center">
          <Wheel />
        </div>
        <div className="flex justify-center">
          <div className='grid grid-cols-3 gap-2 sm:gap-4'>
            <button onClick={() => handleSetBetAmount('25')} className="transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-small-medium sm:text-body-semibold hover:bg-primary-500 duration-200 px-1 sm:p-2 rounded-lg">25 $SEI</button>
            <button onClick={() => handleSetBetAmount('10')} className="transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-small-medium sm:text-body-semibold hover:bg-primary-500 duration-200 sm:p-2 rounded-lg">10 $SEI</button>
            <button onClick={() => handleSetBetAmount('5')} className="transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-small-medium sm:text-body-semibold hover:bg-primary-500 duration-200 sm:p-2 rounded-lg">5 $SEI</button>
          </div>
          <input
            className="py-2 sm:p-2 mx-2 sm:mx-4 rounded-lg bg-slate-950 text-center w-36 sm:w-44 text-light-1 text-small-medium sm:text-body-medium border border-primary-500 hover:border-white"
            type="number"
            placeholder="$SEI Bet Amount"
            value={betAmount}
            onChange={(e) => handleSetBetAmount(e.target.value)}
            min="0" // Ajoutez cet attribut pour empêcher la saisie de valeurs négatives directement dans le champ
          />
          <button onClick={submitBet} className="transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 bg-primary-600 w-20 text-light-1 border border-primary-600 hover:border-white text-small-medium sm:text-body-semibold hover:bg-red-500 duration-200 sm:p-2 rounded-lg">BET</button>
        </div>
      </section>
    </main>
  );
}
