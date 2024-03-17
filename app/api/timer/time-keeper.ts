"use server"

import { GameInfiniteserver } from "../cosmoperation/toggleGameInfiniteserver";
import { supabase } from "../supabase/supabaseClient";


export async function timeKeeper(startTime: number) {
    console.log(`Game start time is: ${startTime}`);

    // Calculer le délai en millisecondes jusqu'au moment où vous souhaitez exécuter `GameInfiniteserver`
    const delayMs = 28 * 1000; 

    // Utiliser setTimeout pour attendre le délai avant d'exécuter `GameInfiniteserver`
    setTimeout(async () => {
        await GameInfiniteserver("sei18j0wumtq8yewt7ka8403q7v7qfezhlsc53aq3hm7uvq8gj9xdnjs4rctnz");
        
        setTimeout(async () => {
            try {
                const { data, error } = await supabase
                    .from('players_data')
                    .delete()
                    .not('id', 'is', null) // Supprime toutes les lignes où 'id' n'est pas null (ce qui devrait être toutes les lignes).
              
                if (error) throw error;
                console.log('All rows deleted successfully:', data);
              } catch (error) {
                console.error('Error deleting rows:', error);
              }
              
        }, 10000); // Attendre 10 secondes avant de vider la table
    }, delayMs);
}