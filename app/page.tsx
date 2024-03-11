"use client"

import { useCallback, useEffect, useState, useMemo } from 'react';
import { useCosmWasmClient, useSigningCosmWasmClient, useWallet, WalletConnectButton } from '@sei-js/react';
import Wheel from '@/components/Wheel';
import Winner from '@/components/winner';
import { handleUserBet } from '@/lib/action/UserJoin.action';

const contract_address = "sei18j0wumtq8yewt7ka8403q7v7qfezhlsc53aq3hm7uvq8gj9xdnjs4rctnz";

export default function Home() {
  
  const [betAmount, setBetAmount] = useState('');
  const { connectedWallet, accounts } = useWallet();
  const walletAccount = useMemo(() => accounts?.[0], [accounts]);
  const [isWinner, setIsWinner] = useState(false); // Assuming you want to show the winner conditionally
  const [error, setError] = useState(''); // Add state for error messages

  // For executing messages on cosmwasm smart contracts
  const { signingCosmWasmClient: signingClient } = useSigningCosmWasmClient();

  const handleSetBetAmount = (amount: string) => {
    if (amount === '') {
      setBetAmount('');
      setError(''); // Clear error when the input is cleared
      return;
    }
    const amountNumber = parseFloat(amount);
    if (!isNaN(amountNumber) && amountNumber >= 0) {
      setBetAmount(amount);
      setError(''); // Clear error when a valid amount is set
    } else {
      setError('Please enter a valid bet amount.'); // Set an error for invalid input
    }
  };

  const submitBet = async () => {
    if (!walletAccount) {
      setError('Wallet account is not available');
      return;
    }

    const betAmountNumber = parseFloat(betAmount);
    if (isNaN(betAmountNumber) || betAmountNumber <= 0) {
      setError('Invalid bet amount');
      setBetAmount('');
      return;
    }

    if (!contract_address) {
      console.error('Contract address is not defined');
      setError('Contract address is not available. Please check the configuration.');
      return;
    }

    try {
      const msg = { add_bet_user_infinite: {} }; // Ajustez selon la méthode `execute` de votre contrat
      // Fee devrait être un objet définissant les frais de transaction, pas juste un nombre
      const fee = {
        amount: [{ amount: "2000", denom: "usei" }], // Exemple de frais, ajustez selon vos besoins
        gas: "200000", // Gas limit
      };
      // Les fonds que vous souhaitez lier à la transaction
      const funds = [{ denom: 'usei', amount: String(betAmountNumber * 1000000) }]; // Ajustez la quantité selon vos besoins
    
      await signingClient?.execute(
        walletAccount.address,
        contract_address,
        msg,
        fee,
        undefined, // Memo, si nécessaire
        funds
      );
      handleUserBet(walletAccount?.address, betAmountNumber);
      console.log('Bet submitted successfully');
      setError(''); // Clear any previous error
      setBetAmount('');
    } catch (error) {
      console.error('Error submitting bet:', error);
      setError('An error occurred while submitting your bet.');
      setBetAmount('');
    }
  };

  if (isWinner) {
    const winningAmount = 100; // Example
    return <Winner amount={winningAmount} onBack={() => setIsWinner(false)} />;
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <section className="text-center">
        <div className="mt-8 mb-6 sm:mb-12 lg:mb-20 pt-8 items-center">
          <Wheel />
        </div>
        <div>
        {error && <p className='mb-4' style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <div className="mx-auto flex justify-center sm:bg-slate-900/60 hover:sm:bg-slate-900 delay-50 duration-200 py-3 px-2 lg:w-[605px] rounded-xl mb-8">
            <div className='hidden sm:grid grid-cols-3 gap-4'>
              <button onClick={() => handleSetBetAmount('25')} className="transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-small-medium sm:text-body-semibold hover:bg-primary-500 duration-200 px-1 sm:p-2 rounded-lg">25 $SEI</button>
              <button onClick={() => handleSetBetAmount('10')} className="transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-small-medium sm:text-body-semibold hover:bg-primary-500 duration-200 sm:p-2 rounded-lg">10 $SEI</button>
              <button onClick={() => handleSetBetAmount('5')} className="transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-small-medium sm:text-body-semibold hover:bg-primary-500 duration-200 sm:p-2 rounded-lg">5 $SEI</button>
            </div>
            <input
              className="py-2 sm:p-2 mx-2 sm:mx-4 rounded-lg bg-slate-950 text-center w-44 text-light-1 text-base-medium sm:text-body-medium border border-primary-500 hover:border-white"
              type="number"
              placeholder="$SEI Bet Amount"
              value={betAmount}
              onChange={(e) => handleSetBetAmount(e.target.value)}
              min="0"
            />
            <button onClick={submitBet} className="transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 bg-primary-600 w-20 text-light-1 border border-primary-600 hover:border-white text-body-medium sm:text-body-semibold hover:bg-red-500 duration-200 sm:p-2 rounded-lg">BET</button>
          </div>
        </div>
      </section>
    </main>
  );
}
