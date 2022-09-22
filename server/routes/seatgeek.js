const express = require('express');
const { response } = require('express');
const https = require('https');
const axios = require('axios');

const router = express.Router();

router.get('/:query', (req, res) => {
    console.log("Looking for: ", req.params.query);
    const encoded_artist = encodeURIComponent(req.params.query);
    const url = `https://api.seatgeek.com/2/events?client_id=${dis.clientId}&performers.slug=${encoded_artist}`;
    axios.get(url)
        .then( (response) => {
            res.json(getEventInfo(response.data));
        })
        .catch( (error) => {
            console.error(error);
        })
})

const dis = {
    consumerKey: 'GQVelrWQttRjAJswGVOj',
    consumerSecret: 'LwITTZJVKlaepvZhCKToAWiXCrkkGajd',
    clientId: 'Mjg3ODc5Mzd8MTY2MTkxNDI3Mi4zNzA5ODEy'
};

function getEventInfo(rsp) {
    let json_file = [];

    s = '<div>There are ' + rsp.meta.total + ' events in total.</div>';
    for (let i = 0; i < rsp.events.length; i++) {
        let current_event = rsp.events[i];
        let address_str = current_event.venue.address + ', ' + 
            current_event.venue.city + ', ' + 
            current_event.venue.country + ' (' + 
            current_event.venue.extended_address + ') ';
        let vanue_latlon = current_event.venue.location.lat + '%2C' + current_event.venue.location.lon;
        let datetime = current_event.datetime_utc.split("T")
        let date = datetime[0];
        let time = datetime[1];

        json_file.push({"title": current_event.title, 
                        "date": date,
                        "time": time,
                        "venue": current_event.venue.name,
                        "location": address_str,
                        "url": current_event.url,
                        "latlon": vanue_latlon});

    }
    return json_file;
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

module.exports = router;
