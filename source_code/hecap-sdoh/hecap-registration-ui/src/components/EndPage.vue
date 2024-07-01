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
              <div  class="font-weight-large">
                Thank you for completing the survey!
              </div>
              <div v-if="negativeEnd">
              <div class="font-weight-large">
                Thank you for your consideration. We understand and respect your decision. Your participation is crucial in advancing our understanding of social determinants of health and shaping future research initiatives. 
              </div>
              <div class="font-weight-large">
                If you have any questions or concerns about the study, please feel free to reach out to us at hecap@rush.edu. 
              </div>
            </div>
              <v-btn block class="mt-2" @click="back" >Close and go back to homepage</v-btn>
            </v-card-text>
        </v-card>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted} from "vue";
import router from "@/router";
import {useAppStore} from '@/store/app';
const appStore = useAppStore()
const negativeEnd = (!appStore.isPositive && (appStore.wantUpcomingProgram != 'yes'))

onMounted(() => {
  console.log("===negativeEnd:", negativeEnd)
});

function back() {
  router.push({path: '/'})
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
