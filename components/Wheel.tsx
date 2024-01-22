"use client";

import React, {  useEffect, useState } from 'react';
import { calculateFinalAngle, describeArc, startTimer } from '@/lib/action/Wheel.action';

type Player = {
  name: string;
  bet: number;
  color: string;
};

type WheelOfFortuneProps = {
  players: { [id: string]: Player };
};

const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({ players }) => {

  // Calculer le pot total
  const totalPot = Object.values(players).reduce((acc, player) => acc + player.bet, 0);
  // Autres états
  const [finalAngle, setFinalAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelSize = 450;
  const radius = wheelSize / 2;
  const innerRadius = radius * 0.65; // Taille du trou intérieur

    // Fonction pour démarrer la rotation de la roue
    const spinWheel = async () => {
      setIsSpinning(true);
      const final = await calculateFinalAngle(finalAngle)
      setFinalAngle(final); // Calcul de l'angle et ajouter à l'angle actuel
      setTimeout(() => {setIsSpinning(false)}, 6000); // Durée de la rotation
    };

  //A UPDATE A CHAQUE NOUVEAU BET Générer les chemins SVG pour chaque joueur
  let startAngle = 0;
  const paths = Object.keys(players).map(playerId => {
    const player = players[playerId];
    const endAngle = startAngle + (player.bet / totalPot) * 360;
    const path = describeArc(radius, radius, radius, innerRadius, startAngle, endAngle);
    startAngle = endAngle;
    return (
      <path key={playerId} d={path} fill={player.color} />
    );
  });

  // Fonction pour rendre la liste des joueurs avec leurs couleurs
  const renderPlayerList = () => {
    return (
      <div className="mt-4 grid grid-rows-2 grid-cols-2 text-white">
        {Object.values(players).map((player, index) => (
          <div key={index} className="flex items-center justify-center mb-2">
            <div className="w-4 h-4 mr-2" style={{ backgroundColor: player.color }}></div>
            {player.name}
          </div>
        ))}
      </div>
    );
  };

  const [timer, setTimer] = useState(30);
  useEffect(() => {
    startAndUpdateTimer();
  }, []);
  

// Ajouter une fonction pour démarrer et mettre à jour le timer
const startAndUpdateTimer = async () => {
  const getRemainingTime = await startTimer(30);
  const timerInterval = setInterval(() => {
    const remainingTime = getRemainingTime();
    setTimer(remainingTime);
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
    }
  }, 1000);
};

  const renderTotalPot = () => {
    return (
      <text
        x="50%" 
        y="50%" 
        textAnchor="middle" 
        dy=".3em" // Ajuster selon la taille de votre police
        fill="#fff" // Couleur du texte
        style={{
          fontSize: '20px', // Taille de la police
          userSelect: 'none', // Empêcher la sélection du texte
        }}
      >
        {totalPot}
      </text>
    );
  };

  return (
    <div className='relative wheel-container'>
      <svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`} style={{ transform: `rotate(${finalAngle}deg)`, transition: 'transform 6s ease-out' }}>
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
          fill="red"
        />
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
      <button onClick={spinWheel} className="bg-gray-500 text-white p-2 rounded-lg absolute bottom-10 left-1/2 transform -translate-x-1/2">Spin</button>
    </div>
  );
};

export default WheelOfFortune;