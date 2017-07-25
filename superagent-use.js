'use strict';

// Now let's use it
const pipe = require('trooba')
    .use(require('./superagent'))
    .use(function mockTransport(pipe) {
        pipe.on('request', request => {
            pipe.respond({
                statusCode: 200,
                body: {
                    greeting: 'Hello World'
                }
            });
        });
    })
    .build();

const agent = pipe.create('superagent');
agent.get('path/to/resource').end((err, response) => {
    console.log(response.body);
});
