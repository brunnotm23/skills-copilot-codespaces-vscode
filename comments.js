// Create web server
// Run: node comments.js
// Test: curl http://localhost:8000/comments
// Test: curl http://localhost:8000/comments/1
// Test: curl -X POST -H "Content-Type: application/json" -d '{"body":"comment body"}' http://localhost:8000/comments
// Test: curl -X PUT -H "Content-Type: application/json" -d '{"body":"new comment body"}' http://localhost:8000/comments/1
// Test: curl -X DELETE http://localhost:8000/comments/1

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var comments = [
    {id: 1, body: "comment 1"},
    {id: 2, body: "comment 2"},
    {id: 3, body: "comment 3"}
];
var commentNextId = 4;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.use(express.static(__dirname + '/public'));

app.get('/comments', function (req, res) {
    res.json(comments);
});

app.get('/comments/:id', function (req, res) {
    var commentId = parseInt(req.params.id);
    var foundComment = comments.filter(function (comment) {
        return comment.id === commentId;
    })[0];
    if (foundComment) {
        res.json(foundComment);
    } else {
        res.status(404).json({error: 'Comment not found'});
    }
});

app.post('/comments', function (req, res) {
    var newComment = req.body;
    newComment.id = commentNextId++;
    comments.push(newComment);
    res.json(newComment);
});

app.put('/comments/:id', function (req, res) {
    var commentId = parseInt(req.params.id);
    var foundComment = comments.filter(function (comment) {
        return comment.id === commentId;
    })[0];
    if (foundComment) {
        foundComment.body = req.body.body;
        res.json(foundComment);
    } else {
        res.status(404).json({error: 'Comment not found'});
    }
});

app.delete('/comments/:id', function (req, res) {
    var commentId =