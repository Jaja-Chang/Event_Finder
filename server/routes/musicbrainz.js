const express = require('express');
const { response } = require('express');
const https = require('https');
const axios = require('axios');


const router = express.Router();

router.get('/:query', (req, res) => {
    const url = `https://musicbrainz.org/ws/2/artist?query=area:${req.params.query}&fmt=json`;

    axios.get(url)
        .then( (response) => {
            res.writeHead(response.status, {'content-type': 'text/html; charset=utf-8'}); 
            return response.data;
        })
        .then( (rsp) => {
            const s = createPage('MusicBrainz Search', getArtists(rsp));
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
    
    for (let i = 0; i < rsp.artists.length; i++) {
        let artist_name = rsp.artists[i].name;
        // let decoded_aartist_name = decodeURI(artist_name);
        // artist = artist.split("-");
        let artist_dash = artist_name.replace(/ /g,"-");
        // let encoded_artist_dash = fixedEncodeURI(artist_name).replace(/ /g,"-");
        // let artist_url = url.parse(encoded_artist_dash, true).path;
        s += '<div>';
        s += '<a href=' + `http://localhost:3000/seatgeek/${artist_dash}` + '>' + artist_name + '</a>';
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

// function createPage(title, rsp) {
//     const str = '<!DOCTYPE html>' + 
//             '<html><head><title>Discogs JSON</title></head>' + 
//             '<body>' + 
//             '<h1>' + title + '</h1>' + 
//             rsp +
//             '</body></html>';
//     return str;
// }

// function fixedEncodeURI(str) {
//     return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
// }

module.exports = router;
