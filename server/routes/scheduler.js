import express from 'express';
import Globals from '../utils/Globals.js';
import Controller from '../controllers/SchedulerController.js';
const router = express.Router();
const url = import.meta.url;
const rootPath = url.substring(url.lastIndexOf('/') + 1).split('.').shift();

Globals.registerRoutes(
    [
        {
            path: '/',
            method: 'get',
            function: 'getScheduler'
        },
        {
            path: '/',
            method: 'post',
            function: 'addScheduler'
        }
    ],
    router,
    rootPath,
    Controller,
);

export default router;