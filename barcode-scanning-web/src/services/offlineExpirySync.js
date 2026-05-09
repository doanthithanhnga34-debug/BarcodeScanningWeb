import {saveExpiryToSheet} from '../services/appScriptService'
import { getOfflineExpiryQueue, removeOfflineExpiry } from './offlineExpiryQueue'


export async function syncOfflineExpiryQueue(){
    if(!navigator.onLine) return;

    const queue = getOfflineExpiryQueue();

    for(const item of queue){
        try{
            await saveExpiryToSheet(item.payload);
            removeOfflineExpiry(item.id);
            console.log("item payload", item.payload);
        }catch(e){
            console.log("Sync failed", e);
            break;
        }
    }
} 