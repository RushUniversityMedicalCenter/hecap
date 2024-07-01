<template>
  <v-container class="fill-height">
    <v-responsive class="align-center fill-height">
      <v-row class="d-flex align-center row_margin" style="margin-top: 1px">
        <v-col cols="1">
          <v-btn icon="mdi-arrow-left" @click="back"></v-btn>
        </v-col>
        <v-col Style="margin-right: 80px">
          <v-img height="40" src="@/assets/RUSH+Logo.png" />
        </v-col>
      </v-row>
      <ResourcePage />
      <div v-if="showUserData">
        <div v-if="showConsentForm">
          <ConsentFormSimple />
        </div>
        <UserDataForm />
        <v-row class="d-flex row_margin button_wrapper" >
          <v-btn block class="mt-2" @click="submitProfile" v-if="isShowUserDataSubmitButton">Submit</v-btn>
        </v-row>
      </div>
      <v-row class="d-flex row_margin button_wrapper" v-if="showCloseButton">
        <v-btn block class="mt-2" @click="back" >Close and go back to homepage</v-btn>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import router from "@/router";
import { onMounted, computed } from "vue";
import { useAppStore } from '@/store/app';
import {submitRushSurvey} from "@/services/submitSurvey";
import ConsentFormSimple from '@/components/ConsentFormSimple.vue'
import ResourcePage from '@/components/ResourcePage.vue'
import UserDataForm from '@/components/UserDataForm.vue'

const appStore = useAppStore()
const showConsentForm = computed(() => {
  return appStore.showConsentForm
})

const showUserData = computed(() => {
  return appStore.showUserData
}) 

const showCloseButton = computed(() => {
  return appStore.showCloseButton
})
const isShowUserDataSubmitButton = computed(() => {
    //return appStore.isAgeConfirmed
    return true
})

function back() {
  router.push({path: '/'})
}

function validateSignature() {
  let signed = appStore.signature
  return signed.startsWith("data:image/png;base64")
}

function isNotEmpty(str:any) {
  if(str) { return  str.trim().length !== 0;}
  else {return false}
}

function validateMissingEmailPhone(formData: any){
  let valid = true
  if(!formData.prefEmail && !isNotEmpty(formData.phone)) {
    valid = false
  }
  if(!formData.prefSms && !isNotEmpty(formData.email)) {
    valid = false
  } 
  return valid
}


function formatPhoneNumber(phoneNumber: any) {
    console.log("===formatPhoneNumber:", phoneNumber)
    phoneNumber = phoneNumber.toString();
    if (phoneNumber.length === 10) {
        return phoneNumber.slice(0, 3) + '-' + phoneNumber.slice(3, 6) + '-' + phoneNumber.slice(6);
    } else {
        return "Invalid phone number";
    }
}

function getPreferredMethod(prefEmail: any, prefSms: any) {
    if(prefEmail && prefSms) {
        return "Both"
    }
    if(prefEmail) {
        return "Email"
    }
    if(prefSms) {
        return "Sms"
    }
    return ""
}

async function submitProfile() {
  let formData = appStore.userData
  let isValidEmailPhone = validateMissingEmailPhone(formData)
  let signed = validateSignature()
  
  console.log("=====validtion:", isValidEmailPhone, signed, appStore.wantRushSupport)

  if(!isValidEmailPhone) {
    alert('invalid email or phone nubmer!')
    return
  }

  if(isValidEmailPhone && !signed && appStore.wantRushSupport == 'yes' && appStore.isPositive) {
    alert('Please sign the consent!')
    return
  }
  formData.sms_email = getPreferredMethod(formData.prefEmail, formData.prefSms)
  formData.group_name = 'HECAP_SDOH_SURVEY'
  formData.phone = formatPhoneNumber(formData.phone)
  formData.signature = appStore.signature
  formData.wantUpcomingProgram = appStore.wantUpcomingProgram
  formData.wantRushSupport = appStore.wantRushSupport
  formData.reasonRushOffer = appStore.reasonRushOffer
  formData.reasonShareInfo = appStore.reasonShareInfo
  formData.surveyAnswers = appStore.surveyAnswers
  formData.demographyData = appStore.demographyData
  
  console.log("=====submitProfile:", formData)
  await submitRushSurvey(formData)
  router.push({path: '/end'})

}

function resetUserData() {
  let userData = {
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
  appStore.setUserData(userData)
  appStore.setSignature('')
  //appStore.setIsAgeConfirmed(false)
  appStore.setShowCloseButton(false)
  appStore.setShowUserData(false)
}
onMounted(() => {
  resetUserData() 
});
</script>

<style scoped>
.row_margin {
  margin-top: 2px;
  margin-bottom: 12px;
  margin-left: 12px;
  margin-right: 12px;
}
.button_wrapper {
  width: 95%;
  margin: 0 auto;
}
</style>
