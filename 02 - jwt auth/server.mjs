
import Express from "express"; 
import dotenv  from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

import {views_router} from "./controllers/views_router.js";
import { api_router } from "./controllers/api_router.js";

/*
const mysql   = require("mysql2/promise");
const env     = require("dotenv").config();
const path    = require("path");

const bcrypt = require("bcryptjs");
const uuid   = require("uuid").v4;

const cookie_parser = require("cookie-parser");
var validator = require('validator');

var mysql_connection = null;
*/

const server = Express();
var port     = 2000;
var db_info  = null;

(async function main(){

    try{
        // get env variables
        dotenv.config();
        port = (process.env?.port || port);
        db_info = JSON.parse(process.env?.db_info || null);
        
        // set views folders to be public  
        server.use(
            "/", Express.static(
                path.join( path.dirname(fileURLToPath(import.meta.url)) , "views/home") , 
                { extensions: ['html' , "css" , "js"], index : "home.html" }
            )
        );
        server.use(
            "/login", Express.static(
                path.join( path.dirname(fileURLToPath(import.meta.url)) , "views/login") , 
                { extensions: ['html' , "css" , "js"], index : "login.html" }
            )
        );
        server.use(
            "/signin", Express.static(
                path.join( path.dirname(fileURLToPath(import.meta.url)) , "views/signin") , 
                { extensions: ['html' , "css" , "js"], index : "signin.html" }
            )
        );

        // set routers
        server.use("/api" , api_router);
        server.use("/" , views_router);

        // for invalid requests
        server.use(function(req ,res) {
            res.sendStatus(404);
        });

        // server starting point
        server.listen( port , function( error ) {

            if(error){
                console.error("[SERVER ERRRO]", error);
                return;
            } 

            console.log(" ");
            console.log("[SERVER RUNNING] on " , process.env.host , ":" , port);
        });

    }
    catch(error){
        console.error("[SERVER ERRRO]", error);
    }

})();

