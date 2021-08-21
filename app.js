require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

// Express needs to know which templating engine to use
// We need to set the option 'view engine' to the name of the package
// that will render our views
app.set('view engine', 'hbs');
// We need to tell express where to look up our view templates
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:

app.get('/', (request, response) => {
  response.render('home.hbs');
});

app.get('/artist-search', (req, res, next) => {
  spotifyApi
    .searchArtists('input-search-term')
    .then((data) => {
      console.log('The received data from the API: ', data.body);
      res.render('index', data); // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
