const fs = require('fs');
fs.readFile('../json/nutrition.json',function(error,jsonObj) {
  if(error){
    console.log(error);
  }
  else{
    var temp = JSON.parse(jsonObj);
    var plotData = new Array();
    for (var prop in temp) {
      if (temp.hasOwnProperty(prop)) {
          plotData.push(temp[prop]);
      }
    }
    console.log(typeof(plotData[1]),plotData[1]);
  }
});
