Template.start.events({
  'submit, click #done': function (evt, templ) {
    evt.stopPropagation();
    evt.preventDefault();
    var answer = templ.find('#phrase').value;
    if (answer) {
      templ.find('#phrase').value = "";
      submitAnswer(answer);
    }
  }
});
