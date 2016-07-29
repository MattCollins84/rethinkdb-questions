// Sort the questions by score and generate the initial chart data
// - Array.sort
// - Array.reduce
const generateChartData = function() {

  questions.sort((a, b) => {
    return b.score - a.score;
  })

  if (questions.length === 0) {
    return [];
  }

  let now = Math.floor(new Date().getTime() / 1000);

  let avg = questions.reduce((a, b) => { 
    return { 
      score: (a.score + b.score) 
    }
  }, { score: 0 })
  .score / questions.length;

  let len = questions.length

  let data = [
    {
      label: "Highest score",
      values: [ {time: now, y: questions[0].score} ],
      range: "range-r"
    },
    {
      label: "Lowest Score",
      values: [ {time: now, y: questions[len - 1].score} ],
      range: "range-r"
    },
    {
      label: "Average Score",
      values: [ {time: now, y: avg } ],
      range: "range-r"
    }
  ]

  return data;

}

// Generate an incremental update for the chart
// - generateChartData()
const generateChartUpdate = function() {

  let data = generateChartData();

  return [data[0].values[0], data[1].values[0], data[2].values[0]]

}

// Generate the chart including the first set of data
// generateChartData()
const generateChart = function() {

  // Generate the chart using chart global
  chart = $('#lineChart').epoch({
    type: 'time.line',
    data: generateChartData(),
    axes: ['right', 'bottom'],
    range: {
      right: "range-r"
    }
  });

  // Simulate new data points to keep chart moving
  // If you have an active stream of data then you
  // don't need this
  setInterval(() => {
    if (questions.length) {
      chart.push(generateChartUpdate())
    }
  }, 1000)

}