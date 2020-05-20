const Book = require('../models/book');
const BookInstance = require('../models/bookinstance');
const Author = require('../models/author');
const Genre = require('../models/genre');

const async = require('async')

exports.index = function(req, res) {
    async.parallel({
        book_count: function(cb) {
            Book.countDocuments({}, cb)
        },
        book_instance_count: function(cb) {
            BookInstance.countDocuments({}, cb)
        },
        book_instance_available_count: function(cb) {
            BookInstance.countDocuments({status: 'Available'}, cb)
        },
        author_count: function(cb) {
            Author.countDocuments({}, cb)
        },
        genre_count: function(cb) {
            Genre.countDocuments({}, cb)
        }
    }, function (err, results) {
        res.render('index', {title: "My express Library", error: err, data: results});
    });
};

// Display list of all books.
exports.book_list = function(req, res, next) {
    Book.find({}, 'title author')
        .populate('author')
        .exec(function (err, list_books) {
            if (err) next(err);
            res.render('book_list', { title: 'Book List', book_list: list_books });
          });
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {
    Book.findById({_id: req.params.id})
        .populate('genre')
        .exec(function (err, data) {
            if (err.name === "CastError") res.send(`No book found with ID '${req.params.id}'`)
            if (err) next(err)
            res.render('book', data);
    })
};

// Display book create form on GET.
exports.book_create_get = function(req, res, next) {
    async.parallel({
        authors: cb => Author.find({}, cb),
        genres: cb => Genre.find({}, cb)
    }, function(err, results) {
        if(err) next(err)
        res.render('book_create_get', {
            title: "Create a book",
            authors: results.authors,
            genres: results.genres
        })
    })
};

// Handle book create on POST.
exports.book_create_post = async function(req, res, next) {
    function checkIfExists(book) {
        // TODO make db requests in series, and escaping, as soon as match is found
        return async.parallel([
            (cb) => 
                Book.findOne({ title: book.title, author: book.author })
                    .populate('author')
                    .exec((err, data) => {
                        if (data) err = false; // break parallel control structure, if data found
                        cb(err, data ? {
                            key: 'title',
                            value: data.title,
                            author: data.author.name
                        } : null);
                    })
            ,
            (cb) => 
                Book.findOne({ isbn: book.isbn })
                    .exec((err, data) => {
                        if (data) err = false;
                        return cb(err, data ? {
                            key: 'isbn',
                            value: data.isbn
                         } : null);
                    })
        ]) 
    }

    const bookAlreadyExists = await checkIfExists(req.body)
    if (bookAlreadyExists) {
        res.render('book_create_already_exists', bookAlreadyExists)
    } else {
        Book.create({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            genre: req.body.genre,
            isbn: req.body.isbn,
        }, (err, result) => {        
            if(err) next(err)
            res.render('book_create_post', result);
        })    
    }
};

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};