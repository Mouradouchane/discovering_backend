
import { debug } from "../../../dev_config.mjs";
import { send_invalid_request , send_unauthorized_request } from "../../api_methods/error_respones.js";

// METHOD : POST /api/signin
// BODY   : { fname , lname , username , password }
export async function handle_signin_request( req , res ){

    if( debug ){
        console.log("[SERVER] signin request at" , new Date( Date.now() ));
    }

    try {

        // if invalid request body
        if( verify_signin_request( req.body ) == false ){

            send_invalid_request(res);
            return;
        }

        // if account already exist in database
        if( is_account_exist( req.body ) == false ){
            
            send_unauthorized_request(res);
            return;
        }
        else {

            // create new account
            let account = new account(req.body);

            // create token's
            let {access_token , refresh_token} = generate_access_token(account);
            // insert it into database

            // response back with success + (access_token & refresh_token)

        }


    }
    catch(error) {

        if(debug){
            console.log("[SERVER ERROR]" , error); 
        }

        send_server_error(res);
    }

}
