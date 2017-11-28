var mainCasper= require('casper');
var x = mainCasper.selectXPath;
var fs=require('fs');
var casper = mainCasper.create({
  clientScripts:  [
        'helpers.js'      // These two scripts will be injected in remote
  ],
  verbose: true,
  logLevel: "debug",
  pageSettings: {
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11"
  }
});
var selectors = ['#ctl00_ContentPlaceHolder_ddFinYear','#ctl00_ContentPlaceHolder_ddState','#ctl00_ContentPlaceHolder_ddLevel', '#ctl00_ContentPlaceHolder_btnGO'];

var stdLink = 'http://indiawater.gov.in/imisreports/Reports/WaterQuality/rpt_WQM_WaterSampleTestingLabWise.aspx?Rep=0&RP=Y';


var postbacks = []
var current=0;

casper.on("click", function(){this.echo();});

casper.on("remote.message", function(msg){
    this.echo("remote.msg: " + msg);
});

casper.on("page.error", function(msg){
    this.echo("page.error: " + msg);
});


casper.start('/home/palashkulshreshtha/Documents/programs/mygit/playing/waterdata/0.html',function(){
  console.log('starting');
});

casper.then(function(){
  casper.evaluate(function(){
    //because static saved page tries to post locally
    document.querySelector('#aspnetForm').action='http://indiawater.gov.in/imisreports/Reports/WaterQuality/rpt_WQM_WaterSampleTestingLabWise.aspx?Rep=0&RP=Y';
    __doPostBack('ctl00$ContentPlaceHolder$rpt$ctl01$lkbtsources','');
  });
})

casper.wait(2000).then(function(){
  casper.capture('static_test.png');
});

casper.run();