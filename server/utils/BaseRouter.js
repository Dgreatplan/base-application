import express from 'express';
import Globals from '../utils/Globals.js';

/**
 * 
 * @description Base router class for global dynamic routes
 */
export default class BaseRouter {
    constructor(controller) {
        this.router = express.Router();
        this.controller = controller;
    }

    /**
     * 
     * @description To register routes dynamically
     * @param {*} routes 
     */
    registerRoutes(routes) {
        routes.forEach(route => {
            this.router[route.method](
                route.path,
                Globals.routerMiddleware,
                this.controller[route.function].bind(this)
            );
        });
    }

    getRouter() {
        return this.router;
    }
}