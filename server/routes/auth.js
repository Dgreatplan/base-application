import express from 'express';
import passport from 'passport';
const router = express.Router();
import BaseController from "../utils/BaseController.js";
import model from "../models/index.js";

const controller = new BaseController();
const UserModel = model.getTable('Users');

let jsonData;
router.post('/', (req, res, next) => {
    passport.authenticate('login', (error, data, info) => {
        if(error || !data) {
            return res.status(401).json(error);
        }
        jsonData = data;
        res.json(data);
    })(req, res, next);
}, (req, res) => res.sendStatus(200));

router.get('/get-user', async (req, res) => {
    try {
        let user = await controller.findOne({ Token: jsonData.token }, UserModel);
        const toRemoved = ['Token', 'Password', 'Temporary Password', 'Created Date', 'Is Verified', 'Login Attempts'];
        toRemoved.forEach(rec => delete user[rec]);
        res.status(200).json({ data: user });
    } catch (error) {
        console.log(error);
        throw error;
    }
});

export default router;