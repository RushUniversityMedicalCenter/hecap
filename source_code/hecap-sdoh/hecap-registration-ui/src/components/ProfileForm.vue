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
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import router from "@/router";
import { onMounted, computed } from "vue";
import { useAppStore } from '@/store/app';
import {submitRushSurvey} from "@/services/submitSurvey";
//import ConsentFormSimple from '@/components/ConsentFormSimple.vue'
import ResourcePage from '@/components/ResourcePage.vue'

const appStore = useAppStore()

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
