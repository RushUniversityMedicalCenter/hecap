import {CosmosClient, SqlQuerySpec, Container} from '@azure/cosmos'
const dbhost = process.env.COSMOSDB_HOST
const dbauthkey = process.env.COSMOSDB_AUTHKEY
const config = {
    endpoint: dbhost,
    key: dbauthkey,
    dbHecapSurvey: "devshared",
    ctnHecapSurveyResults: "hecapsurveyresults",
    ctnHecapSurveyTemplates: "hecapsurveytemplates"
  }

const {endpoint, key, dbHecapSurvey, 
       ctnHecapSurveyResults, ctnHecapSurveyTemplates } = config

const client = new CosmosClient({ endpoint, key })
const dbHecapSurveyClient:any = client.database(dbHecapSurvey)
const ctnHSR: any = dbHecapSurveyClient.container(ctnHecapSurveyResults)

export class HecapCosmosAccess {
    public async saveSurveyResult(context:any, item: any ){
        try {
            const  results = await ctnHSR.items.create(item)
            return { "isSuccess": true, "results": results }
        } catch(err) {
            return { "isSuccess": false, "error": err }
        }

    }
    public async querySurveyResult(context:any, sql: any ){
        try {
            const  { resources: items } = await await ctnHSR.items.query(sql).fetchAll()
            return { "isSuccess": true, "result": items }
        } catch(err) {
            return { "isSuccess": false, "error": err }
        }

    }
}