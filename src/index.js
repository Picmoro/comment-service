const express = require("express");
const {randomBytes} = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");

require('colors');
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
})

app.post('/posts/:id/comments', async (req, res) => {
    console.log(`\n Creating new comment for ${req.params.id}`.bgYellow.black);
    const id = randomBytes(4).toString('hex');
    console.log(`Id: ${id}`.bgYellow.black);
    const {content} = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    const comment = {id, content, status: 'pending'};
    comments.push(comment);
    commentsByPostId[req.params.id] = comments;
    console.log(`Created: ${JSON.stringify(comment)}`.bgYellow.black);
    try {
        console.log(`Echo event: type: "CommentCreated" data: ${JSON.stringify(comment)}`.bgYellow.black);
        await axios.post("http://localhost:4005/events", {
            type: "CommentCreated",
            data: {
                ...comment,
                postId: req.params.id
            }
        })
    } catch (e) {
        console.error(`${e.message}`.bgRed.black);
    }
    res.status(201).send(comments);
})

app.post('/events', async (req, res) => {
    const {type, data} = req.body;
    console.log(`Received event: type: ${req.body.type} data: ${JSON.stringify(req.body.data)}`.bgYellow.black);
    switch (type) {
        case "CommentModerated": {
            const {postId, id, status} = data;
            const comments = commentsByPostId[postId];
            const comment = comments.find(comment => {
                return comment.id === id
            })
            comment.status = status;
            try {
                console.log(`Echo event: type: "CommentUpdated" data: ${JSON.stringify(comment)}`.bgYellow.black);
                await axios.post("http://localhost:4005/events", {
                    type: "CommentUpdated",
                    data: {
                        ...comment,
                        postId
                    }
                })
            } catch (e) {
                console.error(`${e.message}`.bgRed.black);
            }
            break;
        }
    }
    res.send({});
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