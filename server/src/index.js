const express = require('express');
const Joi = require('joi');
const server = express();
const { countries } = require('../database/database.js');
require('dotenv').config({path:'../../.env'})
const securityCode = process.env.SECURITY_CODE;

const countrySchema = Joi.object({
  name: Joi.string().required(),
  population: Joi.number().integer().required(),
  capital : Joi.string().required(),
  language: Joi.string().required()
});

server.use(express.json());


server.get('/countries', (req, res) => {
  res.send(countries);
})

server.get('/country/:name', (req, res) => {
  const { name } = req.params;

  if (!countries[name]) {
    return res.status(404).send('Country not found');
  }
    res.send(countries[name]);
});

server.post('/add/:security', (req, res) => {
    const { security } = req.params;
    const { error, value } = countrySchema.validate(req.body);

    if( security === securityCode) {

      if(error) {
        return res.status(400).send(error.details);
      }
      const { name, population, capital, language } = req.body;
      countries[name] = { population, capital, language};
      return res.status(201).send('Added country');
    }

      res.status(401).send('You are not authorized');
});

server.patch('/edit/:security/:country', (req, res) => {
  const { security } = req.params;
  const { country } = req.params;
  const { error, value } = countrySchema.validate(req.body);

  if( security === securityCode) {
    if (!countries[country]) {
      return res.status(404).send('Country not found');
    } 
    
    if(error) {
      return res.status(400).send(error.details);
    }

    const { name, population, capital, language } = req.body;
    countries[name] = { population, capital, language};
    return res.status(200).send('Edited country');
    
  };
});

server.delete('/del/:security/:name', (req, res) => {
  const { security } = req.params;
  const { name } = req.params;

  if( security === securityCode) {
    if (!countries[name]) {
      return res.status(404).send('Country not found');
    };
    delete countries[name];
    res.status(200).send('Deleted country');
  };
})


server.listen(5050);
