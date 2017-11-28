var request = require("request");

var options = { method: 'POST',
  url: 'http://indiawater.gov.in/imisreports/Reports/WaterQuality/rpt_WQM_WaterSampleTestingLabWise.aspx',
  qs: { Rep: '0', RP: 'Y' },
  headers: 
   {
     'postman-token': 'aae796c2-1124-0c69-15b4-380f650dc80a',
     cookie: 'ASP.NET_SessionId=5a2btp55om5ivfb1tw44bt55; ext_name=jaehkpjddfdgiiefcnhahapilbejohhj; ASP.NET_SessionId=5a2btp55om5ivfb1tw44bt55; ext_name=jaehkpjddfdgiiefcnhahapilbejohhj',
     'accept-language': 'en-US,en;q=0.8',
     'accept-encoding': 'gzip, deflate',
     referer: 'http://indiawater.gov.in/imisreports/Reports/WaterQuality/rpt_WQM_WaterSampleTestingLabWise.aspx?Rep=0&RP=Y',
     accept: '*/*',
     'content-type': 'application/x-www-form-urlencoded',
     'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/58.0.3029.96 Chrome/58.0.3029.96 Safari/537.36',
     'x-microsoftajax': 'Delta=true',
     origin: 'http://indiawater.gov.in',
     'cache-control': 'no-cache' },
  form: 
   { '__ASYNCPOST ': undefined,
     __EVENTVALIDATION: undefined,
     __VIEWSTATE: undefined,
     'ctl00$ContentPlaceHolder$btnGO': undefined,
     'ctl00$ContentPlaceHolder$ddDistrict': undefined,
     'ctl00$ContentPlaceHolder$ddFinYear': undefined,
     'ctl00$ContentPlaceHolder$ddLabName': undefined,
     'ctl00$ContentPlaceHolder$ddLaboratoryType': undefined,
     'ctl00$ContentPlaceHolder$ddLevel': undefined,
     'ctl00$ContentPlaceHolder$ddState': undefined,
     'ctl00$ContentPlaceHolder$ddblock': undefined,
     'ctl00$ScriptManager1': undefined } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
