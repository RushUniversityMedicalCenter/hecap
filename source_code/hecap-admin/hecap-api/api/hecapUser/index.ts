import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import sqlClient = require('../comm/db/daoSql')
const {httpResponse} = require('../comm/commHecap')
const daoSql = new sqlClient.HecapSqlAccess()

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    //let ascUser = "YWFyb246bXlwYXNz"
    context.log('===hecapUser request:', req.query.user, context.bindingData.func);
    let resStatus = 401
    let resBody = null
    let func = context.bindingData.func
    let userCred = req.query.user
    let accessAllowed = validateUser(context, userCred)
    if (accessAllowed) {
        resStatus = 200
        resBody = {"access":"allowed","results": {"token": userCred}}
    } 
    context.res = {
        status: resStatus, 
        body: resBody
    };

};

const validateUser = function(context, userCred) {
    let users = {
        "UserAdmin01": process.env.HECAP_WEB_USER_ADMIN_PASS,
        "UserOpt01": process.env.HECAP_WEB_USER_OPERATOR_PASS
    }
    const credentials = Buffer.from(userCred, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    context.log("====userCred:", userCred, username, password)
    if (users.hasOwnProperty(username)) {
        if (password == users[username]) {
            return true
        }
    }
    return false
}

export default httpTrigger;