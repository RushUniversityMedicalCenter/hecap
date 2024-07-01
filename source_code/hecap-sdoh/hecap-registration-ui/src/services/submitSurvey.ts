import { fetchWrapper} from './fetch-wrapper';

export const submitRushSurvey = async function (body: any) {
    const apiHost = `${import.meta.env.VITE_API_URL}`;
    const surveyUrl = apiHost + '/api/surveyIrb'
    try{
        const res = await fetchWrapper.post(surveyUrl, body)
        if (res.results) {
            return res.results
        }
    } catch(err) {
        console.log("===rushSurvey API error:", err)
    }
    return null
}