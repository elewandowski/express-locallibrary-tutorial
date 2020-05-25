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
    // validate fields

    function validate(book) {

    }

    function alreadyExists(book) {
        return async.tryEach([
                (cb) => 
                    Book.findOne({ title: book.title, author: book.author }) // turn into single query
                        .populate('author')
                        .exec((err, _data) => {
                            if (err) return cb(err)
                            if (!_data) return cb(new Error("no book with matching title and author found"))

                            cb(null, {
                                key: 'title',
                                value: _data.title,
                                author: _data.author.name
                            })
                        })
                ,
                (cb) => 
                    Book.findOne({ isbn: book.isbn })
                        .exec((err, _data) => {
                            if (err) return cb(err)
                            if (!_data) return cb(new Error("No book with matching ISBN found"))

                            cb(null, {
                                    key: 'isbn',
                                    value: _data.isbn
                                })
                        })
            ]).catch(e => {
                if (e.message === "No book with matching ISBN found") return false
                else next(e)
            })
    }

    const bookAlreadyExists = await alreadyExists(req.body)

    if (bookAlreadyExists) {
        res.render('book_create_already_exists', bookAlreadyExists)
    } else {
        await Book.create({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            genre: req.body.genre,
            isbn: req.body.isbn,
        }).then(async (book) => {
            book = await book.populate('author')
                        .populate('genre')
                        .execPopulate()
            const renderData = (function(book){
                const genres = book.genre.map(genre => genre.name);
                return {
                    title: book.title,
                    author: book.author.name,
                    summary: book.summary,
                    isbn: book.isbn,
                    genres: genres
                }
            })(book)
            res.render('book_create_post', renderData);
        }).catch((error) => {
            // return array of readable error strings
            function simplifyErrors(errors) {
                const simpleErrorsMap = {
                    "required": "is required",
                }
                return Object.entries(errors).map((val) => {
                    const nameOfFieldWithError = val[0]
                    const error = val[1].kind
                    const readableError = simpleErrorsMap[error]
                    return `${nameOfFieldWithError} ${readableError}`
                })
            }
            if (error.name === "ValidationError") {
                const simplifiedErrors = simplifyErrors(error.errors)
                res.render('book_create_validation_error', {errors: simplifiedErrors})
            }
            next(error)
        }
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