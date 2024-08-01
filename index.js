const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const port = process.env.PORT ;
const config = require('./config');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const initialize = async()=>{
    try {
        await oracledb.createPool(config);
        console.log('Oracle DB connection pool started');
    } catch (error) {
        console.error('init() error: ' + error.message);
    }
}

app.get('/customers', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT * FROM MFX_CUSTOMER1`, 
            [], // No binds
            { outFormat: oracledb.OUT_FORMAT_OBJECT } // Return the result as an object
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

initialize();