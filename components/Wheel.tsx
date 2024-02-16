"use client";

import React, {  useEffect, useState } from 'react';
import { describeArc, startTimer, spinWheel } from '@/lib/action/Wheel.action';
import RealtimeWheel from './realtime-wheel';

const WheelOfFortune: React.FC = () => {
  

  // Autres états
  const [finalAngle, setFinalAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [transitionClass, setTransitionClass] = useState('transition-transform duration-6000 ease-out');


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
    <RealtimeWheel transitionClass={transitionClass} finalAngle={finalAngle} timer={timer}/>
  );
};

export default WheelOfFortune;