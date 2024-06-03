
import Express from "express";
import path from "path";

import { 
    serve_home_page , 
    serve_signin_page,
    serve_login_page  
} from "./middlewares/views/serve_views.js";

// console.log(__dirname);
const router = Express.Router();

router.get("/" , serve_home_page);

router.get("/signin" , serve_signin_page);

router.get("/login" , serve_login_page);

//module.exports.views_router = router;
export {router as views_router};
