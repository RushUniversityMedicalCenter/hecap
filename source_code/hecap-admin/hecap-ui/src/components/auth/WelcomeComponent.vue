<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/index'
import { useIsAuthenticated } from '../../msal/useIsAuthenticated';
import { useMsal } from '../../msal/useMsal';
import { loginRequest} from "../../authConfig";
const checkbox = ref(true)
const userName = ref('')
const userPassword = ref('')
//const loginError = ref<string | null>(null);
const authStore = useAuthStore()
let loginError = ref(authStore.loginError);

const isAuthenticated = useIsAuthenticated();
const router = useRouter();

const { instance } = useMsal();

onMounted(() => {
    authStore.loginError = null
    //console.log("===in welcome component: onMounted():isAuthenticated:", typeof isAuthenticated, authStore.user)
    if(isAuthenticated.value) {
        authStore.setUser("aaron")
        router.push("/")
    }
})
function isError() {
    //console.log("===isError():", loginError.value, " --- ", loginError)
  if(loginError.value) {
   return true
  }else {
    return false
  }
}

const loginRedirect = () => {
  console.log("===loginRedirect:", instance, loginRequest)
  instance.loginRedirect(loginRequest);
}
const loginPopup = () => {
  console.log("===loginPopup:", instance, loginRequest)
  instance.loginPopup(loginRequest);
}

</script>

<template>
    <v-row class="d-flex mb-3">
            <v-btn @click="loginRedirect"  color="primary" size="large" block   flat>Login</v-btn>
    </v-row>
</template>
<style scoped>
.error-message {
  color: red;
}
</style>
