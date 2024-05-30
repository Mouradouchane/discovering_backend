
const express = require("express");
const api_router = express.Router();

async function sign_in( req , res ){
    console.log("[API] signin");
    res.json({respone : "api sign in"});
}

async function log_in( req , res ){
    console.log("[API] login");
    res.json({respone : "api log in"});
}

api_router.post("/v1/signin" , sign_in);

api_router.post("/v1/login"  , log_in);

module.exports = api_router;
