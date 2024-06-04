
import path from "path";
import { fileURLToPath } from 'url';
import {debug} from "../../../dev_config.mjs";

/*
    path's to html view's
*/
const views_path = path.join( path.dirname(
    fileURLToPath(import.meta.url)) , "../../../views/" 
);

const home_views_path   = path.join(views_path , "/home/home.html");
const login_views_path  = path.join(views_path , "/login/login.html");
const signin_views_path = path.join(views_path , "/signin/signin.html");

/*
    serving pages middleware's
*/

export async function serve_home_page(req , res){

    if(debug){
        console.log("[SERVER] request for home page" , new Date(Date.now()));
    }

    res.sendFile(home_views_path);
}


export async function serve_signin_page(req , res){

    if(debug){
        console.log("[SERVER] request for sign-in page" , Date.now());
    }
    
    res.sendFile(signin_views_path);
}


export async function serve_login_page(req , res){

    if(debug){
        console.log("[SERVER] request for log-in page" , Date.now());
    }

    res.sendFile(login_views_path);
}
