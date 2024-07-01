import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import sqlClient = require('../comm/db/daoSql')
const {funcResponse} = require('../comm/commHecap')
const daoSql = new sqlClient.HecapSqlAccess()
import c24Api= require('../comm/webServices/c24Api')
const c24Endpoint = new c24Api.C24Endpoint()

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('===new C24 patient function start to process a request......');
    try {
        let payload = validatePayload(context, req.body)
        if(!payload) {
            context.res = {
                status: 500,
                body: {"isSuccess": false, "message": "Payload validation error!"}
            };
            return
        }

        let sqlStatement = buildInsertStatement(context, payload)
        if (!sqlStatement) {
            context.res = {
                status: 500,
                body: {"isSuccess": false, "message": "build sqlstatement error!"}
            };
            return
        }
        context.log("===new patient sqlstatement:", sqlStatement)
        let results = []
        let newPatientResult = await daoSql.insertPatient(context, sqlStatement);
        if (!newPatientResult) {
            context.res = {
                status: 500, 
                body: {"isSuccess": false, "message": "sql insert error!"}
            };
            return
        }
        results.push(newPatientResult)


        let c24Payload = buildC24Payload(context, payload)

        let c24Result = await c24Endpoint.onBoardPatien(context, c24Payload)

        if(!c24Result) {
            context.res = {
                status: 500,
                body: {"isSuccess": false, "message": "Sent to C24 error!"}
            };
            return
        }

        results.push(c24Result)

        context.res = {
            status: 200, 
            body: {"isSuccess": true,"message":results}
        };

    } catch (error) {
        context.res = {
            status: 500, /* Defaults to 500 */
            body: {"isSuccess":false,"message": error}
        };
    }
};

const buildC24Payload = function(context, payload) {
    
    return {
        "ContactID": "CID_eFj7XKxBusdgtest3",
        "fhirId": payload.FHIRID,
        "lastName": payload.LastName,
        "middle": "",
        "title": "",
        "firstName": payload.FirstName,
        "mrn": payload.MRN,
        "dob": payload.dob || "1900-01-01",
        "gender": "",
        "address1": "",
        "address2": "",
        "city": "",
        "state": "",
        "zip": "",
        "homePhone": payload.Phone,
        "email": payload.Email,
        "icd10Codes": "",
        "primaryInsuranceName": "",
        "primaryInsuranceId": "",
        "secondaryInsuranceName": "",
        "secondaryInsuranceId": "",
        "providerFirstName": "",
        "providerLastName": "",
        "providerNpi": ""
        }
}

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
        result["FirstName"] = payload.FirstName || null
        result["LastName"] = payload.LastName || null
        result["Email"] = payload.Email || null
        result["Language"] = payload.Language || null
        result["ExternalDataReference"] = payload.ExternalDataReference || null
        result["Phone"] = payload.Phone || null
        result["GroupName"] = payload.GroupName || null
        result["OptInSMS"] = payload.OptInSMS || null
        result["EnrolledDate"] = payload.EnrolledDate || "1900-01-01"
        result["MRN"] = payload.MRN || null
        result["FHIRID"] = payload.FHIRID || null
        result["Status"] = payload.Status || null
        result["City"] = payload.City || null
        result["Country"] = payload.Country || null
        result["Department"] = payload.Department || null
    } catch (err) {
        context.log("===validatePayload: Error:", err)
        return false
    }
    return result
}

const buildInsertStatement = function(context, payload) {
    try {
        context.log(payload["email"], payload["phone"], payload["first_name"])
        const currentDate = new Date();
        const isoString = currentDate.toISOString();
        let sqlStatement = `insert into he.PATIENT_C24 (FirstName,LastName,Email,Language, 
            ExternalDataReference, Phone, GroupName, OptInSMS, 
            EnrolledDate, MRN, FHIRID, Status, 
            City, Country, Department, CreatedAt) 
            values ('${payload["FirstName"]}', '${payload["LastName"]}', '${payload["Email"]}', '${payload["Language"]}',
            '${payload["ExternalDataReference"]}', '${payload["Phone"]}', '${payload["GroupName"]}', '${payload["OptInSMS"]}',
            '${payload["EnrolledDate"]}', '${payload["MRN"]}','${payload["FHIRID"]}', '${payload["Status"]}',
            '${payload["City"]}', '${payload["Country"]}', '${payload["Department"]}', '${isoString}')`
        return sqlStatement
    } catch (err) {
        context.log("===buildInsertStatement:Error:", err)
        return false
    }

}

export default httpTrigger;