"use client";

import React, { useEffect, useState } from 'react';
import RealtimeWheel from './realtime-wheel';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { timeKeeper } from "@/app/api/timer/time-keeper";


const WheelOfFortune: React.FC = () => {
  const [timer, setTimer] = useState(30); // Ce timer sera mis à jour par RealtimeWheel
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const supabase = createClientComponentClient();
    
    
    interface GameStartPayload {
      new: {
        start_time: string;
      };
    }
    
  
  // Souscrire à la table game_start pour obtenir le start_time
  useEffect(() => {
    const channel = supabase.channel('game_time').on('postgres_changes' as any, {
            event: '*' as any,
            schema: 'public',
            table: "game_start"
        }, (payload: GameStartPayload) => {
            const startTime = new Date(payload.new.start_time).getTime();
            try {
              timeKeeper(startTime);
              setGameStartTime(startTime);
            } catch (error)
            {
              console.error("error on executing the sc : ", error)
          }
            
        }).subscribe();
  
    return () => {
        supabase.removeChannel(channel);
    }
  }, [supabase]);


  return (
    <RealtimeWheel 
        timer={timer}
        gameStartTime={gameStartTime} // Passer gameStartTime comme prop
        setTimer={setTimer} // Passer setTimer pour permettre à RealtimeWheel de le mettre à jour
    />
);
};
export default WheelOfFortune;
