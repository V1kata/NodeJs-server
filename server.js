const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://jsqfijyqkatobeptpuwo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzcWZpanlxa2F0b2JlcHRwdXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NzEyMzAsImV4cCI6MjAzMTQ0NzIzMH0.ADaf9peWyi_aSgkPtjfwye4S0QnvcWHxI7VUz0GCgJw')

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        res.json({ fileUrl: `/uploads/${req.file.filename}` });
    } else {
        res.status(400).send('No file uploaded.');
    }
});

app.get('/image/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

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

app.post('/create-portfolio', upload.fields([
    { name: 'avatarImage', maxCount: 1 },
    { name: 'skillsImage', maxCount: 10 },
    { name: 'projectsImage', maxCount: 10 },
    { name: 'musicImage', maxCount: 10 }
]), (req, res) => {
    console.log(req.body)
    console.log(req.files)
})

app.listen(3000, () => console.log('Server is running http://localhost:3000'));