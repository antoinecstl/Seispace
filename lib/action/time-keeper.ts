"use server";

import { GameInfiniteserver } from "./cosmoperation/toggleGameInfiniteserver";
import { supabase } from "@/app/api/supabase/supabaseClient";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function timeKeeper(startTime: number) {

  console.log(`Game start time is: ${startTime}`);

  const delayMs = 28 * 1000;

  await sleep(delayMs);
  // Vérifier le verrou avant l'exécution
    const { data: lockData, error: lockError } = await supabase
    .from('game_lock')
    .select('*')
    .single();

    if (lockError) {
    console.error('Error checking lock:', lockError);
    return;
    }

    if (lockData && lockData.is_locked) {
    console.log('Game is already in progress.');
    return;
    }

    // Verrouiller le jeu
    const { error: lockUpdateError } = await supabase
    .from('game_lock')
    .update({ is_locked: true })
    .match({ id: lockData.id });

    if (lockUpdateError) {
    console.error('Error locking the game:', lockUpdateError);
    return;
    }

    try {
    // Exécuter GameInfiniteserver
    await GameInfiniteserver("sei18j0wumtq8yewt7ka8403q7v7qfezhlsc53aq3hm7uvq8gj9xdnjs4rctnz");
    } catch (error) {
    console.error("Error on executing the sc:", error);
    } finally {
    // Libérer le verrou après l'exécution
    await supabase
    .from('game_lock')
    .update({ is_locked: false })
    .match({ id: lockData.id });
    };

  await sleep(15000);
  try {
    const { data, error } = await supabase
      .from("players_data")
      .delete()
      .not("id", "is", null);

    if (error) throw error;
    console.log("All rows deleted successfully:", data);
  } catch (error) {
    console.error("Error deleting rows:", error);
  };
};