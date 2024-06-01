import chalk from 'chalk';
import Mailer from '../utils/Mailer.js';
import Scheduler from '../utils/Scheduler.js';
import "../utils/Auth.js";
import 'dotenv/config.js';

import { readdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5001;

/**
 * @description Initialization of app
 * @returns
 */
export default class ApplicationBootstrap {

    /**
     * 
     * @description Listen and run the express server
     * @param {*} server 
     * @returns
     */
    static async init(server) {

        const path = join(__dirname, '../routes');
        const files = await readdir(path);
        
        for(const file of files) {
            if(file.endsWith('.js')) {
                const endpoint = file.split('.js').join('');
                const filePath = join(path, file);
                const module = (await import(`file://${filePath}`)).default;
                server.use(`/api/${endpoint}`, module);
                console.log(chalk.yellow(`Available endpoints: ${`/api/${endpoint}`}`));
            }
        }
        
        // Utilities Initializer
        await Mailer.init();
        if(process.env.ENVIRONMENT === 'production') {
            await Scheduler.keepServerUp();
        }

        server.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    }

}