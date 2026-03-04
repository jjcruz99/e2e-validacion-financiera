import { defineConfig } from "cypress";
import cypressMochawesomeReporter from "cypress-mochawesome-reporter/plugin.js";
export default defineConfig({

  e2e: {

    baseUrl: null,
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    viewportWidth: 1500,   
    viewportHeight: 970, 
    screenshotsFolder: "cypress/reports/screenshots", 
    trashAssetsBeforeRuns: true,  
    setupNodeEvents(on, config) {
      // implement node event listeners here
      cypressMochawesomeReporter(on);
      
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome' || browser.name === 'edge') {
          // Forzar el tamaño de la ventana de Chrome/Edge
          launchOptions.args.push('--window-size=1600,1100'); 
          // Forzar a que no haya escalado de pantalla
          launchOptions.args.push('--force-device-scale-factor=1');
        }
        if (browser.name === 'electron') {
          // Si se usa Electron (el default de npx cypress run)
          launchOptions.preferences.width = 1600;
          launchOptions.preferences.height = 1100;
        }
        return launchOptions;
      });

    },
     reporter: "cypress-mochawesome-reporter",
      reporterOptions: {
        reportDir: "cypress/reports",
        overwrite: true,
        charts: true, // graficos en el reporte
        embedScreenshots: true, // capturas de pantalla en el reporte
        html: true, // genera reporte en HTML
        json: false, // no genera reporte en JSON
        reportPageTitle: "Pruebas Automatizadas con Cypress",
        inlineAssets: true,
      },
  },
});
