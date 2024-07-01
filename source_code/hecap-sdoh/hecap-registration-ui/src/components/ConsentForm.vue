<template>
  <v-container class="fill-height" >
    <v-responsive class="align-center fill-height">
      <v-row class="d-flex align-center row_margin" style="margin-top: 10px">
        <v-img height="50" src="@/assets/RUSH+Logo.png" />
      </v-row>
      <!-- <div class="py-14" /> -->
      <v-row class="d-flex row_margin">
        <v-card variant="plain" height="90%">
          <v-card-text height="100%">
          <div class="font-weight-medium">
            At Rush, we care about more than just your health. 
            Please complete the following questions for us to help connect you to any resources 
            that may be available.
          </div>
          <div class="font-weight-medium">
            This survey is completely optional and will not affect your care at Rush.
          </div>
          </v-card-text>
        </v-card>
      </v-row>
      <v-row class="d-flex row_margin">
        <v-card  variant="outlined" height="90%">
          <v-card-text>
            <div class="font-weight-medium">
            Please review the following consent summary. 
            The full consent is available to view here:
            <a href="https://redcap.rush.edu/redcap/surveys/?s=TTYXLFHNPH77EXFJ" target="_blank">
              https://redcap.rush.edu/redcap/surveys/?s=TTYXLFHNPH77EXFJ 
            </a>
          </div>
          </v-card-text>
          <v-card-text height="100%">
          <div class="font-weight-black text-center row_margin">
            Concise Consent Summary
          </div>
          <div class="font-weight-medium">
            The purpose of this study is to screen individuals for social determinants of health (SDOH) needs
using a standardized survey questionnaire. Our goal is to see if we can use email and text
messages to administer this survey.

You will be asked to complete a standardized SDOH needs survey, which should take less than
five minutes to complete. Your screening results will be viewable by the research team and
social workers at Rush. If you screen positive, a member of the social work and community
health team may contact you to help connect you with social resources in your community area.
You must be 18 years or older to participate in this study.

Research studies include some levels of risk to participants. In this study, there is ask of loss of
privacy, given that the survey will collect information related to you and your health. The
research team has strict protocols in place to prevent this from happening and protect your
personal information.

This survey is completely optional and will not affect your care at Rush or any other healthcare
system. Please read the information given. By signing below, you are consenting to participate in
this research studies. You do not waive any of your legal rights by signing this
consent/authorizations form. You will be given a signed copy of the full consent document

If you are interested in this study, please sign this consent and continue ahead to complete the
survey.
            <!-- <v-img style="width: 634px; height: 444px;" src="@/assets/hecap-consent.png"></v-img> -->
          </div>
        </v-card-text>
        </v-card>
      </v-row>
      <v-row class="d-flex">  
        <v-card  variant="plain" style="padding-left: 30px;" >
          <div style="display: flex;">
          <v-label style="padding-left: 10px;">Are you 18 years of age or older?</v-label>
          <v-card-text style="padding: 0;" >
            <div style="display: flex;">
            <v-checkbox v-model="isAgeConfirmed" @change="confirmAge" label="Yes" hide-details />
            <!-- <v-checkbox v-model="isAgeConfirmedNo" @change="confirmAgeNo" label="No" hide-details /> -->
          </div>
          </v-card-text>
        </div>
        </v-card>
      </v-row>
      <v-row class="d-flex row_margin">  
        <v-card  variant="plain" >
          <v-card-text style="padding-top: 0px;" >
          <div class="font-weight-medium">
            By signing below, you agree to consent for participation in this survey
          </div>
          </v-card-text>
        </v-card>
      </v-row>
      <v-row class="d-flex row_margin">
        <v-card  variant="plain" height="100%" width="90%">
         <SignatureComponent />
        </v-card>
      </v-row>
      <v-row class="d-flex row_margin">
        <v-btn block class="mt-2" @click="gotoProfilePage" :disabled="!isAgeConfirmed">Next</v-btn>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import SignatureComponent from "@/components/SignatureComponent.vue";
import router from "@/router";
import { useAppStore } from '@/store/app';
import { ref} from "vue";
const appStore = useAppStore()

const isAgeConfirmed = ref(false)
const isAgeConfirmedNo = ref(false)

function confirmAge () {
  //console.log("======confirmAge:isAgeConfirmed:", isAgeConfirmed.value)
  appStore.setIsAgeConfirmed(isAgeConfirmed.value)
}

function confirmAgeNo() {
  alert("You must over 18 years old to complete this form!")
}

function gotoProfilePage() {
  //const {signature} = useAppStore()
  //console.log("====logSignature:", useAppStore().signature)
  if (useAppStore().signature.includes('data:image')) {
    router.push({path: '/profile'})
  } else {
    alert("Please sign the consent to continue!")
  }
}
</script>
<style scoped>
.row_margin {
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 12px;
  margin-right: 12px;
}
</style>
