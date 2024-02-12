
export interface Player {
    wallets_address: string; // Assurez-vous que cela correspond au type de données dans Supabase
    bet_amount: number;
    color?: string; // Ajout du champ couleur qui est optionnel
  }
  