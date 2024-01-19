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
    'player2': { name: 'Joueur 2', bet: 20, color: '#0bf' },
    'player3': { name: 'Joueur 3', bet: 10, color: '#fff' },
  });

  // Calculer le pot total
  const totalPot = Object.values(players).reduce((acc, player) => acc + player.bet, 0);

  // Autres états
  const [finalAngle, setFinalAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelSize = 280;
  const radius = wheelSize / 2;
  const innerRadius = radius * 0.8; // Taille du trou intérieur

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

  // Fonction pour démarrer la rotation de la roue
  const spinWheel = () => {
    setIsSpinning(true);
    const randomAngle = Math.floor(Math.random() * 360 + 360 * 5); // Rotation de 5 à 6 tours complets
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

  return (
    <div className='wheel-container'>
      <svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`} style={{ transform: `rotate(${finalAngle}deg)`, transition: 'transform 6s ease-out' }}>
        {paths}
        {/* Autres éléments SVG ici, comme le texte central */}
      </svg>
      <button onClick={spinWheel} className="bg-blue-500 text-white p-2 rounded">Spin</button>
      {/* Ajouter d'autres éléments d'interface ici si nécessaire */}
    </div>
  );
};

export default WheelOfFortune;