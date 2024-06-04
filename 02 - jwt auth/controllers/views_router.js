
import Express from "express";

import { 
    serve_home_page , 
    serve_signin_page,
    serve_login_page  
} from "./middlewares/views/serve_views.js";

const router = Express.Router();

/*
    === serving static files routes === 
*/
router.get("/" , serve_home_page);

router.get("/signin" , serve_signin_page);

router.get("/login" , serve_login_page);
/*
    ===================================
*/ 

export {router as views_router};
