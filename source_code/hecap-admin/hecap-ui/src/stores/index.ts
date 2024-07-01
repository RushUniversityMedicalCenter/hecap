import { defineStore } from 'pinia';
import {router} from '../router';
import { fetchWrapper} from '@/helpers';

import { InteractionRequiredAuthError, InteractionStatus } from "@azure/msal-browser";
import { hecapApiRequestScope } from "@/authConfig";
import { useMsal } from "@/msal/useMsal";
const baseUrl = `${import.meta.env.VITE_API_URL}`;

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: localStorage.getItem('user'),
        userName: "",
        returnUrl: "/ui/qualtrics",
        loginError: <String | null> null,
        accessToken: ""
    }),
    actions: {
        async getApiAccessToken() {
            const { instance } = useMsal();
            const response = await instance.acquireTokenSilent({
                ...hecapApiRequestScope
            }).catch(async (e) => {
                if (e instanceof InteractionRequiredAuthError) {
                    await instance.acquireTokenRedirect(hecapApiRequestScope);
                }
                throw e;
            });
            return response.accessToken
        },
        async login(username: any, password: any) {
            //console.log("===login.baseUrl:", baseUrl)
            try {
                this.userName = username
                let userCred =  window.btoa(username + ':' + password);
                let user:any = await fetchWrapper.get(`${baseUrl}/hecapUser/auth?user=${userCred}`, null);

                // update pinia state with user object + basic auth data
                //console.log("===store.login:", username, password, userCred, user)
                //console.log("===store.thisuser:", this.user)
                this.user = user;

                // // store user details and basic auth data in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(this.user));
                this.loginError = null
                // // redirect to previous url or default to home page
                router.push(this.returnUrl || '/');
                return "ok"
            } catch(err) {
                console.log("===login failed exception:", err)
                this.loginError = "Login failed. Please try again!"
                return null
            } 
        },
        logout() {
            this.user = null;
            localStorage.removeItem('user');
            this.loginError = null;
            //console.log("===logout: localstorage:", localStorage.getItem('user'))
            router.push('/auth/welcome');
        },
        setUser(user: any) {
            this.user = user
        },
        setAccessToken(accessToken: any) {
            this.accessToken = accessToken
        }
    }
});