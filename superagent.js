'use strict';

module.exports = function (pipe) {
    pipe.set('superagent', function factory(pipe) {
        return new Superagent(pipe);
    });
};

class Superagent {
    constructor(pipe) {
        this.pipe = pipe;
        this.options = {
            method: 'GET'
        };
    }

    request(options) {
        this.options = options;
        return this;
    }

    post(body) {
        this.options.method = 'POST';
        this.options.body = body;
        return this;
    }

    get(path) {
        this.options.path = path;
        return this;
    }

    end(callback) {
        // here we should initiate an actual flow
        this.pipe.create().request(this.options, callback);
    }
}
