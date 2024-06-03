
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

server.use(cookie_parser());
server.use(express.json()); 

const home_path   = path.join(__dirname, "client_side", "home");
const signin_path = path.join(__dirname, "client_side", "signin");
const login_path  = path.join(__dirname, "client_side", "login");

async function query_session( db , session = "") {

    try {

        let [rows , fields] = await db?.query(
            `select * from sessions where session=?` , session
        );
        
        return (rows.length > 0) ? rows[0] : null;
    }
    catch(error){
        return null;
    }

}

async function is_valid_session( session_id ){

    if( typeof(session_id) !== "string" ) return false;

    try{

        let [rows, fields] = await mysql_connection.query(
        `select session from sessions where session=?` , [session_id]
        );
        
        return (rows.length > 0);
    }
    catch(error){
        console.error("SERVER ERROR : " , error);
    }
    
}

server.use("/", express.static( home_path ) );
server.use("/signin", express.static( signin_path ) );
server.use("/login" , express.static( login_path ) );

server.get("/" , async function(req ,res) {

    let already_in = await is_valid_session( req.cookies?.session_id );

    if(already_in){
        res.status(200);
        res.sendFile( path.join(home_path , "home.html") );
    }
    else {
        res.redirect("/signin");
    }

});

server.get("/login" , async function(req ,res) {

    let already_in = await is_valid_session( req.cookies?.session_id );

    if(already_in){
        res.redirect("/");
    }
    else{
        res.status(200);
        res.sendFile( path.join(login_path , "login.html") );
    }

});

server.get("/signin" , async function(req ,res) {

    let already_in = await is_valid_session( req.cookies.session_id );
    
    if(already_in){
        res.redirect("/");
    }
    else {
        res.status(200);
        res.sendFile( path.join(signin_path , "signin.html") );
    }

});

function is_valid_signin_info( obj = {} ){

    if(obj?.password.length < 8){
        return false;
    }

    obj.username = (obj?.username) ? String(obj?.username).trim() : "";
    if(obj.username.length < 6 || validator.isNumeric(obj?.username[0])) {
        return false;
    }

    obj.email = (obj?.email) ? String(obj?.email).trim() : "";
    if(validator.isEmail(obj?.email) == false || validator.isNumeric(obj?.email[0])){
        return false;
    }

    obj.fname = (obj?.fname) ? String(obj.fname).trim() : "";
    obj.lname = (obj?.lname) ? String(obj.lname).trim() : "";

    if(obj.fname === "" && obj.lname === ""){
        return false;
    }

    return true;
}

let invalid_info_request = JSON.stringify( 
    {
        response  : { 
            error : "your request contain invalid information" , 
            data  : null 
        }
    }
);

let email_already_taken = JSON.stringify( 
    {
        response  : { 
            error : "email is used by another account" , 
            data  : null 
        }
    }
);

let username_already_taken = JSON.stringify( 
    {
        response  : { 
            error : "username is used by another account" , 
            data  : null 
        }
    }
);

let account_created_successfully = JSON.stringify( 
    {
        response  : { 
            error : "new account created successfully" , 
            data  : null 
        }
    }
);

let server_error_response = {

    response  : { 
        error : "server internal error" ,
        data  : null 
    }

}

let password_to_short_response = {
    response  : { 
        error : "new account created successfully" , 
        data  : null 
    }
};

let account_not_found = {
    response  : { 
        error : "account not found" , 
        data  : null 
    }
};

let incorrect_password_request = {
    response  : { 
        error : "password incorrect" , 
        data  : null 
    }
};

