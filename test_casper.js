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

// casper.on('resource.requested', function(requestData, resource) {
//   console.log('resource.requested',JSON.stringify(requestData,null,4),JSON.stringify(resource,null,4));
// });

// The base links array
var links = [];
var started=0;
// If we don't set a limit, it could go on forever
var upTo = ~~casper.cli.get(0) || 10;

var currentLink = 0;

// Get the links, and add them to the links array
// (It could be done all in one step, but it is intentionally splitted)
function addLinks(link) {
  var that=this;
  /***
    this.then(function() {
        var found = this.evaluate(searchLinks);
        this.echo(found.length + " links found on " + link);
        links = links.concat(found);

    });
   ***/
}

// Fetch all <a> elements from the page and return
// the ones which contains a href starting with 'http://'
function searchLinks() {
    var filter, map;
    filter = Array.prototype.filter;
    map = Array.prototype.map;
    return map.call(filter.call(document.querySelectorAll("a"), function(a) {
        return (/^http:\/\/.*/i).test(a.getAttribute("href"));
    }), function(a) {
        return a.getAttribute("href");
    });
}

// Just opens the page and prints the title
function start(link) {
  var that=this;
    if(!that.cli.options || !that.cli.options.year || !that.cli.options.state){
      console.log('no state or year passed');
      that.exit();
    }
  that.clear();
  phantom.clearCookies();
  that.start(link, function() {
    console.log('inside start')
    this.echo('Page title: ' + this.getTitle());
  });
  that.waitForSelector(selectors.join(', '),function waitor(){
    console.log('here');
    that.evaluate(function evaluator(year){
      console.log('eval');
      console.log('setting values');
      helpers.setSelectedValue(document.getElementById("ctl00_ContentPlaceHolder_ddFinYear"),year);
      __doPostBack('ctl00_ContentPlaceHolder_ddFinYear','');
    },that.cli.options.year);
  });

  that.waitForSelector('#ctl00_ContentPlaceHolder_ddState',function(){
    that.evaluate(function(state){      
      console.log('before state',document.getElementById("ctl00_ContentPlaceHolder_ddState"));
      helpers.setSelectedValue(document.getElementById("ctl00_ContentPlaceHolder_ddState"),state)
       __doPostBack('ctl00_ContentPlaceHolder_ddState','') //calling this postback otherwise the changes dont reflect on click      
    },that.cli.options.state);
  });
 
  that.waitForSelector('#ctl00_ContentPlaceHolder_ddLevel',function(){
    that.capture('before_district_'+current+'.png')
    that.evaluate(function district(){
      helpers.setSelectedValue(document.getElementById("ctl00_ContentPlaceHolder_ddLevel"),"DISTRICT")
      __doPostBack('ctl00_ContentPlaceHolder_ddLevel','')
    });
  });

  that.then(function(){    
    that.capture('before_button.png')
    that.evaluate(function(){
      document.getElementById("ctl00_ContentPlaceHolder_btnGO").click()
    });
  });

  //waiting for outertable as inner table is not rendered in case of no data found
  that.waitForSelector('#ctl00_ContentPlaceHolder_reportContent > table',function waitor5sec(){
    //fs.write(current+'.html',that.getHTML(undefined, true),'w')
    this.capture('example_'+current+'.png');
  });
  
  that.then(function(){
    postbacks = that.evaluate(function(){
                  // __doPostBack('ctl00$ContentPlaceHolder$rpt$ctl01$lkbtsources','')
                  return  [].map.call(__utils__.findAll('#tableReportTable > tbody > tr > td:nth-child(7)> a'), function (e) { return e.id.replace(/_/g,'$'); });
                });
  });

  that.then(function(){
    console.log('$$$$$$$$$$',postbacks)
    if(!postbacks.length){
      console.log('no data exiting');
      return that.exit(0);
    }else{
      console.log('%%%%%%%%%%%',postbacks[current],current,postbacks.length);
      that.then(function(){
        that.evaluate(function(postbackName){
          console.log('postbackName===========',postbackName)
          __doPostBack(postbackName,'');
          // document.getElementById(postbacks[current].replace(/$/g,'_')).click();
        },postbacks[current])
      }).wait(2000).then(function(){
        var pagesCallbacks = that.evaluate(function(){
                      return  [].map.call(__utils__.findAll('#ctl00_ContentPlaceHolder_reportContent > table > tbody > tr > td > a'), function (e) { return e.id.replace(/_/g,'$'); });
                             });

        that.then(function(){
          that.capture('data_'+current+'.png')
          console.log('&&&&&&&&&&&&&&&&&&&&',pagesCallbacks)
          that.then(function(){
            that.evaluate(function(){
              Sys.WebForms.PageRequestManager.getInstance().add_endRequest(function () {
                console.log("client: doPostback complete");
                window.onPostBackComplete = true;
              });
            })
          })
          that.then(function(){
            var count=0;
            var allPagesData=[];
            var csvData=[];
            var prevData=[];
            that.repeat(pagesCallbacks.length, function(){
              var eachPageCallback=pagesCallbacks[count++];
              console.log('capturing page @@@@@@@@@@@@',eachPageCallback)
              this.evaluate(function(eachPageCallback){
                console.log('demanding paging ',eachPageCallback)
                __doPostBack(eachPageCallback,'');
                console.log('UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU')
                
              },eachPageCallback);
              // self.waitForaSelector('#tableReportTable',function(){
              //   self.capture('eachpage_'+current+'_'+index+'.png');
              // });
              this.waitFor(function () {
                var postbackComplete=this.evaluate(function () {
                                       return window.onPostBackComplete;
                                     });
                csvData = this.evaluate(function(){
                            return helpers.getCsvData();
                          });
                console.log('*****************',prevData.length,postbackComplete,csvData[0]!==prevData[0],csvData[1]!==prevData[1])
                return postbackComplete && (prevData.length!==csvData.length || (csvData[2] !== prevData[2] && csvData[1] !== prevData[1]));
              }, function then() {
                this.wait(10000).then(function(){
                  this.echo("doPostback complete");
                  this.capture('eachpage_'+current+'_'+count+'.png');
                  csvData =this.evaluate(function(){
                             return helpers.getCsvData();
                           });
                  prevData=csvData; //copying before unshift because need to compare  elements
                  if(count>1){
                    csvData.shift();
                  }
                  csvData=csvData.join('\n');
                  fs.write(this.cli.options.state+'_'+this.cli.options.year+'.csv' ,csvData,'a')
                })
              }, function timeout() {
                this.echo("-- > timeout");
              },20000);            
            });
          });          
          that.then(function(){
            console.log('current increment')
            
            current++;
            if(current==postbacks.length){
              console.log('all done');
              that.exit(0);
            }
            that.clear();
            that.run(check);
          });
        });
      });
    }        
  });
}

// As long as it has a next link, and is under the maximum limit, will keep running
function check() {
  console.log(current,postbacks.length)
    if (!started || (current && current!==postbacks.length)) {
      started=1;
      console.log('here');
        this.echo('--- Link ' + currentLink + ' ---');
      console.log('2');
        start.call(this, stdLink);
      console.log('3');
        // addLinks.call(this, links[currentLink]);
      console.log('4');
        currentLink++;
      console.log('5');
        this.run(check);
    } else {
        this.echo("All done.");
        this.exit();
    }
}

casper.start().then(function() {
    this.echo("Starting");
});

casper.run(check);