import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import sqlClient = require('../db/daoSql')
const axios = require('axios');
const https = require('https');
const daoSql = new sqlClient.HecapSqlAccess()
export async function epicPatientLookup(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('===epicPatientLookup function start to process a request......');
    let responseCode = 405; //405: Method Not Allowed
    let results = []
    try { 
        //results = await daoSql.listHecapPatients(context);
        const url = process.env.EPIC_ENDPOINT
        const auth = process.env.EPIC_AUTH
        let mode = request.query.get('mode')
        const testurl = request.query.get('testurl')
        const testauth = request.query.get('testauth')
        if (mode == "test"){
            context.log('===epicPatientLookup test mode......');
            results.push("test ok!")
        } else if (mode == "testapi") {
            context.log('===epicPatientLookup testapi mode......');
            let result = await callTestApi(context, testurl, testauth)
            results.push(result)
        } else {
            context.log('===epicPatientLookup call EPIC API......');
            let result = await callEpicApi(context, url, auth)
            results.push(result)
        }
        responseCode = 200
        context.log('===epicPatientLookup function results:::', responseCode, results.length, url, auth);
    } catch (exc) {
        responseCode = 409 //409: Conflict
        context.log('===epicPatientLookup function exception:::', responseCode, exc);
    } finally {
        context.log('===epicPatientLookup function finally:::', responseCode);
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

async function callTestApi(context, url, auth) {
    try {
        if (auth) {
            try {
                const headers = {
                    'Authorization': auth,
                  };
                  const agent = new https.Agent({  
                    rejectUnauthorized: false
                  });
                const response = await axios.get(url, {headers, httpsAgent: agent});
                context.log("=================callTestApi(auth) response:", response.data)
                
                return response.data; // Assuming the data is in the response.data property
            }  catch (error) {
                console.error('Error fetching data:', error);
                throw error; // Or handle the error differently
              }
        } else {
          const response = await axios.get(url);
          context.log("=================callTestApi(no auth) response:", response.data)
          return response.data; // Assuming the data is in the response.data property
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Or handle the error differently
      }
}
async function callEpicApi(context, url, auth) {
    try {
        const headers = {
            'EPIC-CLIENT-ID': '0dd959bf-4504-4450-9fcb-33b77d649ee1',
            'EPIC-USER-ID': '929999',
            'EPIC-USER-IDType': 'EXTERNAL',
            'Authorization': auth,
          };
          const agent = new https.Agent({  
            rejectUnauthorized: false
          });
        const response = await axios.get(url, {headers, httpsAgent: agent});
        context.log("=================epic response:", response.data)
        
        return response.data; // Assuming the data is in the response.data property
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Or handle the error differently
      }
}

app.http('epicPatientLookup', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: epicPatientLookup
});
