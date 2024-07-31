const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const port = process.env.PORT ;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});