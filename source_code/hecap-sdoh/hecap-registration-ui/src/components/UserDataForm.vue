<template>
  <v-container class="fill-height">
    <v-responsive class="align-center fill-height">
      <v-sheet max-width="900" class="mx-auto" style="padding-top: 1px;">  
      <v-row class="d-flex align-center" style="max-width: 900px;">
        <v-col>
        <div v-if="showContactInfoOnly" style="display: flex; margin-bottom: 10px;">
          <v-card  height="98%" variant="outlined">
            <v-card-text class="pa-3" >
            <v-label class="text-wrap font-weight-bold">Thank you for your interest. Please fill out the contact information form to stay connected and be contacted for future programs. Your information will be kept confidential and will not be shared with any third parties.</v-label>
          </v-card-text>
        </v-card>
      </div>
        <v-card  height="98%" variant="outlined">
          <div v-if="showAge">
            <v-label>You must be 18 years or older to participate in this study.</v-label>
            <v-text-field v-model="birthdate"  type="date" @change="onChangeBirthdate"
            :rules="birthdateRules" label="Date of Birth (MM/DD/YYY)"
            hide-details required></v-text-field>
          </div>
            <v-text-field  v-model="firstname" @change="onChangeFirstName"
              :rules="nameRules" :counter="50" hide-details
              label="First Name" required></v-text-field>
            <v-text-field v-model="lastname" @change="onChangeLastName"
              :rules="nameRules" :counter="50" hide-details
              label="Last Name"  required></v-text-field>
            </v-card>
            <v-card  height="98%" variant="outlined" style="margin-top: 10px;">
            <div style="display: flex; margin-left: 15px;">
                <v-label>Do you want to hear from us by email or by text message?</v-label>
                <v-checkbox v-model="prefEmail" label="Email" value="Email" @change="onCheckEmail"
                    hide-details style="margin-left: 20px;"></v-checkbox>
                <v-checkbox v-model="prefSms" label="Text Message" value="Sms" @change="onCheckSms" 
                    hide-details></v-checkbox>
            </div>
            <v-text-field v-model="email" @change="onChangeEmail" ref="emailField"
              :rules="emailRules" label="E-mail"  hide-details></v-text-field>
            <v-text-field v-model="phone" @change="onChangePhone" ref="phoneField"
                :rules="phoneRules" label="Phone Number (##########)" hide-details></v-text-field>
            </v-card>
      </v-col>
      </v-row>
      </v-sheet>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useAppStore } from '@/store/app';

const appStore = useAppStore()
const firstname = ref()
const lastname = ref()
const birthdate = ref()

const phone = ref()
const email = ref()
const prefEmail = ref()
const prefSms = ref()
const emailField = ref()
const phoneField = ref()

const showContactInfoOnly = appStore.showContactInfoOnly
const showAge = computed(() => {
  if (appStore.isPositive && appStore.isAgeConfirmed) {
    return true
  } else {
    return false
  }
})  

const birthdateRules = [
  (value: string | null) => !!value || 'Date of birth is required',
  (value: string | null) => {
    if (!value) return true; // If birthdate is not provided, let the required rule handle it
    const today = new Date();
    const birthDateInput = new Date(value);
    let age = today.getFullYear() - birthDateInput.getFullYear();
    //console.log("===age0:", age)
    const monthDiff = today.getMonth() - birthDateInput.getMonth();
    //console.log("===monthDiff:", monthDiff)
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateInput.getDate())) {
      age--;
    }
    //console.log("===age1:", age)

    return age >= 18 || 'You must be at least 18 years old';
  }
];

function ageConfirm(birthdate: any) {
  const today = new Date();
    const birthDateInput = new Date(birthdate);
    let age = today.getFullYear() - birthDateInput.getFullYear();
    //console.log("===age0:", age)
    const monthDiff = today.getMonth() - birthDateInput.getMonth();
    //console.log("===monthDiff:", monthDiff)
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateInput.getDate())) {
      age--;
    }
    //console.log("===age1:", age)

    return age >= 18 || false;
}
const nameRules = [
  (v: string) => !!v || 'Field is required'
];

const phoneRules = computed(() => {
  if (prefSms.value === 'Sms') {
    return [
    (v: string) => !!v || 'Phone number is required',
    (v: string) => !v || /^[0-9]{10}$/.test(v) || 'Phone number must be in the format ##########'
    ]
  } else {
    return [
      (v: string) => !v || /^[0-9]{10}$/.test(v) || 'Phone number must be in the format ##########'
    ]
  }
})

const emailRules = computed(() => {
  if (prefEmail.value === 'Email') {
    return [
      (v: string) => !!v || 'Email is required',
      (v: string) => /\S+@\S+\.\S+/.test(v) || 'Invalid email address'
    ]
  } else {
    return [
      (v: string) => !v || /\S+@\S+\.\S+/.test(v) || 'Invalid email address'
    ]
  }
})

function onChangeBirthdate() {
 // console.log("====birthdate:", event.target.value, birthdate.value)
  if (ageConfirm(birthdate.value)) {
  let userData = appStore.userData
    userData.birthdate = birthdate.value
    appStore.setIsAgeConfirmed(true)
    appStore.setUserData(userData)
  }
}
function onChangeFirstName() {
  //console.log("====firstName:", event.target.value, firstname.value)
  let userData = appStore.userData
    userData.firstname = firstname.value
    appStore.setUserData(userData)
}
function onChangeLastName() {
  //console.log("====lastName:", event.target.value, lastname.value)
  let userData = appStore.userData
    userData.lastname = lastname.value
    appStore.setUserData(userData)
}
function onCheckEmail() {
  let userData = appStore.userData
  userData.prefEmail = prefEmail.value
  appStore.setUserData(userData)
  emailField.value.focus()
}

function onCheckSms() {
  let userData = appStore.userData
  userData.prefSms = prefSms.value
  appStore.setUserData(userData)
  phoneField.value.focus()
}

function onChangeEmail() {
  let userData = appStore.userData
    userData.email = email.value
    appStore.setUserData(userData)
}

function onChangePhone() {
  let userData = appStore.userData
    userData.phone = phone.value
    appStore.setUserData(userData)
}

function initUserData() {
  let userData = {
      "hecap_id": "C1234567", 
      "firstname": "", 
      "lastname": "", 
      "email": "",
      "phone": "",
      "birthdate": "",
      "signature": "",
      "prefEmail": "",
      "prefSms": "",
      "surveyAnswers": {},
    }
  appStore.setUserData(userData)
  //appStore.setSignature('')
  //appStore.setIsAgeConfirmed(false)
  //appStore.setShowCloseButton(false)
  //appStore.setShowUserData(false)
}

onMounted(() => {
  //initUserData()
});
</script>

<style scoped>
canvas {
  border: 1px solid #ccc;
  max-width: 100%; /* Make the canvas responsive */
  width: auto;
  height: auto;
}
.row_margin {
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 12px;
  margin-right: 12px;
}

.button_wrapper {
  width: 80%;
  margin: 0 auto;
}

.rush_col {
  max-width: 900px;
}
</style>
