import morgan from 'morgan';
import chalk from 'chalk'; // or you can use the require('chalk') syntax too

const colorizedMorgan = morgan((tokens, req, res) => {
  const status = tokens.status(req, res);
  let statusText = chalk.bold(status);
  if (status.startsWith('4')) statusText = chalk.hex('#ffb142').bold(status);
  if (status.startsWith('5')) statusText = chalk.bgRed.bold(status);

  return [
    '',
    chalk.cyan.bold(tokens.method(req, res)),
    statusText,
    chalk.cyanBright.bold(tokens.url(req, res)),
    chalk.yellow.bold(tokens.res(req, res, 'content-length'), 'byte ->'),
    chalk.hex('#2ed573').bold(`${tokens['response-time'](req, res)} ms`),
    process.env.NODE_ENV === 'production' ? chalk.hex('#adf573').bold(tokens['remote-addr'](req, res)) : undefined,
    process.env.NODE_ENV === 'production' ? chalk.hex('#e1d573').bold(`[${tokens.date(req, res).toLocaleString()}]`) : undefined,
  ].join(' ');
});

export default colorizedMorgan;
