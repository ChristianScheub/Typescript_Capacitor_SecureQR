# Secure QR
Last Dependencies update:  11.2025
Last Edit: 11.2025 <br>
Language: Typescript React Capacitor with Vite<br>
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ChristianScheub_Typescript_Capacitor_SecureQR&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecureQR)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ChristianScheub_Typescript_Capacitor_SecureQR&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecureQR) 
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ChristianScheub_Typescript_Capacitor_SecureQR&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecureQR)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ChristianScheub_Typescript_Capacitor_SecureQR&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecureQR)

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ChristianScheub_Typescript_Capacitor_SecureQR&metric=coverage)](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecureQR)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=ChristianScheub_Typescript_Capacitor_SecureQR&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecureQR)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=ChristianScheub_Typescript_Capacitor_SecureQR&metric=bugs)](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecureQR)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=ChristianScheub_Typescript_Capacitor_SecureQR&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecureQR) 
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=ChristianScheub_Typescript_Capacitor_SecureQR&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecureQR)

Secure QR is a practical application for encrypting texts such as passwords and generating a QR code. This can then be decrypted again using the app.

Google Play Store: https://play.google.com/store/apps/details?id=de.scheub.secureqr&pli=1

Apple App Store: https://apps.apple.com/de/app/secure-qr/id6739471935

Galaxy App Store: https://apps.samsung.com/appquery/appDetail.as?appId=de.scheub.secureqr

Deutsche Kurzbeschreibung: Secure QR ist eine praktische Anwendung um Texte wie Passwörter zu verschlüsseln und einen QR Code zu generieren. Dieser lässt sich anschließend mit der App wieder entschlüsseln.

## App Screenshots

 <img src="images/appStore/AdvertismentScreen.png" alt="Start Screen" height="300">

| Start Screen                                                            | Generated QR Code                                                                        | QR Scanner                                                                     | QR Scan Result                                                         |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| <img src="images/screens/screen1.PNG" alt="Start Screen" height="300"> | <img src="images/screens/screen2.PNG" alt="Generated QR Code" height="300"> | <img src="images/screens/screen3.PNG" alt="QR Scanner" height="300"> | <img src="images/screens/screen4.PNG" alt="QR Scan Result" height="300"> |

## Architecture

The components used are divided into four categories:

- `UI-Elements`
- `View-Componets`
- `Container-Componets`
- `ServiceLayer`

Note: Some of the modules are used from other Web Apps from me like the UsedLibs Modul or the Impressum/Imprint Modules.
As a result of the use from the modules there is also one configuration file:

- `app_texts`: Contains texts such as the description, imprint text, data protection text etc.

In addition, the separation is not 100% sharp, partly because of these modules, but also because the final architecture only turned out that way during development. (Such as the QR Scanner)

`UI-Elements`
At the topmost level, UI-Elements are the fundamental building blocks of our interface. These are the atomic components that include buttons, input fields, and other basic interactive elements. They are styled and abstracted to be reusable across the application.
Examples of this are the drop down menu, input fields, the cards, qr code scanner, etc.

`View-Components`
View-Components are composed of UI-Elements and form parts of the application's screens. They are responsible for presenting data and handling user interactions. These components are often reusable within different parts of the application and can communicate with Container-Components for dynamic data fetching.

`Container-Components`
Container-Components serve as the data-fetching and state management layer in our architecture. They connect View-Components to the Service Layer, managing the application state and providing data to the components as necessary. They may also handle complex user interactions, form submissions, and communicate with services to send or receive data.

`Service Layer`
The Service Layer is the foundation of our application's client-side architecture. 
There is a separate encapsulated service which is responsible for the logging while the development or the encryption service which uses crpyto js. The generic helper methods / hooks also belong there, such as the methods for an transparent status bar or the hook that allows you to swipe through the app.
 <img src="images/SecureQR_Architecture.png" alt="Architecture Overview">
 <i>To simplify the display, the App/Routes is hidden. That is why there is no arrow to the NavBar or the Status Bar method, for example.</i>

## Testing

The Jest testing framework is used for testing in combination with React Testing Library.
All tests are written in TypeScript and follow best practices for unit and integration testing.

### Test Coverage

The application maintains comprehensive test coverage across all critical components:

- **Overall Coverage: 93.67% statements, 93.26% lines**
- Core Services: 100% coverage
- Containers: 100% coverage
- Routing: 100% coverage
- Legal Components: 100% coverage

#### Coverage by Category:

| Category | Statements | Branches | Functions | Lines |
|----------|-----------|----------|-----------|-------|
| **Overall** | 93.67% | 84.12% | 90.32% | 93.26% |
| App & Routes | 100% | 75% | 100% | 100% |
| Containers | 100% | 100% | 100% | 100% |
| Encryption Service | 100% | 100% | 100% | 100% |
| File Handlers | 100% | 100% | 100% | 100% |
| Helper Utilities | 75.75% | 84% | 64.7% | 73.33% |
| Logger Service | 78.26% | 73.68% | 100% | 77.27% |

