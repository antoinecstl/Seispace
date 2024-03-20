"use client";

import React, { useEffect, useState } from 'react';
import RealtimeWheel from './realtime-wheel';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { timeKeeper } from '@/lib/action/time-keeper';

const WheelOfFortune: React.FC = () => {
  const [timer, setTimer] = useState(30);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const supabase = createClientComponentClient();
    
    
    interface GameStartPayload {
      new: {
        start_time: string;
      };
    }
    
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
        gameStartTime={gameStartTime}
        setTimer={setTimer}
    />
);
};
export default WheelOfFortune;
