<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
import {allPatientList, patientSearch, updatePatientStatus} from '@/services/patients';
import { toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/index'

const router = useRouter();
const authStore = useAuthStore()

const patients = ref()
const givenname = ref()
const familyname = ref()
const nameRules = ref()
const dialogVisible = ref()
const isEmailSmsDisabled = ref(false)
//const selectedDistributMethod = ref('')
const selectedEmailSms = ref<Array<string | null>>(Array(10).fill(null));
var selectedPatient = ref()
var selectedItems: any[] = []
//let ex = true
function isBlank(variable: any) {
    return (
        !variable ||
        variable === null ||
        variable === undefined ||
        (typeof variable === 'string' && variable.trim() === '') ||
        (typeof variable === 'string' && variable === 'undefined') ||
        (typeof variable === 'string' && variable === 'null')
      );
}

async function defaultSearch() {
  //let apiAccessToken = await authStore.getApiAccessToken()
  //authStore.setAccessToken(apiAccessToken)
  let currentRoutePath = router.currentRoute.value.path
  if(currentRoutePath == '/ui/c24') {
    patients.value = await allPatientList('c24')
  } else if(currentRoutePath == '/ui/qualtrics') {
    patients.value = await allPatientList('qualtrics')
  }
  //console.log("===deafultSearch:", patients.value)
  //for (let item of patients.value) {
  for (let i=0; i < patients.value.length; i++) {
    let item = patients.value[i]
    if(item && item.status){
      item.selected = true
    } else {
      item.selected = false
    }
    if(item && !isBlank(item.sms_email)){
      selectedEmailSms.value[i] = item.sms_email
    } else {
      if(item && !isBlank(item.pref_mobile)){
        selectedEmailSms.value[i] = "SMS"
      } else if(item && !isBlank(item.pref_email)){
        selectedEmailSms.value[i] = "Email"
      }else {
        selectedEmailSms.value[i] = ""
      }

    }
  }
}

async function search() {
  //console.log("===patientSearch", givenname.value, familyname.value)
  let searchResults = await patientSearch('c24', givenname.value, familyname.value)
  patients.value = searchResults
  //console.log("===patientSearchResults", patients.value)
} 

function isOnboarded(status: any) {
  let displayStatus = false
  if(status && (status.includes("Processing") || status.includes("Onboard"))) {
    displayStatus = true
  } 
  //console.log("===isOnboarded:", status, displayStatus)
  return displayStatus
}
async function onboarding() {
    let patient = selectedPatient.value
    if (patient.id[0] && patient.MRN && patient.sms_email) {
      let res = await updatePatientStatus(patient, patient.sms_email)
    }else{
      console.log("===onboarding:selectedItem has empty patientDimId or patientMrn!")
      return
    }
  await defaultSearch()
  closeDialog()
}

function updateSelectedItems(item: any) {
  const actualItem = toRaw(item); // Access the underlying object from the proxy
  item.selected = true
  if (item.selected) {
    selectedItems.push(actualItem);
  } else {
    const index = selectedItems.findIndex((selectedItem) => selectedItem.id === actualItem.id);
    if (index > -1) {
      selectedItems.splice(index, 1);
    }
  }
  //console.log("====clicked:updateSelectedItems:selectedItems", selectedItems)
}

function formatPhoneNumber(phone: any) {
  if (phone) {
    phone = "1-" + phone
    return phone.replace(/-/g, "&#8209;");
  } else {
    return ""
  }
}

function openDialog(item: any, index: any) {
  dialogVisible.value = true
  item.sms_email = selectedEmailSms.value[index]
  selectedPatient.value = item
  console.log("===open dialog: ", selectedPatient.value, item)
}

function closeDialog() {
  dialogVisible.value = false
}

onMounted(async () => {
  // Actions to perform when the component is mounted
  dialogVisible.value = false
  selectedPatient.value = {
    "givenName": "",
    "familyName": ""
  }
  let apiAccessToken = await authStore.getApiAccessToken()
  authStore.setAccessToken(apiAccessToken)
  defaultSearch()
});
</script>

<template>
  <div class="text-left">
    <v-form >
    <v-container>
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field v-model="givenname" :rules="nameRules" :counter="20"
            label="Given Name" required></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field v-model="familyname" :rules="nameRules" :counter="20"
            label="Family Name" required></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-row>
    <v-col cols="7" md="3">
      <v-btn class="ma-2" rounded="md" outlined color="primary" prepend-icon="mdi-check-circle" @click="search">
        Search
      </v-btn>
    </v-col>
    <v-col cols="7" md="4">
      <v-btn class="ma-2" rounded="md" outlined color="primary" prepend-icon="mdi-check-circle" @click="defaultSearch">
        Default Search
      </v-btn>
    </v-col>
  </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
  </div>
  <div class="table-container">
    <v-table theme="light" fixed-header height="480px" wigth=" ">
    <thead>
      <tr> 
        <th class="text-left"> Status </th> 
        <th class="text-left"> First Name </th>
        <th class="text-left"> Last Name </th>
        <th class="text-left"> Phone </th>
        <th class="text-left"> Email </th>
        <th class="text-left"> MRN </th>
        <th class="text-left"> FHIR ID </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in patients" :key="item.MRN">
        <td>
          <span>{{ item.Status }}</span>
        </td>
        <td>{{ item.LastName }}</td>
        <td>{{ item.FirstName}}</td>
        <td>{{ item.Phone}}</td>
        <td>{{ item.Email }}</td>
        <td>{{ item.MRN }}</td>
        <td>{{ item.FHIRID }}</td>
      </tr>
    </tbody>
  </v-table>
  </div>
  <div>
    <v-dialog v-model="dialogVisible" max-width="650px">
      <v-card>
        <!-- <v-card-title>
          <span class="headline">Please confirm: </span>
        </v-card-title> -->
        <v-card-text>
          <div v-if="!isBlank(selectedPatient.sms_email)">
            {{selectedPatient.givenName}} {{selectedPatient.familyName}}'s profile will be registered at Qualtrics Survey Application
          </div>
          <div v-if="!isBlank(selectedPatient.sms_email)">
            The survey will be sent through <b>{{selectedPatient.sms_email}}</b>
          </div>
          <div v-else>
            Please select a communication method to send the survey, either Email or SMS.
          </div>
          <!-- <v-radio-group v-model="selectedDistributMethod">
          <v-radio label="Email"  value="Email"></v-radio>
          <v-radio label="SMS"  value="SMS"></v-radio>
        </v-radio-group> -->
        </v-card-text>
        <v-card-actions>
          <div v-if="!isBlank(selectedPatient.sms_email)">
          <v-btn color="primary" text @click="onboarding">Confirm</v-btn>
        </div>
          <v-btn color="primary" text @click="closeDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style>
.table-container {
  height: 500px; /* Set the desired height here */
  width: auto;
  overflow-y: auto;
  overflow-x: auto;
}
.icon {
  font-size: 50px;
}
</style>
