"use client"

import { useEffect, useState } from 'react';
import { TwitterShareButton } from 'react-twitter-embed';
import Confetti from 'react-confetti';

const Winner = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({ width: screen.width - 20, height: screen.height });
  }, []);

  return (
    <main>
      <section className=''>
        <Confetti
        width={dimensions.width}
        height={dimensions.height}
        gravity={0.09}
        />
        <div className='text-center rounded-xl py-4 mb-24 mt-32 mx-auto'>
            <h1 className='text-primary-500 text-heading3-bold mb-6'>You just won:</h1>
            <span className='text-light-2 text-heading2-bold'>100 $SEI</span>
            <p className='text-primary-500 text-heading3-bold mt-6'>Well Played!</p>
        </div>
        <div className='bg-slate-900/90 w-[410px] mx-auto p-4 rounded-xl'>
            <h2 className='mb-2 text-base-medium text-light-3'>Share this on X:</h2>
            <div className='px-2 py-1 rounded-xl mb-2 bg-light-2'>
                <h1 className="text-base-medium text-center my-2 mb-4 text-gray-950">I just won x $SEI playing @SeiFiNFT Shuffle!</h1>
                <TwitterShareButton
                    url="https://sei-fi.com"
                    options={{ text: "I just won x $SEI playing @SeiFiNFT Shuffle!", size: "large" }}
                />
            </div>
        </div>
      </section>
    </main>
  );
};

export default Winner;
