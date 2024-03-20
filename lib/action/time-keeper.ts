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
  try {
    await GameInfiniteserver(
      "sei18j0wumtq8yewt7ka8403q7v7qfezhlsc53aq3hm7uvq8gj9xdnjs4rctnz"
    ); //OTHER SERVER FUNCTION
  } catch (error) {
    console.error("error on executing the sc : ", error);
  }

  await sleep(10000);
  try {
    const { data, error } = await supabase
      .from("players_data")
      .delete()
      .not("id", "is", null);

    if (error) throw error;
    console.log("All rows deleted successfully:", data);
  } catch (error) {
    console.error("Error deleting rows:", error);
  }
}