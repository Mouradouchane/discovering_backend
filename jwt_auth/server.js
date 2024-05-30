
// ====================================================
const express = require("express");
const mysql   = require("mysql2/promise");
const env     = require("dotenv").config();

const cookie_parser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const uuid = require("uuid").v4;
const jwt = require("jsonwebtoken");

var validator = require('validator');
// ====================================================

// ====================================================
const serve_web_pages_router = require("./routes/web_pages");
const api_router = require("./routes/api");
// ====================================================

const server  = express();
const port    = process.env.port || 2024;
const db_info = JSON.parse(process.env.db_info);

function main(){

    server.use(cookie_parser());
    server.use(express.json()); 

    // serve web pages
    server.use(serve_web_pages_router);
    
    // api routes
    server.use("/api" , api_router);

    // server start point
    server.listen(port , async function( ) {        
        console.log(" ");
        console.log("[SERVER] running at" , process.env.host + ":" + port); 
    });
    
} 

main();
