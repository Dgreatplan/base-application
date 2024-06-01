import passport from "passport";
import { Strategy } from "passport-local";
import BaseController from "../utils/BaseController.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Globals from "./Globals.js";
import "dotenv/config.js";

import model from "../models/index.js";

const controller = new BaseController();
const UserModel = model.getTable('Users');

let err = { statusCode: 401 }, user;

passport.use(
    "login",
    new Strategy(
        {
            usernameField: "username",
            passwordField: "password",
            passReqToCallback: true,
        },
        async (_, username, password, done) => {
            try {
                if(!username || !password) {
                    return done({ message: "Incorrect username or password.", status: 401 });
                }

                user = await controller.findOne(
                    { Username: username },
                    UserModel
                );

                if(user['Status'] !== 'Active') {
                    err.message = Globals.getError("deactivated");
                    return done(err);
                }

                if(!user['Is Verified']) {
                    err.message = Globals.getError("unverified");
                    return done(err);
                }

                if(user['Locked At']) {
                    err.message = Globals.getError("locked");
                    return done(err);
                }

                const isValid = await bcrypt.compare(password, user.Password);
                let payload = { 'Login Attempts': (user['Login Attempts'] || 0) };
                const isExceeded = user['Login Attempts'] >= 5;
                if(!isValid) {
                    payload['Login Attempts'] += 1;
                    if(payload['Login Attempts'] >= 5) {
                        err.message = "Your account is locked. Please contact administrator.";
                        payload['Locked At'] = new Date().toISOString();
                    } else {
                        err.message = "Incorrect username or password.";
                    }
                    await controller.update(user.id, payload, UserModel);
                    return done(err);
                } else {
                    if(isExceeded && user['Locked At']) {
                        err.message = "Your account is locked. Please contact administrator.";
                        return done(err);
                    }
                }
        
                const token = jwt.sign({ userId: user.id, date: new Date() }, process.env.SECRET_KEY, { expiresIn: "30m" });
    
                await controller.update(user.id, {
                    Token: token,
                    'Login Attempts': 0,
                    'Locked At': null,
                    'Last Login': new Date().toISOString(),
                }, UserModel);
    
                done(null, { token, id: user.id }, { scope: "read" });
            } catch (error) {
                console.error("Login error :>> ", err);
                if(!user) err.message = "User doesn't exists."
                done(err);
            }
        }
    )
);
