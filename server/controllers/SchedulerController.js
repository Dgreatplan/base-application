import BaseController from "../utils/BaseController.js";
import model from '../models/index.js';
const SchedulerModel = model.getTable('Scheduler');

export default class SchedulerController extends BaseController {
    constructor() {
        super(SchedulerModel);
    }

    /**
     * 
     * @description get scheduler
     * @param {*} req 
     * @param {*} res 
     */
    getScheduler = async (req, res) => {
        try {
            const data = await this.findAll();
            this.response(data, null, res);
        } catch (error) {
            this.response(null, error, res);
        }
    }

    /**
     * 
     * @description create scheduler
     * @param {*} req 
     * @param {*} res 
     */
    addScheduler = async (req, res) => {
        try {
            const data = req.body;
            const response = await this.create(data);
            this.response(response, null, res);
        } catch (error) {
            this.response(null, error, res);
        }
    }

}