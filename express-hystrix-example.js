'use strict';

const express = require('express');
const app = express();
const commandFactory = require('express-hystrix');
const Toobusy = require('hystrix-too-busy');

// This is out main too busy function
function tooBusyFactory(config) {
    Toobusy.init(config);

    return function commandExecutor(command, req, res, next) {
        return new Promise((resolve, reject) => {
            Toobusy.getStatus(busy => {
                setImmediate(next);
                if (busy) {
                    return reject(new Error('TooBusy'));
                }
                resolve();
            });
        });
    };
}

// let's add a dashboard for easy viewing before toobusy
app.use('/hystrix', require('hystrix-dashboard')({
    idleTimeout: 4000,
    interval: 2000,
    proxy: true
}));

// add toobusy command before any other route
app.use(commandFactory({
    commandExecutorFactory: tooBusyFactory
}));

app.get('/hello', (req, res) => {
    // force some CPU work here
    let dummyStr = '';
    for (let i = 0; i < 10000; i++) {
        dummyStr += 'eiqweyqiwuyeiqwyeiqwy';
    }
    res.status(200).end('Hello World');
});

// start the server
app.listen(8000);
