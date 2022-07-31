const express = require("express");
const router = express.Router();
const {
    URLSearchParams
} = require('url'); // can also use form-data
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args));

const client_id = '1003056966706413689'; // Paste your bot's ID here (in between the apostrophes)
const client_secret = 'SbjsGa4Ks1gWKKKZ-ng3xN-9m4swk3Qi'; // Paste your bot's secret here (in between the apostrophes).

router.use('', express.static(path.join(__dirname, 'public')));

router.get('/', (request, response) => {
    return response.sendFile('/expressRouter/index.html', {
        root: '.'
    });
});

router.get('/auth/discord', (request, response) => {
    return response.sendFile('/expressRouter/dashboard.html', {
        root: '.'
    });
});


module.exports = router;