// for creating new accounts
server.post("/signin" , async function(req ,res) {

    // verify request information 
    if( await is_valid_signin_info(req.body) == false ){
        res.status(400);
        res.setHeader("Content-Type" , "application/json");
        res.send( invalid_info_request );

        return;
    }
   
    try {

        /*
            check if "username and email" already exist
        */
        let [email_query , e_feild] = await mysql_connection.query(
            `select email from emails where email=?` , [req.body.email]
        );

        if(email_query.length > 0) {
            res.status(400);
            res.setHeader("Content-Type" , "application/json");
            res.send(email_already_taken);
            
            return;
        }

        let [username_query , u_field] = await mysql_connection.query(
            `select username from accounts where username=?` , [req.body.username]
        );

        if(username_query.length > 0) {
            res.status(400);
            res.setHeader("Content-Type" , "application/json");
            res.send(username_already_taken);

            return;
        }

        /*
            insert into database
        */
        req.body.id = uuid();
        req.body.password = bcrypt.hashSync(req.body.password , 10);

        let [insert_username_query , insert_username_field] = await mysql_connection.query(
            `insert into accounts(username,fname,lname,status,id,password) values(?,?,?,?,?,?)` ,
            [req.body.username , req.body.fname , req.body.lname , "normal" , req.body.id , req.body.password]
        );

        let [insert_email_query , insert_email_field] = await mysql_connection.query(
            `insert into emails(email,account_id) values(?,?)` , [req.body.email,req.body.id]
        );

        let sessiond_id = uuid();
        let [insert_session , se_filed] = await mysql_connection.query(
            `insert into sessions(account_id,session,active_devices) values(?,?,?)`, 
            [req.body.id , sessiond_id , 1]
        );

        res.status(201);
        res.cookie("session_id" , sessiond_id , {expires:new Date(Date.now() + 31540000000) , sameSite:"Strict", path:"/"});
        res.send(account_created_successfully);
        res.redirect("/");

    }
    catch(error){
        console.error("[SERVER ERROR] : " , error);
    }
   
});

// for login
server.post("/login" , async function(req , res) {

    if( await is_valid_session(req.cookie?.session_id)){
        res.redirect("/");
        return;
    }
 
    try{

        /*
            check login info 
        */

        if(req.body?.password < 8){ 
            res.send(403);
            res.json(password_to_short_response);
            res.send();

            return;
        }

        // note ! : in case username value is email
        let is_email =  validator.isEmail(req.body?.username);
        let id_query = (is_email) ? `select account_id as id from emails where email=?` : `select id from accounts where username=?`;

        let [id_from_db , id_query_fields] = await mysql_connection.query(
            // query account id using email or username
            id_query , [req.body.username]
        );

        // if account not found
        if(id_from_db?.length < 1){
            res.status(403);
            res.json(account_not_found);
            res.send();

            return;
        }

        let id = id_from_db[0]?.id;

        /*
            check if password correct
        */

        // query password for comparison
        let [password_from_db , password_query_fields] = await mysql_connection.query(
            `select password from accounts where id=?` , [ id ]
        );

        // if account not found
        if(password_from_db[0]?.length < 1){
            res.status(403);
            res.json(account_not_found);
            res.send();

            return;
        }

        // if password correct
        if(bcrypt.compareSync(req.body.password , password_from_db[0]?.password)){ 

            // get account session from db
            let [session_from_db , session_feilds] = await mysql_connection.query(
                `select session from sessions where account_id=?`, [id]
            );

            let new_session = null;

            // no session found
            if(session_from_db[0].length < 1){

                // create new session 
                new_session = uuid();

                // insert it into 
                let [insert_session , insert_session_feils] = await mysql_connection.query(
                    `insert into sessions(session, account_id, active_devices) values(?,?,?)` , 
                    [ new_session , id , 1 ]
                );

            }

            new_session = session_from_db[0]?.session;
            
            // send login successed respone
            res.status(202);
            res.cookie("session_id" , new_session);
            res.json({error:null, data:null, message:"login successed"});
            res.send();

        }
        else {
            res.status(401);
            res.cookie("session_id" , "0");
            res.json(incorrect_password_request);
            res.send();
        }

    }
    catch(error){
        console.error("[SERVER ERROR] :" , error);

        res.status(500);
        res.json(server_error_response);
        res.send();
    }

});

class vec3{
    constructor(x,y,z){
        this.x=x;
        this.y=y;
        this.z=z;
    }
}

server.listen(port , async function( ) {

    if(await try_to_connect_db() == false) process.exit(0);

    console.log(" ");
    console.log("[SERVER RUNNING] at port: " , port);

});

