const express = require('express');
const server = express();
const { countries } = require('../database/database.js');
require('dotenv').config();

const securityCode = process.env.SECURITY_CODE;

server.use(express.json());


server.get('/countries', (req, res) => {
  res.send(countries);
})

server.get('/country/:name', (req, res) => {
  const { name } = req.params;

  if (!countries[name]) {
    return res.status(404).send('Country not found');
  } else {
      res.send(countries[name]);
  }
});

server.post('/add/:security', (req, res, next) => {
    const { security } = req.params;

    if( security === securityCode) {

      if(Object.keys(req.body).length !== 4) {
        return res.status(400).send('Expected 4 keys, received too many or too few');
      } else {
        const { name, population, capital, language } = req.body;
        countries[name] = { population, capital, language};
        
        res.status(201).send('Added country.');
      };
    } else {
      res.status(401).send('You are not authorized')
    };
});

server.patch('/edit/:security/:name', (req, res) => {
  const { security } = req.params;
  const { name } = req.params;

  if( security === securityCode) {
    if (!countries[name]) {
      return res.status(404).send('Country not found');
    } else {
      if(Object.keys(req.body).length !== 4) {
        return res.status(400).send('Expected 4 keys, received too many or too few');
      } else {
        const { name, population, capital, language } = req.body;
        countries[name] = { population, capital, language};

        res.status(200).send('Edited country');
      };
    };
  };
});

server.delete('/del/:security/:name', (req, res) => {
  const { security } = req.params;
  const { name } = req.params;

  if( security === securityCode) {
    if (!countries[name]) {
      return res.status(404).send('Country not found');
    } else {
      delete countries[name];
      res.status(200).send('Deleted country');
    };
  };
})


server.listen(5050);
