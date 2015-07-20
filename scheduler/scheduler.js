// Unless you use Meteor.isClient/Meteor.isServer,
// all code is executed on both server and client
// So making the mongo collection here means the user
// has a local copy of it

People = new Mongo.Collection("people");
console.log("Hello world");
SLOTS_PER_DAY = 48
DAYS = 7
var ADD = true;

TimeTables = new Mongo.Collection("timeTables");

if (Meteor.isClient) {
  console.log("Hello client");

  Template.body.helpers({
    timeTables: function() {
      var instance = TimeTables.findOne({userName: "example"});
      return instance.userId;
    },

    timeTables_getSlots: function(userName) {
      var instance = TimeTables.findOne({userName: userName});
      console.log(instance.freeSlots);
    }
  });

  Template.results.helpers({
    // Helpers are defined in JSON format
    // (name as key, function as value)
    people: function () {
      return People.find();
    }
  });

  Template.select.helpers({
    days: function () {
      // Returns an array of days of the week
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    },

    times: function (i) {
      // Returns string in the range "0:00" to "23:30"
      // Used in spacebars to label each row
      var result = String(Math.floor(i/2)) + ":";
      if (i%2 == 0) {
        result += "00";
      } else {
        result += "30";
      }
      return result;
    },

    slots: function () {
      // Returns an array with values from 0 to SLOTS_PER_DAY
      // Used in spacebars to provide index for ids, times
      var result = [];
      for (i=0; i<SLOTS_PER_DAY; i++) {
        result[i] = i;
      }
      return result;
    },

    ids: function (i) {
      // Given a time index, returns each ID of the related timeslots
      // Used to generate IDs of each TD tag in each row in the table
      results = [];
      for (j=0; j<DAYS; j++) {
        results[j] = j*48 + i;
      }
      return results;
    }
  });

  // For the contents of the select template
  Template.select.events({

    // If a td tag element is clicked within the select template
    // (we could also say "click td .class" to only affect a
    // a certain class)
    'click td': function (event) {
      //array[slot] = 1;
      //Session.set("timeSelected",array);
      // console.log("A cell was clicked");
      // The element that was clicked can be found with
      // event.target (could be a td, or a child node)
      // (use event.currentTarget to get the td)

      // Print the ID of the target to the console
      // $() is JQuery; it just makes it easier to get attributes
      // TODO: no idea how to use the target (change its colour etc)
      //console.log($(event.target).attr('id'));
    },

    'submit .done': function (event) {
      var n = event.target.name.value;
      var array = Session.get("timeSelected");
      Meteor.call("submit", n, array, event);
    },

    'mouseenter td' : function (event) {
      var cell = event.target;
      var array = Session.get("SelectedCells");
      //no selected time yet
      if (array == null ) {
        $(cell).css("background-color", "yellow");
      } else {
        if ($.inArray(cell.id/1,array) == -1){
          $(cell).css("background-color", "yellow");
        }
      }
    },

    'mouseleave td' : function (event) {
      var cell = event.target;
      var array = Session.get("SelectedCells");
      //no selected time yet
      if (array == null){
        $(cell).css("background-color", "white");
      } else {
        if ($.inArray(cell.id/1,array) == -1){
          $(cell).css("background-color", "white");
        }
      }
    },

    'mousedown td':function (event){
      var cell = event.target;
      Session.set("from",cell.id);
      if (Session.get("SelectedCells") != null){
        var array = Session.get("SelectedCells");
        var pos = $.inArray(cell.id/1,array);
        for (var i in array){
          console.log(array[i]);
        }
        if (pos != -1){
          ADD = false;
        } else{
          ADD = true;
        }
      }
    },

    'mouseup td':function (event){

      var begin = Session.get("from");
      var into = Session.set("to",event.target.id);
      var end = Session.get("to");
      var cells = Session.get("SelectedCells");

      if (cells == null) {
        cells = [];
      }

      var from;
      var to;

      //to see which one is on the left handside
      if (begin/48 > end/48){
        from = end;
        to = begin;
      } else{
        from = begin;
        to = end;
      }

      var to_x = Math.floor(to/48);
      var to_y = to%48;
      var from_x = Math.floor(from/48);
      var from_y = from%48;
      var start = from/1;
      var current;

      for (var j = 0; j <= Math.abs(to_y-from_y); j++) {

        if (from_y > to_y) {
          current = start - j;
        }else {
          current = start + j;
        }

        for (var k = 0; k <= Math.abs(to_x - from_x); k++) {
         // $("#"+current).css("background-color","red");
          var pos = $.inArray(current,cells);
          if (ADD){
            //not inside array
            if (pos == -1){
              cells.push(current);
              $("#"+current).css("background-color","red");
            }
          } else{
            //inside array
            if (pos != -1){
              cells.splice(pos,1);
              $("#"+current).css("background-color","white");
            }
          }
          current += 48;
        }
      }
      Session.set("SelectedCells",cells);
    }
  });
}

if (Meteor.isServer) {
  console.log("Hello server");
  /*Meteor.startup(function () {
   // code to run on server at startup
   });*/

  // People.find() returns a cursor pointing to all elements
  // in the collection (since the parameter is the search criteria
  // and {} or empty parameter matches all documents).

  // If People is empty
  if (TimeTables.find().count() == 0) {
    var array = [0, 23, 74];
    TimeTables.insert({userName: "example", userId: 1324, freeSlots: array, createdAt: new Date()});
  }

  Meteor.methods({
    addPerson : function(name) {
      // A zeroed array 48 cells long
      var times = [];
      for (i=0; i<SLOTS_PER_DAY; i++) {times[i] = 1;}

      // A 2D array indexed by day, timeslot
      var free = [];
      for (i=0; i<DAYS; i++) {free[i] = times;}

      People.insert({name: name, free: free});
    },

    submit:function(name, array, event){
      People.update({name:name},{$set:{free:array}});
      
      event.preventDefault();
      
      var userName = name;
      var userId = Meteor.userId();
      var freeSlots = array;

      TimeTables.insert({
        userName: userName,
        userId: userId,
        freeSlots: freeSlots,
        createdAt: new Data()
      });

      event.target.text.value = "";
    },
    "insertSlots" :function(){

    }
  });
}