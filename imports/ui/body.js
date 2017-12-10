import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Abx } from '../api/abx.js';
import { Bugs } from '../api/bugs.js';
import './body.html';

Template.body.helpers({
  abx: function () {
    return Abx.find({});
  },
  coveredBugs: function () {
    console.log(Session.get("lastAbxClick"));
    var checkedAbxIds = $(".abx:checked").map(function () {
      var _id = parseInt(this.value);
      return {abx: _id};
    }).get();

    //console.dir(checkedAbxIds);
    
    if (checkedAbxIds.length > 0) {
      return Bugs.find({$or: checkedAbxIds});
      //return Bugs.find({$or: [{abx: 22}, {abx: 24}]});
    } else {
      return "";
    }
  },
  bugs: function () {
    return Bugs.find({});
  },
  abxForBugs: function () {
    console.log(Session.get("lastBugsClick"));
    var checkedBugsIds = $(".bugs:checked").map(function () {
      var _id = parseInt(this.value);
      return {bugs: _id};
    }).get();

    //console.dir(checkedBugsIds);
    
    if (checkedBugsIds.length > 0) {
      return Abx.find({$and: checkedBugsIds});
    } else {
      return "";
    }
  }
});

Template.body.events({
  "click .abx": function (e) {
    console.log("in function click .abx");
    Session.set("lastAbxClick", (new Date()).getTime());
  },
  "click .bugs": function (e) {
    console.log("in function click .bugs");
    Session.set("lastBugsClick", (new Date()).getTime());
  }
});
