GAME_LENGTH = 4;

Meteor.methods({
  getAssignment: function () {
    if (!Meteor.userId()) {
      throw new Error("Must be logged in to play");
    }
    var game = Games.findOne({
      done: false,
      activeMove: null,
      participants: {
        $ne: Meteor.userId()
      }
    });
    var move = {
      assignee: Meteor.userId(),
      expires: new Date(new Date().valueOf() + 100*1000),
      answer: null
    };
    var previous = null;
    if (game) {
      previous = game.moves[game.moves.length-1];
      move.previous = previous;
      move.game = game._id;
    } else {
      var gameId = Games.insert({
        done: false,
        activeMove: null,
        participants: [],
        moves: []
      });
      move.game = gameId;
    }
    var moveId = Moves.insert(move);
    Games.update(move.game, {$set: {activeMove: moveId}});
    if (previous) {
      var prevMove = Moves.findOne(previous);
      if (!prevMove)
        console.log("no prev move for", previous);
      if (typeof prevMove.answer === "string") {
        move.draw = true;
        move.description = prevMove.answer;
      } else {
        move.describe = true;
        move.picture = prevMove.answer;
      }
    } else {
      move.start = true;
    }
    move._id = moveId;
    return move;
  },
  submitAnswer: function (assignmentId, answer) {
    if (!Meteor.userId())
      throw new Meteor.Error(403, "Must be logged in to play");
    check(assignmentId, String);
    var assignment = Moves.findOne(assignmentId);
    if (assignment.expires.valueOf() < new Date().valueOf())
      throw new Meteor.Error(403, "Assignment has expired");
    var previous = Moves.findOne(assignment.previous);
    if (previous && typeof previous.answer === 'string')
      check(answer, Object);
    else
      check(answer, String);
    Moves.update(assignmentId, {$set: {answer: answer}});
    var gameSetter = {
      activeMove: null
    };
    var game = Games.findOne(assignment.game);
    if (game.moves.length >= GAME_LENGTH - 1) {
      gameSetter.done = true;
    }
    Games.update(game._id, {
      $set: gameSetter,
      $addToSet: {
        moves: assignmentId,
        participants: Meteor.userId()
      }
    });
  }
});

//Expire assignments that are old

Meteor.setInterval(function () {
  var oldMoves = Moves.find({
    answer: null,
    expires: {$lt: new Date()}
  });
  oldMoves.forEach(function (move) {
    Moves.remove(move._id);
    Games.update(move.game, {
      $set: {
        activeMove: null
      }
    });
    var game = Games.findOne(move.game);
    if (game && _.isEmpty(game.moves))
      Games.remove(game._id);
  });
}, 10*1000);
