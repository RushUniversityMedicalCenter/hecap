import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import sqlClient = require('../db/daoSql')
const daoSql = new sqlClient.HecapSqlAccess()
import qualtricsApi= require('../webServices/qualtricsApi')
const HECAP_PATIENT_GROUP = process.env.HECAP_PATIENT_GROUP

const {upload} = require('../blob/blobOperations')
const {buildHtmlConsentForm} = require('../htmlBuilder/builder')

export async function survey(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('===regQualtrics function start to process a request......');
    let responseCode = 405; //405: Method Not Allowed
    let results = []
    try {
        let body = await request.text()
        let jsonData = JSON.parse(body)
        let validPayload = validatePayload(jsonData)
        if (validPayload) {
            if (jsonData.hecap_id == 'SurveyOnly' && jsonData.surveyAnswers) {
                let hecapSurveyResult = await daoSql.insertSDOHSurvey(context, jsonData.hecap_id, jsonData.surveyAnswers)
                responseCode = 200
            } else {
                let hecapId = await daoSql.getLastHecapPatienId(context)
                let hecapFormatJsonData = hecapFormat(jsonData, hecapId)
                //let qualtricsApiJsonData = buildQualticsApiPayloads(jsonData, hecapId)
                
                let hecapPatientRegResult = await daoSql.insertHecapPatient(context, hecapFormatJsonData);
                let hecapSurveyResult = await daoSql.insertSDOHSurvey(context, hecapId, jsonData.surveyAnswers)
                results = await daoSql.insertPatientStatus(context, hecapFormatJsonData.hecap_id, 
                    hecapFormatJsonData.hecap_id, "Onboarded", "HECAP Registration", "HecapNonRush", hecapFormatJsonData.sms_email, 
                    hecapFormatJsonData.email, '1-' + hecapFormatJsonData.phone);

                let htmlBuffer = buildHtmlConsentForm(context, jsonData, getDateForToday().formatSignature)
                //context.log("===htmlBuffer1:", htmlBuffer)
                let filename = "hecapregconsent-" +  getDateForToday().formatFilename + "-" + jsonData.firstname + jsonData.lastname + ".html"
                context.log("===blobname: ", filename)
                await upload(context, htmlBuffer, filename)
                responseCode = 200
                context.log('===patientList function results:::', responseCode, results.length);
            }
        } else {
            //let htmlBuffer = buildHtmlConsentForm(context, jsonData, getDateForToday().formatSignature)
            //context.log("===htmlBuffer2:", htmlBuffer)
            //let filename = "hecapregconsent-" +  getDateForToday().formatFilename + "-" + jsonData.firstname + jsonData.lastname + ".html"
            //context.log("===blobname: ", filename)
            //await upload(context, htmlBuffer, filename)
            responseCode = 409
        }
    } catch (exc) {
        responseCode = 409 //409: Conflict
        context.log('===patientList function exception:::', responseCode, exc);
    } finally {
        context.log('===patientList function finally:::', responseCode);
        return  {
            status: responseCode, 
            jsonBody: {"results": ""},
            headers: {
                'X-Content-Type-Options': 'nosniff',
                'X-XSS-Protection': '1; mode=block',
                'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:",
                'X-Frame-Options': 'DENY',
                'Strict-Transport-Security': 'max-age=63072000; includeSubDomains'
            }
        };
    }
};

app.http('survey', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: survey
});

function getPreferredMethod(prefEmail, prefSms) {
    if(prefEmail && prefSms) {
        return "Both"
    }
    if(prefEmail) {
        return "Email"
    }
    if(prefSms) {
        return "Sms"
    }
}

function hecapFormat(jsonData, hecapId) {
    let formatedData = {
        "hecap_id": "", 
        "firstname": "", 
        "lastname":"", 
        "email": "",
        "phone":"", 
        "birthdate": "",
        "signature": "",
        "sms_email": ""  //Email/Sms/Both
    }
    formatedData.hecap_id = hecapId || ''
    formatedData.firstname = jsonData.firstname || ''
    formatedData.lastname = jsonData.lastname || ''
    formatedData.email = jsonData.email || ''
    formatedData.phone = jsonData.phone || ''
    formatedData.birthdate = jsonData.birthdate
    formatedData.signature = jsonData.signature || ''
    formatedData.sms_email = getPreferredMethod(jsonData.prefEmail, jsonData.prefSms)
    return formatedData
}

const buildQualticsApiPayloads = function(jsonData, hecapId) {
        let patientData = {
            "FHIR ID": hecapId,
            "FirstName": jsonData.firstname,
            "LastName": jsonData.lastname,
            "Group": HECAP_PATIENT_GROUP,
            "MRN": hecapId,
            "prefEmail": jsonData.prefEmail,
            "prefSms": jsonData.prefSms,
            "email": jsonData.email,
            "phone_number": "1-" + jsonData.phone
        }
    return patientData
}

function validatePayload(payload): boolean {    
    let firstname = payload.firstname || ''
    let lastname = payload.lastname || ''
    let email = payload.email || ''
    let phone = payload.phone || ''
    let birthdate = payload.birthdate || ''
    let prefEmail = payload.prefEmail 
    let prefSms = payload.prefSms
    let surveyAnswers = payload.surveyAnswers
    let hecapId = payload.hecap_id
    if (hecapId == 'SurveyOnly' && surveyAnswers) {
        return true
    }
    if (payload.hecap_id.length > 50
        || firstname.length > 100 
        || lastname.length > 100
        || email.length > 100
        || phone.length > 15
        || birthdate.length > 15
        || prefEmail.length > 10
        || prefSms.length > 10
        ) {
      return false;
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email != '' && !emailRegex.test(email)) {
      return false;
    }
  
    // Validate phone format
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (phone !== '' && !phoneRegex.test(phone)) {
      return false;
    }
  
    // Validate birthdate format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(payload.birthdate)) {
      return false;
    }
  
    // Validate signature as image data
    const signatureRegex = /^data:image\/(png|jpg|jpeg);base64,/;
    if (!signatureRegex.test(payload.signature)) {
      return false;
    }
    // All validations passed
    return true;
}

function getDateForToday() {
    var today = new Date();
    // Get the current date components
    var year = today.getFullYear();
    var day = today.getDate();
    var month = today.getMonth() + 1; // Months are zero-based, so we add 1

    var month2 = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
    var day2 = today.getDate().toString().padStart(2, '0');

    // Format the date as a string (in MM/DD/YYYY or DD/MM/YYYY format, for example)
    var formattedDate1 = month + '/' + day + '/' + year;
    var formattedDate2 = year + month2 + day2;
    return {
        "formatSignature": formattedDate1,
        "formatFilename" : formattedDate2
    }
}


  
