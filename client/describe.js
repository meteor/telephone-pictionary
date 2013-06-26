Template.describe.rendered = (function () {
  var self = this;
  if (!self.canvas) {
    self.canvas = new fabric.StaticCanvas("pictionary");
    self.canvas.setWidth(640);
    self.canvas.setHeight(480);
    self.autorun = Meteor.autorun(function () {
      var assignment = Session.get("assignment");
      if (assignment && assignment.picture) {
        self.canvas.clear();
        self.canvas.loadFromJSON(assignment.picture);
        self.canvas.renderAll();
      }
    });
  }
  CANVAS = self.canvas;
});

Template.describe.destroyed = function () {
  var self = this;
  if (self.autorun)
    self.autorun.stop();
};


Template.describe.events({
  'submit, click #done': function (evt, templ) {
    evt.stopPropagation();
    evt.preventDefault();
    // PHASE 5
    // use the template to find the '#phrase' input element
    // if it has a value, submit that.

    // note: check the submitAnswer helper function in main.js
  }
});
