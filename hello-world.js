'use strict';

const Trooba = require('trooba');

const pipe = Trooba
.use(pipe => {
    pipe.on('request', (request, next) => {
        next(`${request} and Bob`);
    });
})
.use(pipe => {
    pipe.on('request', request => {
        pipe.respond(`Hello ${request}`);
    });
})
.build();

pipe.create().request('John', (err, response) => console.log(response)); // Hello John and Bob
