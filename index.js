const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();

const Note = require('./models/notes.js');

mongoose.connect(process.env.databaseUrl || 'mongodb://localhost:27017/note', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.redirect('/notes');
});

app.get('/notes', async (req, res) => {
    const notes = await Note.find({});
    res.render('index', { notes });
});

app.post('/notes', async (req, res) => {
    const { message } = req.body;
    const note = await new Note({ message: message, canceled: false });
    note.save();
    res.redirect('/notes');
});

app.put('/notes/:id', async (req, res) => {
    const { message } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { message: message, checked: false });
    res.redirect('/notes');
});

app.delete('/notes/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.redirect('/notes');
});

app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log(process.env.PORT || 3000);
    console.log("SERVER STARTED");
});