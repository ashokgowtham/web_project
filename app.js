var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var router = express.Router();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var books = [{
    name:"C programming",
    author:"Author1",
    description:"Some Description",
    price:"25",
    available_quantity:"10",
}, {
    name:"Python",
    author:"Author1",
    description:"Some Description",
    price:"30",
    available_quantity:"20",
}, {
    name:"Typescript",
    author:"Author2",
    description:"Some other Description",
    price:"10",
    available_quantity:"5",
}];

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/books', function(req, res, next) {
  res.render('books_view', { count: books.length, books: books});
});


router.get('/new_book', function(req, res, next) {
  res.render('new_book', {});
});

router.post('/new_book', function(req, res, next) {
  console.log(req.body);
  books.push(req.body);
  res.render('new_book', {});
});

router.post('/borrow_book', function(req, res, next) {
  console.log(req.body);

  for(var i=0; i<books.length; i++) {
    if(books[i].name == req.body.book_name) {
        books[i].available_quantity = books[i].available_quantity - 1;
    }
  }

  res.render('books_view', { count: books.length, books: books});
});







app.use(router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
