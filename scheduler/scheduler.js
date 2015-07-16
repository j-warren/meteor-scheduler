// Unless you use Meteor.isClient/Meteor.isServer,
// all code is executed on both server and client
// So making the mongo collection here means the user
// has a local copy of it

People = new Mongo.Collection("people");
console.log("Hello world");

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

    times: function () {
      // Returns an array of strings from "0:00" to "23:30"
      var result = [];

      for (i=0; i<48; i++) {
        result[i] = String(Math.floor(i/2)) + ":";

        if (i%2 == 0) {
          result[i] += "00";

        } else {
          result[i] += "30";
        }
      }

      return result;
    },

    dayTimes: function () {
      // Given a day of the week, returns an array of Dates
      // representing half hour intervals from midnight to
      // midnight (start to end of day)
      // TODO ...
    }
  });

  // For the contents of the select template
  Template.select.events({

    // If a td tag element is clicked within the select template
    // (we could also say "click td .class" to only affect a
    // a certain class)
    'click td': function (event) {

      // console.log("A cell was clicked");
      // The element that was clicked can be found with
      // event.target (could be a td, or a child node)
      // (use event.currentTarget to get the td)

      // Print the ID of the target to the console
      // $() is JQuery; it just makes it easier to get attributes
      // TODO: no idea how to use the target (change its colour etc)
      console.log($(event.target).attr('id'));
    },

    'submit .done': function (event) {
      var n = event.target.name.value;
      People.insert({name: n, free: [0, 0, 0]});
      // alert("hi :)");
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
}
