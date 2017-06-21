'use strict';

const express = require('express');
const app = express();
const dashboard = require('hystrix-dashboard');

app.use('/hystrix', dashboard({
    idleTimeout: 4000,
    interval: 2000,
    proxy: true
}));

app.listen(8000);

/*
    Use the below link to see the dashboard with metrics
    http://localhost:8000/hystrix/monitor/monitor.html?streams=%5B%7B%22name%22%3A%22%22%2C%22stream%22%3A%22http%3A%2F%2Flocalhost%3A8000%2Fhystrix%2Fhystrix.stream%22%2C%22auth%22%3A%22%22%2C%22delay%22%3A%22%22%7D%5D
*/

setInterval(() => {
    const pipe = require('trooba')
    .use(require('trooba-hystrix-handler'))
    .use(require('trooba-http-transport'), {
        hostname: 'www.ebay.com',
        protocol: 'http:',
        method: 'GET',
        socketTimeout: 1000
    })
    .build();

    pipe.create({
        command: 'my-service-command'
    }).request({}, (err, res) => {
        console.log(err, res && res.body.toString());
    });
}, 1000);
