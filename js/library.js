var ob1 = Object.create(Object);
console.log(ob1.prototype.id);
ob1.prototype.addProp = function(prop,value){
  this[prop] = value;
};

var ob2 = new Object(ob1);
ob2["id"] = "root";

ob2.addProp("stream","networking");

ob2.prototype.removeProp = function(prop) {
  if (!this.hasOwnProperty(prop)) {
     console.error("No such property in the object");
  }
  else if (this.prototype.hasOwnProperty(prop)){
    delete this.prototype.prop;
  }
  else{
    delete this.prop;
  }
};

var ob3 = new Object();

ob3.addProp("name","abc");
ob2.addProp("branch","cs");
ob1.removeProp("branch");
console.log(ob1);
console.log(ob2);
console.log(ob3);
