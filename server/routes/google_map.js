const express = require('express');
const { response } = require('express');
const https = require('https');
const axios = require('axios');

const router = express.Router();

router.get('/:query', async (req, res) => {
    const hotelUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${g_map.key}&location=${req.params.query}&type=hotel&radius=1500`;

    let placeIds = await getHotelsId(hotelUrl);
    let hotels = [];

    for (let i = 0; i < placeIds.length; i++) {
        let hotelInfo = await getHotelInfo(placeIds[i].place_id);
        hotels.push(hotelInfo);
    }
    res.json(hotels);
})

const g_map = {
    key: 'AIzaSyBIfa3hwbd9v4eIb6xg1dArdhK4p-PtSTo',
};

function getHotelsId(url) {
    let ids = [];
    return axios.get(url)
        .then( (response) => {
            for (let i = 1; i < response.data.results.length; i++) {
                ids.push({"name": `${response.data.results[i].name}`, "place_id": `${response.data.results[i].place_id}`});
            }
            return ids;
        }).catch( (error) => {
            console.error(error);
        })
}

function getHotelInfo(placeId) {
    let url = `https://maps.googleapis.com/maps/api/place/details/json?key=${g_map.key}&place_id=${placeId}&fields=name,international_phone_number,formatted_address,geometry,rating,permanently_closed,photo,url`;
    return axios.get(url)
        .then( (response) => {
            let res = response.data.result;
            return {
                "name": `${res.name}`, 
                "address": `${res.formatted_address}`,
                "phone_number": `${res.formatted_address}`,
                "lat": `${res.geometry.location.lat}`,
                "lon": `${res.geometry.location.lng}`,
                "rating": `${res.rating}`,
                "url": `${res.url}`,
                "photo": `${res.photos}`
            };
        })
        .catch( (error) => {
            console.error(error);
        })
}

function placeholder(url, res) {
    axios.get(url)
        .then( (response) => {
            res.writeHead(response.status, {'content-type': 'text/html'}); 
            return response.data;
        })
        .then( (rsp) => {
            const s = createPage('Hotel Search', getNearbyHotels(rsp));
            res.write(s);
            res.end();
        })
        .catch( (error) => {
            console.error(error);
        })
}

// function getNearbyHotels(rsp) {
//     let s = "";
//     let link = 'https://www.google.com/search?q=mickey&rlz=1C1ONGR_en-GBAU958AU958&oq=mickey&aqs=chrome..69i57j0i67i433j46i67i433j46i67j46i67i131i433j46i67j0i433i512j69i61.1170j0j7&sourceid=chrome&ie=UTF-8';
//     // for (let i = 0; i < rsp.results.length; i++) {
//     //     s += '<div>';
//     //     s += '<a href=' + link + '>' + rsp.results[i].name + '</a>';
//     //     s += '</div>';
//     // }
//     return s;
// }

// function createPage(title, rsp) {
//     const str = '<!DOCTYPE html>' + 
//             '<html><head><title>Discogs JSON</title></head>' + 
//             '<body>' + 
//             '<h1>' + title + '</h1>' + 
//             rsp +
//             '</body></html>';
//     return str;
// }

module.exports = router;
