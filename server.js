// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs')
var uniqid = require('uniqid');

// Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GET Route for second page
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Routes
app.get('/api/notes', (req, res) => {
     let db = JSON.parse(fs.readFileSync('db/db.json'));
    res.json(db);
    });

//To add notes    
app.post('/api/notes', (req, res) => {
    let db = JSON.parse(fs.readFileSync('db/db.json'));
    let userNote = {
        title: req.body.title,
        text: req.body.text,
        id: uniqid(),
        };
    db.push(userNote);
    fs.writeFile('db/db.json', JSON.stringify(db));
    res.json(userNote);
     });

// Deelete Route 
app.delete('/api/notes/:id', (req, res) => {
    let db = JSON.parse(fs.readFileSync('db/db.json'));
    let deleteNotes = db.filter(item => item.id !== req.params.id);
    fs.writeFileSync('db/db.json', JSON.stringify(deleteNotes));
    res.json({ message: 'Note deleted successfully' });
});

// GET Route for homepage
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// APP listener - starts the server
app.listen(PORT, () => {
    console.log(`Server available at localhost:${PORT}`);
});
