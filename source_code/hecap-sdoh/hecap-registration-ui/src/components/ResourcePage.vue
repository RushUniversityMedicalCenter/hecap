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
            Your participation is invaluable and greatly appreciated. You screened NEGATIVE but may have needs or know others with needs.
          </div>
          <div class="font-weight-medium rush_text_spacing">
            <a href="#" @click.prevent="openPdf">“Click here”</a> to see additional resources for any immediate needs. 
          </div>
          <PopupComponent v-model:isOpen="dialogOpen" :pdfUrl="pdfUrlPath"/>
          <div class="text-h6 rush_text_spacing">
            Would you be interested in staying connected and receiving updates about our upcoming programs?
          </div>
          </v-card-text>
          <v-card-text class="pa-3">
            <div class="rush_btn_center">
              <v-btn-toggle class="rush_btn_padding_top" v-model="wantRushSupport"  rounded="1" color="#00A66c" divided>
                <v-btn variant="outlined" value="yes" @click="selectShareData" class="rush_wider-button">Yes</v-btn>
                <v-btn variant="outlined" value="no" @click="selectShareData" class="rush_wider-button">No</v-btn>
              </v-btn-toggle>
            </div>
          </v-card-text>
        </v-card>

        <v-card id="positiveSurvey" v-if="showPositiveInfo" height="98%" variant="outlined">
          <v-card-text class="pa-3" >
          <div class="text-h6 rush_text_spacing">
            <b>Thank you for Completing the Survey! </b>
          </div>
          <div class="font-weight-medium rush_text_spacing">
            Your participation is invaluable and greatly appreciated. You screened POSITIVE and may have needs.
          </div>
          <div class="font-weight-medium rush_text_spacing">
            <a href="#" @click.prevent="openPdf">“Click here”</a> to see additional resources for any immediate needs. 
          </div>
          <PopupComponent v-model:isOpen="dialogOpen" :pdfUrl="pdfUrlPath"/>
          <div class="text-h6 rush_text_spacing">
            Q1: Would you like Rush to connect you with a social worker or community health worker for available support? 
          </div>
          <div class="font-weight-medium rush_text_spacing">
            Rush may connect you with a social worker or community health worker for the support available. If you would like to be connected, or included in future research, please click “Yes” to complete demographic and consent form. Click “No” to be exited.   
          </div>
          <div class="rush_btn_center">
              <v-btn-toggle class="rush_btn_padding_top" v-model="wantRushSupport"  rounded="1" color="#00A66c" divided>
                <v-btn variant="outlined" value="yes" @click="selectShareData" class="rush_wider-button">Yes</v-btn>
                <v-btn variant="outlined" value="no" @click="selectShareData" class="rush_wider-button">No</v-btn>
              </v-btn-toggle>
          </div>
          <div class="text-h6 rush_text_spacing">
            Q2: Would you be interested in receiving updates about our upcoming programs? 
          </div>
          <div class="rush_btn_center">
              <v-btn-toggle class="rush_btn_padding_top" v-model="wantUpcomingProgram"  rounded="1" color="#00A66c" divided>
                <v-btn variant="outlined" value="yes" @click="selectShareData" class="rush_wider-button">Yes</v-btn>
                <v-btn variant="outlined" value="no" @click="selectShareData" class="rush_wider-button">No</v-btn>
              </v-btn-toggle>
          </div>
          </v-card-text>
 
          <v-card-text class="pa-3">
            <div class="text-h6 rush_text_spacing">
              Q3:Are there any that factors influenced your decision to permit or decline Rush's offer to connect you with support?
            </div>
           
            <div>
              <v-textarea v-model="reasonRushOffer" label=""  row-height="20" rows="2"  @input="inputReasonRushOffer"></v-textarea>
            </div>
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
