import BaseController from "../utils/BaseController.js";
// import model from '../models/index.js';
// const <TableName>Model = model.getTable('<TableName>');

export default class TestController extends BaseController {
    // constructor() {
    //     super(<TableName>Model);
    // }

    /**
     * 
     * @description get model
     * @param {*} req 
     * @param {*} res 
     */
    testFunction = async (req, res) => {
        try {
            const data = await this.findAll();
            this.response(data, null, res);
        } catch (error) {
            this.response(null, error, res);
        }
    }

}