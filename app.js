// Node Modules
var express = require('express');
var fs = require('fs');
var app = express();
var dotenv = require('dotenv');
require('dotenv').config();
var PORT = process.env.PORT || 3000;

app.use(express.json());

// Path initializing
var path = './data.json';


var jsonData = fs.readFileSync(path, 'utf-8');

// If Null, then initialize with as an empty array

if (!jsonData) {
    fs.writeFileSync(path, '[]', 'utf-8');
}

var data = JSON.parse(jsonData);

app.get('/', (req, res) => {
    res.send(data);
});

// Create new data by name
app.post('/add', (req, res) => {
    const new_data = req.body;

    // Check if the name already exists
    const existingItem = data.find(item => item.name === new_data.name);
    if (existingItem) {
        return res.status(400).send('Item with the same name already exists');
    }

    data.push(new_data);
    updateJsonFile(res);
});

// Update data by name
app.put('/update', (req, res) => {
    const name = req.params.name;
    const index = data.findIndex(item => item.name === name);

    if (index === -1) {
        return res.status(404).send('Item not found');
    }

    const updated_data = req.body;
    data[index] = { ...data[index], ...updated_data };

    updateJsonFile(res);
});

// Delete data by name
app.delete('/delete', (req, res) => {
    const name = req.params.name;
    const index = data.findIndex(item => item.name === name);

    if (index === -1) {
        return res.status(404).send('Item not found');
    }

    data.splice(index, 1);

    updateJsonFile(res);
});

function updateJsonFile(res) {
    fs.writeFile(path, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).send('JSON file updated successfully');
    });
}
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
