const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const book = require('./controllers/bookController');
const cors = require('cors');
// const config = require('config');

// parser
app.use(express.json());
app.use(express.urlencoded({extended:false}))

//cors
app.use(cors());

// db config
const mongoURI = process.env.MONGO_URI;
mongoose.Promise = global.Promise;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    };
mongoose.connect(mongoURI, options);

const db = mongoose.connection;
db.on("error", console.error.bind(console,"Connection Error"));
db.once("open", () => console.log("Connected to mongodb!"));

// routes
// const booksRoute = require("./routes/book");
// const errorHandler = require("./middlewares/errorHandler");

app.get("/", (req, res)=>{
    res.json({
        "message": "Homepage"
    })
})
// app.use("/books", booksRoute);
// app.use(errorHandler);
app.route("/books")
    .get(book.getBooks)
    .post(book.postBook);
app.route("/books/:id")
    .get(book.getBook)
    .delete(book.deleteBook)
    .put(book.updateBook);

// server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening to ${PORT}`));

module.exports = app;