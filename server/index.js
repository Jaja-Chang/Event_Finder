const path = require('path');
const express = require('express');
const bucketRouter = require('./routes/bucket_counter')
const seatgeekRouter = require('./routes/seatgeek');
const googlemapRouter = require('./routes/google_map');
const musicbrainzRouter = require('./routes/musicbrainz');

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

// Serve out any static assets correctly
app.use('/counter', bucketRouter)
app.use('/seatgeek', seatgeekRouter)
app.use('/googlemap', googlemapRouter)
app.use('/musicbrainz', musicbrainzRouter)

app.use(express.static('../client/build'))

// New api routes should be added here.
// It's important for them to be before the `app.use()` call below as that will match all routes.
app.use( (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'))
})

app.listen(port, function () {
  console.log(`Express app listening at http://${hostname}:${port}/`);
});

