import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import ApplicationBootstrap from './utils/ApplicationBootstrap.js';
import { SERVER_LOG } from './constants/index.js';
import 'dotenv/config.js';

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(bodyParser.json());

['/', '/api'].forEach(path => {
    app.get(path, (req, res) => {
        res.status(200).send(SERVER_LOG);
    });
});

ApplicationBootstrap.init(app);
