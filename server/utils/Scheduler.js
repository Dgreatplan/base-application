import cron from "node-cron";
import chalk from 'chalk';
import axios from 'axios';
import Mailer from "../utils/Mailer.js";
import { CRON_CODE } from '../constants/index.js';

import model from "../models/index.js";
const SchedulerModel = model.getTable('Scheduler');

let data = [];
await new Promise((resolve, reject) => {
    SchedulerModel.select().eachPage(
        (records, nextPage) => {
            records.forEach(record => {
                if(record.fields.Status === 'Active') {
                    data.push(record.fields);
                }
            });
            nextPage();
        }, (err) => err ? reject(err) : resolve({ count: data.length, data })
    );
});

export default class Scheduler {

    static async keepServerUp() {

        console.log(chalk.cyan('Scheduler has been initialized.'));

        const job = cron.schedule(CRON_CODE, async () => {
            try {
                const urls = data.map(x => x.API);
                for(const url of urls) {
                    const { data } = await axios.get(url);
                    console.log(`response :>> `, data);
                }
            } catch (error) {
                await Mailer.sendMail({
                    to: 'markpaulocruz839@gmail.com',
                    subject: 'Dgreatplan API - Cron Task Execution Failed',
                    text: `Task Scheduler Execution Failed - ${new Date().toLocaleDateString()}`
                });
            }
        });

        job.start();
    }

}