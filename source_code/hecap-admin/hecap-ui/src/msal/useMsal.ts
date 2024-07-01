import { AccountInfo, InteractionStatus, PublicClientApplication } from "@azure/msal-browser";
import { getCurrentInstance, Ref, toRefs } from "vue";

export type MsalContext = {
    instance: PublicClientApplication,
    accounts: Ref<AccountInfo[]>,
    inProgress: Ref<InteractionStatus>
}

export function useMsal(): MsalContext {
    //console.log("===useMasl()...")
    const internalInstance = getCurrentInstance();
    //console.log("===useMsal():internalInstance:", internalInstance)
    if (!internalInstance) {
        throw "useMsal() cannot be called outside the setup() function of a component";
    }
    const { instance, accounts, inProgress} = toRefs(internalInstance.appContext.config.globalProperties.$msal);
    //console.log("===useMsal():instance, accounts, inProgress:", instance, accounts, inProgress)
    if (!instance || !accounts || !inProgress) {
        throw "Please install the msalPlugin";
    }
    //console.log("===useMsal():InteractionStatus.Startup:", InteractionStatus)
    if (inProgress.value === InteractionStatus.Startup) {
        instance.value.handleRedirectPromise().catch(() => {
            // Errors should be handled by listening to the LOGIN_FAILURE event
            console.log("===useMsal():error!!!!!!!!!!!!!")
            return;
        });
    }

    return {
        instance: instance.value,
        accounts,
        inProgress
    }
}