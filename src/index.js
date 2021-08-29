const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
require('colors');

const app =  express();
app.use(bodyParser.json());

const posts = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(posts);
})

app.post('/posts/:id/comments', (req, res) => {
    console.log("\nCreating new post".bgYellow.black);
    const id = randomBytes(4).toString('hex');
    console.log(`Id: ${id}`.bgYellow.black);
    const {title} = req.body;
    posts[id] = {
        id, title
    }
    console.log(`Created: ${JSON.stringify(posts)}`.bgYellow.black);
    res.status(201).send(posts[id]);
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