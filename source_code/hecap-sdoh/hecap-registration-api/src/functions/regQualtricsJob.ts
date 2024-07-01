import { app, InvocationContext, Timer } from "@azure/functions";
import sqlClient = require('../db/daoSql')
const daoSql = new sqlClient.HecapSqlAccess()
import qualtricsApi= require('../webServices/qualtricsApi')
const qualtricsEndpoint = new qualtricsApi.QualtricsEndpoint()
const HECAP_PATIENT_GROUP = process.env.HECAP_PATIENT_GROUP
const {getEncryptionKey, encryptData, decryptData} = require('../db/encryption')

export async function regQualtricsJob(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('===regQualtricsJob Timer function processed request.', myTimer);
    let qualtricsApiJsonData = null
    let results = []
    try{
        results = await daoSql.listHecapPatients(context)
        const key = await getEncryptionKey(context)
        for(let jsonData of results) {
            let hecapFormatJsonData = hecapFormat(jsonData)
            let qualtricsApiJsonData = buildQualticsApiPayloads(context, jsonData, key)
            let qualtricsApiRes = await qualtricsEndpoint.onBoardContact(context, qualtricsApiJsonData)
            // context.log("===onboard res:", qualtricsApiRes)
            if (qualtricsApiRes && qualtricsApiRes.meta && qualtricsApiRes.meta.httpStatus 
                &&  qualtricsApiRes.meta.httpStatus.includes("202 - Accepted")) {
                let res = await daoSql.insertPatientStatus(context, hecapFormatJsonData.hecap_id, 
                hecapFormatJsonData.hecap_id, "Onboarded", "HECAP Registration", "HecapNonRush", "Email", 
                hecapFormatJsonData.email, hecapFormatJsonData.phone);
            }
        }
        context.log('===regQualtricsJob function results:::', results.length);
    } catch (exc) {
        context.log('===regQualtricsJob function exception:::', exc);
    } finally {
        context.log('===regQualtricsJob function finally...');
    }
}

function hecapFormat(jsonData) {
    let formatedData = {
        "hecap_id": "", 
        "firstname": "", 
        "lastname":"", 
        "email": "",
        "phone":"", 
        "birthdate": "",
        "signature": ""
    }
    formatedData.hecap_id = jsonData.hecap_id
    formatedData.firstname = jsonData.firstname
    formatedData.lastname = jsonData.lastname
    formatedData.email = jsonData.email
    formatedData.phone = jsonData.phone
    //formatedData.birthdate = jsonData.birthdate
    //formatedData.signature = jsonData.signature
    return formatedData
}

const buildQualticsApiPayloads = function(context, jsonData, key) {
    let patientData = {
        "FHIR ID": jsonData.hecap_id,
        "MRN": jsonData.hecap_id,
        "FirstName": decryptData(jsonData.firstname, key),
        "LastName": decryptData(jsonData.lastname, key),
        "Group": jsonData.group_name,
        "SMS_Email": 'Email',
        "email": decryptData(jsonData.email, key),
        "phone_number": "1-" + decryptData(jsonData.phone, key)
    }
    return patientData
}

app.timer('regQualtricsJob', {
    schedule: '0 */2 * * * *',
    handler: regQualtricsJob
});