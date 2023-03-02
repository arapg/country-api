const express = require('express');
const server = express();
//const { countries } = require('../database/database.js');

let countries = [
    {
      name: 'Sweden',
      population: 1000000,
      capital: 'CapitalA',
      language: 'LanguageA'
    },
    {
      name: 'CountryB',
      population: 5000000,
      capital: 'CapitalB',
      language: 'LanguageB'
    }
  ]

  server.get('/country/name=Sweden', (req, res) => {
    const { name } = req.params;
  
    if (!countries[name]) {
      return res.status(404).send('Country not found');
    } else {
        res.send(countries[name]);
    }

  });

 server.use(myMiddleware);
 server.use(verifySecretCode);

server.post('/add', (req, res, next) => {
    const country = req.body;
    countries.push(country);
    res.status(201).send('Added country.');
});

function verifySecretCode(req, res, next) {
    const secretCode = req.get('X-Secret-Code');
    if (secretCode === 'mySecretCode') {
      next(); // continue to the next middleware or route handler
    } else {
      res.status(401).send('Unauthorized'); // send a 401 Unauthorized response
    }
  };

  function myMiddleware(req, res, next) {
    if(req.headers['content-type'] !== 'application/json') {
        console.log('The request body was not of type JSON');
        next();
        return;
    }
    req.on('data', (chunk) => {
        const readableChunk = chunk.toString();
        const body = JSON.parse(readableChunk);
        req.body = body;
        next();
    })
}

server.listen(5050);
