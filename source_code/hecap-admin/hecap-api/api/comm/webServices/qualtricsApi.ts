const axios = require('axios');
const urlEmail = process.env.QUALTRICS_ENDPOINT_EMAIL
const urlSms = process.env.QUALTRICS_ENDPOINT_SMS
const token = process.env.QUALTRICS_ENDPOINT_TOKEN

export class QualtricsEndpoint {
    public async onBoardContact(context, data) {
       let url = urlEmail 
       let res = null
       try {
            // if (data["SMS_Email"].toUpperCase() == "SMS") {
            //     url = urlSms
            // } 
            context.log("===onBoardContact.axios:url:", url, "--data:", data)
            res = await axios.post(url, data, {
                headers: {
                    'X-API-TOKEN': token,
                    'Content-Type': 'application/json'
                }
                })
                return res.data
        }catch(err){
            context.log("===QualtricsEndpoint.onBoardContact.Error!!", err)
            return false
        }
    }
}

