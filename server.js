const express = require('express');
const app = express();
const sql = require('mssql');

app.get('/', async (req, res) => {
    res.write('<p style="color: red;">Working</p>');
})

app.listen(3000, () => console.log('Server is running http://localhost:3000'));