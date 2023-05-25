import morgan from 'morgan';

// const logger = morgan(function (tokens, req, res) {
//   return [
//     tokens.method(req, res),
//     tokens.url(req, res),
//     tokens.status(req, res),
//   ].join(' ')
// });

const logger = morgan('dev');

export default logger;