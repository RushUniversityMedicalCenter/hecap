import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import sqlClient = require('../db/daoSql')
const daoSql = new sqlClient.HecapSqlAccess()
export async function listPatients(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('===patientList function start to process a request......');
    let responseCode = 405; //405: Method Not Allowed
    let results = []
    try {
        results = await daoSql.listHecapPatients(context);
        responseCode = 200
        context.log('===patientList function results:::', responseCode, results.length);
    } catch (exc) {
        responseCode = 409 //409: Conflict
        context.log('===patientList function exception:::', responseCode, exc);
    } finally {
        context.log('===patientList function finally:::', responseCode);
        return  {
            status: responseCode, 
            jsonBody: {"numberOfRecords": results.length,"results":results},
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

app.http('listPatients', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: listPatients
});
