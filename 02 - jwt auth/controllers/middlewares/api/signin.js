
import { debug } from "../../../dev_config.mjs";

export async function handle_signin_request( req , res ){

    if(debug){
        console.log("[SERVER] signin request");
    }
    
    res.sendStatus(200);
}
