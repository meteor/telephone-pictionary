GAME_LENGTH = 7;

Meteor.methods({
  getAssignment: function () {
    if (!Meteor.userId())
      throw new Meteor.Error(403, "Must be logged in to play");
    var move = Moves.findOne({
      assignee: Meteor.userId(),
      answer: null
    });
    if (!move) {
      move = {
        assignee: Meteor.userId(),
        expires: new Date(new Date().valueOf() + 100*1000),
        answer: null,
        _id: Random.id()
      };
      var game = Games.findOne({
        done: false,
        activeMove: null,
        participants: {$ne: Meteor.userId()}
      });
      if (game) {
        move.previous = game.moves[game.moves.length-1];
        move.game = game._id;
      } else {
        move.game = Games.insert({
          done: false,
          activeMove: null,
          participants: [],
          moves: []
        });
      }
      Moves.insert(move);
      Games.update(move.game, {$set: {activeMove: move._id}});
    }
    if (move.previous) {
      var prevMove = Moves.findOne(move.previous);
      if (!prevMove)
        throw new Error("missing the previous move");
      if (typeof prevMove.answer === "string") {
        move.description = prevMove.answer;
      } else {
        move.picture = prevMove.answer;
      }
    } else {
      move.start = true;
    }
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

    var gameSetter = {activeMove: null};
    var game = Games.findOne(assignment.game);
    if (game.moves.length >= GAME_LENGTH - 1)
      gameSetter.done = true;
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
      $set: { activeMove: null}
    });
    var game = Games.findOne(move.game);
    if (game && _.isEmpty(game.moves))
      Games.remove(game._id);
  });
}, 10*1000);
