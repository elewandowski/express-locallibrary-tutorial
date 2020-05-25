const async = require('async')

const book = {}

if (Math.random() > 0.5) {
    book.isbn = '123'
} else {
    book.title = '123'
}

// console.log(book)

function checkIfExists(book) {
    return new Promise((resolve, reject) => {
        async.tryEach([
            function(cb) {
                // data = false
                console.log('the first function is running')
                cb(null, book)
            },
            function(cb) {
                const error = 'null'
                const data = 'data'
                // if (!book.isbn) 
                console.log('the second function is running')
                cb(null, "success")
            }
        ], function(error, data) {
            console.log('the final callback is running')
            if (error) reject(error)
            else resolve(data)
        })
    })
}

async.tryEach([
    function getDataFromFirstWebsite(callback) {
        // Try getting the data from the first website
        callback("err1", false);
    },
    function getDataFromSecondWebsite(callback) {
        // First website failed,
        // Try getting the data from the backup website
        callback("err2", "data2");
    }
],
// optional callback
function(err, results) {
    console.log("err", err)
    console.log("results", results)
});




// (async function run() {
//     const bookAlreadyExists = await checkIfExists().catch(e => console.log(`the promise was rejected with ${e}`))
//     console.log(bookAlreadyExists)
    
// })()
// console.log('fuck')