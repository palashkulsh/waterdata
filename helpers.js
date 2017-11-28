var helpers = {
  setSelectedValue: function setSelectedValue(selectObj, valueToSet) {
    for (var i = 0; i < selectObj.options.length; i++) {
      console.log(selectObj.options[i].text)
      if ((selectObj.options[i].text== valueToSet) || (selectObj.options[i].value== valueToSet) ) {
        selectObj.options[i].selected = true;
        console.log('**********found',selectObj.options[i].text)
        return;
      }
    }
  },
  export_table_to_csv: function export_table_to_csv(html, filename, skip_headers) {
    var csv = [];
    var rows = html.querySelectorAll("tr");	
    for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td, th");		
      for (var j = 0; j < cols.length; j++) 
        row.push(cols[j].innerText.replace(/,/g,';'));        
      csv.push(row.join(","));		
    }
    return csv;
  },
  getCsvData: function getCsv(name, id, skip_headers) {
    var html = document.getElementById(id || "tableReportTable")
    return helpers.export_table_to_csv(html);
  }
}