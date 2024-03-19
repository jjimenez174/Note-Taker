// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs')


// Creates unique IDs
var uniqid = require('uniqid');

// Express app
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GET Route for homepage
module.exports = (app) => {
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
};

// Routing
module.exports = (app) => {
    app.get('/api/notes', (req, res) => {
        let db = JSON.parse(fs.readFileSync('db/db.json'));
        res.json(db);
    });

    app.post('/api/notes', (req, res) => {
        let db = JSON.parse(fs.readFileSync('db/db.json'));
        let userNote = {
            title: req.body.title,
            text: req.body.text,
            id: uniqid(),
        };
        db.push(userNote);
        fs.writeFileSync('db/db.json', JSON.stringify(db));
        res.json(userNote);
    });

    app.delete('/api/notes/:id', (req, res) => {
        let db = JSON.parse(fs.readFileSync('db/db.json'));
        let deleteNotes = db.filter(item => item.id !== req.params.id);
        fs.writeFileSync('db/db.json', JSON.stringify(deleteNotes));
        res.json(deleteNotes);
    });
};

// APP listener - starts the server
app.listen(PORT, () => {
    console.log(`Server available at localhost:${PORT}`);
});

