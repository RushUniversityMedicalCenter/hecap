import { fetchWrapper} from './fetch-wrapper';

export const register = async function (body: any) {
    const regQualtricsUrl = `${import.meta.env.VITE_API_URL}`;
    try{
        const res = await fetchWrapper.post(regQualtricsUrl + '/api/regQualtrics', body)
        if (res.results) {
            return res.results
        }
    } catch(err) {
        console.log("===registerAPI().error:", err)
    }
    return null
}