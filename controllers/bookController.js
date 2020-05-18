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
exports.book_list = function(req, res) {
    Book.find({}, 'title author')
        .populate('author')
        .exec(function (err, list_books) {
            if (err) { return next(err); }
            res.render('book_list', { title: 'Book List', book_list: list_books });
          });
};

// Display detail page for a specific book.
exports.book_detail = function(req, res) {
    Book.findById({_id: req.params.id})
        .populate('genre')
        .exec(function (err, data) {
            console.log(data);
            
            if (err) next(err)
            res.render('book', data);
    })
};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
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
exports.book_create_post = function(req, res) {
    // check if entry already exists
        // check if isbn exists
        // Book.exists()
    console.log();
    
    /**
     *     title: {type: String, required: true},
            author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
            summary: {type: String, required: true},
            isbn: {type: String, required: true},
            genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}]
     */

    Book.create({})
    console.log(req.body);
    
    res.render('book_create_post', {book: req.body});
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