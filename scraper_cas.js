var mainCasper= require('casper');
var x = mainCasper.selectXPath;
var fs=require('fs');
// --------------------------------------
var casper = mainCasper.create({
  clientScripts:  [
        'helpers.js'      // These two scripts will be injected in remote
  ],
  verbose: true,
  logLevel: "debug"
});

casper.on("click", function(){this.echo();});

casper.on("remote.message", function(msg){
    this.echo("remote.msg: " + msg);
});

/////////////////////////program variable
var selectors = ['#ctl00_ContentPlaceHolder_ddFinYear','#ctl00_ContentPlaceHolder_ddState','#ctl00_ContentPlaceHolder_ddLevel', '#ctl00_ContentPlaceHolder_btnGO'];
var postbacks = []              //global set of links
var current=0;                  //global pointer to know current status
var started=0;

//start casper without anything
casper.start().then(function() {
    this.echo("Starting");
});

function check() {
  var myCasper=this;
  console.log('inside check')
  //if scraper is not started yet
  if(!started){
    console.log('inside started')
    started=1;
    this.open('http://indiawater.gov.in/imisreports/Reports/WaterQuality/rpt_WQM_WaterSampleTestingLabWise.aspx?Rep=0&RP=Y').then( function(){
      console.log('start')
      casper.end();
    });    
  }
}

casper.run(check);