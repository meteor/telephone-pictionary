/*
 * A move consists of
 * an assignee,
 * a game (foreign key),
 * a previous move (none
 * if the first move), an expiration, and an answer (supplied later).
*/
Moves = new Meteor.Collection("moves");

/*
 * A game consists of
 * A list of moves
 * A list of participants
 * A current active move (or none)
 * A boolean for its finished state.
 */
Games = new Meteor.Collection("games");


if (Meteor.isServer) {
  Meteor.publish('gamesForUser', function () {
    return  Games.find({
      done: true,
      participants: this.userId
    });
  });

  Meteor.publish('movesForGame', function (gameId) {
    var game = Games.find({_id: gameId, participants: this.userId});
    if (game) {
      return Moves.find({
        game: gameId
      });
    }
    return null;
  });
}
