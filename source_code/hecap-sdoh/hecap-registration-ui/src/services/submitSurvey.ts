import { fetchWrapper} from './fetch-wrapper';

export const submitRushSurvey = async function (body: any) {
    const apiHost = `${import.meta.env.VITE_API_URL}`;
    const surveyUrl = apiHost + '/api/surveyIrb'
    try{
        await fetchWrapper.post(surveyUrl, body)
        return 1
    } catch(err) {
        console.log("===rushSurvey API error:", err)
        return 0
    }
    
}