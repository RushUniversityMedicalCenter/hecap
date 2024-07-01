import { fetchWrapper} from '@/helpers';
import { useAuthStore } from '@/stores/index'
const authStore = useAuthStore()

export const allPatientList = async function(provider: any) {
    let baseUrl = `${import.meta.env.VITE_API_URL}`;
    let requstUrl = baseUrl + `/patientList?provider=${provider}`
    try{
        let res = await fetchWrapper.get(requstUrl, null)
        if (res.results) {
            return res.results
        }
    } catch(err) {
        console.log("===allPatientList.error:", err)
    }
    return null
}

export const patientSearch = async function(provider: any, keywordFN: any, keywordLN: any) {
    let baseUrl = `${import.meta.env.VITE_API_URL}`;
    let requstUrl = baseUrl + `/patientQuery?keywordFN=${keywordFN}&keywordLN=${keywordLN}&provider=${provider}`
    //let results: any = null
    try{
        let res = await fetchWrapper.get(requstUrl, null)
        if (res.results) {
            return res.results
        }
    } catch(err) {
        console.log("===patientHtmlFiles.error:", err)
    }
    return null
}

export const newPatient = async function(currentRoutePath: string, patient: any) {
    let baseUrl = `${import.meta.env.VITE_API_URL}`;
    let requstUrl = baseUrl + `/patientC24`
    try{
        let body = {
            "Email": patient.email,
            "FirstName": patient.givenName,
            "LastName": patient.familyName,
            "Phone": patient.phone,
            "FHIRID":patient.fhirid,
            "MRN": patient.MRN,
            "Status": "Submitted",
            "Group": "Dev Test Group",
        }

        let res = await fetchWrapper.post(requstUrl, body)
        if (res.results) {
            return res.results
        }
    } catch(err) {
        console.log("===new patient.error:", err)
    }
    return null
}

export const updatePatientStatus = async function(patient: any, method: any) {
    //console.log("===updatePatientStatus:method:", method, "---patient:", patient)
    let baseUrl = `${import.meta.env.VITE_API_URL}`;
    const authStore = useAuthStore()
    let user = authStore.userName
    let requstUrl = baseUrl + `/patientStatusUpdate?status=Onboarded&user=${user}`
    let qualtricFormatPhoneNumber = "1-" + patient.pref_mobile
    let body = {
        "email": patient.pref_email,
        "FirstName": patient.givenName,
        "LastName": patient.familyName,
        "phone_number": qualtricFormatPhoneNumber,
        "FHIR ID":patient.id[0],
        "MRN": patient.MRN,
        "Group": "Dev Test Group",
        "SMS_Email": method
    }
    try{
        let res = await fetchWrapper.post(requstUrl, body)
        if (res.results) {
            return res.results
        }
    } catch(err) {
        console.log("===patientHtmlFiles.error:", err)
    }
    return null
}