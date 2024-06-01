import DB from "airtable";
import 'dotenv/config.js';

/**
 * @description db connector
 */

class DBConnector {
    constructor() {
        this.connection = this.connect();
    }

    connect() {
        try {
            return  new DB({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.DATABASE);
        } catch (error) {
            throw error;
        }
    }
}

let model = new DBConnector();
model.getTable = (table) => model.connection(table);

export default model;