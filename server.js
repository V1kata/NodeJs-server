const express = require('express');
const app = express();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://jsqfijyqkatobeptpuwo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzcWZpanlxa2F0b2JlcHRwdXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NzEyMzAsImV4cCI6MjAzMTQ0NzIzMH0.ADaf9peWyi_aSgkPtjfwye4S0QnvcWHxI7VUz0GCgJw')

app.get('/', async (req, res) => {
    const { data, error } = await supabase.from('UserData').select('*');

    // let postData = {
    //     username: 'V1kata',
    //     avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMpIZbN3HsqSADBtsTrCB_An3KE-D3IIQknxdmXsR9AQ&s',
    //     skills: JSON.stringify(['driving', 'frontend', 'react']),
    //     projects: JSON.stringify(['sudoku', 'moms-site']),
    //     music: JSON.stringify(['alive-neffex', 'idk-here']),
    //     links: JSON.stringify(['https://github.com', 'https://youtube.com']),
    // }

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

app.listen(3000, () => console.log('Server is running http://localhost:3000'));