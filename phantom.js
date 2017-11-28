var page = require('webpage').create();


page.open('http://indiawater.gov.in/imisreports/Reports/WaterQuality/rpt_WQM_WaterSampleTestingLabWise.aspx?Rep=0&RP=Y', function(status) {
  console.log('opening page');
  if(status === "success") {
    page.render('example.png');
    page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
      console.log('loaded jquery')
      page.evaluate(function(){
        console.log('evalulated')
        function setSelectedValue(selectObj, valueToSet) {
          for (var i = 0; i < selectObj.options.length; i++) {
            if (selectObj.options[i].text== valueToSet) {
              selectObj.options[i].selected = true;
              return;
            }
          }
        }
        console.log('setting values');
        setSelectedValue(document.getElementById("ctl00_ContentPlaceHolder_ddFinYear"),"2015-2016")
        setSelectedValue(document.getElementById("ctl00_ContentPlaceHolder_ddState"),"UTTARAKHAND")
        setSelectedValue(document.getElementById("ctl00_ContentPlaceHolder_ddLevel"),"DISTRICT")
        console.log('clicking');
        document.getElementById("ctl00_ContentPlaceHolder_btnGO").click();
      });
      page.evaluate(function(){
        console.log('next evaluation');
        Sys.Application.add_load(function(){
          console.log('page loaded');          
        });
      });
      page.render('check.png');
    });
  }  
});