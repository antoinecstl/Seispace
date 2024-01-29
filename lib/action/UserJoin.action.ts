import { supabase } from "@/app/api/supabase/supabaseclient";

interface Player {
  wallets_addr: string; // Assurez-vous que cela correspond au type de données dans Supabase
  bet_amount: number;
  color?: string; // Ajout du champ couleur qui est optionnel
}

export async function handleUserBet(wallets_addr: string, bet_amount: number) {
  // Vérifier si l'utilisateur existe déjà dans la table players_data
  let { data: existingPlayer, error: selectError } = await supabase
    .from('players_data')
    .select('id, bet_amount')
    .eq('wallets_addr', wallets_addr)
    .single();

  if (selectError) {
    console.error(selectError);
    throw selectError;
  }

  if (existingPlayer) {
    // Mettre à jour le pari du joueur existant
    const { data: updatedPlayer, error: updateError } = await supabase
      .from('players_data')
      .update({ bet_amount: existingPlayer.bet_amount + bet_amount })
      .match({ id: existingPlayer.id });

    if (updateError) {
      console.error(updateError);
      throw updateError;
    }
    
    console.log(`User ${wallets_addr} has updated bet to ${updatedPlayer?.bet_amount} $SEI`);
  } else {
    // Générer une couleur aléatoire pour le nouveau joueur
    const color = generateRandomColor();

    // Ajouter un nouveau joueur
    const { data: newPlayer, error: insertError } = await supabase
      .from('players_data')
      .insert([
        { wallets_addr: wallets_addr, bet_amount: bet_amount, color: color }
      ]);

    if (insertError) {
      console.error(insertError);
      throw insertError;
    }

    console.log(`User ${wallets_addr} has bet ${bet_amount} $SEI with color ${color}`);
  }
}

// Fonction pour générer une couleur aléatoire
function generateRandomColor(): string {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padEnd(6, '0');
}