### Test Organization

Tests are organized alongside their source files with the `.test.ts` or `.test.tsx` extension:

- **App Tests** (`src/App.test.tsx`): Application initialization and routing
- **Container Tests** (`src/Container/*.test.tsx`): Component behavior and state management
- **Service Tests** (`src/Services/**/*.test.ts`): Business logic and utilities
  - Encryption service with all 4 encryption methods (AES256, TripleDES, Blowfish, Rabbit)
  - File handling and download functionality
  - Logger utility with different log levels
  - Device detection and status bar utilities
  - Navigation and swipe gesture handling
- **Routes Tests** (`src/routes.test.tsx`): Route configuration and navigation

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

The coverage report is generated in the `coverage/` directory and includes:
- HTML report: `coverage/lcov-report/index.html`
- JSON summary: `coverage/coverage-summary.json`
- LCOV format: `coverage/lcov.info`

### Test Configuration

Tests are configured via `jest.config.cjs` with:
- TypeScript support via ts-jest
- jsdom environment for DOM testing
- React Testing Library integration
- Mocking of Capacitor plugins (Filesystem, Share, StatusBar, AdMob)
- Coverage thresholds set to 60% (easily exceeded by actual coverage)

### Continuous Integration & Code Quality

#### SonarCloud Integration

The project uses SonarCloud for automated code quality analysis and test coverage tracking. The integration is configured via:

- **Configuration File**: `sonar-project.properties` - Defines SonarCloud settings including coverage paths and exclusions
- **GitHub Action**: `.github/workflows/sonarcloud.yml` - Automatically runs tests and uploads coverage on every push and pull request
- **Coverage Upload**: Jest generates LCOV coverage reports that are automatically uploaded to SonarCloud

**Badges and Metrics:**
- Quality Gate Status
- Security Rating
- Code Coverage
- Duplicated Lines Density
- Bugs, Code Smells, and Vulnerabilities

The SonarCloud dashboard provides detailed insights into code quality metrics, security vulnerabilities, and test coverage trends over time.

**View the full analysis:** [SonarCloud Dashboard](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecureQR)

## Available Scripts

In the project directory, you can run:

### `npm run dev`
Runs the app in the development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npx license-checker --json --production --out licenses.json`
Generate the JSON with the licenses of the NPM packages used. This can then replace the existing license json under /legal/usedLibs.


## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
# Used NPM Modules
According to the command npm list You can see the deeper NPM modules used and which of these are used in the licenses.json.

<br />├── @capacitor-community/admob@6.1.0
<br />├── @capacitor/android@6.2.0
<br />├── @capacitor/cli@6.2.0
<br />├── @capacitor/core@6.2.0
<br />├── @capacitor/filesystem@6.0.2
<br />├── @capacitor/ios@6.2.0
<br />├── @capacitor/share@6.0.3
<br />├── @capacitor/status-bar@6.0.2
<br />├── @emotion/react@11.14.0
<br />├── @emotion/styled@11.14.0
<br />├── @eslint/js@9.16.0
<br />├── @mui/icons-material@6.1.10
<br />├── @mui/material@6.1.10
<br />├── @testing-library/jest-dom@6.6.3
<br />├── @testing-library/react@16.1.0
<br />├── @types/crypto-js@4.2.2
<br />├── @types/jest@29.5.14
<br />├── @types/qrcode@1.5.5
<br />├── @types/react-dom@18.3.2
<br />├── @types/react-swipeable@5.2.0
<br />├── @types/react@18.3.14
<br />├── @vitejs/plugin-react@4.3.4
<br />├── bootstrap@5.3.3
<br />├── crypto-js@4.2.0
<br />├── eslint-plugin-react-hooks@5.1.0
<br />├── eslint-plugin-react-refresh@0.4.16
<br />├── eslint@9.16.0
<br />├── globals@15.13.0
<br />├── i18next-browser-languagedetector@8.0.2
<br />├── i18next@24.0.5
<br />├── install@0.13.0
<br />├── jest@29.7.0
<br />├── npm@10.9.2
<br />├── qr-scanner@1.4.2
<br />├── qrcode@1.5.4
<br />├── react-bootstrap@2.10.6
<br />├── react-dom@18.3.1
<br />├── react-i18next@15.1.3
<br />├── react-icons@5.4.0
<br />├── react-qr-scanner@1.0.0-alpha.11
<br />├── react-router-dom@7.0.2
<br />├── react-swipeable@7.0.2
<br />├── react@18.3.1
<br />├── typescript-eslint@8.17.0
<br />├── typescript@5.6.3
<br />└── vite@6.0.3