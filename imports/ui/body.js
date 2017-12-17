import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Abx } from '../api/abx.js';
import { Bugs } from '../api/bugs.js';
import { Infxns } from '../api/infxns.js';
import { arrayInArray, gramToColor, bugCompare, abxCompare, infxnCompare, abxNarrowToBroad } from './functions.js';
import './body.html';

Meteor.startup(function () {
  Session.set("widestLabel", 0);
});

Template.body.helpers({
  commonAbx: function () {
    Session.get("lastInfxnClick");

    var checkedInfxnIds = $(".infxns:checked").map(function () {
      var _id = parseInt(this.value);
      return _id;
    }).get();

    var checkedInfxns = Infxns.find({_id: {$in: checkedInfxnIds}}).fetch();
    var commonAbxIds = [];
    for (var i = 0; i < checkedInfxns.length; i++) {
      commonAbxIds = commonAbxIds.concat(checkedInfxns[i].abx);
    }

    var finalIds = [];
    if (checkedInfxns.length < 2) {
      finalIds = commonAbxIds;
    } else {
      for (var j = 0; j < commonAbxIds.length; j++) {
        console.log("j = ", j);
        console.log(arrayInArray(commonAbxIds[j], finalIds, 0) < 0);
        console.log(arrayInArray(commonAbxIds[j], commonAbxIds, j+1) > -1);
        if (arrayInArray(commonAbxIds[j], finalIds, 0) < 0 &&
        arrayInArray(commonAbxIds[j], commonAbxIds, j+1) > -1) {
          finalIds.push(commonAbxIds[j]);
        }
      }
    }

    return finalIds;
  },
  infxns: function () {
    return Infxns.find({}).fetch().sort(infxnCompare);
  },
  abx: function () {
    return Abx.find({}).fetch().sort(abxCompare);
  },
  coveredBugs: function () {
    Session.get("lastAbxClick");

    var checkedAbxIds = $(".abx:checked").map(function () {
      var _id = parseInt(this.value);
      return {abx: _id};
    }).get();

    if (checkedAbxIds.length > 0) {
      return Bugs.find({$or: checkedAbxIds}).fetch().sort(bugCompare);
    } else {
      return "";
    }
  },
  bugs: function () {
    Session.get("lastInfxnClick");

    var checkedInfxnIds = $(".infxns:checked").map(function () {
      var _id = parseInt(this.value);
      return _id;
    }).get();

    var bugIds = [];
    for (var i = 0; i < checkedInfxnIds.length; i++) {
      var infxn = Infxns.findOne({_id: checkedInfxnIds[i]});
      bugIds = bugIds.concat(infxn.bugs);
    }


    if (bugIds.length > 0) {
      $(".bugs:checked").each(function () {
        if ($.inArray(parseInt(this.value), bugIds) < 0) {
          $(this).prop('checked', false);
        }
      });
      Session.set("lastBugsClick", (new Date()).getTime());
      return Bugs.find({_id: {$in: bugIds}}).fetch().sort(bugCompare);
    } else {
      return Bugs.find({}).fetch().sort(bugCompare);
    }
  },
  abxForBugs: function () {
    Session.get("lastBugsClick");
    var checkedBugsIds = $(".bugs:checked").map(function () {
      var _id = parseInt(this.value);
      return {bugs: _id};
    }).get();

    if (checkedBugsIds.length > 0) {
      return Abx.find({$and: checkedBugsIds}).fetch().sort(abxNarrowToBroad);
    } else {
      return "";
    }
  }
});

Template.common.helpers({
  name: function () {
    var antibiotic = Abx.findOne(this[0]).name;
    for (var i = 1; i < this.length; i++) {
      antibiotic += " + " + Abx.findOne(this[i]).name;
    }
    return antibiotic;
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
    Session.set("lastAbxClick", (new Date()).getTime());
  },
  "click .bugs": function (e) {
    if ($(".bugs").not(":checked").length > 0) {
      $("#allBugs").prop("checked", false);
    } else { 
      $("#allBugs").prop("checked", true);
    }
    Session.set("lastBugsClick", (new Date()).getTime());
  },
  "click .infxns": function (e) {
    Session.set("lastInfxnClick", (new Date()).getTime());
  },
  "click #allBugs": function (e) {
    $(".bugs").prop("checked", $("#allBugs").prop("checked"));
    Session.set("lastBugsClick", (new Date()).getTime());
  },
});

Template.bug.onRendered(function () {
  var widestLabel = Session.get("widestLabel");
  var currentLabel = this.$('label').width();

  if ( currentLabel > widestLabel ) {
    Session.set("widestLabel", currentLabel);
    $('#widestLabel').remove();
    $('<style id="widestLabel">.equalWidth { width: ' + currentLabel + 'px; }</style>').appendTo('head');
  }
  this.$('label').addClass("equalWidth");

  if ($(".bugs").not(":checked").length > 0) {
    $("#allBugs").prop("checked", false);
  } else { 
    $("#allBugs").prop("checked", true);
  }
});

Template.bug.onDestroyed(function () {
  if (this.$(".bugs").not(":checked") && $(".bugs").not(":checked").length < 2) {
    $("#allBugs").prop("checked", true);
  } else { 
    $("#allBugs").prop("checked", false);
  }
});

Template.antibiotic.onRendered(function () {
  var widestLabel = Session.get("widestLabel");
  var currentLabel = this.$('label').width();

  if ( currentLabel > widestLabel ) {
    Session.set("widestLabel", currentLabel);
    $('#widestLabel').remove();
    $('<style id="widestLabel">.equalWidth { width: ' + currentLabel + 'px; }</style>').appendTo('head');
  }
  this.$('label').addClass("equalWidth");
});

Template.infxn.onRendered(function () {
  var widestLabel = Session.get("widestLabel");
  var currentLabel = this.$('label').width();

  if ( currentLabel > widestLabel ) {
    Session.set("widestLabel", currentLabel);
    $('#widestLabel').remove();
    $('<style id="widestLabel">.equalWidth { width: ' + currentLabel + 'px; }</style>').appendTo('head');
  }
  this.$('label').addClass("equalWidth");
});
