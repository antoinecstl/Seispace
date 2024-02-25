"use client";

import { Player } from '@/lib/schema/playerdata.Schema'; // Assurez-vous que le chemin est correct

type RightSidebarProps = {
  players: Player[];
  totalPot: number;
  lastbet:{ address: string; amount: number; color: string } | null;
};

// Fonction pour formatter l'adresse du portefeuille
const formatWalletAddress = (address: string) => {
  if (address.length > 10) {
    return `${address.slice(0, 10)}.......${address.slice(-8)}`;
  }
  return address;
};

const RightSidebar: React.FC<RightSidebarProps> = ({ players, totalPot, lastbet }) => {
  const sortedPlayers = [...players].sort((a, b) => {
    const percentageOfPotA = totalPot > 0 ? (a.bet_amount / totalPot) * 100 : 0;
    const percentageOfPotB = totalPot > 0 ? (b.bet_amount / totalPot) * 100 : 0;
    return percentageOfPotB - percentageOfPotA;
  });

  const playersList = sortedPlayers.map((player, index) => {
    const percentageOfPot = totalPot > 0 ? ((player.bet_amount / totalPot) * 100).toFixed(2) : 0;
    return (
      <div key={index} className='flex items-center gap-2'>
        <span className='block w-4 h-4 rounded-full' style={{ backgroundColor: player.color }}></span>
        <p className='text-white'>{percentageOfPot}% - {player.bet_amount} $SEI</p>
        <p className='text-light-3 hidden md:inline min-[1280px]:hidden 2xl:inline'>{player.wallets_address}</p>
        <p className='text-light-3 md:hidden min-[1280px]:inline 2xl:hidden'>{formatWalletAddress(player.wallets_address)}</p>
      </div>
    );
  });

  return (
    <section className='pt-4 xl:pt-10 max-xl:px-2'>
      <div className='flex flex-col justify-center items-center'>
      {lastbet && (
        <><h3 className='text-heading4-medium max-xl:text-body-medium text-light-1'>
            Last Bet
          </h3>
          <p className="text-white mt-2">{lastbet.amount} $SEI by 
          <span className='hidden sm:inline min-[1280px]:hidden 2xl:inline' style={{ color: lastbet.color }}> {lastbet.address}</span> 
          <span className='sm:hidden min-[1280px]:inline 2xl:hidden' style={{ color: lastbet.color }}> {formatWalletAddress(lastbet.address)}</span> 
          </p></>)}
        <h3 className='mt-4 text-heading4-medium max-xl:text-body-medium text-light-1'>
          Players
        </h3>
        <div className='mt-4 '>
          {playersList}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
