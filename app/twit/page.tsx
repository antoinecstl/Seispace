"use client"

import { TwitterShareButton } from 'react-twitter-embed';
import Confetti from 'react-confetti'

const Winner = () => {

  return (
    <main>
      <section className=''>
        <Confetti
        width={screen.width - 20}
        height={screen.height}
        />
        <div className='text-center rounded-xl py-4 mb-24 mt-32 mx-auto'>
            <h1 className='text-primary-500 text-heading3-bold mb-6'> You just won :</h1>
            <span className='text-light-2 text-heading2-bold'>100 $SEI</span>
            <p className='text-primary-500 text-heading3-bold mt-6'>Well Played !</p>
        </div>
        <div className='bg-slate-900/90 w-[410px] mx-auto p-4 rounded-xl'>
            <h2 className='mb-2 text-base-medium text-light-3'>Share this on X :</h2>
            <div className=' px-2 py-1 rounded-xl mb-2 bg-light-2'>
                <h1 className="text-base-medium text-center my-2  mb-4 text-gray-950  ">I just won x $SEI playing @SeiFiNFT Shuffle !</h1> {/* Adjusted text size and color for visibility */}
                <TwitterShareButton
                    url="https://sei-fi.com"
                    options={{ text: "I just won x $SEI playing @SeiFiNFT Shuffle !", size: "large" }}
                />
            </div>
        </div>
        
        
      </section>
    </main>
  );
};

export default Winner;
