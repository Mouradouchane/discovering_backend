
import { debug } from "../../../dev_config.mjs";

// METHOD : POST /api/login
// BODY   : { username , password }
export async function handle_login_request( req , res ){

    if(debug){
        console.log("[SERVER] login request");
    }

    res.sendStatus(200);
}