"use server"

import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { getSigningCosmWasmClient } from "@sei-js/core";
import { calculateFee } from '@cosmjs/stargate';
import { supabase } from '../supabase/supabaseClient';

const rpcEndpoint = "https://rpc.atlantic-2.seinetwork.io/";
const feeaddress = "sei1aafcfydsgcq02gy54fjm3etl6yzsrzxu8epcg9";
const mnemonic = "pear shoe relief wage dish rifle guitar coil wear celery dinner velvet";

// Définir la variable au niveau du module pour stocker la valeur du second receiver
let WinnerAdd = '';

function generateRandomNumber(length : number) {
  let result = '';
  while (result.length < length) {
    const randomNumber = Math.floor((Math.random() + 1) * 1e18).toString().substring(1);
    result += randomNumber;
    if (result.length > length) {
      result = result.substring(0, length);
    }
  }
  return Number(result);
}

export async function GameInfiniteserver(contractAddress: string) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "sei" });
  const client = await getSigningCosmWasmClient(rpcEndpoint, wallet);

  const executetoggleMsg = { toggle_game_infinte: {} };
  const fee = calculateFee(3000000, "0.1usei");
  const seed = generateRandomNumber(19);
  const executeendMsg = { end_game_infinte: { "seed": seed } };

  try {
    const result = await client?.execute(feeaddress, contractAddress, executetoggleMsg, fee);
    console.log("Transaction réussie:", result.transactionHash);
  } catch (error) {
    console.error("Error : ", error);
    throw new Error("Failed to toggle game infinite");
  }

  try {
    const winner = await client?.execute(feeaddress, contractAddress, executeendMsg, fee); 

    let receiverCounter = 0;
  
    winner.logs.flatMap(log => log.events).forEach(event => {
      if (event.type === 'coin_received') {
        event.attributes.forEach(attr => {
          if (attr.key === 'receiver') {
            receiverCounter++;
            if (receiverCounter === 2) {
              WinnerAdd = attr.value; // Stocke la valeur du second receiver
              console.log(`Winner: ${WinnerAdd}`);
            }
          }
        });
      }
    });

  } catch (error) {
    console.error("Error : ", error);
    throw new Error("Failed to end game infinite");
  }

  try {
    const { error } = await supabase
      .from('game_winner')
      .insert([
        { winner_address: WinnerAdd }
      ]);

    if (error) throw error;
    console.log('Winner address inserted into Supabase:', WinnerAdd);
  } catch (error) {
    console.error('Error inserting winner address into Supabase:', error);
  }

}
