
/*
    here all the api response functions
*/

import { short_live , long_live } from "../../dev_config.mjs";

class api_error_response {

    constructor(error_code = 0 , message = ""){
        this.type = "error";
        this.message = message;
        this.code = error_code;
    }
}

function invalidate_tokens_in_cookie( res = {} ){
    
    res?.cookie("access_token" , "0" , {
        expires : short_live,
        httpOnly : true,
        sameSite : "Strict"
    });

    res?.cookie("refresh_token" , "0" , {
        expires : long_live,
        httpOnly : true,
        sameSite : "Strict"
    });

}

export function send_server_error( res = {} , message = "" ){
    
    try {

        res?.status(500);
        res?.setHeader("Content-type","application/json");

        invalidate_tokens_in_cookie(res);

        res?.json(new api_error_response(500 , message));
        res?.send();

    } 
    catch (error) {

        if(debug){
            console.log("[SERVER ERROR]" , error); 
        }

        res.sendStatus(500);
    }
    
}

export function send_bad_request( res = {} , message = "" ){
    
    try {

        res?.status(400);
        res?.setHeader("Content-type","application/json");

        invalidate_tokens_in_cookie(res);

        res?.json(new api_error_response(400 , message));
        res?.send();
            
    } 
    catch (error) {

        if(debug){
            console.log("[SERVER ERROR]" , error); 
        }

        res.sendStatus(500);
    }

}

export function send_unauthorized_request( res = {} , message = ""){

    try {

        res?.status(401);
        res?.setHeader("Content-type","application/json");

        invalidate_tokens_in_cookie(res);

        res?.json(new api_error_response(401 , message));
        res?.send();
            
    } 
    catch (error) {

        if(debug){
            console.log("[SERVER ERROR]" , error); 
        }

        res.sendStatus(500);
    }

}
