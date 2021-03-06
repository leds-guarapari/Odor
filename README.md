# Odor
Projeto referente a um aplicativo sobre a percepção de gases odorantes.

## Instalação
Crie um projeto no [Firebase](https://firebase.google.com/). Modifique os arquivos de acordo com as configurações do projeto criado.

### Firebase\\.firebaserc
```json
{
  "projects": {
    "default": "YOUR-PROJECT-NAME-IN-FIREBASE"
  }
}
```
### Firebase\src\services\config.js
```javascript
export const config = {
 organization: "YOUR-NAME-ORGANIZATION",
 user: "YOUR-PROJECT-EMAIL-USER-IN-FIREBASE",
 admin: "YOUR-PROJECT-EMAIL-ADMIN-IN-FIREBASE",
 version: "VERSION",
 firebase: {
  apiKey: "YOUR-PROJECT-API-KEY-IN-FIREBASE",
  authDomain: "YOUR-PROJECT-ID-IN-FIREBASE.firebaseapp.com",
  databaseURL: "https://YOUR-PROJECT-ID-IN-FIREBASE.firebaseio.com",
  projectId: "YOUR-PROJECT-ID-IN-FIREBASE",
  storageBucket: "YOUR-PROJECT-ID-IN-FIREBASE.appspot.com",
  messagingSenderId: "YOUR-PROJECT-MESSAGING-SENDER-ID-IN-FIREBASE",
  appId: "YOUR-PROJECT-APP-ID-IN-FIREBASE"
 },
 vapidKey: "YOUR-PROJECT-VAPID-KEY-IN-FIREBASE",
 odor: {
  intensity: "Não sabe",
  nuisance: "Não sabe",
  type: "Não sabe",
  origin: "Não sabe",
  address: "Não informado",
  user: {
   type: "Outro",
   origin: "Outro"
  },
 },
 address: {
  localized: "Local selecionado",
  localizing: "Localizando endereço..."
 }
};
```
### Odor\Services\config.json
```json
{
	"Organization" : "YOUR-NAME-ORGANIZATION",
	"UserFile" : "user.json",
	"FirebaseRealtimeDatabasePath" : "https://YOUR-PROJECT-ID-IN-FIREBASE.firebaseio.com/",
	"FirebaseAPIKey" : "YOUR-PROJECT-API-KEY-IN-FIREBASE",
	"FirebaseUser" : "YOUR-PROJECT-EMAIL-USER-IN-FIREBASE",
	"FirebasePassword" : "YOUR-PROJECT-PASSWORD-USER-IN-FIREBASE",
	"OdorIntensity" : "Não sabe",
	"OdorNuisance" : "Não sabe",
	"OdorType" : "Não sabe",
	"OdorOrigin" : "Não sabe",
	"OdorAddress" : "Não informado",
	"OdorUserType" : "Outro",
	"OdorUserOrigin" : "Outro",
	"LocalizedAddress" : "Local selecionado",
	"LocalizingAddress" : "Localizando endereço..."
}
```
### Odor.Android\google-services.json
Faça o download do arquivo no Firebase do Projeto.
### Odor.Android\Properties\AndroidManifest.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" android:versionCode="YOUR-VERSION-CODE" android:versionName="YOUR-VERSION-NAME" package="YOUR-PACKAGE" android:installLocation="auto">
	<uses-sdk android:minSdkVersion="22" android:targetSdkVersion="30" />
	<uses-permission android:name="android.permission.INTERNET" />
	<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
	<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
	<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
	<uses-permission android:name="android.permission.ACCESS_MOCK_LOCATION" />
	<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
	<uses-permission android:name="android.permission.ACCESS_LOCATION_EXTRA_COMMANDS" />
	<uses-feature android:name="android.hardware.location" android:required="false" />
	<uses-feature android:name="android.hardware.location.gps" android:required="false" />
	<uses-feature android:name="android.hardware.location.network" android:required="false" />
	<application android:label="Odor" android:icon="@drawable/icon">
		<meta-data android:name="com.google.android.maps.v2.API_KEY" android:value="YOUR-PROJECT-API-KEY-IN-FIREBASE" />
		<meta-data android:name="com.google.android.gms.version" android:value="@integer/google_play_services_version" />
		<uses-library android:name="org.apache.http.legacy" android:required="false" />
	</application>
</manifest>
```

## Changelog
Alterações detalhadas para cada versão estão documentadas em [release notes](https://github.com/leds-guarapari/Odor/releases).

## Licença
Licenciado sob a Licença [MIT](http://opensource.org/licenses/MIT).