import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Abx } from '../api/abx.js';
import { Bugs } from '../api/bugs.js';
import { Infxns } from '../api/infxns.js';
import { gramToColor } from './gramToColor.js';
import './body.html';

Meteor.startup(function () {
  console.log("startup");
  Session.set("widestLabel", 0);
});



Template.body.helpers({
  infxns: function () {
    return Infxns.find({});
  },
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
    console.log(Session.get("lastInfxnClick"));
    console.log("in bugs");

    var checkedInfxnIds = $(".infxns:checked").map(function () {
      var _id = parseInt(this.value);
      return _id;
    }).get();
    console.dir(checkedInfxnIds);

    var bugIds = [];
    for (var i = 0; i < checkedInfxnIds.length; i++) {
      var infxn = Infxns.findOne({_id: checkedInfxnIds[i]});
      bugIds = bugIds.concat(infxn.bugs);
    }


    if (bugIds.length > 0) {
      console.log("11111111111111  " + $(".bugs:checked").length);
      $(".bugs:checked").each(function () {
        console.log("does this happen? " + this.value);
        console.dir(bugIds);
        if ($.inArray(parseInt(this.value), bugIds) < 0) {
          console.log("does this happen? yes for " + this.value);
          $(this).prop('checked', false);
        }
      });
      Session.set("lastBugsClick", (new Date()).getTime());
      console.log("222222222222222  " + $(".bugs:checked").length);
      return Bugs.find({_id: {$in: bugIds}});
    } else {
      return Bugs.find({});
    }
  },
  abxForBugs: function () {
    console.log(Session.get("lastBugsClick"));
    console.log("333333333333");
    var checkedBugsIds = $(".bugs:checked").map(function () {
      var _id = parseInt(this.value);
      return {bugs: _id};
    }).get();

    console.dir(checkedBugsIds);
    
    if (checkedBugsIds.length > 0) {
      return Abx.find({$and: checkedBugsIds});
    } else {
      return "";
    }
  }
});

Template.bug.helpers({
  gramStainColor: function () {
    return gramToColor(this.gram);
  }
});

Template.coveredBug.helpers({
  gramStainColor: function () {
    return gramToColor(this.gram);
  }
});

Template.body.events({
  "click .abx": function (e) {
    console.log("in function click .abx");
    Session.set("lastAbxClick", (new Date()).getTime());
  },
  "click .bugs": function (e) {
    console.log("in function click .bugs" + $(".bugs:checked").length);
    console.dir(this);
    console.log("in function click .bugs" + $(".bugs").length);
    //if (!$(this).prop("checked")) {
    //  $("#allBugs").prop("checked", false);
    //} else
    if ($(".bugs").not(":checked").length > 0) {
      $("#allBugs").prop("checked", false);
    } else { 
      $("#allBugs").prop("checked", true);
    }
    Session.set("lastBugsClick", (new Date()).getTime());
  },
  "click .infxns": function (e) {
    console.log("in function click .infxns");
    Session.set("lastInfxnClick", (new Date()).getTime());
  },
  "click #allBugs": function (e) {
    console.log("in function click .allBugs");
    $(".bugs").prop("checked", $("#allBugs").prop("checked"));
    Session.set("lastBugsClick", (new Date()).getTime());
  },
});

Template.bug.onRendered(function () {
  console.log("bug.onRendered");
  var widestLabel = Session.get("widestLabel");
  var currentLabel = this.$('label').width();

  console.log(currentLabel + " > " + widestLabel);
  if ( currentLabel > widestLabel ) {
    Session.set("widestLabel", currentLabel);
    $('#widestLabel').remove();
    $('<style id="widestLabel">.equalWidth { width: ' + currentLabel + 'px; }</style>').appendTo('head');
  }
  console.log("widestLabel: " + Session.get("widestLabel"));
  this.$('label').addClass("equalWidth");
});

Template.antibiotic.onRendered(function () {
  console.log("bug.onRendered");
  var widestLabel = Session.get("widestLabel");
  var currentLabel = this.$('label').width();

  console.log(currentLabel + " > " + widestLabel);
  if ( currentLabel > widestLabel ) {
    Session.set("widestLabel", currentLabel);
    $('#widestLabel').remove();
    $('<style id="widestLabel">.equalWidth { width: ' + currentLabel + 'px; }</style>').appendTo('head');
  }
  console.log("widestLabel: " + Session.get("widestLabel"));
  this.$('label').addClass("equalWidth");
});

Template.infxn.onRendered(function () {
  console.log("infxn.onRendered");
  var widestLabel = Session.get("widestLabel");
  var currentLabel = this.$('label').width();

  console.log(currentLabel + " > " + widestLabel);
  if ( currentLabel > widestLabel ) {
    Session.set("widestLabel", currentLabel);
    $('#widestLabel').remove();
    $('<style id="widestLabel">.equalWidth { width: ' + currentLabel + 'px; }</style>').appendTo('head');
  }
  console.log("widestLabel: " + Session.get("widestLabel"));
  this.$('label').addClass("equalWidth");
});
