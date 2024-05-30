
const express = require("express");
const serve_web_pages_router = express.Router();

const path = require("path");

const pages_paths = {

    home   : {
        path : path.join( __dirname , "../client_side/home"),
        html : path.join( __dirname , "../client_side/home/home.html")
    },

    login  : {
        path : path.join( __dirname , "../client_side/login"),
        html : path.join( __dirname , "../client_side/login/login.html")
    },

    signin : {
        path : path.join( __dirname , "../client_side/signin" ),
        html : path.join( __dirname , "../client_side/signin/signin.html" ),
    }

};

serve_web_pages_router.use("/", express.static(pages_paths.home.path) );
serve_web_pages_router.use("/login", express.static(pages_paths.login.path) );
serve_web_pages_router.use("/signin", express.static(pages_paths.signin.path) );

async function send_home_page( req , res ){

    res.sendFile( pages_paths.home.html );
}

async function send_login_page( req , res ){
    
    res.sendFile( pages_paths.login.html );
}

async function send_signin_page( req , res ){

    res.sendFile( pages_paths.signin.html );
}

serve_web_pages_router.get("/"       , send_home_page);
serve_web_pages_router.get("/signin" , send_signin_page);
serve_web_pages_router.get("/login"  , send_login_page);

module.exports = serve_web_pages_router;
