<template>
  <v-container class="" >
    <v-responsive class="align-center">
      <v-row class="d-flex align-center row_margin" style="margin-top: 10px">
        <v-col cols="2">
          <v-img height="35" src="@/assets/RUSH+Logo.png" />
        </v-col>
        <v-col cols="10">
          <div class="rush_color text-h4">Community Screening for Social Resources</div>
        </v-col>
      </v-row>
      <!-- <div class="py-14" /> -->
      <v-row class="d-flex row_margin">
        <v-card variant="plain" height="90%">
          <v-card-text class="pa-3" height="100%">
          <div class="font-weight-medium">
            We invite you to take a quick survey to help us understand if you have any social needs that might affect your health, like food, housing, or employment. After completing the survey, you’ll receive a list of helpful Rush resources and contact information for our social care team.  
            <br><br>Our goal is to see if using online surveys is an effective and affordable way to screen for health-related social needs in the community.
            <br><br>Please review the <a href="#" @click.prevent="openInfoSheet">"Rush Information Sheet"</a> for more details about the study. By completing the survey, you agree to participate in this research.
          </div>
          <PopupComponent v-model:isOpen="dialogOpen" :pdfUrl="pdfUrlPath"/>
          </v-card-text>
        </v-card>
      </v-row>
      <v-row class="d-flex row_margin">
        <v-card  height="70%">
          <v-card-text class="pa-3">
            <div class="font-weight-medium"> 
              1. Currently or within the past 3 months, have you worried your food would run out before you had money to buy more?
            </div>
            <div>
              <v-btn-toggle class="rush_btn_padding_top" v-model="answer1" rounded="1" color="#00A66c" divided>
                <v-btn variant="outlined" value="yes">Yes</v-btn>
                <v-btn variant="outlined" value="no">No</v-btn>
              </v-btn-toggle>
            </div>
          </v-card-text>
        </v-card>
      </v-row>
      <v-row class="d-flex row_margin">
        <v-card   height="90%">
          <v-card-text class="pa-3">
            <div class="font-weight-medium"> 
              2. Within the past 12 months, have you run out of food or been unable to get more?
            </div>
            <div>
              <v-btn-toggle class="rush_btn_padding_top" v-model="answer2" rounded="1" color="#00A66c" divided>
                <v-btn variant="outlined" value="yes">Yes</v-btn>
                <v-btn variant="outlined" value="no">No</v-btn>
              </v-btn-toggle>
            </div>
          </v-card-text>
        </v-card>
      </v-row>
      <v-row class="d-flex row_margin">
        <v-card   height="90%">
          <v-card-text class="pa-3">
            <div class="font-weight-medium"> 
              3. Are you currently without housing?
            </div>
            <div>
              <v-btn-toggle class="rush_btn_padding_top" v-model="answer3" rounded="1" color="#00A66c" divided>
                <v-btn variant="outlined" value="yes">Yes</v-btn>
                <v-btn variant="outlined" value="no">No</v-btn>
              </v-btn-toggle>
            </div>
          </v-card-text>
        </v-card>
      </v-row>
      <v-row class="d-flex row_margin">
        <v-card   height="90%">
          <v-card-text class="pa-3">
            <div class="font-weight-medium"> 
              4. Are you currently worried about losing your housing?
            </div>
            <div>
              <v-btn-toggle class="rush_btn_padding_top" v-model="answer4" rounded="1" color="#00A66c" divided>
                <v-btn variant="outlined" value="yes">Yes</v-btn>
                <v-btn variant="outlined" value="no">No</v-btn>
              </v-btn-toggle>
            </div>
          </v-card-text>
        </v-card>
      </v-row>
      <v-row class="d-flex row_margin">
        <v-card   height="90%">
          <v-card-text class="pa-3">
            <div class="font-weight-medium"> 
              5. Currently or within the past 3 months, has lack of transportation kept you from medical appointments, getting food or medicine, or providing care to a family member?​
            </div>
            <div>
              <v-btn-toggle class="rush_btn_padding_top" v-model="answer5" rounded="1" color="#00A66c" divided>
                <v-btn variant="outlined" value="yes">Yes</v-btn>
                <v-btn variant="outlined" value="no">No</v-btn>
              </v-btn-toggle>
            </div>
          </v-card-text>
        </v-card>
      </v-row>
      <v-row class="d-flex row_margin">
        <v-card   height="90%">
          <v-card-text class="pa-3">
            <div class="font-weight-medium"> 
              6. Currently or within the past 12 months, have you or household members gone without utilities (heat, water, electricity)?​
            </div>
            <div>
              <v-btn-toggle class="rush_btn_padding_top" v-model="answer6" rounded="1" color="#00A66c" divided>
                <v-btn variant="outlined" value="yes">Yes</v-btn>
                <v-btn variant="outlined" value="no">No</v-btn>
              </v-btn-toggle>
            </div>
          </v-card-text>
        </v-card>
      </v-row>
      <v-row class="d-flex row_margin">
        <v-card   height="90%">
          <v-card-text class="pa-3">
            <div class="font-weight-medium"> 
              7. Are you currently unemployed?
            </div>
            <div>
              <v-btn-toggle class="rush_btn_padding_top" v-model="answer7" rounded="1" color="#00A66c" divided>
                <v-btn variant="outlined" value="yes">Yes</v-btn>
                <v-btn variant="outlined" value="no">No</v-btn>
              </v-btn-toggle>
            </div>
          </v-card-text>
        </v-card>
      </v-row>
      <v-row class="d-flex row_margin">
        <v-card   height="90%" width="80%">
          <v-card-text class="pa-3">
            <div class="font-weight-medium" > 
              Are there any factors that influenced your decision to share or not share your information? 
            </div>
            <div>
              <v-textarea  v-model="reasonNotShareInfo" label=""  row-height="20" rows="2"></v-textarea>
            </div>
          </v-card-text>
        </v-card>
      </v-row>
      <v-row class="d-flex row_margin">
    <v-card height="98%" width="80%" variant="outlined">
      <v-row>
        <v-col cols="6">
          <v-select
            v-model="age"
            :items="ageOptions"
            label="Age*"
            required
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="gender"
            :items="genderOptions"
            label="Gender*"
            required
            hide-details
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-select
            v-model="ethnicity"
            :items="ethnicityOptions"
            label="Ethnicity*"
            required
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="race"
            :items="raceOptions"
            label="Race*"
            required
            hide-details
          ></v-select>
        </v-col>
      </v-row>
    </v-card>
  </v-row>
      <v-row class="d-flex row_margin">
        <div v-if="validationWarning">
    <p v-html="validationWarning"></p>
  </div>
      </v-row>
      <v-row class="d-flex row_margin">
        <v-btn block class="mt-2" @click="submitSurvey" :disabled="isSubmitting || isSubmitted">Submit</v-btn>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import router from "@/router";
