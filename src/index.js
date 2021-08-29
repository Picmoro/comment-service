const express = require("express");
const {randomBytes} = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");

require('colors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
})

app.post('/posts/:id/comments', (req, res) => {
    console.log(`\n Creating new comment for ${req.params.id}`.bgYellow.black);
    const id = randomBytes(4).toString('hex');
    console.log(`Id: ${id}`.bgYellow.black);
    const {content} = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    const comment = {id, content};
    comments.push(comment);
    commentsByPostId[req.params.id] = comments;
    console.log(`Created: ${JSON.stringify(comment)}`.bgYellow.black);

    res.status(201).send(comments);
})

app.listen(4001, () => {
    console.info("\n" +
        " ██████  ██████  ███    ███ ███    ███ ███████ ███    ██ ████████       ███████ ███████ ██████  ██    ██ ██  ██████ ███████ \n" +
        "██      ██    ██ ████  ████ ████  ████ ██      ████   ██    ██          ██      ██      ██   ██ ██    ██ ██ ██      ██      \n" +
        "██      ██    ██ ██ ████ ██ ██ ████ ██ █████   ██ ██  ██    ██    █████ ███████ █████   ██████  ██    ██ ██ ██      █████   \n" +
        "██      ██    ██ ██  ██  ██ ██  ██  ██ ██      ██  ██ ██    ██               ██ ██      ██   ██  ██  ██  ██ ██      ██      \n" +
        " ██████  ██████  ██      ██ ██      ██ ███████ ██   ████    ██          ███████ ███████ ██   ██   ████   ██  ██████ ███████ \n" +
        "                                                                                                                            \n" +
        "                                                                                                                            \n");
    console.info('Listening on 4001'.bgGreen.black);
})