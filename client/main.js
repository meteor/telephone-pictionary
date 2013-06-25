Meteor.autorun(function () {
  Meteor.subscribe('gamesForUser');
});

Meteor.autorun(function () {
  Games.find().forEach(function (game) {
    Meteor.subscribe('movesForGame', game._id);
  });
});

Template.main.loggedIn = Template.sidebar.loggedIn = function () {
  return Meteor.userId();
};

Template.main.assignment = function () {
  if (!Session.get("viewingGame"))
    return Session.get('assignment');
  return null;
};

Template.main.game = function () {
  if (Session.get("viewingGame"))
    return Games.findOne(Session.get("viewingGame"));
  return null;
};

Meteor.autorun(function () {
  if (Meteor.userId() &&
      !Session.get("viewingGame") &&
      !Session.get("assignment")) {
    Meteor.call("getAssignment", function (err, res) {
      Session.set("assignment", res);
    });
  }
});


submitAnswer = function (answer) {
  var assignment = Session.get('assignment');
  if (assignment) {
    Meteor.call('submitAnswer', assignment._id, answer);
    Session.set('assignment', null);
  }
};


Template.sidebar.recentGames = function () {
  return Games.find({
    done: true,
    participants: Meteor.userId()
  });
};


Template.sidebar.firstPhrase = function () {
  var move = Moves.findOne(this.moves[0]);
  return move && move.answer;
};

Template.sidebar.events({
  'click .selectGame': function (evt) {
    Session.set("viewingGame", this._id);
  },
  'click .playGame': function () {
    Session.set("viewingGame", null);
  }
});

Template.sidebar.gameActive = function () {
  return activeIfTrue(Session.equals("viewingGame", this._id));
};

Template.sidebar.playActive = function () {
  return activeIfTrue(!Session.get("viewingGame"));
};
