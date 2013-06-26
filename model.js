/*
 * A move consists of
 * assignee -- _id of the user assigned this move
 * game -- _id of the game this belongs to
 * previous -- _id of the previous move in the game, or null
 * expires -- Date at which this move expires
 * answer -- string description or object canvas contents, or null if not specified yet.
*/
Moves = new Meteor.Collection("moves");

/*
 * A game consists of:
 * moves -- list of move _ids
 * participants -- list of user _ids
 * activeMove -- the _id of the current active move in this game, or null
 * done -- true iff this game is done.
 */
Games = new Meteor.Collection("games");


if (Meteor.isServer) {
  // PHASE 7
  // Publish all games that are done and the current user is a participant

  // Publish all moves for a given game, as long as the current user is a participant.
}
