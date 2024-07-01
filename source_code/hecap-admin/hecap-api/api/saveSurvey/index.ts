import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import cosmosClient = require('../comm/db/daoCosmos')
const daoCosmos = new cosmosClient.HecapCosmosAccess()

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request. req.body: ', req.body);
    const name = (req.query.name || (req.body && req.body.name));
    let item = req.body
    if (item["birthdate"]) {
        item.pkey = item["birthdate"]
    } else {
        item.pkey = "missing-birthdate"
    }
    let result: any = {}
    let responseStatus = true
    try {
        await daoCosmos.saveSurveyResult(context, item)
    } catch(error) {
        responseStatus = false
    }
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: { "isSuccess": responseStatus}
    };

};

export default httpTrigger;