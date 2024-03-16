
export interface Player {
    endAngle: number;
    startAngle: number;
    wallets_address: string; // Assurez-vous que cela correspond au type de données dans Supabase
    bet_amount: number;
    color?: string; // Ajout du champ couleur qui est optionnel
  }
  
export interface WinnerInfo {
  winner_address: string;
}