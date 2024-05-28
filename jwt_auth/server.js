
const express = require("express");
const mysql   = require("mysql2/promise");
const env     = require("dotenv").config();
const path    = require("path");

const bcrypt = require("bcryptjs");
const uuid   = require("uuid").v4;

const cookie_parser = require("cookie-parser");
var validator = require('validator');

const server = express();
const port = process.env.port;

const db_info = JSON.parse(process.env.db_info);
var mysql_connection = null;

async function try_to_connect_db( ){
    
    try{
        mysql_connection = await mysql.createConnection({
            host: db_info.host,
            user: db_info.username,
            database: db_info.name,
            port: db_info.port,
            password: db_info.password,
        });
        
        console.log("connection with database established");
        return true;
    }
    catch(error){
        console.error("connection with database failed :" , error.code);
        return false;
    }

} 

(function main(){

    server.use(cookie_parser());
    server.use(express.json()); 

    

    // server start listen
    server.listen(port , async function( ) {
        
        // await connection with databse 
        if(await try_to_connect_db() == false) process.exit(0);

        console.log(" ");
        console.log("[SERVER RUNNING] at port: " , port); 
    });
    
})();
