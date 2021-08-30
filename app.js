const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
hbs.registerPartials(__dirname + '/views/partials');
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

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artist-search-results', (req, res) => {
  const keyword = req.query.keyword;
  spotifyApi
    .searchArtists(keyword)
    .then((data) => {
      console.log('The received data from the API: ', data.body.artists.items);
      res.render('artist-search-results', {
        artists: data.body.artists.items
      });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.get('/albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      console.log('Album information', data.body.items);
      res.render('albums', {
        albums: data.body.items
      });
    })
    .catch((err) => console.log('The following error occured: ', err));
});

app.get('/viewtracks/:albumId', (req, res, next) => {
  const albumId = req.params.albumId;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      console.log('Album tracks', data.body.items);
      res.render('viewtracks', {
        tracks: data.body.items
      });
    })
    .catch((err) =>
      console.log('The error while searching tracks occurred: ', err)
    );
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
