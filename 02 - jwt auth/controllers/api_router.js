
import Express from "express";

import { handle_login_request  } from "./middlewares/api/login.js";
import { handle_logout_request } from "./middlewares/api/logout.js";
import { handle_signin_request } from "./middlewares/api/signin.js";

const api = Express.Router();

// route: api/
api.post("/login"  , handle_login_request);
api.post("/signin" , handle_signin_request);
api.post("/logout" , handle_logout_request);

export { api as api_router };
