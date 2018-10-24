var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var router = express.Router();

var app = express();
var store = require('json-fs-store')('./data');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

store.add({
        id: 1,
        name:"C programming",
        author:"Author1",
        description:"Some Description",
        price:"25",
        available_quantity:"10",
    }, function (err) {
        if (err) {
            throw err;
        }
    });
store.add({
        id: 2,
        name:"Python",
        author:"Author1",
        description:"Some Description",
        price:"30",
        available_quantity:"20",
    }, function (err) {
        if (err) {
            throw err;
        }
    });
store.add({
        id: 3,
        name:"Typescript",
        author:"Author2",
        description:"Some other Description",
        price:"10",
        available_quantity:"5",
    }, function (err) {
        if (err) {
            throw err;
        }
    });

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/books', function(req, res, next) {
  store.list(function (err, books) {
    res.render('books_view', { count: books.length, books: books});
  });
});


router.get('/new_book', function(req, res, next) {
  res.render('new_book', {});
});

router.post('/new_book', function(req, res, next) {
  console.log(req.body);
  var book = req.body;

  store.list(function(err, books) {
    book.id = books.length + 1;
    store.add(req.body, function (err) {
      if (err){
        throw err;
      }
      res.render('new_book', {});
    });
  });

});

router.post('/borrow_book', function(req, res, next) {
  console.log(req.body);
  store.list(function (err, books) {
    console.log(books);
    for(var i=0; i<books.length; i++) {
      var book = books[i];
      if(book.name == req.body.book_name) {
          book.available_quantity = book.available_quantity - 1;
          store.add(book, function (err) {
            if (err) throw err;
            res.render('books_view', { count: books.length, books: books});
          });
      }
    }

  });
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
