'use strict';

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

service.get('/service/:location', (req, res, next) => {
  request.get('http://api.openweathermap.org/data/2.5/weather?q=' + req.params.location + `&appid=${process.env.WEATHER_KEY}&units=metric`, (err, response) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500)
    }

    const weather = response.body.main.temp;
    
    res.json({result: weather});
    });
  });

module.exports = service;