import type { RouteLocationNormalized, Router } from "vue-router";
import { msalInstance, loginRequest } from "../authConfig";
import { InteractionType, PopupRequest, PublicClientApplication, RedirectRequest } from "@azure/msal-browser";
import { useAuthStore } from '@/stores/index'
//const authStore = useAuthStore()

export function registerGuard(router: Router) {
    router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
        //console.log("=======registerGuard().router.beforeEach:", from.fullPath, to.fullPath)
        if (to.meta.requiresAuth) {
            const request = {
                ...loginRequest,
                redirectStartPage: to.fullPath
            }
            const shouldProceed = await isAuthenticated(msalInstance, InteractionType.Redirect, request);
            //console.log("=======registerGuard().shouldProceed:", shouldProceed)
            return shouldProceed || '/auth/welcome';
        }
    
        return true;
    });
}

export async function isAuthenticated(instance: PublicClientApplication, interactionType: InteractionType, loginRequest: PopupRequest|RedirectRequest): Promise<boolean> {    
    // If your application uses redirects for interaction, handleRedirectPromise must be called and awaited on each page load before determining if a user is signed in or not  
    return instance.handleRedirectPromise().then(() => {
        const accounts = instance.getAllAccounts();
        //console.log("====handleRedirectPromise():accounts:", accounts, instance)
        if (accounts.length > 0) {
            if (accounts[0] && accounts[0].username) {
                const authStore = useAuthStore()
                authStore.setUser(accounts[0].username)
            }
            return true;
        }

        // User is not signed in and attempting to access protected route. Sign them in.
        // if (interactionType === InteractionType.Popup) {
        //     return instance.loginPopup(loginRequest).then(() => {
        //         return true;
        //     }).catch(() => {
        //         return false;
        //     })
        // } else if (interactionType === InteractionType.Redirect) {
        //     return instance.loginRedirect(loginRequest).then(() => {
        //         return true;
        //     }).catch(() => {
        //         return false;
        //     });
        // }

        return false;
    }).catch(() => {
        return false;
    });
}