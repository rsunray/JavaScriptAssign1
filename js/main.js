const fs = require('fs');

fs.readFile("../csv/FoodFacts.csv","utf-8",function(error,data){
  if(error)
    console.error("error");
  else{
      var rows = data.split("\n");
      var re = /,(?=(?:(?:[^\"]*\"){2})*[^\"]*$)/g;///,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/g
      var header = rows[0].split(",");
      var countries = new Array();
      var sugar = new Array();
      var salt = new Array();
      var carbo = new Array();
      var proteins = new Array();
      var fats = new Array();
      // filter the data
      for (var i = 1; i < rows.length; i++) {
        var cols = rows[i].split(re);
        countries.push(cols[header.indexOf("countries_en")]);
        sugar.push(cols[header.indexOf("sugars_100g")]);
        salt.push(cols[header.indexOf("salt_100g")]);
        carbo.push(cols[header.indexOf("carbohydrates_100g")]);
        proteins.push(cols[header.indexOf("proteins_100g")]);
        fats.push(cols[header.indexOf("fat_100g")]);
      }
      // create the data object
      var jsonData = new Object();
      var count = new Object();
      // method to add values to the object properties
      var addProp = function(property) {
        if (jsonData.hasOwnProperty(property)) {
          count[property]++;
          jsonData[property].sugar+=Number(sugar[i]);
          jsonData[property].salt+=Number(salt[i]);
          jsonData[property].carbohydrates+=Number(carbo[i]);
          jsonData[property].proteins+=Number(proteins[i]);
          jsonData[property].fat+=Number(fats[i]);
        }
        else {
          count[property] = 1;
          jsonData[property] = {
            "sugar" : Number(sugar[i]),
            "salt"  : Number(salt[i]),
            "carbohydrates"  : Number(carbo[i]),
            "proteins"  : Number(proteins[i]),
            "fat"  : Number(fats[i])
        }
      }
    }
    // add data to the object dynamically
      for (var i = 0; i < countries.length; i++) {
        if (countries[i] === undefined) {
          continue;
        }
        var prop = countries[i];
        if(prop.includes(","))
        {
          var props = new Array();
          props = prop.split(",");
          for (var j = 0; j < props.length; j++) {
            if (props[j].includes("\"")) {
              props[j] = props[j].replace(/\"/g,'');
            }
            addProp(props[j]);
          }
        }
        else {
          addProp(prop);
        }
      }

      for (var country in jsonData) {
          jsonData[country].sugar/= count[country];
          jsonData[country].salt/= count[country];
          jsonData[country].carbohydrates/= count[country];
          jsonData[country].proteins/= count[country];
          jsonData[country].fat/= count[country];
      }
  // jsonify the object
    var jsonText = JSON.stringify(jsonData,null,'\n\t');

      fs.writeFile("../json/nutrition.json",jsonText,function(error){
        if(error)
          console.error("error");
          else {
            console.log("written 1");
          }
      });

      // second data object creation
      var NE = ["United Kingdom","Denmark","Sweden","Norway"];
      var CE = ["France","Belgium","Germany","Switzerland","Netherlands"];
      var SE = ["Portugal","Greece","Italy","Spain","Croatia","Albania"];
      var jsonData2 = new Object();
      jsonData2 = {
        North_Europe :{} ,
        Central_Europe :{} ,
        South_Europe :{}
      }
      var addReg = function(region) {
        var rname;
        if(region === NE)
          rname = jsonData2.North_Europe;
        else if(region === CE)
          rname = jsonData2.Central_Europe;
        else
          rname = jsonData2.South_Europe;

        for (var i = 0; i < region.length; i++) {
          if(rname.hasOwnProperty("carbohydrates")){
            rname.carbohydrates+= jsonData[region[i]].carbohydrates;
            rname.proteins+= jsonData[region[i]].proteins;
            rname.fat+= jsonData[region[i]].fat;
            if (i === region.length-1 ) {
              rname.carbohydrates= rname.carbohydrates/region.length;
              rname.proteins= rname.proteins/region.length;
              rname.fat= rname.fat/region.length;
            }
          }
          else{
            rname.carbohydrates = jsonData[region[i]].carbohydrates;
            rname.proteins = jsonData[region[i]].carbohydrates;
            rname.fat = jsonData[region[i]].carbohydrates;
          }
        }
      }

      addReg(NE);
      addReg(CE);
      addReg(SE);
      
      var jsonText2 = JSON.stringify(jsonData2,null,'\n\t');

      fs.writeFile("../json/region.json",jsonText2,function(error){
        if(error)
          console.error("error");
          else {
            console.log("written 2");
          }
      });
  }
});
