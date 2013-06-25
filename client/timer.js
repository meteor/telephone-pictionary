var timerDep = new Deps.Dependency();

Template.timer.timeLeft = function () {
  timerDep.depend();
  var assignment = Session.get("assignment");
  var left = Math.ceil( (assignment.expires.valueOf() - new Date().valueOf())/1000);
  if (left <= 0)
    Session.set("assignment", null);
  return left;
};

Meteor.setInterval(function () {
  timerDep.changed();
}, 500);
