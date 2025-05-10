const express = require('express');

const port = 8009;
const app = express();
const dbConnect = require('./config/dbconnection');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");


// middleware
app.use(cors());
app.use(express.urlencoded());
app.use(morgan("dev"))
app.use(bodyParser.json());
app.use(cookieParser());


// Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/recipes', require('./routes/recipe.routes'));
app.use('/comments', require('./routes/comment.routes'));

app.listen(port, ()=> {
    console.log(`Server start at http://localhost:${port}`);
})