import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import cosmosClient = require('../comm/db/daoCosmos')
const daoCosmos = new cosmosClient.HecapCosmosAccess()

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));
    //const responseMessage = "";
    let sql = "select * from c"
    let result: any = await daoCosmos.querySurveyResult(context, sql)

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: result
    };

};

export default httpTrigger;