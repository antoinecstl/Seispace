"use client"

import { useEffect, useState } from 'react';
import { TwitterShareButton } from 'react-twitter-embed';
import Confetti from 'react-confetti';

interface WinnerProps {
  amount: number;
  onBack: () => void; 
}

// Ajout de la prop `amount` pour personnaliser le montant gagné
const Winner: React.FC<WinnerProps> = ({ amount, onBack }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [numberOfPieces, setNumberOfPieces] = useState(250);

  useEffect(() => {
    // Ajustement des dimensions pour le confetti
    setDimensions({ width: screen.width - 20, height: screen.height });

    const timer = setTimeout(() => {
      // Stoppe le confetti après 5 secondes
      setNumberOfPieces(0); 
    }, 5000);

    // Nettoyage du timer
    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      <section className=''>
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          gravity={0.09}
          numberOfPieces={numberOfPieces}
        />
        <div className="mt-8 sm:mt-6 justify-center"> 
            <h1 className='text-primary-500 hidden sm:block text-center text-body-bold md:text-heading3-bold '>Congrats Degen, you just won the total pot !</h1>
            <h1 className='text-primary-500 block sm:hidden text-center text-body-bold '>Congrats, you won the total pot !</h1>
        </div>

        <section className='xl:grid xl:grid-cols-2 xl:mt-12'>
        <div className='bg-slate-900/90 w-[380px] sm:w-[510px] rounded-xl p-4 mb-12 mt-16 mx-auto'>
          <h2 className='mb-2 text-small-medium sm:text-base-medium text-light-3'>Your receipt:</h2>
          <div className='grid grid-cols-2 grid-rows-3 gap-3 sm:gap-5 px-2 py-1 rounded-xl bg-gray-950'>
            <p className='text-small-bold sm:text-base-bold text-light-1'>Total Pot: </p>      
            <p className='text-small-bold sm:text-base-bold text-primary-500 text-end'>{amount} $SEI</p>
            <p className='text-small-bold sm:text-base-bold text-light-1'>Platform Fee: </p>  
            <p className='text-small-bold sm:text-base-bold text-primary-500 text-end'>4%</p>    
            <p className='text-small-bold sm:text-base-bold text-light-1'>Your winnings: </p>  
            <p className='text-small-bold sm:text-base-bold text-primary-500 text-end'>{amount - 0.04*amount} $SEI</p> 

            </div>
        </div>
        <div>
          <div className='bg-slate-900/90 w-[380px] sm:w-[410px] mx-auto p-4 rounded-xl'>
            <h2 className='mb-2 text-small-medium sm:text-base-medium text-light-3'>Share this on X:</h2>
            <div className='px-2 py-1 rounded-xl mb-2 bg-light-2'>
                <h1 className="text-small-medium sm:text-base-medium text-center my-2 sm:mb-4 text-gray-950">I just won {amount - 0.04*amount} $SEI playing @SeiFiNFT Shuffle!</h1>
                <TwitterShareButton
                    url="https://sei-fi.com"
                    options={{ text: `I just won ${amount - 0.04*amount} $SEI playing @SeiFiNFT Shuffle!`, size: "large" }}
                />
            </div>
          </div>
          <div className='text-center rounded-xl py-4 mx-auto'>
            <button onClick={onBack} className="mt-5 sm:mt-10 sm:mb-10 transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 bg-primary-600 text-light-1 border border-primary-600 hover:border-white text-body-semibold sm:text-heading4-semibold hover:bg-primary-500 duration-200 p-2 rounded-lg">
              Return to Game
            </button>
          </div>
        </div>
        </section>
        
      </section>
    </main>
  );
};

export default Winner;
