'use strict';

const express = require('express');
const app = express();
const commandFactory = require('express-hystrix');

// let's add a dashboard for easy viewing before toobusy
app.use('/hystrix', require('hystrix-dashboard')({
    idleTimeout: 4000,
    interval: 2000,
    proxy: true
}));

app.use(commandFactory({
    commandStatusResolver: (req, res) => {
        if (res && res.statusCode === 404) {
            return Promise.reject(new Error('Bad path'));
        }
        return Promise.resolve();
    }
}));

// handle open circuit here
app.use((err, req, res, next) => {
    if (err && err.message === 'OpenCircuitError') {
        res.status(500).end('Circuit is open');
    }
    next(err);
});

app.get('/hello', (req, res) => {
    res.status(200).end('Hello world');
});

app.listen(8000, () => {
    console.log('The server is ready');
});
