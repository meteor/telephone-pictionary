
Session.setDefault('pencilSize', "small");
Session.setDefault('pencilColor', "black");

Template.draw.rendered = (function () {
  var self = this;
  if (!self.canvas) {
    self.canvas = new fabric.Canvas("pictionary");
    self.canvas.setWidth(640);
    self.canvas.setHeight(480);
    self.autorun = Meteor.autorun(function () {
      self.canvas.isDrawingMode = Session.get('pencilActive');
      if (self.canvas.freeDrawingBrush) {
        self.canvas.freeDrawingBrush.width = {
          small: 1,
          medium: 4,
          large: 8
        }[Session.get('pencilSize')];
        self.canvas.freeDrawingBrush.color = Session.get('pencilColor');
      }
    });
  }
  CANVAS = self.canvas;
});

Template.draw.destroyed = function () {
  var self = this;
  if (self.autorun)
    self.autorun.stop();
};

Template.draw.colors = [ "black", "red", "orange", "yellow", "green", "blue", "indigo", "violet", "white"];


Template.draw.pencilActive = function () {
  return activeIfTrue(Session.get('pencilActive'));
};
Template.draw.moveActive = function () {
  return activeIfTrue(!Session.get('pencilActive'));
};
Template.draw.lgActive = function () {
  return activeIfTrue(Session.equals('pencilSize', "large"));
};
Template.draw.medActive = function () {
  return activeIfTrue(Session.equals('pencilSize', "medium"));
};
Template.draw.smActive = function () {
  return activeIfTrue(Session.equals('pencilSize', "small"));
};

Template.draw.events({
  'click .pencil': function () {
    Session.set('pencilActive', true);
  },
  'click .move': function () {
    Session.set('pencilActive', false);
  },
  'click .large': function () {
    Session.set('pencilSize', "large");
  },
  'click .medium': function () {
    Session.set('pencilSize', "medium");
  },
  'click .small': function () {
    Session.set('pencilSize', "small");
  },
  'click .remove': function (evt, templ) {
    if (templ.canvas && templ.canvas.getActiveObject()) {
      templ.canvas.remove(templ.canvas.getActiveObject());
    }
  }
});

Template.colorButton.active = function () {
  return activeIfTrue(Session.equals("pencilColor", this.toString()));
};

Template.colorButton.events({
  'click' : function () {
    Session.set('pencilColor', this.toString());
  }
});

Template.draw.events({
  'submit, click #done': function (evt, templ) {
    if (templ.canvas) {
      submitAnswer(templ.canvas.toObject());
    }
  }
});
