const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://shop.demoqa.com",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

