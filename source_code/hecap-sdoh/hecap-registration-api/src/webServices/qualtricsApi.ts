const axios = require('axios');
const urlEmail = process.env.QUALTRICS_ENDPOINT_EMAIL
const urlSms = process.env.QUALTRICS_ENDPOINT_SMS
const token = process.env.QUALTRICS_ENDPOINT_TOKEN
const qualtricsApiSwitch = process.env.QUALTRICS_API_SWITCH

export class QualtricsEndpoint {
    public async onBoardContact(context, data) {
       let res = null
       let resEmail = null
       let resSms = null
       try {
            context.log("===onBoardContact.axios:url:", urlEmail, urlSms, "--data:", data)
            if(qualtricsApiSwitch == 'ON') {
                if(data.prefEmail) {
                    data['SMS_Email'] = "Email"
                    context.log("===onBoardContact.axios:urlEmail:", urlEmail, "--data:", data)
                    resEmail = await axios.post(urlEmail, data, {
                        headers: {
                            'X-API-TOKEN': token,
                            'Content-Type': 'application/json'
                        }
                        })
                }
                if(data.prefSms) {
                    data['SMS_Email'] = "SMS"
                    context.log("===onBoardContact.axios:urlSms:", urlSms, "--data:", data)
                    resSms = await axios.post(urlSms, data, {
                        headers: {
                            'X-API-TOKEN': token,
                            'Content-Type': 'application/json'
                        }
                        })
                }
                return {
                    meta: {
                        httpStatus: "202 - Accepted"
                    },
                    resEmail: resEmail,
                    resSms: resSms
                }
            } else {
                return {
                    meta: {
                        httpStatus: "202 - Accepted"
                    }
                }
            }
        }catch(err){
            context.log("===QualtricsEndpoint.onBoardContact.Error!!", err)
            return false
        }
    }
}

