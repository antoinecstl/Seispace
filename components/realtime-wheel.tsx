"use client"

import RightSidebar from "./shared/RightSidebar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Key, useEffect, useState } from "react";
import { describeArc } from "@/lib/action/Wheel.action";
import { Player } from "@/lib/schema/playerdata.Schema";

type RealtimeWheelProps = {
    transitionClass: string;
    finalAngle: number;
    timer: number;
    gameStartTime: number | null;
    setTimer: React.Dispatch<React.SetStateAction<number>>;
    spinWheelClient: () => void;
};


export default function RealtimeWheel ({
    transitionClass,
    finalAngle,
    timer,
    gameStartTime,
    setTimer,
    spinWheelClient
}: RealtimeWheelProps) {

    const supabase = createClientComponentClient()
    const [lastBet, setLastBet] = useState<{ address: string; amount: number; color: string } | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [playersCount, setPlayersCount] = useState(0);
    const [totalPot, setTotalPot] = useState(0);
    const [isWheelSpinning, setIsWheelSpinning] = useState(false);
    const [wheelSize, setWheelSize] = useState(450);
    const radius = wheelSize / 2;
    const innerRadius = radius * 0.65; // Taille du trou intérieur

    useEffect(() => {
        // Fonction pour mettre à jour la taille de la roue en fonction de la largeur de l'écran
        const updateWheelSize = () => {
            const screenWidth = window.innerWidth;

            if(screenWidth < 640) { // Taille pour 'sm'
                setWheelSize(360);
            } else if(screenWidth >= 640 && screenWidth < 768) { // Taille pour 'md'
                setWheelSize(400);
            } else if(screenWidth >= 768 && screenWidth < 1024) { // Taille pour 'lg'
                setWheelSize(410);
            } else if(screenWidth >= 1024 && screenWidth < 1280) { // Taille pour 'lg'
                setWheelSize(420);
            } else { // Taille pour 'xl' et plus
                setWheelSize(450);
            }
        };
        updateWheelSize(); // Appel initial

        // Écouter les changements de taille de l'écran
        window.addEventListener('resize', updateWheelSize);

        // Nettoyage de l'effet
        return () => window.removeEventListener('resize', updateWheelSize);
    }, []);

  // Fonction pour récupérer les joueurs depuis Supabase
  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from('players_data')
      .select('*');

    if (error) {
      console.error('Error during data recovery', error);
      return;
    }

    if (data) {
      setPlayers(data);
      const pot = data.reduce((acc, player) => acc + player.bet_amount, 0);
      setTotalPot(pot);
      setPlayersCount(data.length)
    }
  };

  const missingPlayers = Math.max(0, 2 - playersCount); // Calculez le nombre de joueurs manquants
  
  let startAngle = 0;
  const paths = players.map(player => {
    const playerShare = player.bet_amount / totalPot;
    const endAngle = startAngle + (playerShare * 360);
    const path = describeArc(radius, radius, radius, innerRadius, startAngle, endAngle);
    startAngle = endAngle; // Mettez à jour startAngle pour le prochain segment
    return (
      <path d={path} fill={player.color} />
    );
  });

    useEffect(() => {
        fetchPlayers();

        const channel = supabase.channel('supabase_realtime').on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: "players_data"
        }, (payload) => {
            fetchPlayers();

            // Traiter le payload pour les mises à jour et les insertions
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                const newBetInfo = {
                    address: payload.new.wallets_address,
                    amount: payload.new.bet_amount,
                    color: payload.new.color
                };
                setLastBet(newBetInfo); // Mettre à jour l'état avec les informations du dernier pari
            }
            
        }).subscribe()

        return () => {
            supabase.removeChannel(channel);
        }
    }, [supabase])

    // Mettre à jour le timer basé sur le gameStartTime
    useEffect(() => {
        if (gameStartTime) {
            const interval = setInterval(() => {
                const now = Date.now();
                const timeElapsed = Math.floor((now - gameStartTime) / 1000);
                const timeLeft = 30 - timeElapsed;
                if (timeLeft >= 0) {
                    setTimer(timeLeft);
                } else if (timer === 0 && !isWheelSpinning) {
                    clearInterval(interval);
                    setIsWheelSpinning(true);
                    spinWheelClient(); // Lancer la rotation de la roue coté client
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [gameStartTime, setTimer, spinWheelClient]);
      

    return <section className='grid xl:grid-cols-2 xl:gap-20 text-left justify-center'>
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
                    {playersCount >= 2 ? (
                    <polygon
                        points={`${20 * Math.sqrt(3) / 2 / 2},0 ${20 * Math.sqrt(3) / 2}, ${20} 0,${20}`}
                        fill="#7e89ff" />
                    ) : null}
                    </svg>
                    <svg
                    className="absolute"
                    width={wheelSize}
                    height={wheelSize}
                    style={{ top: 0, left: 0 }}
                    >
                    {playersCount < 2 ? (
                            <>
                                <text
                                    x="50%"
                                    y="25%"
                                    textAnchor="middle"
                                    fill="#fff"
                                    style={{ fontSize: '28px', userSelect: 'none' }}
                                >
                                    {missingPlayers} player{missingPlayers === 1 ? '' : 's'} missing...
                                </text>
                            </>
                        ) : null}

                    <text
                        x="50%"
                        y="35%"
                        textAnchor="middle"
                        dy=".3em"
                        fill="#7878A3"
                        style={{ fontSize: '13px', userSelect: 'none' }}
                    >
                        Total Pot

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
                    {playersCount >= 2 ? (
                    <><text
                                x="50%"
                                y="56%"
                                textAnchor="middle"
                                dy=".3em"
                                fill="#7878A3"
                                style={{ fontSize: '13px', userSelect: 'none' }}
                            >
                                CountDown
                            </text><text
                                x="50%"
                                y="65%"
                                textAnchor="middle"
                                dy=".3em"
                                fill="#fff"
                                style={{ fontSize: '26px', userSelect: 'none' }}
                            >
                                    {timer > 0 ? `${Math.floor(timer / 60)}:${timer % 60 < 10 ? `0${timer % 60}` : timer % 60}` : "Time's up"}
                                </text></>
                    ):null}

                </svg>
            </div>
            <RightSidebar players={players} totalPot={totalPot} lastbet={lastBet}/>
            </section>

}