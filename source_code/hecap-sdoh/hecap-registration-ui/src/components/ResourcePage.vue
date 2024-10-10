<template>
  <v-container class="fill-height" >
    <v-responsive class="align-center fill-height">
      <v-sheet max-width="900" class="mx-auto" style="padding-top: 1px;">  
      <v-row class="d-flex row_margin">
        <v-card id="negativeSurvey" v-if="!showPositiveInfo" height="98%" variant="outlined" >
          <v-card-text class="pa-3" >
          <div class="text-h6 rush_text_spacing">
            <b>Thank you for Completing the Survey! </b>
          </div>
          <div class="font-weight-medium rush_text_spacing">
            Your participation is invaluable and greatly appreciated. You, or someone you know, may need additional support.
          </div>
          <div class="font-weight-medium rush_text_spacing">
            <a href="#" @click.prevent="openPdf">“Click here”</a> to see additional resources for any immediate needs. 
          </div>
          <div class="font-weight-medium rush_text_spacing">
            For additional support related to your social needs from the Rush Social Care Provider Team, please call (800) 757-0202.
          </div>
          <div class="font-weight-medium rush_text_spacing">
            Your participation is crucial in advancing our understanding of social determinants of health and shaping future research initiatives. If you have any questions about the program, please feel free to reach out to us at hecap@rush.edu. 
          </div>
          <v-btn block class="mt-2" @click="back" >Close and go back to homepage</v-btn>
          <PopupComponent v-model:isOpen="dialogOpen" :pdfUrl="pdfUrlPath"/>
          </v-card-text>
        </v-card>

        <v-card id="positiveSurvey" v-if="showPositiveInfo" height="98%" variant="outlined">
          <v-card-text class="pa-3" >
          <div class="text-h6 rush_text_spacing">
            <b>Thank you for Completing the Survey! </b>
          </div>
          <div class="font-weight-medium rush_text_spacing">
            Your participation is invaluable and greatly appreciated. You, or someone you know, may need additional support.
          </div>
          <div class="font-weight-medium rush_text_spacing">
            <a href="#" @click.prevent="openPdf">"Click here"</a> to see additional resources for any immediate needs. 
          </div>
          <PopupComponent v-model:isOpen="dialogOpen" :pdfUrl="pdfUrlPath"/>
          <div class="font-weight-medium rush_text_spacing">
            For additional support related to your social needs from the Rush Social Care Provider Team, please call (800) 757-0202.
          </div>
          <div class="font-weight-medium rush_text_spacing">
            Your participation is crucial in advancing our understanding of social determinants of health and shaping future research initiatives. If you have any questions about the program, please feel free to reach out to us at hecap@rush.edu. 
          </div>
          <v-btn block class="mt-2" @click="back" >Close and go back to homepage</v-btn>
          </v-card-text>
        </v-card>
      </v-row>
      </v-sheet>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import router from "@/router";
import {useAppStore} from '@/store/app';
import PopupComponent from '@/components/Popup.vue'
const appStore = useAppStore()
const showPositiveInfo = appStore.showPositiveInfo
const wantRushSupport = ref()
const wantUpcomingProgram = ref()
const reasonRushOffer = ref()

const pdfUrlPath = ref("Rush_Resource_NowPow.pdf")
const dialogOpen = ref(false)
async function openPdf() {
  dialogOpen.value = true
}
async function selectShareData(){
  //console.log("===selectShareData: values:", wantRushSupport.value, wantUpcomingProgram.value, 
  //appStore.isAgeConfirmed, appStore.userData, appStore.surveyAnswers, appStore.demographyData)
  if(appStore.isPositive && wantRushSupport.value == 'yes' && wantUpcomingProgram.value == 'no') {
    appStore.setWantRushSupport('yes')
    appStore.setWantUpcomingProgram('no')
    appStore.setShowConsentForm(true)
    appStore.setShowUserData(true)
    // let payload = {
    //   "hecap_id":"SurveyOnly",
    //   "surveyAnswers": appStore.surveyAnswers
    // }
    //await submitRushSurvey(payload)
    //router.push({path: '/end'})
 }
  if(appStore.isPositive && wantRushSupport.value == 'yes' && wantUpcomingProgram.value == 'yes') {
    appStore.setWantRushSupport('yes')
    appStore.setWantUpcomingProgram('yes')
    appStore.setShowConsentForm(true)
    appStore.setShowUserData(true)
    // let payload = {
    //   "hecap_id":"SurveyOnly",
    //   "surveyAnswers": appStore.surveyAnswers
    // }
    //await submitRushSurvey(payload)
    //router.push({path: '/end'})
 }
 if (appStore.isPositive && wantRushSupport.value == 'no' && wantUpcomingProgram.value == 'no' ) {
    appStore.setWantRushSupport('no')
    appStore.setWantUpcomingProgram('no')
    router.push({path: '/end'})
 }
 if (appStore.isPositive && wantRushSupport.value == 'no' && wantUpcomingProgram.value == 'yes' ) {
    appStore.setWantRushSupport('no')  
    appStore.setWantUpcomingProgram('yes')
    appStore.setShowConsentForm(false)
    appStore.setShowContactInfoOnly(true)
    appStore.setShowUserData(true)
 }

 if(!appStore.isPositive && wantRushSupport.value == 'yes') {
    appStore.setWantRushSupport('yes')
    appStore.setShowConsentForm(false)
    appStore.setShowContactInfoOnly(true)
    appStore.setShowUserData(true)
 }

 if(!appStore.isPositive && wantRushSupport.value == 'no') {
    appStore.setWantRushSupport('no')
    appStore.setShowConsentForm(false)
    appStore.setShowUserData(false)
    router.push({path: '/end'})
 }

}

function inputReasonRushOffer(event: any) {
  appStore.setReasonRushOffer(event.target.value)
}

function back() {
  router.push({path: '/'})
}

</script>
<style scoped>
.row_margin {
  margin-top: 1px;
  margin-bottom: 12px;
  margin-left: 12px;
  margin-right: 12px;
}
.rush_text_spacing {
  margin-top: 0px;
  margin-bottom: 10px;
}
.rush_btn_center {
  display: flex;
  justify-content: center;
  align-items: center; /* For vertical centering as well */
}
.rush_wider-button {
  width: 150px;
  margin-top: 15px;
  margin-bottom: 5px;
}

</style>
