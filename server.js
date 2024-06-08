const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const { createClient } = require('@supabase/supabase-js');
const { get, post, put } = require('./api');
const updateUser = require('./helperFn');

const supabase = createClient('https://jsqfijyqkatobeptpuwo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzcWZpanlxa2F0b2JlcHRwdXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NzEyMzAsImV4cCI6MjAzMTQ0NzIzMH0.ADaf9peWyi_aSgkPtjfwye4S0QnvcWHxI7VUz0GCgJw')

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get('/image/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename)

    res.sendFile(filePath, err => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
});

app.post('/create-music/:id', upload.none(), async (req, res) => {
    const { id } = req.params;
    let body = req.body;
    try {
        let result = await post('/classes/Music', body);
        const updatedUser = await updateUser(id, 'music', 'Music', result.objectId);

        res.status(200).json({ message: 'Everything is cool', result, updatedUser });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
})

app.post('/create-user', upload.single('avatarImage'), async (req, res) => {
    try {
        let data = await post('/classes/UserData', { ...req.body, avatarImage: req.file.filename });
        res.status(200).json({ message: 'Everything is cool', data });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

app.post('/create-social/:id', upload.none(), async (req, res) => {
    const { id } = req.params;
    let body = req.body;

    console.log(body)
    try {
        let result = await post('/classes/SocialNetwork', body);
        const updatedUser = await updateUser(id, 'social', 'SocialNetwork', result.objectId);

        res.status(200).json({ message: 'Everything is cool', result, updatedUser });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

app.post('/create-skill/:id', upload.none(), async (req, res) => {
    const { id } = req.params;
    let body = req.body;

    try {
        let result = await post('/classes/Skills', body);
        const updatedUser = await updateUser(id, 'skills', 'Skills', result.objectId);

        res.status(200).json({ message: 'Everything is cool', result, updatedUser });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

app.post('/create-project/:id', upload.none(), async (req, res) => {
    const { id } = req.params;
    let body = req.body;

    try {
        let result = await post('/classes/Projects', body);
        const updatedUser = await updateUser(id, 'projects', 'Projects', result.objectId);

        res.status(200).json({ message: 'Everything is cool', result, updatedUser });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
})

app.get('/users', async (req, res) => {
    const data = await get('/classes/UserData?include=projects');

    res.status(200).json({ data });
});

app.get('/userDetails/:id', upload.none(), async (req, res) => {
    const { id } = req.params;

    try {
        const data = await get(`/classes/UserData/${id}?include=social&include=music&include=projects&include=skills`);
        console.log(data)
        res.status(200).json({ data });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
})

app.listen(3000, () => console.log('Server is running http://localhost:3000'));