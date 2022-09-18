const express = require('express');
const { response } = require('express');
const https = require('https');
const axios = require('axios');


const router = express.Router();

router.get('/:query', (req, res) => {
    const url = `https://api.discogs.com/database/search?country=${req.params.query}&key=${dis.consumerKey}&secret=${dis.consumerSecret}`;

    axios.get(url)
        .then( (response) => {
            res.writeHead(response.status, {'content-type': 'text/html'}); 
            return response.data;
        })
        .then( (rsp) => {
            const s = createPage('Discogs Search', getArtists(rsp));
            res.write(s);
            res.end();
        })
        .catch( (error) => {
            console.error(error);
        })
})

router.get('/hi', (req, res) => {
    res.json("Hello!");
})


const dis = {
    consumerKey: 'GQVelrWQttRjAJswGVOj',
    consumerSecret: 'LwITTZJVKlaepvZhCKToAWiXCrkkGajd'
};

function getArtists(rsp) {
    let s = "";
    
    // console.log(artist);
    for (let i = 0; i < rsp.results.length; i++) {
        let artist = rsp.results[i].title;
        artist = artist.split("-");
        console.log
        let artistDash = artist[0].replace(/ /g,"-");
        s += '<div>';
        s += '<a href=' + `http://localhost:3000/seatgeek/${artistDash}` + '>' + artist + '</a>';
        s += '</div>';
    }
    return s;
}

function createPage(title, rsp) {
    const str = '<!DOCTYPE html>' + 
            '<html><head><title>Discogs JSON</title></head>' + 
            '<body>' + 
            '<h1>' + title + '</h1>' + 
            rsp +
            '</body></html>';
    return str;
}

// const discogs = {
//     method: 'discogs.database.search',
//     api_key: 'GQVelrWQttRjAJswGVOj',
//     // format: 'json',
//     // media: 'photos',
//     // nojsoncallback: 1
// };

// TODO: fix the function
// function createDiscogsOptions() {
//     const options = {
//         hostname: 'api.discogs.com',
//         port: 443,
//         path: '/databasae/search/?',
//         method: 'GET'
//     }

//     const str = 
// }
// function createFlickrOptions(query, number) {
//     const options = {
//         hostname: 'api.discogs.com',
//         port: 443,
//         path: '/databasae/search/?',
//         method: 'GET'
//     }
//     const str = 'method=' + flickr.method + 
//             '&api_key=' + flickr.api_key + 
//             '&tags=' + query + 
//             '&per_page=' + number + 
//             '&format=' + flickr.media + 
//             '&nojsoncallback=' + flickr.nojsoncallback;
//     options.path += str;
//     return options;
// }


module.exports = router;
