require('dotenv').config();
const axios = require('axios');
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('static'));

// get a unique state value for each OAuth request
function generateState() {
  return Math.random().toString(36).substr(2, 10); // random string
}

app.get('/auth', (req, res) => {
  const canvasInstallUrl = 'https://canvas.instructure.com';
  const redirectUri = encodeURIComponent('http://localhost:3000/oauth-callback');
  const state = generateState(); // generate a unique state value
  const clientId = process.env.CANVAS_CLIENT_ID;

  // store the state value in a temporary variable or session if needed for comparison later
  req.session.oauthState = state;

  res.redirect(
    `${canvasInstallUrl}/login/oauth2/auth?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${redirectUri}&scope=/auth/userinfo`
  );
});

app.get('/oauth-callback', ({ query: { code, state } }, res) => {
  // Verify state here for CSRF protection
  const expectedState = req.session.oauthState; // Retrieve the expected state value from session
  if (!expectedState || state !== expectedState) {
    return res.status(403).json({ error: 'CSRF protection failed' });
  }

  // Continue with token exchange
  const body = {
    grant_type: 'authorization_code',
    client_id: process.env.CANVAS_CLIENT_ID,
    client_secret: process.env.CANVAS_CLIENT_SECRET,
    redirect_uri: 'http://localhost:3000/oauth-callback',
    code,
  };

  const opts = { headers: { accept: 'application/json' } };

  axios
    .post('https://canvas.instructure.com/login/oauth2/token', body, opts)
    .then((_res) => _res.data.access_token)
    .then((token) => {
      console.log('My token:', token);
      res.redirect(`/?token=${token}`);
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});

app.listen(3000);
console.log('App listening on port 3000');



// i referenced this repo https://github.com/danba340/oauth-github-example at static/index.js