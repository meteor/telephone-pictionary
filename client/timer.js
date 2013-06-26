var timerDep = new Deps.Dependency();

Template.timer.timeLeft = function () {
  return "TIMER";
  // PHASE 6
  // Depend on the timer dependency so we rerun whenever it's changed.
  // Calculate the time in seconds left on the current assignment, and return it.
};

Meteor.setInterval(function () {
  // Tell the dependency that it has changed.
}, 500);
