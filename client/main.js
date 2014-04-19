Session.setDefault("assignment", null);

// Define a helper function that will be truthy if we're logged in.
Template.main.loggedIn = Template.sidebar.loggedIn = function () {
  // PHASE 2 x
  // Return something truthy if we're logged in.
  return Meteor.userId();
};

Template.main.assignment = function () {
  // PHASE 3

  // Return the current assignment if we're not in game-viewing mode (in
  // game-viewing mode, the 'viewingGame' Session variable is truthy).

  // For now, return a dummy.
  return { description: "Lorem ipsum dolor sic amet"};
};

// return the game we're viewing, if any.
Template.main.game = function () {
  if (Session.get("viewingGame"))
    return Games.findOne(Session.get("viewingGame"));
  return null;
};

Meteor.autorun(function () {
  // PHASE 3

  // Use Meteor.call to get an assignment any time we notice we need one
  // (we're logged in, we're not viewing a game) and don't have it in the
  // "assignment" session variable.

  // Note: if we're viewing a game, its id is in the `viewingGame` Session
  // variable.

  // Set the "assignment" session variable to the result.
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

Meteor.autorun(function () {
  // PHASE 7
  // inside this autorun, subscribe to:

  // * All games where this user is a participant and the game is done (see
  //   publish section in model.js)
  // * For all games we can see, all moves.
});
