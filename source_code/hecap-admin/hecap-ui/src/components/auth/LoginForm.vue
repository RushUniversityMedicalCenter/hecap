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
    //console.log("===in onMounted():isAuthenticated:", typeof isAuthenticated, authStore.user)
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

async function login() {
    //console.log("====login....", userName.value, userPassword.value)
    
    const resLogin = await authStore.login(userName.value, userPassword.value)
    //console.log("===login response:", resLogin)
    if(resLogin) {
        authStore.loginError = null;
    } else {
        //console.log("===login response: err1:", authStore.loginError, loginError)
        authStore.loginError = "Login failed. Please try again.";
        loginError.value = "Login failed. Please try again."
        //console.log("===login response: err2:", authStore.loginError, loginError)
    }
}

const loginRedirect = () => {
  console.log("===loginRedirect:", instance, loginRequest)
  instance.loginRedirect(loginRequest);
}
const loginPopup = () => {
  instance.loginPopup(loginRequest);
}

const logoutRedirect = () => {
  instance.logoutRedirect();
}

</script>

<template>
    <v-row class="d-flex mb-3">
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">Username</v-label>
            <v-text-field v-model="userName" variant="outlined" hide-details color="primary"></v-text-field>
        </v-col>
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">Password</v-label>
            <v-text-field v-model="userPassword" variant="outlined" type="password"  hide-details color="primary"></v-text-field>
        </v-col>
        <v-col cols="12">
            <p v-if="isError()" class="error-message">{{ loginError }}</p>
        </v-col>
        <!-- <v-col cols="12" class="pt-0">
            <div class="d-flex flex-wrap align-center ml-n2">
                <v-checkbox v-model="checkbox"  color="primary" hide-details>
                    <template v-slot:label class="text-body-1">Remeber this Device</template>
                </v-checkbox>
                <div class="ml-sm-auto">
                    <RouterLink to="/"
                        class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium">Forgot
                        Password ?</RouterLink>
                </div>
            </div>
        </v-col> -->
        <v-col cols="12" class="pt-0">
            <v-btn @click="login"  color="primary" size="large" block   flat>Sign in</v-btn>
        </v-col>
        <v-col cols="12" class="pt-0">
            <v-btn v-if="isAuthenticated" @click="logoutRedirect"  color="primary" size="large" block   flat>SSO Logout</v-btn>
            <v-btn v-else @click="loginRedirect"  color="primary" size="large" block   flat>SSO Login</v-btn>
        </v-col>
    </v-row>
</template>
<style scoped>
.error-message {
  color: red;
}
</style>
