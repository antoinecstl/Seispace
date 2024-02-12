"use client";

import React, {  useEffect, useState } from 'react';
import { describeArc, startTimer, spinWheel } from '@/lib/action/Wheel.action';
import { supabase } from '@/app/api/supabase/supabaseClient';
import { Player } from '@/lib/schema/playerdata.Schema';
import RightSidebar from './shared/RightSidebar';

const WheelOfFortune: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [totalPot, setTotalPot] = useState(0);

  // Fonction pour récupérer les joueurs depuis Supabase
  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from('players_data')
      .select('*');

    if (error) {
      console.error('Erreur lors de la récupération des joueurs', error);
      return;
    }

    if (data) {
      setPlayers(data);
      // Calculer le pot total
      const pot = data.reduce((acc, player) => acc + player.bet_amount, 0);
      setTotalPot(pot);
    }
  };

  useEffect(() => {
    fetchPlayers();
    // Cette configuration ne prend pas en compte les mises à jour en temps réel.
  }, []);

  // Autres états
  const [finalAngle, setFinalAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [transitionClass, setTransitionClass] = useState('transition-transform duration-6000 ease-out');
  const wheelSize = 450;
  const radius = wheelSize / 2;
  const innerRadius = radius * 0.65; // Taille du trou intérieur

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
          // Désactiver la transition avant de fixer l'angle final
          setTransitionClass('');
          setFinalAngle(final);
    
          // Réactiver la transition après un bref délai
          setTimeout(() => {
            setTransitionClass('transition-transform duration-6000');
            setIsSpinning(false);
          }, 50); // Délai de 50ms avant de réactiver la transition
        }
      };
    
      requestAnimationFrame(animate);
    };
    

  //A UPDATE A CHAQUE NOUVEAU BET Générer les chemins SVG pour chaque joueur
  let startAngle = 0;
  const paths = players.map((player, index) => {
    const playerShare = player.bet_amount / totalPot;
    const endAngle = startAngle + (playerShare * 360);
    const path = describeArc(radius, radius, radius, innerRadius, startAngle, endAngle);
    startAngle = endAngle; // Mettez à jour startAngle pour le prochain segment
    return (
      <path key={index} d={path} fill={player.color} />
    );
  });

  const [timer, setTimer] = useState(30);
  useEffect(() => {
    startAndUpdateTimer();
  }, []);
  

// Ajouter une fonction pour démarrer et mettre à jour le timer
const startAndUpdateTimer = async () => {
  const getRemainingTime = await startTimer();
  const timerInterval = setInterval(() => {
    const remainingTime = getRemainingTime();
    setTimer(remainingTime);
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      spinWheelClient();
    }
  }, 1000);
};

  return (
    <section className='grid xl:gap-4 xl:grid-cols-2 xl:gap-12 justify-center'>
      <div className='relative mx-auto'>
      <svg width={wheelSize} height={wheelSize}
        viewBox={`0 0 ${wheelSize} ${wheelSize}`}
        style={{ transform: `rotate(${finalAngle}deg)` }}
        className={transitionClass}>
        {paths}
      </svg>
      <svg
        width={20 * Math.sqrt(3) / 2}
        height={20}
        viewBox={`0 0 ${20 * Math.sqrt(3) / 2} ${20}`}
        style={{
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%) rotate(180deg)',
        }}
      >
        <polygon
          points={`${20 * Math.sqrt(3) / 2 / 2},0 ${20 * Math.sqrt(3) / 2}, ${20} 0,${20}`}
          fill="red" />
      </svg>
      <svg
        className="absolute"
        width={wheelSize}
        height={wheelSize}
        style={{ top: 0, left: 0 }}
      >
        <text
          x="50%"
          y="35%"
          textAnchor="middle"
          dy=".3em"
          fill="#7878A3"
          style={{ fontSize: '13px', userSelect: 'none' }}
        >
          Total Value

        </text>
        <text
          x="52%"
          y="44%"
          textAnchor="middle"
          dy=".3em"
          fill="#fff"
          style={{ fontSize: '28px', userSelect: 'none' }}>
          {totalPot} $Sei
        </text>
        <text
          x="50%"
          y="56%"
          textAnchor="middle"
          dy=".3em"
          fill="#7878A3"
          style={{ fontSize: '13px', userSelect: 'none' }}
        >
          CountDown
        </text>

        <text
          x="50%"
          y="65%"
          textAnchor="middle"
          dy=".3em"
          fill="#fff"
          style={{ fontSize: '26px', userSelect: 'none' }}
        >
          {timer > 0 ? `${Math.floor(timer / 60)}:${timer % 60 < 10 ? `0${timer % 60}` : timer % 60}` : "Time's up"}
        </text>

      </svg>
    </div>
    <RightSidebar players={players} totalPot={totalPot}/>
    </section>
  );
};

export default WheelOfFortune;