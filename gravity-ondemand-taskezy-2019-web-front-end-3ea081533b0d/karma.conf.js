// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: [
      "jasmine",
      "@angular-devkit/build-angular",
    ],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      // require('karma-coverage-istanbul-reporter'),
      require("karma-spec-reporter"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    files: ["googleMock.js"],
    client: {
      jasmine: {
        random: false,
      },
      captureConsole: true,
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: require("path").join(__dirname, "/coverage/"),
      subdir: "karma",
      reporters: [
        { type: "html" },
        { type: "lcov" },
        { type: "text-summary" },
      ],
      check: {
        emitWarning: false,
        global: {
          statements: 30,
          lines: 30,
          branches: 6,
          functions: 22,
        },
      },
      includeAllSources: true,
    },
    reporters: [
      "progress",
      "kjhtml",
      "coverage",
      "spec",
    ],
    port: 9876,
    proxies: {
      // "/api/clients": "/api/clients",
      // "/api/accounts": "/api/accounts",
      // "/api/suppliers": "/api/suppliers",
      // "/api/resources": "/api/resources",
      // "/api/accreditationTypes": "/api/accreditationTypes",
      // "/api/compliance": "/api/compliance",
      // "/api/types": "/api/types",
      // "/api/login": "/api/login",
      // "/api/controls": "/api/controls",
      // '/api/profiles': '/api/profiles'
    },
    browserNoActivityTimeout: 400000,
    captureTimeout: 240000,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [
      "Chrome",
      "ChromeHeadless"
    ],
    customLaunchers: {
      ChromeHeadless: {
        base: "Chrome",
        flags: [
          "--headless",
          "--disable-translate",
          "--disable-extensions",
          "--remote-debugging-port=9223",
          "--disable-web-security",
          "--disable-gpu",
          "--no-sandbox",
        ],
      }
    },
    singleRun: false,
  });
};
