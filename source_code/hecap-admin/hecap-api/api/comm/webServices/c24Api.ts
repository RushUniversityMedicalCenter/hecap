const axios = require('axios');
const url = process.env.C24_ENDPOINT_URL
const token = process.env.C24_ENDPOINT_TOKEN
const accountId = process.env.C24_ACCOUNT_ID

export class C24Endpoint {
    public async onBoardPatien(context, data) {
       let res = null
       try {
            context.log("===onBoardPatienC24.axios:url:", url, "--data:", data)
            res = await axios.post(url, JSON.stringify(data), {
                headers: {
                    'Authorization': "Bearer " + token,
                    'Content-Type': 'application/json',
                    'Api-AccountId': accountId,
                }
                })
            return res.data
        }catch(err){
            context.log("===C24Endpoint.onBoardPatient.Error!!", err)
            return false
        }
    }
}

