<template>
  <v-container class="fill-height" >
    <v-responsive class="align-center fill-height">
      <v-sheet max-width="900" class="mx-auto">  
      <v-row class="d-flex row_margin">
        <v-card  variant="outlined" height="90%">
          <v-card-text>
            <div class="font-weight-medium">
              Thank you for your interest. Please fill out the consent and demographic form to enroll in the program. Your information will be kept confidential and will not be shared with any third parties.
          </div>
          </v-card-text>
          <v-card-text height="100%">
          <div class="font-weight-black text-center row_margin">
            Summary Consent: 
          </div>
          <div class="font-weight-medium">
            The purpose of this program to pilot a screening program aimed at gauging community interest in accessing social resources online and willingness to share information, potentially facilitating connections to both clinical and social support services that are available.  
          </div>
          <div class="font-weight-medium">
            You have completed a standard survey about your health. Responses will be viewed by researchers and clinical providers at Rush. If you screen positive for any SDOH needs and would like to talk to a community health worker, a Rush team member will reach out to help connect you with resources.  
          </div>
          <div class="font-weight-medium">
            By providing your demographic information and consent, you agree to be contacted by the Rush team. Your information will be securely stored and will not be shared with any third parties. A copy of the full consent is available to view here: link. 
          </div>
        </v-card-text>
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
      </v-sheet>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import SignatureComponent from "@/components/SignatureComponent.vue";
//import router from "@/router";
import { useAppStore } from '@/store/app';
import { ref} from "vue";
const appStore = useAppStore()

const isAgeConfirmed = ref(false)
//const isAgeConfirmedNo = ref(false)

function confirmAge () {
  //console.log("======confirmAge:isAgeConfirmed:", isAgeConfirmed.value)
  if(!isAgeConfirmed.value) {
    //appStore.setSubmitDisabled(true)
  }
  appStore.setIsAgeConfirmed(isAgeConfirmed.value)
}

// function confirmAgeNo() {
//   alert("You must over 18 years old to complete this form!")
// }

// function gotoProfilePage() {
//   //const {signature} = useAppStore()
//   //console.log("====logSignature:", useAppStore().signature)
//   if (useAppStore().signature.includes('data:image')) {
//     router.push({path: '/profile'})
//   } else {
//     alert("Please sign the consent to continue!")
//   }
// }
</script>
<style scoped>
.row_margin {
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 12px;
  margin-right: 12px;
}
</style>
