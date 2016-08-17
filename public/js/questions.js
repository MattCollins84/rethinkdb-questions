// Handle the "Ask Question" form submission
// jQuery POST /question
// No data is added to the DOM on callback
const askQuestion = function(e) {

  // stop this form actually submitting
  e.preventDefault();

  // remove any previous validation
  $("form#questionForm div.form-group").removeClass("has-error");

  // capture our form
  let form = $("form#questionForm");

  // capture our question
  let question = form.serializeArray()[0].value;

  // perform some validation if the form hasn't been completed
  if (!question) {
    return $("form#questionForm div.form-group").addClass("has-error");
  }

  // submit and reset the form
  $.post("/question", { question: question }).complete(d => {
    $("form#questionForm").each(function(){
      this.reset();
    });
    $("form").addClass("hidden");
  });

}

// Handle upvoting a question
// jQuery POST /upvote/:id
// No data is added to the DOM on callback
const doUpvote = function(id) {

  $.post("/upvote/"+id)

}

// Handle downvoting a question
// jQuery POST /downvote/:id
// No data is added to the DOM on callback
const doDownvote = function(id) {

  $.post("/downvote/"+id)

}

// Handle upvoting a question
// jQuery POST /answer/:id
// No data is added to the DOM on callback
const answerQuestion = function(id) {
  
  let answer = $(`textarea[answer-id='${id}']`).val()
  $.post(`/answer/${id}`, {answer: answer})

}

// Toggle visibility of the "Ask a question" form
const showForm = function() {
  $("form#questionForm").toggleClass("hidden");
  $("form#questionForm input").focus();
}