

/*
<input type="text" name="" id="user_name_input" placeholder="username or email">
<input type="password" name="" id="user_password_input" placeholder="password">
<button id="login_button"> login </button>
*/

const input_username = document.querySelector("#user_name_input");
const input_password = document.querySelector("#user_password_input");

const login_button = document.querySelector("#login_button");

const url  = "http://127.0.0.1";
const port = "3000";
const path = "login"; 

login_button.addEventListener("click" , async function send_login_request() {

    let login_request = await fetch(`${url}:${port}/${path}` , {
        method : "POST",
        redirect: "follow",

        headers :{
            "Content-Type" : "application/json"
        },

        body : JSON.stringify({
            username : input_username.value,
            password : input_password.value
        })
    });
    
    console.log(login_request)
    if(login_request.status === 202){
        window.location.replace(`${url}:${port}/`);
    }

});