import { useAppStore } from '@/store/app';
import { ref, onMounted} from "vue";
import {submitRushSurvey} from "@/services/submitSurvey";
import PopupComponent from '@/components/Popup.vue'
const appStore = useAppStore()

const age = ref()
const gender = ref()
const zipcode = ref()
const ethnicity = ref()
const race = ref()
const validationWarning = ref()

const genderOptions = ['Female', 'Male', 'Non-Binary', "Prefer not to say"]
const ageOptions = ['18-33', '34-48', '49-63', '64-78', '78+']
const raceOptions = ['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Native Hawaiian or Other Pacific Islander', 'White']
const ethnicityOptions = ['Hispanic or Latino', 'Not Hispanic or Latino']

const answer1 = ref()
const answer2 = ref()
const answer3 = ref()
const answer4 = ref()
const answer5 = ref()
const answer6 = ref()
const answer7 = ref()
const reasonNotShareInfo = ref()

function validateDemographyForm() {
  //console.log("===validate: age.value:", age.value, appStore.isAgeConfirmed)
  let emptyFields = []
  if (age.value == null) {
    emptyFields.push("Age")
    appStore.setIsAgeConfirmed(false)
    //console.log("====appStore.isAgeConfirmed.false", appStore.isAgeConfirmed)
  } else {
    appStore.setIsAgeConfirmed(true)
    //console.log("====appStore.isAgeConfirmed.true", appStore.isAgeConfirmed)
  }
  if (gender.value == null) {
    emptyFields.push("Gender")
  }
  if (ethnicity.value == null) {
    emptyFields.push("Ethnicity")
  }
  if (race.value == null) {
    emptyFields.push("Race")
  }
  if (emptyFields.length > 0) {
    validationWarning.value = `The following fields can not be empty: <b style="color: red;"> ${emptyFields} </b>`
    return false
  }
  return true
}

