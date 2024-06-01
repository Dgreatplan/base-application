import bcrypt from 'bcrypt';
import axios from 'axios';
import 'dotenv/config.js';
import { PUBLIC_API } from '../constants/PublicRoutes.js';

/**
 * 
 * @description Methods for global reusable functions
 */
export default class Globals {


    /**
     * 
     * @description Middleware to protect routes from unauthorized access
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @returns token: string
     */
    static async routerMiddleware(req, res, next) {
        const { token } = req.headers;
        const errInfo = { message: 'Unauthorized' };

        if(!token) return res.status(401).json(errInfo);

        try {

            const secretKey = await bcrypt.hash(process.env.SECRET_KEY, 10);
            const isMatch = await bcrypt.compare(token, secretKey);

            if(!isMatch) {
                return res.status(401).json(errInfo);
            }
            next();
        } catch (error) {
            console.error('middleware error :>> ', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    /**
     * 
     * @description To register routes dynamically (temporary solution: to implement class based using base router)
     * @param {*} routes 
     */
    static registerRoutes(routes, router, rootPath, controller) {
        routes.forEach(route => {
            const endpoint = `/api/${rootPath}${route.path === '/' ? '' : route.path}`;
            router[route.method](
                route.path,
                !PUBLIC_API.includes(endpoint) ? this.routerMiddleware : [],
                controller
                    ? new controller()[route.function]
                    : (req, res) => res.status(401).json({ message: 'Unauthorized' })
            );
        });
    }

    /**
     * 
     * @description to return github headers
     * @returns github headers
     */
    static githubHeaders() {
        return {
            headers: {
                'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            }
        }
    }

    /**
     * 
     * @description Deep copy information
     * @param {*} object 
     * @returns 
     */
    static deepCopy(object) {
        return JSON.parse(JSON.stringify(object));
    }

    /**
     * 
     * @description Deep copy information
     * @param {*} object 
     * @returns 
     */
    static getError(message) {
        return `Your account is ${message}. Please contact administrator.`;
    }

    /**
     * 
     * @description dymically deep dive objects using string
     * @param {*} object 
     * @returns 
     */
    static deepDive(obj, path) {
        const keys = path.split('.');
        let result = obj;
        for(const key of keys) {
            result = result[key];
            if([undefined, null, ''].includes(result)) {
                return undefined;
            }
        }
        return result;
    }

}