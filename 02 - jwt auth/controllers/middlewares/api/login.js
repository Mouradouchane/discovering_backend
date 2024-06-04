
import { debug } from "../../../dev_config.mjs";

export async function handle_login_request( req , res ){

    if(debug){
        console.log("[SERVER] login request");
    }

    res.sendStatus(200);
}