const express = require('express');
const { response } = require('express');
const https = require('https');
const axios = require('axios');

const router = express.Router();

router.get('/:query', (req, res) => {
    const url = `https://musicbrainz.org/ws/2/artist?query=area:${req.params.query}&fmt=json`;

    axios.get(url)
        .then( (response) => {
            res.json(getArtists(response.data));
        })
        .catch( (error) => {
            console.error(error);
        })
})

function getArtists(rsp) {
    let json_file = [];
    
    for (let i = 0; i < rsp.artists.length; i++) {
        let artist_name = rsp.artists[i].name;
        let decoded_artist_name = decodeURI(artist_name);
        let artist_dash = decoded_artist_name.replace(/ /g,"-");

        json_file.push({"artist_dash": artist_dash, "name": decoded_artist_name});
    }
    return json_file;
}

module.exports = router;
