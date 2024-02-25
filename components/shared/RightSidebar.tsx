"use client";

import React, { useState } from 'react'; // Ajouter useState
import { Player } from '@/lib/schema/playerdata.Schema'; // Vérifiez le chemin
import { useWallet } from '@sei-js/react'; // Importez useWallet

type RightSidebarProps = {
  players: Player[];
  totalPot: number;
  lastbet: { address: string; amount: number; color: string } | null;
};

const formatWalletAddress = (address: string) => {
  if (address.length > 10) {
    return `${address.slice(0, 10)}.......${address.slice(-8)}`;
  }
  return address;
};

const RightSidebar: React.FC<RightSidebarProps> = ({ players, totalPot, lastbet }) => {
  const [showAllPlayers, setShowAllPlayers] = useState(false);
  const { accounts } = useWallet(); // Utilisez useWallet pour récupérer le compte de l'utilisateur
  const userWalletAddress = accounts?.[0]?.address; // Adresse du portefeuille de l'utilisateur

// Extraction du joueur actuel
const currentUserPlayer = players.find(player => player.wallets_address === userWalletAddress);

// Filtrer les autres joueurs
const otherPlayers = players.filter(player => player.wallets_address !== userWalletAddress);

// Trier les autres joueurs par pourcentage du pot
const sortedOtherPlayers = otherPlayers.sort((a, b) => {
  const percentageOfPotA = totalPot > 0 ? (a.bet_amount / totalPot) * 100 : 0;
  const percentageOfPotB = totalPot > 0 ? (b.bet_amount / totalPot) * 100 : 0;
  return percentageOfPotB - percentageOfPotA;
});

// Combiner le joueur actuel avec les autres joueurs triés, en plaçant le joueur actuel en haut
const sortedPlayers = currentUserPlayer ? [currentUserPlayer, ...sortedOtherPlayers] : sortedOtherPlayers;

  const displayedPlayers = showAllPlayers ? sortedPlayers : sortedPlayers.slice(0, 8);

  const playersList = displayedPlayers.map((player, index) => {
    const percentageOfPot = totalPot > 0 ? ((player.bet_amount / totalPot) * 100).toFixed(2) : '0';
    const isCurrentUser = player.wallets_address === userWalletAddress; // Vérifiez si le joueur est l'utilisateur connecté

    return (
      <div key={index} className={`flex items-center gap-2`}> {/* Appliquez la classe ici */}
        <span className='block w-4 h-4 rounded-full' style={{ backgroundColor: player.color }}></span>
        <p className='text-white'>{percentageOfPot}% - {player.bet_amount} $SEI</p>
        <p className={`hidden md:inline min-[1280px]:hidden 2xl:inline ${isCurrentUser ? 'text-white bg-primary-600 rounded-lg px-1' : 'text-light-3'}`}>{player.wallets_address}</p>
        <p className={`md:hidden min-[1280px]:inline 2xl:hidden ${isCurrentUser ? 'text-white bg-primary-600 rounded-lg px-1' : 'text-light-3'}`}>{formatWalletAddress(player.wallets_address)}</p>
        <p className={`${isCurrentUser ? 'text-primary-500' : 'hidden'}`}>{'<'}</p>
      </div>
    );
  });

  return (
    <section className='pt-4 xl:pt-10 max-xl:px-2'>
      <div className='flex flex-col justify-center'>
        {lastbet && (
          <>
            <h3 className='text-heading4-medium max-xl:text-body-medium text-light-1'>Last Bet</h3>
            <p className="text-white mt-2 ">{lastbet.amount} $SEI by 
            <span className='md:hidden min-[1280px]:inline 2xl:hidden' style={{ color: lastbet.color }}>{formatWalletAddress(lastbet.address)}</span>
            <span className='hidden md:inline min-[1280px]:hidden 2xl:inline' style={{ color: lastbet.color }}>{lastbet.address}</span>
            </p>
          </>
        )}
        <h3 className='mt-4 text-heading4-medium max-xl:text-body-medium text-light-1'>Players: {players.length}</h3>
        <div className='mt-4 overflow-auto max-h-96'>
          {playersList}
        </div>
        {sortedPlayers.length > 8 && (
          <button 
            className='mt-1 sm:mt-4 text-primary-600 hover:text-primary-500 transition duration-200 ease-in-out py-2 px-4 rounded'
            onClick={() => setShowAllPlayers(!showAllPlayers)}>
            {showAllPlayers ? 'Show Less' : 'Show All Players'}
          </button>
        )}
      </div>
    </section>
  );
};

export default RightSidebar;
