<script setup lang="ts">
import {newPatient} from '@/services/patients';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/index'

const router = useRouter();
const authStore = useAuthStore()

const props = defineProps({
    title: String,
    class:String
});

const showNewPatientForm = ref(false);
const showNewPatientButton = ref(false);

const givenName = ref('')
const familyName = ref('')
const email = ref('')
const phone = ref('')
const mrn = ref('')
const fhirid = ref('')

const buttonText = ref('Add New Patient');

async function toggleForm() {
  showNewPatientForm.value = !showNewPatientForm.value;
  buttonText.value = showNewPatientForm.value ? 'Close Form' : 'Add New Patient';
}

async function submitNewPatient(){
  // Validate form data (optional)
  if (!givenName || !familyName) {
    alert('Please enter both first and last name.');
    return;
  }
  let currentRoutePath = router.currentRoute.value.path
  //let apiAccessToken = await authStore.getApiAccessToken()
  //authStore.setAccessToken(apiAccessToken)
  let payload = {
    "givenName": givenName.value,
    "familyName": familyName.value,
    "email": email.value,
    "phone": phone.value,
    "MRN": mrn.value,
    "fhirid": fhirid.value,
  }
  await newPatient(currentRoutePath, payload)
  
  showNewPatientForm.value = false;
  buttonText.value = 'Add New Patient';
};

onMounted(async () => {
  let currentRoutePath = router.currentRoute.value.path
  if(currentRoutePath == '/ui/c24'){
    showNewPatientButton.value = true;
  }
  let apiAccessToken = await authStore.getApiAccessToken()
  authStore.setAccessToken(apiAccessToken)
});

</script>

// ===============================|| Ui Parent Card||=============================== //
<template>
  <div>
    <v-card elevation="10" class="withbg">
        <v-card-item class="pa-0">
            <div class="d-sm-flex align-center justify-space-between">
                <h5 class="text-h5 mb-6 pl-7 pt-7">{{ title }}</h5>
                <v-btn v-if="showNewPatientButton" class="ma-2" rounded="md" outlined color="primary" prepend-icon="mdi-check-circle" :label="buttonText" @click="toggleForm">
                  {{ buttonText }}
                </v-btn>
            </div>
        </v-card-item>
        <div id="newPatientInfo" v-if="showNewPatientForm">
          <v-form >
  <v-row>
    <v-col cols="6">
      <v-text-field label="Given Name"  v-model="givenName" />
    </v-col>
    <v-col cols="6">
      <v-text-field label="Family Name"  v-model="familyName" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="6">
      <v-text-field label="email"  v-model="email" />
    </v-col>
    <v-col cols="6">
      <v-text-field label="phone"  v-model="phone" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="6">
      <v-text-field label="MRN"  v-model="mrn" />
    </v-col>
    <v-col cols="6">
      <v-text-field label="FHIRID"  v-model="fhirid" />
    </v-col>
  </v-row>
  <v-row>
    <v-spacer></v-spacer>  <v-col cols="auto">
      <v-btn class="ma-2" rounded="md" outlined color="primary" prepend-icon="mdi-check-circle" @click="submitNewPatient">
        Submit Patient
      </v-btn>
    </v-col>
  </v-row>
</v-form>
      </div>
        <slot />
    </v-card>

  </div>
</template>
