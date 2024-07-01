import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import sqlClient = require('../comm/db/daoSql')
const {funcResponse} = require('../comm/commHecap')
const daoSql = new sqlClient.HecapSqlAccess()

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('===patientList function start to process a request......');
    let responseCode = 405; //405: Method Not Allowed
    let results = []
    try {
        let provider = req.query.provider
        if (provider == "qualtrics") {
            results = await daoSql.listPatients(context);
        } else if (provider == "c24") {
            results = await daoSql.listPatientsC24(context);
        }
        responseCode = 200
        context.log('===patientList function results:::', responseCode, results.length);
    } catch (exc) {
        responseCode = 409 //409: Conflict
        context.log('===patientList function exception:::', responseCode, exc);
    } finally {
        context.log('===patientList function finally:::', responseCode);
        funcResponse(context, results, responseCode)
    }
};

export default httpTrigger;