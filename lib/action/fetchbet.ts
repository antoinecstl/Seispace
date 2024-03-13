import { supabase } from "@/app/api/supabase/supabaseClient";

// Définition du type pour un enregistrement de joueur

export async function fetchTotalBet(): Promise<number> {
  try {
    const { data, error, status } = await supabase
      .from('players_data')
      .select('bet_amount');

    if (error && status !== 406) throw error;

    const totalBet = data?.reduce((acc, { bet_amount }) => acc + bet_amount, 0) ?? 0;
    console.log(`Le total des paris est de ${totalBet} $SEI`);
    return totalBet;
  } catch (error) {
    console.error('Error fetching total bet:', error);
    return 0;
  }
}
