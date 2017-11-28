//show button id ctl00_ContentPlaceHolder_btnGO 
//call simualate using

function simulate(element, eventName)
{
  var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
  }
  var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
  }
  var options = extend(defaultOptions, arguments[2] || {});
  var oEvent, eventType = null;
  for (var name in eventMatchers)
  {
    if (eventMatchers[name].test(eventName)) { eventType = name; break; }
  }
  if (!eventType)
    throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
  if (document.createEvent)
  {
    oEvent = document.createEvent(eventType);
    if (eventType == 'HTMLEvents')
    {
      oEvent.initEvent(eventName, options.bubbles, options.cancelable);
    }
    else
    {
      oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
                            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
    }
    element.dispatchEvent(oEvent);
  }
  else
  {
    options.clientX = options.pointerX;
    options.clientY = options.pointerY;
    var evt = document.createEventObject();
    oEvent = extend(evt, options);
    element.fireEvent('on' + eventName, oEvent);
  }
  return element;
  //function used in simulate
  function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  }
}


//USAGE setSelectedValue(document.getElementById("ctl00_ContentPlaceHolder_ddState"),"MEGHALAYA")
// to get all options given in dropdown 
// document.getElementById("ctl00_ContentPlaceHolder_ddState").length gives all possible options available
// document.getElementById("ctl00_ContentPlaceHolder_ddState")[0].value gives -1
//select value from dropdown
function setSelectedValue(selectObj, valueToSet) {
  for (var i = 0; i < selectObj.options.length; i++) {
    if (selectObj.options[i].text== valueToSet) {
      selectObj.options[i].selected = true;
      return;
    }
  }
}

//how to back the page 
//history.back() should do the trick.
// use this ==> window.history.back() 

//table div id ctl00_ContentPlaceHolder_reportContent
//document.getElementById("ctl00_ContentPlaceHolder_reportContent").innerHTML
//document.getElementById("ctl00_ContentPlaceHolder_reportContent").outerHTML



function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;
    // CSV FILE
    csvFile = new Blob([csv], {type: "text/csv"});
    // Download link
    downloadLink = document.createElement("a");
    // File name
    downloadLink.download = filename;
    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);
    // Make sure that the link is not displayed
    downloadLink.style.display = "none";
    // Add the link to your DOM
    document.body.appendChild(downloadLink);
    // Lanzamos
    downloadLink.click();
}

function export_table_to_csv(html, filename, skip_headers) {
	var csv = [];
	var rows = html.querySelectorAll("tr");	
    for (var i = 0; i < rows.length; i++) {
		var row = [], cols = rows[i].querySelectorAll(skip_headers?"td ":"td, th":);		
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText.replace(/,/g,';'));        
		csv.push(row.join(","));		
	}
    // Download CSV
    download_csv(csv.join("\n"), filename);
}

function getCsv(name, id) {
    var html = document.getElementById(id||"tableReportTable")
	export_table_to_csv(html,name|| "table.csv");
}
//////////////////////////////
////MAIN start
/////////////////////////////
function calling(){
  var somevar=1234;
  setSelectedValue(document.getElementById("ctl00_ContentPlaceHolder_ddFinYear"),"2015-2016")
  setSelectedValue(document.getElementById("ctl00_ContentPlaceHolder_ddState"),"UTTARAKHAND")
  setSelectedValue(document.getElementById("ctl00_ContentPlaceHolder_ddLevel"),"DISTRICT")
  simulate(document.getElementById("ctl00_ContentPlaceHolder_btnGO"), "click");
  console.log(somevar);
}
//////////////////////////////
//////MAIN ENDS
//////////////////////////////


/////////////////////////////
//////STARTS handling downloading for 1 all
////////////////////////////
/****
var pages = $x('//*[@id="ctl00_ContentPlaceHolder_reportContent"]/table[1]/tbody/tr/td/a/@href');
for(let page in pages){
  await eval(eachHref.nodeValue.replace(/javascript:/g,''));
  await getCsv(index+'.csv');
}
****/

var doPosts=[];
var processed=0;
$x('//*[@id="ctl00_ContentPlaceHolder_reportContent"]/table[1]/tbody/tr/td/a/@href').forEach(function(eachHref,index){
  console.log(eachHref.nodeValue.replace(/javascript:/g,''))
  doPosts.push(eachHref.nodeValue.replace(/javascript:/g,''));
  //getCsv(index+'.csv');
});

function processDoPosts(){
  if(doPosts.length==processed){
    console.log('all done')
    return ;
  }
  eval(doPosts[processed]);
}

Sys.Application.add_load(function(){
  processed++;  
  getCsv(processed+'.csv');
  processDoPosts();
});

/////////////////////////////
//////ENDS handling downloading for 1 all
////////////////////////////


/***** STARTS adding event handlers start
////how are requests handled
Sys.Net.WebRequestManager.add_invokingRequest(function(){console.log('invoking request')})
Sys.Net.WebRequestManager.add_completedRequest(function(){console.log('completed request')})
Sys.Net.WebRequestManager.add_navigate(function(){console.log('add navigate')})
Sys.Application.add_load(function(){console.log('page loaded')})

///They are printed as follows
// invoking request
// completed request
// page loaded
ENDS adding event handlers start
****/



/**
 
$x('//*[@id="tableReportTable"]/tbody/tr/td/a/@href').forEach(function(eachHref){console.log(eachHref.nodeValue)})
__doPostBack('ctl00$ContentPlaceHolder$rpt$ctl01$lkbtsources','')
__doPostBack('ctl00$ContentPlaceHolder$rpt$ctl02$lkbtsources','')
__doPostBack('ctl00$ContentPlaceHolder$rpt$ctl03$lkbtsources','')
__doPostBack('ctl00$ContentPlaceHolder$rpt$ctl04$lkbtsources','')
__doPostBack('ctl00$ContentPlaceHolder$rpt$ctl05$lkbtsources','')
__doPostBack('ctl00$ContentPlaceHolder$rpt$ctl06$lkbtsources','')
__doPostBack('ctl00$ContentPlaceHolder$rpt$ctl07$lkbtsources','')
__doPostBack('ctl00$ContentPlaceHolder$rpt$ctl08$lkbtsources','')
__doPostBack('ctl00$ContentPlaceHolder$rpt$ctl09$lkbtsources','')
__doPostBack('ctl00$ContentPlaceHolder$rpt$ctl10$lkbtsources','')
__doPostBack('ctl00$ContentPlaceHolder$rpt$ctl11$lkbtsources','')
__doPostBack('ctl00$ContentPlaceHolder$rpt$ctl12$lkbtsources','')
__doPostBack('ctl00$ContentPlaceHolder$rpt$ctl13$lkbtsources','')
__doPostBack('ctl00$ContentPlaceHolder$rpt$ctl14$lkbtsources','')
undefined 
 
 * **/