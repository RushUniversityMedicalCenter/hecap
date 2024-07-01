// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isPositive: false,
    isAgeConfirmed: false,
    showPositiveInfo: false,
    showUserData: false,
    showUserDataSubmitButton: false,
    showConsentForm: false,
    showContactInfoOnly: false,
    showCloseButton: false,
    surveyAnswers: {},
    demographyData: {},
    reasonShareInfo: "",
    reasonRushOffer: "",
    wantRushSupport: "", //want to get RUSH social worker support
    wantUpcomingProgram: "", //want to participate RUSH upcoming programs 
    signature: "",
    userData: {
      "hecap_id": "C1234567", 
      "firstname": "", 
      "lastname": "", 
      "email": "",
      "phone": "",
      "birthdate": "",
      "prefEmail": "",
      "prefSms": "",
      "sms_email": "",
      "group_name": "",
      "signature": "",
      "reasonRushOffer": "",
      "reasonShareInfo": "",
      "wantUpcomingProgram": "",
      "wantRushSupport": "",
      "surveyAnswers": {},
      "demographyData": {},
    }
  }),
  actions: {
    setIsPositive(input: boolean) {
      this.isPositive = input
    },
    setIsAgeConfirmed(isAgeConfirmed: boolean) {
      this.isAgeConfirmed = isAgeConfirmed
    },
    setShowPositiveInfo(positive: boolean) {
      this.showPositiveInfo = positive
    },
    setShowUserData(show: boolean) {
      this.showUserData = show
    },
    setShowUserDataSubmitButton(show: boolean) {
      this.showUserDataSubmitButton = show
    },
    setShowConsentForm(show: boolean) {
      this.showConsentForm = show
    },
    setShowContactInfoOnly(show: boolean) {
      this.showContactInfoOnly = show
    },
    setShowCloseButton(showCloseButton: boolean) {
      this.showCloseButton = showCloseButton
    },
    setSurveyAnswers(answers: any) {
      this.surveyAnswers = answers
    },
    setDemographyData(demographyData: any) {
      this.demographyData = demographyData
    },
    setWantRushSupport(input: string) {
      this.wantRushSupport = input
    },
    setWantUpcomingProgram(input: string) {
      this.wantUpcomingProgram = input
    },
    setReasonShareInfo(input: string) {
      this.reasonShareInfo = input
    },
    setReasonRushOffer(input: string) {
      this.reasonRushOffer = input
    },
    setSignature(signatureBase64: any) {
      this.signature = signatureBase64
    },
    setUserData(userData: any) {
      this.userData = userData
    }
  }
})
