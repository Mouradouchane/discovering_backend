
const server ={
    addr : "http:\/\/127.0.0.1",
    port : 3000,
    route : "/signin"
} 

const form_inputs = {
    fname : document.querySelector("#name_input"),
    lname : document.querySelector("#last_name_input"),
    email    : document.querySelector("#email_input"),
    username : document.querySelector("#user_name_input"),
    password : document.querySelector("#user_password_input"),
    repassword : document.querySelector("#user_password_input_again"),
    submit_button : document.querySelector("#submit_sign_in_button")
}

const request_url = `${server.addr}:${server.port}${server.route}`;
console.log(request_url , form_inputs.submit_button);


async function send_sign_in_request( fname = "", lname = "", username = "", password = "", email = "" ){

    let response = await fetch( request_url , {
       
        method : "POST",
        referrerPolicy: "same-origin",
        redirect: "manual",
        referrerPolicy: "no-referrer",

        headers : {
            "Access-Control-Allow-Origin" : "127.0.0.1",
            "Content-Type": "application/json",
        },

        body : JSON.stringify({
            "fname" : fname ,
            "lname" : lname,
            "username" : username,
            "password": password,
            "email":email 
        })

    });

    if(response.status === 201){
        window.location.replace("/");
    }

}


form_inputs.submit_button.addEventListener("click" , function(){
   
    // check user inputs 
    let name       = form_inputs.fname.value;
    let last_name  = form_inputs.lname.value;
    let email      = form_inputs.email.value;
    let username   = form_inputs.username.value;
    let password   = form_inputs.password.value;
    let repassword = form_inputs.repassword.value;

    // small username
    if(username.length < 6){
        console.warn("username to short");
        return;
    }

    // invalid password
    if(password != repassword || password.length < 8){
        console.warn("password invalid");
        return;
    }

    // send sign_in request
    send_sign_in_request(name , last_name , username , password , email);
    
});