const {isBlank} = require('../../comm/commHecap')
import sqlClient = require('../../comm/db/daoSql')
const daoSql = new sqlClient.HecapSqlAccess()
import qualtricsApi= require('../../comm/webServices/qualtricsApi')
const qualtricsEndpoint = new qualtricsApi.QualtricsEndpoint()
const HECAP_PATIENT_GROUP = process.env.HECAP_PATIENT_GROUP

const preferredMethod = function(patient) {
    return "Email"
    if(patient && !isBlank(patient.pref_mobile)){
        return "SMS"
      } else if(patient && !isBlank(patient.pref_email)){
        return "Email"
      }else {
        return ""
      }
}
const buildQualticsApiPayloads = function(context, dailyResults) {
    let patientPayloads: object[] = []
    
    for(let patient of dailyResults) {
        let patientData = {
            "FHIR ID": patient.id[0],
            "FirstName": patient.givenName,
            "LastName": patient.familyName,
            "Group": HECAP_PATIENT_GROUP,
            "MRN": patient.MRN,
            "SMS_Email": preferredMethod(patient),
            "email": patient.pref_email,
            "phone_number": "1-" + patient.pref_mobile
        }
        patientPayloads.push(patientData)
    }
    return patientPayloads
}

const updatePatientStatus = async function (context: any, patientData: any) {
    let patient_dim_id = patientData["FHIR ID"]
    let patient_dim_mrn = patientData["MRN"]
    let status = "Onboarded"
    let sms_email = "Email"
    let email = patientData["email"]
    let updateBy = "QualtricsJob"
    let group_name = HECAP_PATIENT_GROUP
    let phone = patientData["phone_number"]
    let results = null
    results = await daoSql.insertPatientStatus(context, patient_dim_id, patient_dim_mrn, 
        status, updateBy, sms_email, email, group_name, phone);
    return results
}
const run = async function (context: any, time: any){
    var now = new Date().toISOString()
    try {
    context.log("===QualtricsJob Executor run........ ",now)
    let dailyResults = await daoSql.listDailyPatients(context);
    let qualtricsPayloads = buildQualticsApiPayloads (context, dailyResults)
    for(let patientData of qualtricsPayloads) {
        console.log("====patientData sent to Qualtrics:", patientData["FHIR ID"], patientData["MRN"], patientData["SMS_Email"])
        let resQualtrics = await qualtricsEndpoint.onBoardContact(context, patientData)
        let resDb = await updatePatientStatus(context, patientData)
    }
    context.log("===Qualtrics Job Executor is done! qualtricsPayloads counts:", qualtricsPayloads.length)
    } catch(err) {
        context.log("===qualtricsJob.Executor.error!!!", err);
    }
}

export{run}