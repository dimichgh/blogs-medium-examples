'use strict';

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
