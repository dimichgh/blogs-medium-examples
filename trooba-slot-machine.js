'use strict';

const Trooba = require('trooba');

const symbols = ['🍊', '🍉', '🍈', '🍇', '🍆', '🍅', '🍄'];
function spinReel(pipe) {
  pipe.once('request', (request, next) => {
    const position = Math.round(Math.random() * (symbols.length - 1));
    request.push(symbols[position]);
    next();
  });
}

function validate(pipe) {
  pipe.once('request', (request, next) => {
    const line = request.join(' ');
    if (line === [request[0], request[0], request[0]].join(' ')) {
      // you won!
      return pipe.respond('You won! ' + line);
    }
    pipe.respond('You lost! ' + line);
  });
}

// create a pipeline
const sharablePipe = Trooba
  .use(spinReel) // reel 1
  .use(spinReel) // reel 2
  .use(spinReel) // reel 3
  .use(validate)
  .build();

// create a generic client and inject context
const client = sharablePipe.create();

// make a request
client.request([], console.log);
