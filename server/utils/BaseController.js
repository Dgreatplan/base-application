import model from '../models/index.js';
/**
 * 
 * @description Includes all global necessary functions for controllers
 */
export default class BaseController {

    constructor(model) {
        this.model = model;
    }


    /**
     * @description get all records
     * @param {*} req 
     * @param {*} res 
     * @returns all records
     */
    findAll = (query = {}) => {
        try {
            return new Promise((resolve, reject) => {
                let data = [];
                this.model.select().eachPage(
                    (records, nextPage) => {
                        records.forEach(record => data.push(record.fields));
                        nextPage();
                    }, (err) => err ? reject(err) : resolve({ count: data.length, data })
                );
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * @description get records based on query
     * @param {*} query 
     * @returns matching records
     */
    findByQuery = (query = {}) => {
        try {
            return new Promise((resolve, reject) => {
                let data = [];
                this.model.select({
                    filterByFormula: `AND(${Object.keys(query).map(key => `{${key}} = '${query[key]}'`).join(',')})`
                }).eachPage(
                    (records, nextPage) => {
                        records.forEach(record => data.push(record.fields));
                        nextPage();
                    }, (err) => err ? reject(err) : resolve({ count: data.length, data })
                );
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * @description get single record by unique column value
     * @param {*} column 
     * @param {*} value 
     * @returns matching record
     */
    findOne = (query = {}, _model, association) => {
        try {
            return new Promise((resolve, reject) => {
                const key = Object.keys(query)[0], value = Object.values(query)[0];
                (_model ? _model : this.model).select({
                    filterByFormula: `{${key}} = '${value}'`,
                    maxRecords: 1
                }).firstPage((err, records) => {
                    if(err) {
                        reject(err);
                    } else if(records && records.length > 0) {
                        // if(association) {
                        //     if(Array.isArray(association)) {

                        //     } else {
                        //         console.log('association :>> ', association);
                        //         const assoc = this.getById(records[0].fields[association][0],);
                        //         console.log('assoc :>> ', assoc);
                        //     }
                        // }
                        resolve({ ...records[0].fields, id: records[0].id});
                    } else {
                        reject(new Error(`Record with ${key} '${value}' not found`));
                    }
                });
            });
        } catch (error) {
            return error;
        }
    };
    

    /**
     * @description get single record by id
     * @param {*} id 
     * @returns 
     */
    getById = (id, _model) => {
        return new Promise((resolve, reject) => {
            (_model ? _model : this.model).find(id, (err, record) => {
                err ? reject(err) :
                    (record ? resolve(record.fields) :
                        reject(new Error(`Record with ID ${id} not found`)));
            });
        });
    };


    /**
     * @description create bulk or single record
     * @param {*} data
     * @returns {*} created record/s
     */
    create = (data) => {
        data = Array.isArray(data) ? data.map(x => ({ fields: x })) : data;
        return new Promise((resolve, reject) => {
            this.model.create(data, (err, record) => {
                err ? reject(err) :
                    resolve(
                        Array.isArray(record)
                            ? record.map(x => x.fields)
                            : record.fields
                    );
            });
        });
    };


    /**
     * @description update record
     * @param {*} ids 
     * @param {*} data 
     * @returns updated record
     */
    update = (id, data, model) => {
        return new Promise((resolve, reject) => {
            (model ? model : this.model).update(id, data, (err, record) => {
                err ? reject(err) :
                    resolve(record);
            });
        });
    };
    

    /**
     * @description delete record
     * @param {*} ids 
     * @returns deleted record
     */
    deleteRecords = (ids) => {
        return new Promise((resolve, reject) => {
            const _ids = Array.isArray(ids) ? ids : [ids];
            this.model.destroy(_ids, (err, records) => {
                err ? reject(err) :
                    resolve(records.map(record => record.id));
            });
        });
    };


    /**
     * 
     * @description create dynamic response
     * @param {*} data 
     * @param {*} err 
     * @param {*} res 
     * @returns 
     */
    response = (data, err, res) => {
        if(err) {
            const er = err?.response?.data?.Fault?.Error;
            console.log('###Error :>> ', er ? er : err); 
            return res.send(err);
        } return res.json(data);
    }

    /**
     * 
     * @description build query params
     * @param {*} data 
     * @param {*} err 
     * @param {*} res 
     * @returns 
     */
    queryParams = (params) => {
        const queryString = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${params[key]}`)
            .join('&');
        return queryString;
    }

}