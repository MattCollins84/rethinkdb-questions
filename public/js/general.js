// Get all of the available questions
// - jQuery GET /questions
// - Stores questions in global questions array
// - Optional callback
const getQuestions = function(callback) {
  
  var questions = [];

  $.ajax("/questions")
  .complete(function(data) {
    
    // populate questions array
    data.responseJSON.forEach(q => {
      questions.push(q);
    });

    // sort questions by score
    questions.sort((a, b) => {
      return b.score - a.score;
    })

    return callback(questions)

  });

}

// Find the index of a question in the global questions array
// by ID, and replace with a new question that has the same ID
// - Array.findIndex (ES6)
const updateQuestion = function(q) {

  // find the index of the question in our array
  let index = app.questions.findIndex((el, i, arr) => { 
    return el.id == q.id 
  });

  // if this element isn't found - add it!
  if (index === -1) {
    app.questions.push(q);
  }

  // otherwise, update the array
  else {
    
    if (app.questions[index].score != q.score) {
      app.questions[index].score = q.score
    }

    if (app.questions[index].answer != q.answer) {
      app.questions[index].answer = q.answer
    }

  }

}

// Find the index of a question in the global questions array
// by ID, and delete it
// - Array.findIndex (ES6)
// - Array.splice
const deleteQuestion = function(q) {

  // find the index of the question in our array
  let index = app.questions.findIndex((el, i, arr) => { 
    return el.id == q.id 
  });

  // if this element is found - delete it!
  if (index !== -1) {
    app.questions.splice(index, 1)
  }

}

// Get the public IP for this app
// - jQuery GET /ip
const getIP = function(callback) {
  
  $.ajax("/ip")
  .complete(data => {
    return callback(data.responseJSON.ip)
  });

}