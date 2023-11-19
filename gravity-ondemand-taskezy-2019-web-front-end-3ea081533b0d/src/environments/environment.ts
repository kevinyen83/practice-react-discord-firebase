// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  env: 'dev',
  production: false,
  stage: false,
  test: false,
  dev: true,
  e2e: false,
  tenant: 'taskezy',
  apiUrlAuth: 'https://devapi.gravityfusion.com.au/auth/1.1',
  apiUrlBusinessAccount: 'https://devapi.gravityfusion.com.au/profile/1.2',
  apiUrlLog: 'api/auditlog',
  apiUrlTemplates: 'https://devapi.gravityfusion.com.au/formbuilder/1.0',
  apiUrlCompliance: 'https://devapi.gravityfusion.com.au/compliance/1.1',
  apiUrlRoster: 'https://devapi.gravityfusion.com.au/roster/1.1',
  apiUrlFiles: 'https://devdoc.gravityfusion.com.au',
  apiUrlInvite: 'https://devapi.gravityfusion.com.au/profile/1.2/invite',
  urlGoogleMap: 'https://maps.googleapis.com/maps/api',
  keyGoogleMap: 'AIzaSyBQA7mw-dqtx75RiC7kvSF_NjTavatq7tA',
  sentryDsn: 'https://c7730db6934644d88f33d2c7daaec4ef@o26287.ingest.sentry.io/5191512',
  intercomAPIKey: 'cmkwfq1c',
  cloudinary: {
    uri: 'https://api.cloudinary.com/v1_1/lwve0xa7a/image/upload',
    avatarPreset: 't8innunp'
  },
  firebase: {
    apiKey: 'AIzaSyCnmOyvGlCtkXElkQXC3h_3iRSR9T6sG50',
    authDomain: 'totallyezy.firebaseapp.com',
    projectId: 'totallyezy',
    storageBucket: 'tboss-ident',
    messagingSenderId: '228822179711'
  },
  urlCloudinary: 'https://api.cloudinary.com/v1_1',
  digitalIDUrl: 'https://digitalid-sandbox.com/sdk/app.js',
  digitalIDClientId: 'ctid2k8SFOx3VRS7etJYSojN27'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
