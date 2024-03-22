"use client"

import RightSidebar from "./shared/RightSidebar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { describeArc, spinWheel } from "@/lib/action/Wheel.action";
import { Player, WinnerInfo, players_data } from "@/lib/schema/playerdata.Schema";

type RealtimeWheelProps = {
    timer: number;
    gameStartTime: number | null;
    setTimer: React.Dispatch<React.SetStateAction<number>>;
};

export default function RealtimeWheel ({
    timer,
    gameStartTime,
    setTimer,
}: RealtimeWheelProps) {

    const supabase = createClientComponentClient()
    const [lastBet, setLastBet] = useState<{ address: string; amount: number; color: string } | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [playerdata, setplayerdata] = useState<players_data[]>([]);
    const [WinnerInfo, setWinnerInfo] = useState<WinnerInfo[]>([]);
    const [playersCount, setPlayersCount] = useState(0);
    const [totalPot, setTotalPot] = useState(0);
    const [IsSpinning, setIsSpinning] = useState(false);
    const [wheelSize, setWheelSize] = useState(450);
    const [finalAngle, setFinalAngle] = useState(0);
    const [transitionClass, setTransitionClass] = useState('');

    const radius = wheelSize / 2;
    const innerRadius = radius * 0.65;
    
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
    const { data, error } = await supabase.from('players_data').select('*');
  
    if (error) {
      console.error('Error during data recovery', error);
      return;
    }
  
    if (data) {
        setPlayers(data);
        const pot = data.reduce((acc, player) => acc + player.bet_amount, 0);
        setTotalPot(pot);
        setPlayersCount(data.length)
        return(data)
    }
  };
  

  const missingPlayers = Math.max(0, 2 - playersCount);
  
  let startAngle = 0;
  const paths = players.map(player => {
    player.startAngle = startAngle;
    const playerShare = player.bet_amount / totalPot;
    const endAngle = startAngle + (playerShare * 360);
    player.endAngle = endAngle
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
                    color: payload.new.color,
                };
                setLastBet(newBetInfo); // Mettre à jour l'état avec les informations du dernier pari
            }
            
        }).subscribe()

        return () => {
            supabase.removeChannel(channel);
        }
    }, [supabase])

    

    // Fonction pour démarrer la rotation de la roue
    const spinWheelClient = (final: number) => {
        setIsSpinning(true);

        let currentAngle = 0;
        const finalRotationAngle = final + 360 * 10; 
        const duration = 8000;
        const startTime = Date.now();
        const easeInOutCubic = (t : number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const animate = () => {
            const now = Date.now();
            const elapsedTime = now - startTime;
            const progress = elapsedTime / duration;

            if (progress < 1) {
                currentAngle = finalRotationAngle * easeInOutCubic(progress);
                setFinalAngle(currentAngle);
                requestAnimationFrame(animate);
              } else {
                setTransitionClass('');
                setFinalAngle(final);
        
                setTimeout(() => {
                    setTransitionClass('transition-transform duration-8000');
                    setIsSpinning(false);
                  }, 50);
                }
            };

            requestAnimationFrame(animate);
    };
    
    const resetGame = () => {
        setLastBet(null); // Réinitialise le dernier pari
        setIsSpinning(false); // Assure que la roue n'est plus en train de tourner
        setFinalAngle(0); // Réinitialise l'angle de la roue à 0
        setTransitionClass(''); // Réinitialise la classe de transition
        setTimer(30);
    };


    const fetchWinner = async () => {
        const { data, error } = await supabase.from('game_winner').select('winner_address').order('id', { ascending: false }).limit(1);      
        
        if (error) {
          console.error('Error fetching winner address:', error);
          return;
        }
      
        if (data && data.length > 0) {
            setWinnerInfo(data); // Assurez-vous que ceci met à jour l'état correctement
            return data[0]; // Retourne le premier élément pour un traitement ultérieur
        }
        return null; // Retourne null si aucune donnée n'est trouvée
    };

    const fetchplayerdata = async () => {
        const { data, error } = await supabase.from('players_data').select('*');
  
    if (error) {
      console.error('Error during data recovery', error);
      return;
    }
  
    if (data) {
        console.log(data)
        return(data)
    }
  };
    
  // Mettre à jour le timer basé sur le gameStartTime
    useEffect(() => {
        if (gameStartTime) {
            const interval = setInterval(async () => {
                const now = Date.now();
                const timeElapsed = Math.floor((now - gameStartTime) / 1000);
                const timeLeft = 30 - timeElapsed;

                if (timeLeft > 0) {
                    setTimer(timeLeft);
                    return
                } else {
                    clearInterval(interval); // Nettoyer l'intervalle ici
                    setTimer(0);
                    const playerdata = await fetchplayerdata();
                    if (!playerdata) {
                        return console.error("erreur en fetch player du use effect")
                    }

                    const usepot = playerdata.reduce((acc, player) => acc + player.bet_amount, 0);

                    let startAngleuse = 0;
                    playerdata.map(player => {
                        player.startAngle = startAngleuse;
                        const playerShare = player.bet_amount / usepot;
                        const endAngleuse = startAngleuse + (playerShare * 360);
                        player.endAngle = endAngleuse;
                        startAngleuse = endAngleuse;})
                    
                    console.log("playerdata : ",playerdata)

                    // Attendre un peu avant de procéder
                    setTimeout(async () => {
                        const winnerData = await fetchWinner();
                        if (!winnerData) {
                            console.error("No winner data found");
                            return;
                        }
                        console.log("Winner Data:", winnerData.winner_address);

                        for (const i in playerdata){
                            if (playerdata[i].wallets_address == winnerData.winner_address) {
                                const winnerPlayer = playerdata[i];
                                const startAngle = winnerPlayer.startAngle;
                                const endAngle = winnerPlayer.endAngle;

                                console.log("Winner Player:", winnerPlayer);
                                console.log("Winner Angle : ", startAngle, endAngle);
                                const finalAngle = spinWheel(startAngle, endAngle);
                                console.log("final angle wheel : ", finalAngle)
                                spinWheelClient(await finalAngle);
                                setTimeout(() => resetGame(), 15000);
                            };
                        };

                        
                    }, 8000);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [gameStartTime]);


    return <section className='grid xl:grid-cols-2 xl:gap-20 text-left justify-center'>
            <div className='relative mx-auto'>
                <svg 
                    width={wheelSize} 
                    height={wheelSize}
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
                                Countdown
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