// Unless you use Meteor.isClient/Meteor.isServer,
// all code is executed on both server and client
// So making the mongo collection here means the user
// has a local copy of it

People = new Mongo.Collection("people");
console.log("Hello world");
SLOTS_PER_DAY = 48
DAYS = 7

if (Meteor.isClient) {
  console.log("Hello client");

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
      console.log(event.target.id);
      var id = event.target.id;
      if (Math.floor(id/7) === 0){
        Session.set("name","Sunday");
      } else if (Math.floor(id/7) === 1){
        Session.set("name","Monday");
      } else if (Math.floor(id/7) === 2){
        Session.set("name","Tuesday");
      } else if (Math.floor(id/7) === 3) {
        Session.set("name","Wednesday");
      } else if (Math.floor(id/7)  === 4){
        Session.set("name","Thursday");
      } else if (Math.floor(id/7) === 5){
        Session.set("name","Friday");
      } else{
        Session.set("name","Saturday");
      }

      var slot = id%48;
      var array = Session.get("timeSelected");
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
      Meteor.call("submit",n,array);
      // alert("hi :)");
    },

    'submit .done': function (event) {
      var n = event.target.name.value;
      // TODO ...
    },

    'mouseenter td' : function (event) {
      var cellId = event.target.id;
      var userId = this.;
      console.log("Mouse Entered " + userId + ":" + cellId);
    },

    'mouselevel td' : function (event) {
      var cellId = event.target.id;
      console.log("Mouse Leave : " + cellId);
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
  if (People.find().count() == 0) {
    People.insert({name: "alice", free: [0, 0, 0]});
    People.insert({name: "bob", free: [0, 0, 0]});
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
    submit:function(name,array){
      People.update({name:name},{$set:{free:array}});
    }
  });
}
