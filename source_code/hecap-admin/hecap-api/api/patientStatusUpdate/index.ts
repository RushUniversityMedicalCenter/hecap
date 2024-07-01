import { AzureFunction, Context, HttpRequest } from "@azure/functions"
const {httpResponse} = require('../comm/commHecap')
import sqlClient = require('../comm/db/daoSql')
const daoSql = new sqlClient.HecapSqlAccess()
import qualtricsApi= require('../comm/webServices/qualtricsApi')
const qualtricsEndpoint = new qualtricsApi.QualtricsEndpoint()
const HECAP_PATIENT_GROUP = process.env.HECAP_PATIENT_GROUP

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('===patientStatue request:', req.query.patientDimId);
    let user = req.query.user
    let status = req.query.status
    let data = req.body
    let patient_dim_id = data["FHIR ID"]
    let patient_dim_mrn = data["MRN"]
    let sms_email = data["SMS_Email"]
    let email = data["email"]
    let phone = data["phone"]
    let group_name = HECAP_PATIENT_GROUP
    let results = null
    let res = await qualtricsEndpoint.onBoardContact(context, data)
    context.log("===onboard res:", res)
    if (res && res.meta && res.meta.httpStatus &&  res.meta.httpStatus.includes("202 - Accepted")) {
      results = await daoSql.insertPatientStatus(context, patient_dim_id, patient_dim_mrn, status, user, sms_email, email, group_name, phone);
    }
  
    if(results) {
        context.res = {
            status: 200, /* Defaults to 200 */
            body: {"state":"success","results":results}
        };
    }else{
        context.res = {
            status: 200, /* Defaults to 200 */
            body: {"state":"failed","results": []}
        };
    }

};

export default httpTrigger;