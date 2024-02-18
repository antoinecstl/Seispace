"use client";

import React, { useEffect, useState } from 'react';
import { spinWheel } from '@/lib/action/Wheel.action';
import RealtimeWheel from './realtime-wheel';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";


const WheelOfFortune: React.FC = () => {
  const [finalAngle, setFinalAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [transitionClass, setTransitionClass] = useState('transition-transform duration-6000 ease-out');
  const [timer, setTimer] = useState(30); // Ce timer sera mis à jour par RealtimeWheel
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const supabase = createClientComponentClient();


    // Fonction pour démarrer la rotation de la roue
    const spinWheelClient = async () => {
      setIsSpinning(true);
      
      let currentAngle = 0;
      const final = await spinWheel(finalAngle);
      const duration = 8000;
      const startTime = Date.now();
    
      const easeInOutCubic = (t : number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
      const animate = () => {
        const now = Date.now();
        const elapsedTime = now - startTime;
        const progress = elapsedTime / duration;
    
        if (progress < 1) {
          currentAngle = final * easeInOutCubic(progress);
          setFinalAngle(currentAngle);
          requestAnimationFrame(animate);
        } else {
          setTransitionClass('');
          setFinalAngle(final);
    
          setTimeout(() => {
            setTransitionClass('transition-transform duration-6000');
            setIsSpinning(false);
          }, 50); // Délai de 50ms avant de réactiver la transition
        }
      };
    
      requestAnimationFrame(animate);
    };
    
  // Souscrire à la table game_start pour obtenir le start_time
  useEffect(() => {
    const channel = supabase.channel('game_time')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: "game_start"
        }, (payload) => {
            const startTime = new Date(payload.new.start_time).getTime();
            setGameStartTime(startTime);
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    }
  }, [supabase]);

  

  return (
    <RealtimeWheel 
        transitionClass={transitionClass} 
        finalAngle={finalAngle} 
        timer={timer}
        gameStartTime={gameStartTime} // Passer gameStartTime comme prop
        setTimer={setTimer} // Passer setTimer pour permettre à RealtimeWheel de le mettre à jour
        spinWheelClient={spinWheelClient} // Passer spinWheelClient pour lancer la rotation
    />
);
};
export default WheelOfFortune;