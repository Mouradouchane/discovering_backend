
const log_out_button = document.querySelector("#log_out_button");

log_out_button.addEventListener("click" , async function() {
    
    document.cookie = "session_id=0";
    window.location.replace("/login");

});