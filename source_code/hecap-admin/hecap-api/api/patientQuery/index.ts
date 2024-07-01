import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import sqlClient = require('../comm/db/daoSql')
const {httpResponse} = require('../comm/commHecap')
const daoSql = new sqlClient.HecapSqlAccess()

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('===patientQuery request keyward:', req.query.keywordFN, req.query.keywordLN);
    let results = []
    if (req.query.provider == 'c24') {
        results = await daoSql.queryC24PatientsByKeyword(context, req.query.keywordFN,req.query.keywordLN );
    } else if (req.query.provider == 'qualtrics') {
        results = await daoSql.queryPatientsByKeyword(context, req.query.keywordFN,req.query.keywordLN );
    }
    httpResponse(context, results)
};

export default httpTrigger;