const express = require('express')
const request = require('request')
const fetch = require('node-fetch')
const app = express()
const port = 8080
var bodyParser = require('body-parser')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'  // SET SSL certificate verification to FALSE

const question_list = [
  "Why does Little Red Riding Hood visit her grandmother?",
  "Why does Little  Red Riding Hood's mother give Little Red Riding Hood a basket of treats?",
  "Why does Little Red Riding Hood's mother tell Little Red Riding Hood not to talk to strangers?",
  "Whom does Little Red Riding Hood meet in the forest?",
  "What does the wolf ask Little Red Riding Hood?",
  "Does Little Red Riding Hood answer the wolf?",
  "Is Little Red Riding Hood supposed to answer the wolf?",
  "Why is Little Red Riding Hood not supposed to answer the wolf?",
  "What does the wolf do after Little Red Riding Hood tells him where she is going?",
  "What does the wolf do when he gets to Little Red Riding Hood's grandmother's house?",
  "Why does Little Red Riding Hood ask the wolf about his eyes, ears and teeth?",
  "What does the wolf try to do to Little Red Riding Hood?",
  "Who saves Little Red Riding Hood?",
  "What is the lesson of the story?"
]

const answer_list2 = [
  "Little Red Riding Hood visits her grandmother because her grandmother is sick.",
  "Little Red Riding Hood's mother gives her a basket of treats  to give to her grandmother to help her feel better.",
  "Little Red Riding Hood's mother tells her not to talk to strangers to keep her from getting hurt.",
  "Little Red Riding Hood meets a wolf in the forest.",
  "The wolf asks Little Red Red Riding Hood what she's doing in the forest.",
  "Little Red Riding answers the wolf and tells him she's going to see her grandmother.",
  "Little Red Riding Hood is not supposed to answer the wolf.",
  "Little Red Riding Hood is not supposed to answer the wolf because the wolf is a stranger.",
  "After Little Red Riding Hood tells the wolf where she's going, he takes a shortcut to her grandmother's house.",
  "When the wolf gets to Little Red Riding Hood's grandmother's house, he locks her in the closet, dresses up like her, and gets in her bed.",
  "Little Red Riding Hood asks the wolf about his eyes, ears, and teeth because he doesn't look like her grandmother.",
  "The wolf tries to eat Little Red Riding Hood.",
  "The lumberjack saves Little Red Riding Hood.",
  "The lesson of the story is that children shouldn't talk to strangers because bad things can happen if they do."
]

var url = 'https://alistempirefoundation.org:5041/test'
var defaultData = {
  "s1": "To be or not to be, it is a question.",
  "s2": answer_list2
}

require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

/*
postData(url, defaultData)
  .then(data => console.log(data)) // JSON from `response.json()` call
  .catch(error => console.error(error))
*/

function postData(url, data) {
  // Default options are marked with *
  return fetch(url, {
    body: JSON.stringify(data), // must match 'Content-Type' header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
      'user-agent': 'PostmanRuntime/7.25.0',
      'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
  })
  .then(response => response.json()) // parses response to JSON
}

app.get('/ask_question/p1', function(req, res){
  res.send('Ask Question Page: using post body')
})

// the post function of QA system
app.post('/ask_question/p1', function(req, res) { 
  var params = req.body.question
  var QAResponseClass = {
    "type":       "1",
    "question1":  "default1",
    "question2":  "default2",
    "question3":  "default3",
    "answer1":    "answer1",
    "answer2":    "answer2",
    "answer3":    "answer3"
  }
  console.log(params)
  postData(url, {"s1": params, "s2": question_list})
    .then(function(data){
      var newList = []
      for (var i = 0; i < 14; i++) {
        data.rates[i] = Number(data.rates[i])
      }
      if (Math.max(...data.rates) > 0.92){
        QAResponseClass.type = "1"
      }
      else if (Math.max(...data.rates) > 0.5){
        QAResponseClass.type = "2"
      }
      else QAResponseClass.type = "3"
      for (var i = 0; i < 14; i++){
        newList.push([data.rates[i], i+1])
      }
      newList.sort(function(x,y){
          return y[0]-x[0]
      })
      console.log(newList)
      QAResponseClass.question1 = question_list[newList[0][1]-1]
      QAResponseClass.question2 = question_list[newList[1][1]-1]
      QAResponseClass.question3 = question_list[newList[2][1]-1]
      QAResponseClass.answer1 = answer_list2[newList[0][1]-1]
      QAResponseClass.answer2 = answer_list2[newList[1][1]-1]
      QAResponseClass.answer3 = answer_list2[newList[2][1]-1]
      console.log(QAResponseClass)
      res.json(QAResponseClass)
    })
    .catch(error => console.error(error))
})


app.listen(port, () => console.log('Example app listening at localhost:8080'))