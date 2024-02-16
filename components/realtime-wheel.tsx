"use client"

import RightSidebar from "./shared/RightSidebar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Key, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { describeArc } from "@/lib/action/Wheel.action";
import { Player } from "@/lib/schema/playerdata.Schema";

type RealtimeWheelProps = {
    transitionClass: string;
    finalAngle: number;
    timer: number;
  };

export default function RealtimeWheel ({ transitionClass, finalAngle, timer}: RealtimeWheelProps) {
    const supabase = createClientComponentClient()
    const [lastBet, setLastBet] = useState<{ address: string; amount: number; color: string } | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [totalPot, setTotalPot] = useState(0);
    const wheelSize = 450;
    const radius = wheelSize / 2;
    const innerRadius = radius * 0.65; // Taille du trou intérieur

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
    }
  };
  
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

    return <section className='grid xl:gap-4 xl:grid-cols-2 xl:gap-12 justify-center'>
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
        
            {lastBet && (
                <p className="text-heading4-medium text-light-1">Last bet: {lastBet.amount} $SEI by {lastBet.address} (Couleur: <span style={{ color: lastBet.color }}>{lastBet.color}</span>)</p>
            )}
            </section>

}