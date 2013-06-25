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
    var answer = templ.find('#phrase').value;
    console.log(templ.find("#phrase").value);
    if (answer) {
      templ.find('#phrase').value = "";
      submitAnswer(answer);
    }
  }
});
