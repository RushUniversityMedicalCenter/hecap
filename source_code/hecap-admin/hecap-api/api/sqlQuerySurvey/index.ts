import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import sqlClient = require('../comm/db/daoSql')
const daoSql = new sqlClient.HecapSqlAccess()

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    let sqlStatement = buildSqlStatement(context, req.query.id)
    let results = await daoSql.insertSurvey(context, sqlStatement);
    context.res = {
        status: 200, /* Defaults to 200 */
        body: {"state":"ok","results":results}
    };

};

const buildSqlStatement = function(context, id) {
    let sqlStatement = `select * from hs.SURVEY s  where s.id = ${id}`
    //context.log("===sql:", sqlStatement)
    return sqlStatement

}

export default httpTrigger;