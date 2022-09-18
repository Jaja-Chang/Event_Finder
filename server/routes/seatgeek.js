const express = require('express');
const { response } = require('express');
const https = require('https');
const axios = require('axios');


const router = express.Router();

router.get('/:query', (req, res) => {
    const url = `https://api.seatgeek.com/2/events?client_id=${dis.clientId}&performers.slug=${req.params.query}`;
    axios.get(url)
        .then( (response) => {
            res.writeHead(response.status, {'content-type': 'text/html'}); 
            return response.data;
        })
        .then( (rsp) => {
            // console.log(rsp);
            const s = createPage('Seatgeek Search', getEventInfo(rsp));
            res.write(s);
            res.end();
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
    const event_len = rsp.events.length;
    let s = "";
    let address_str = "";
    let current_event = "";
    let current_string = "";
    let vanue_latlon = "";

    s = '<div>There are ' + rsp.meta.total + ' events in total.</div>';
    for (let i = 0; i < event_len; i++) {
        current_event = rsp.events[i];
        address_str = current_event.venue.address + ', ' + 
            current_event.venue.city + ' ' + 
            current_event.venue.country + ' (' + 
            current_event.venue.extended_address + ') ';
        vanue_latlon = current_event.venue.location.lat + '%2C' + current_event.venue.location.lon;
        
        current_string = '<div>' + 
                            '<div>' + 
                                current_event.title + 
                            '</div>' + 
                            '<div>' +
                                'Time (UTC): ' + current_event.datetime_utc + '<br>' + 
                                'Venue: ' +  current_event.venue.name + '<br>' + 
                                'Location: ' + address_str + '<br>' + 
                                '<a href=' + current_event.url + '>More information here</a><br>' + 
                                '<a href=' + `http://localhost:3000/googlemap/${vanue_latlon}` + '>Hotel nearby</a><br>' + 
                                '<br>' + 
                            '</div>';
        s += current_string;
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

module.exports = router;
