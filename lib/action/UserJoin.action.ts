import { supabase } from "@/app/api/supabase/supabaseClient";

export async function handleUserBet(wallets_address: string, bet_amount: number) {
  // Vérifier si l'utilisateur existe déjà dans la table players_data
  let { data: existingPlayer, error: selectError } = await supabase
  .from('players_data')
  .select('id, bet_amount')
  .eq('wallets_address', wallets_address)
  .maybeSingle();


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
    
  } else {
    // Générer une couleur aléatoire pour le nouveau joueur
    const color = generateRandomColor();

    // Ajouter un nouveau joueur
    const { data: newPlayer, error: insertError } = await supabase
      .from('players_data')
      .insert([
        { wallets_address: wallets_address, bet_amount: bet_amount, color: color }
      ]);

    if (insertError) {
      console.error(insertError);
      throw insertError;
    }

    console.log(`User ${wallets_address} has bet ${bet_amount} $SEI with color ${color}`);
  }
}

// Fonction pour générer une couleur aléatoire
function generateRandomColor(): string {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padEnd(6, '0');
}
