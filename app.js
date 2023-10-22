const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const methodOverride = require('method-override');

const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverride('_method'));

let id = 0;
let todoItems = [];

app.get('/', (req, res) => {
    res.render('index', {todoItems});
});

app.post('/', (req, res) => {
    id++;
    const today = new Date();
    const newItem = req.body.item;
    todoItems.push({ id, date: today, item: newItem });
    res.redirect('/');
});

app.delete('/:id', (req, res) => {
    const { id } = req.params;
    todoItems = todoItems.filter(todo => {
        return todo.id !== Number(id); 
    });
    res.redirect('/');
});

app.get('/:id/edit', (req, res) => {
    const { id } = req.params;
    const editItem = todoItems.find(todoItem => Number(todoItem.id) === Number(id));
    if (editItem) {
        res.render('edit', {editItem});
    } else {
        res.render('undefined');
    }
});

app.patch('/:id', (req, res) => {
    const { id } = req.params;
    const foundIndex = todoItems.findIndex(todoItem => todoItem.id === Number(id));
    todoItems[foundIndex].item = req.body.item;
    res.redirect('/');
});

app.all('*', (req, res) => {
    res.render('undefined');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listen on port ${port}.`);
})
