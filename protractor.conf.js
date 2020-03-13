/*global jasmine */
var HtmlScreenshotReporter = require("protractor-jasmine2-html-reporter");
var jasmineReporters = require('jasmine-reporters');
var HtmlReporter = require('protractor-beautiful-reporter');
var retry = require('protractor-retry').retry;

exports.config = {
  allScriptsTimeout: 11000,
  specs: ['./e2e/*.js'],   
  directConnect: true,  
  chromeDriver: process.platform === "win32"? './node_modules/chromedriver/lib/chromedriver/chromedriver.exe' : './node_modules/chromedriver/lib/chromedriver/chromedriver',
  capabilities: {
    'browserName': 'chrome',
    'shardTestFiles': true,
    'maxInstances': 4,
    'chromeOptions': {
      'binary': require('puppeteer').executablePath(),
      //'args': ['--headless']
    },
  },
 
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  
  onPrepare: function() {
    /*jasmine.getEnv().addReporter(
      new HtmlScreenshotReporter({
      savePath: './reports/execution',
      screenshotsFolder: 'images',
      filename: 'report.html'
    }));  */
    console.log("------------------+++++++++++--------------")  
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
        consolidateAll: false,
        savePath: 'testresults',
        filePrefix: Math.floor(Math.random()*1E16)
    }));
    jasmine.getEnv().addReporter(
      new HtmlReporter({
        baseDirectory: 'beauty',
        preserveDirectory: true,
        sortFuntion: function sortFunction(a, b) {
          if (a.instanceId < b.instanceId) return -1;
          else if (a.instanceId > b.instanceId) return 1;
      
          if (a.timestamp < b.timestamp) return -1;
          else if (a.timestamp > b.timestamp) return 1;
      
          return 0;
        }
      }).getJasmine2Reporter());
      retry.onPrepare();
  },
  onCleanUp: function(results) {
    console.log("==============Oncleanup========================")
    retry.onCleanUp(results);
  },
  onComplete: function() {    
    console.log("==============Onocomplte========================")
  },

  afterLaunch: function() {
    return retry.afterLaunch(2);
    console.log("++++++++++After Block+++++++++++++++++++++")
  }
};