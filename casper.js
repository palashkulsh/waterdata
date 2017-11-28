var mainCasper= require('casper');
var x = mainCasper.selectXPath;
var fs=require('fs');

var casper = mainCasper.create({
  clientScripts:  [
        'helpers.js'      // These two scripts will be injected in remote
  ],
  verbose: true,
  logLevel: "debug"
});
var selectors = ['#ctl00_ContentPlaceHolder_ddFinYear','#ctl00_ContentPlaceHolder_ddState','#ctl00_ContentPlaceHolder_ddLevel', '#ctl00_ContentPlaceHolder_btnGO'];

var postbacks = []
var current=0;

casper.on("click", function(){this.echo();});

casper.on("remote.message", function(msg){
    this.echo("remote.msg: " + msg);
});

casper.start('http://indiawater.gov.in/imisreports/Reports/WaterQuality/rpt_WQM_WaterSampleTestingLabWise.aspx?Rep=0&RP=Y', function(){
  console.log('start')
});


casper.waitForSelector(selectors.join(', '),function waitor(){
  console.log('here');
  this.evaluate(function evaluator(){
    console.log('eval');
    console.log('setting values');
    helpers.setSelectedValue(document.getElementById("ctl00_ContentPlaceHolder_ddFinYear"),"2014-2015");
    __doPostBack('ctl00_ContentPlaceHolder_ddFinYear','');
   });
});

casper.then(function(){
  casper.evaluate(function(){
    
    console.log('before state');
    helpers.setSelectedValue(document.getElementById("ctl00_ContentPlaceHolder_ddState"),"020")
    __doPostBack('ctl00_ContentPlaceHolder_ddState','') //calling this postback otherwise the changes dont reflect on click
    console.log('after state');
  });
});

casper.then(function(){
  casper.evaluate(function district(){
    console.log('before district');
    helpers.setSelectedValue(document.getElementById("ctl00_ContentPlaceHolder_ddLevel"),"DISTRICT")
    __doPostBack('ctl00_ContentPlaceHolder_ddLevel','')
    console.log('after district');
  });
  this.capture('info.png')
});

casper.then(function(){
  this.capture('before_button.png')
  casper.evaluate(function(){
    document.getElementById("ctl00_ContentPlaceHolder_btnGO").click()
  });
});

//waiting for outertable as inner table is not rendered in case of no data found
casper.waitForSelector('#ctl00_ContentPlaceHolder_reportContent > table',function waitor5sec(){
  fs.write('1.html',casper.getHTML(undefined, true),'w')
      this.capture('example.png');
});

casper.wait(1000).then(function waitor5sec(){
      this.capture('screen.png');
});



casper.run(again);