function validateAnswers(answers: any) {
  let countYes = 0
  for(let key in answers) {
    if (answers[key] == 'yes') {
      countYes = countYes + 1
    } 
  }
  if(countYes >= 2) {
    return true
  } else {
    return false
  }
}

const isSubmitting = ref(false)
const isSubmitted = ref(false)


async function submitSurvey() {
  if (isSubmitting.value || isSubmitted.value) return
  isSubmitting.value = true
  try {
    let answers = {
      'answer1': answer1.value || '',
      'answer2': answer2.value || '',
      'answer3': answer3.value || '',
      'answer4': answer4.value || '',
      'answer5': answer5.value || '',
      'answer6': answer6.value || '',
      'answer7': answer7.value || '',
      'answer8': reasonNotShareInfo.value || '',
    }
    let demographyData = {
      "age": age.value,
      "gender": gender.value,
      "zipcode": zipcode.value,
      "ethnicity": ethnicity.value,
      "race": race.value
    }
    appStore.setSurveyAnswers(answers)
    appStore.setReasonShareInfo(reasonNotShareInfo.value)
    appStore.setDemographyData(demographyData)
    appStore.setShowCloseButton(false)
    appStore.setShowUserData(false)
    if (!validateDemographyForm()) {
      return
    }
    if (validateAnswers(answers)) {
      appStore.setIsPositive(true)
      appStore.setShowPositiveInfo(true)
    } else {
      appStore.setIsPositive(false)
      appStore.setShowCloseButton(false)
    }
    let formData = appStore.userData
    formData.hecap_id = "SurveyOnly"
    formData.group_name = 'HECAP_SDOH_SURVEY'
    formData.surveyAnswers = appStore.surveyAnswers
    formData.reasonShareInfo = appStore.reasonShareInfo
    formData.demographyData = appStore.demographyData
    
    let res =  await submitRushSurvey(formData)
    if(res == 0) {
      isSubmitted.value = false
      console.log("Please try again.")
    } else {
      isSubmitted.value = true
      router.push({path: '/profile'})
    }
  } catch(error) {
    isSubmitted.value = false
  } finally {
    isSubmitting.value = false
  }

}

function initGlobalConfig() {
  appStore.setIsPositive(false)
  appStore.setWantRushSupport('no')
  appStore.setWantUpcomingProgram('no')
  appStore.setIsAgeConfirmed(false)
  appStore.setShowPositiveInfo(false)
  appStore.setShowUserData(false)
  appStore.setShowUserDataSubmitButton(false)
  appStore.setShowConsentForm(false)
  appStore.setShowCloseButton(false)
  appStore.setSurveyAnswers({})
  appStore.setSignature('')
  appStore.setUserData({})
}

const pdfUrlPath = ref("HECAP_Information Sheet_Clean_9924.pdf")
const dialogOpen = ref(false)
function openInfoSheet() {
  dialogOpen.value = true
}

onMounted(() => {
  initGlobalConfig()
});
</script>

<style scoped>
.row_margin {
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 12px;
  margin-right: 12px;
}
.rush_color {
  color: #00A66c;
}
.rush_btn_padding_top {
  padding-top: 10px;
}
.v-btn-group--density-default.v-btn-group {
  height: 35px;
}
.mycontainer {
  position: absolute;
  z-index: 100;
}
</style>
