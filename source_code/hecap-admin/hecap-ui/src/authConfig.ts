import { LogLevel, PublicClientApplication } from '@azure/msal-browser';
const AZURE_CLIENT_ID_APPUI = import.meta.env.VITE_AZURE_CLIENT_ID_APPUI
const AZURE_CLIENT_ID_APPAPI = import.meta.env.VITE_AZURE_CLIENT_ID_APPAPI
const AZURE_TENENT_ID = import.meta.env.VITE_AZURE_TENENT_ID

// Config object to be passed to Msal on creation
export const msalConfig = {
  auth: {
    clientId: AZURE_CLIENT_ID_APPUI,
    authority: `https://login.microsoftonline.com/${AZURE_TENENT_ID}`,
    redirectUri: '/', // Must be registered as a SPA redirectURI on your app registration
    postLogoutRedirectUri: '/' // Must be registered as a SPA redirectURI on your app registration
  },
  cache: {
    cacheLocation: 'localStorage'
  },
  system: {
      allowNativeBroker: false,
      loggerOptions: {
          loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
              if (containsPii) {
                  return;
              }
              switch (level) {
                  case LogLevel.Error:
                      //console.error(message);
                      return;
                  case LogLevel.Info:
                      //console.info(message);
                      return;
                  case LogLevel.Verbose:
                      //console.debug(message);
                      return;
                  case LogLevel.Warning:
                      //console.warn(message);
                      return;
                  default:
                      return;
              }
          },
          logLevel: LogLevel.Verbose
      }
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);
await msalInstance.initialize();
await msalInstance.handleRedirectPromise();

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
  scopes: ['User.Read'],
};

export const hecapApiRequestScope = {
  scopes: [`api://${AZURE_CLIENT_ID_APPAPI}/user_impersonation`],
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};
