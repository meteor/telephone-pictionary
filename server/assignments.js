GAME_LENGTH = 3;

// Meteor.methods sets up RPCs you can access with Meteor.call('methodName', args...)
Meteor.methods({
  // Return an assignment for the current user.
  getAssignment: function () {
    if (!Meteor.userId())
      throw new Meteor.Error(403, "Must be logged in to play");

    // PHASE 3

    // This is the most involved, coding-wise, of the exercises in this
    // project.  It's mostly mongodb manipulations.  Before you continue here,
    // take a look at model.js for what fields will be in your db.

    // Use mongo to try and find a move we're already assigned (PHASE 6 -- and
    // that hasn't expired).

    // If there's no such move, create one
    // * Assigned to us
    // * Expiring in 100 seconds
    // * With an answer of null so far
    // * Create an _id for it explicitly (why?)

    // Find a game to put the move in
    // * That isn't done
    // * With no activeMove
    // * Where we're not already a participant (you can leave this one out for a while)
    //   (Hint: {$ne: foo}, when matched against a list, means "no member of the list is foo)

    // If we found the a game, set up the `previous` field on the move with the
    // previous move in that game.

    // If we haven't found a game, set one up. (hint: It's not done, has no
    // participants yet, and no moves yet)

    // Insert into the Moves table the new move
    // Update the Games table with the new active move for that game

    // You're going to return the move, but augment it first, depending on the
    // previous move.
    // * If there was no previous move, set the `start` field to true.
    // * If the previous move was a picture (the `answer` field on the previous
    //   move will be an object), set the `picture` field to the previous
    //   answer.
    // * If the previous move was a description (the `answer` field on the
    //   previous move will be a string), set the `description` field to the
    //   previous answer.
  },
  // Answer a particular assigned move with the given answer
  submitAnswer: function (assignmentId, answer) {
    if (!Meteor.userId())
      throw new Meteor.Error(403, "Must be logged in to play");
    // This makes sure the assignmentId the client passed us is actually a
    // string.  Prevents mongo injection attacks.
    check(assignmentId, String);
    // Do more answer validation.
    var assignment = Moves.findOne(assignmentId);
    if (assignment.expires.valueOf() < new Date().valueOf())
      throw new Meteor.Error(403, "Assignment has expired");
    var previous = Moves.findOne(assignment.previous);
    if (previous && typeof previous.answer === 'string')
      check(answer, Object);
    else
      check(answer, String);

    // PHASE 5

    // Set the answer field on the move in the Moves table

    // Find the relevant game, and
    // * Set its activeMove back to null
    // * Mark it done if it is done
    // * Add the current userId to the list of participants
    // * Add the current move to the list of moves.

    // For the last two, the mongo updaters $addToSet or $push may be useful.
  }
});

Meteor.setInterval(function () {
  // PHASE 6

  // Find all the moves that are expired but not answered.

  // Delete them from the Moves table.
  // Find the relevant game, and unset them as the activeMove
  // If the game is otherwise empty, just remove it from the Games table.
}, 10*1000);
