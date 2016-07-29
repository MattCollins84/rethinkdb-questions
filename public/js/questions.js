// Render the HTML for each individual question
// - question (The question object)
// If accessing this app via localhost, questions will be answerable
const render = function(question) {

  // create all of our elements
  let div = $("<div>", {id: question.id, "class": "col-lg-12"});
  let upvote = $("<button>", {type: "button", class: "mr10 btn btn-success btn-xs glyphicon glyphicon-chevron-up", href: "#", "up-id": question.id})
      .click(doUpvote)
  let downvote = $("<button>", {type: "button", class: "mr10 btn btn-danger btn-xs glyphicon glyphicon-chevron-down", href: "#", "down-id": question.id})
      .click(doDownvote)
  
  let score = $("<span>", { class: "mr10 label label-info"})
  score.text(question.score);
  let answered = $("<span>", { class: "mr10 label label-"+(question.answer?"success":"warning")}).text((question.answer?"":"NOT ")+"ANSWERED")
  let h4 = $("<h4>");
  h4.text(question.question);
  let answer = $("<p>").text(question.answer);
  let textarea = $("<textarea>", { "answer-id": question.id, "class": "form-control", "rows": 3})
  let answerBtn = $("<button>", { type: "button", class: "btn btn-success mt10", "answer-id": question.id})
      .text("Answer")
      .click(answerQuestion)
  let hr = $("<hr>");

  // Append all of the elements to the containing div
  div.append(upvote)
  div.append(score)
  div.append(downvote)
  div.append(answered)
  div.append(h4)
  
  // if we have an answer, display that
  if (question.answer) {
    div.append(answer);
  }
  
  // if we are on localhost and don't have an answer, show the answer form
  if (location.hostname === "localhost" && !question.answer) {
    div.append(textarea);
    div.append(answerBtn);
  }
  
  div.append(hr)

  return div;

}

// Sort questions by score and render them
// - Array.sort
// - render()
const renderQuestions = function() {

  $('#questions').html("");

  questions.sort((a, b) => {
    return b.score - a.score;
  })

  questions.forEach(question => {

    $('#questions').append(render(question));

  });

}

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
const doUpvote = function() {

  let id = $(this).attr("up-id");

  $.post("/upvote/"+id)

}

// Handle downvoting a question
// jQuery POST /downvote/:id
// No data is added to the DOM on callback
const doDownvote = function() {

  let id = $(this).attr("down-id");

  $.post("/downvote/"+id)

}

// Handle upvoting a question
// jQuery POST /answer/:id
// No data is added to the DOM on callback
const answerQuestion = function(e) {

  let id = $(this).attr("answer-id");

  let answer = $(`textarea[answer-id='${id}']`).val()

  $.post(`/answer/${id}`, {answer: answer})

}