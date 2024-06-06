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

app.get('/', async (req, res) => {
    const { data, error } = await supabase.from('UserData').select('*');

    let postData = {
        username: 'V1kata',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMpIZbN3HsqSADBtsTrCB_An3KE-D3IIQknxdmXsR9AQ&s',
        skills: JSON.stringify({
            'skill1': 'skillImage1',
            'skill2': 'skillImage2',
            'skill3': 'skillImage3'
        }),
        projects: JSON.stringify({
            'project1': 'projectCover1',
            'project2': 'projectCover2',
        }),
        music: JSON.stringify({
            'musicName1': {
                'cover': 'coverImage',
                'author': 'authorImage'
            },
            'musicName2': {
                'cover': 'coverImage',
                'author': 'authorImage'
            }
        }),
        links: JSON.stringify({
            'platform1': 'linkForPlatform1',
            'platform2': 'linkForPlatform2'
        }),
    }

    // const { error } = await supabase.from('UserData').insert(postData);

    // if (error) {
    //     console.log(error)
    // }

    let html = ``;
    let dataToGetFrom = data[0];

    for (let value in dataToGetFrom) {

        if (typeof dataToGetFrom[value] == 'string' && dataToGetFrom[value].startsWith('[')) {
            for (let objData of JSON.parse(dataToGetFrom[value])) {
                html += `<p>${objData}</p>`;
            }
        } else {
            html += `<p>${dataToGetFrom[value]}</p>`
        }
    }

    res.write(html);
});

app.post('/create-music/:id', async (req, res) => {
    const { id } = req.params;
    let body = req.body;

    console.log(body)
    try {
        let result = await post('/classes/Music', body);
        const updatedUser = await updateUser(id, 'Music', result.objectId);

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
        const updatedUser = await updateUser(id, 'SocialNetwork', result.objectId);

        res.status(200).json({ message: 'Everything is cool', result, updatedUser });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

app.post('/create-skill/:id', async (req, res) => {
    const { id } = req.params;
    let body = req.body;

    console.log(body)
    try {
        let result = await post('/classes/Skills', body);
        const updatedUser = await updateUser(id, 'Skills', result.objectId);

        res.status(200).json({ message: 'Everything is cool', result, updatedUser });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

app.post('/create-project/:id', async (req, res) => {
    const { id } = req.params;
    let body = req.body;

    try {
        let result = await post('/classes/Projects', body);
        const updatedUser = await updateUser(id, 'Projects', result.objectId);

        res.status(200).json({ message: 'Everything is cool', result, updatedUser });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
})

app.get('/users', async (req, res) => {
    const data = await get('/classes/UserData');

    res.status(200).json({ data });
});

app.listen(3000, () => console.log('Server is running http://localhost:3000'));