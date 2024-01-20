"use client"

import React, { useState, useEffect } from 'react';

type Player = {
  name: string;
  bet: number;
  color: string;
};

const WheelOfFortune: React.FC = () => {
  // Initialiser les joueurs
  const [players, setPlayers] = useState<{ [id: string]: Player }>({
    'player1': { name: 'Joueur 1', bet: 20, color: '#f82' },
    'player2': { name: 'Joueur 2', bet: 1, color: '#0bf' },
    'player3': { name: 'Joueur 3', bet: 1, color: '#fff' },
  });

  // Calculer le pot total
  const totalPot = Object.values(players).reduce((acc, player) => acc + player.bet, 0);
  console.log(totalPot)
  // Autres états
  const [finalAngle, setFinalAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelSize = 350;
  const radius = wheelSize / 2;
  const innerRadius = radius * 0.7; // Taille du trou intérieur

  // Convert polar coordinates to Cartesian for SVG path
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, innerRadius: number, startAngle: number, endAngle: number) => {
    const startOuter = polarToCartesian(x, y, radius, endAngle);
    const endOuter = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    const startInner = polarToCartesian(x, y, innerRadius, endAngle);
    const endInner = polarToCartesian(x, y, innerRadius, startAngle);

    return [
      'M', startOuter.x, startOuter.y,
      'A', radius, radius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
      'L', endInner.x, endInner.y,
      'A', innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
      'Z'
    ].join(' ');
  };


  //DISOSSIER DE TRUE RESULT QUI SORTIRA COTE SERVER
  // Fonction pour démarrer la rotation de la roue
  const spinWheel = () => {
    setIsSpinning(true);
    const randomAngle = Math.floor(Math.random() * 360 + 360 * 15); // Rotation de 15 tours complets
    setFinalAngle(finalAngle + randomAngle); // Ajouter à l'angle actuel
    setTimeout(() => {
      setIsSpinning(false);
      // Logique pour déterminer le gagnant après la rotation
    }, 6000); // Durée de la rotation
  };



  // Générer les chemins SVG pour chaque joueur
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
          00:00
          
        </text>
        
      </svg>
      <button onClick={spinWheel} className="bg-gray-500 text-white p-2 rounded-lg absolute bottom-10 left-1/2 transform -translate-x-1/2">Spin</button>
    </div>
  );
};

export default WheelOfFortune;