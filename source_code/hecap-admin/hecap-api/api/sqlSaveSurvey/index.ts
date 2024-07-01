import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import sqlClient = require('../comm/db/daoSql')
const daoSql = new sqlClient.HecapSqlAccess()

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('===HTTP trigger function sqlSaveSurvey processed a request.', req.body);
    //const name = (req.query.name || (req.body && req.body.name));
    try {
        let sqlStatement = buildSqlStatement(context, req.body)
        if (sqlStatement) {
            context.log("===sqlstatement:", sqlStatement)
            let results = await daoSql.insertSurvey(context, sqlStatement);
            if (results) {
                context.res = {
                    status: 200, 
                    body: {"isSuccess": true,"message":results}
                };
            } else {
                context.res = {
                    status: 500, 
                    body: {"isSuccess": false, "message": "sql insert error!"}
                };
            }
        } else {
            context.res = {
                status: 500,
                body: {"isSuccess": false, "message": "build sqlstatement error!"}
            };
        }
    } catch (error) {
        context.res = {
            status: 500, /* Defaults to 500 */
            body: {"isSuccess":false,"message": error}
        };
    }
};

const convertBoolean = function(value) {
    if(value === undefined || value === null || value === "") {
        return -1
    }else if (value === false){
        return 0
    }else if (value === true) {
        return 1
    }else {
        return value
    }
}
const validatePayload = function(context, payload) {
    let result = {}
    try {
        result["first_name"] = payload.first_name || null
        result["last_name"] = payload.last_name || null
        result["email"] = payload.email || null
        result["phone"] = payload.phone || null
        result["birthdate"] = payload.birthdate || "1900-01-01"
        result["address_line1"] = payload.address_line1 || null
        result["address_line2"] = payload.address_line2 || null
        result["address_city"] = payload.address_city || null
        result["address_state"] = payload.address_state || null
        result["address_postal_code"] = payload.address_postal_code || null
        result["submit_date"] = payload.submit_date || "1900-01-01"
        result["worried_food"] = convertBoolean(payload.worried_food)
        result["runout_food"] = convertBoolean(payload.runout_food)
        result["no_housing"] = convertBoolean(payload.no_housing)
        result["worried_housing"] = convertBoolean(payload.worried_housing)
        result["lack_transportation"] = convertBoolean(payload.lack_transportation)
        result["no_utilities"] = convertBoolean(payload.no_utilities)
        result["employment"] = convertBoolean(payload.employment)
        result["additional_info"] = payload.additional_info || null
        result["signature"] = payload.signature || null
    } catch (err) {
        context.log("===validatePayload: Error:", err)
        return false
    }
    return result
}

const buildSqlStatement = function(context, body) {
    let payload = validatePayload(context, body.sqlPayload)
    if (!payload) {
        return false
    }
    try {
        context.log(payload["email"], payload["phone"], payload["first_name"])
        let sqlStatement = `insert into hs.SURVEY (first_name,last_name,email,phone,birthdate,
            address_line1,address_line2,address_city,address_state,address_postal_code,
            submit_date,worried_food,runout_food,no_housing,worried_housing,lack_transportation,
            no_utilities,employment,additional_info,signature) 
            values ('${payload["first_name"]}', '${payload["last_name"]}', '${payload["email"]}', '${payload["phone"]}',
            '${payload["birthdate"]}', '${payload["address_line1"]}', '${payload["address_line2"]}', '${payload["address_city"]}',
            '${payload["address_state"]}', '${payload["address_postal_code"]}','${payload["submit_date"]}',
            '${payload["worried_food"]}','${payload["runout_food"]}', '${payload["no_housing"]}', '${payload["worried_housing"]}',
            '${payload["lack_transportation"]}', '${payload["no_utilities"]}', '${payload["employment"]}', '${payload["additional_info"]}',
            '${payload["signature"]}')`
        return sqlStatement
    } catch (err) {
        context.log("===buildSqlStatement:Error:", err)
        return false
    }

}

export default httpTrigger;