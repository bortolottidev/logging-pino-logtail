const pino = require("pino");
const fs = require("fs");

const loggingDirectory = `${__dirname}/log`;
if(!fs.existsSync(loggingDirectory)) {
  fs.mkdirSync(loggingDirectory);
}

const levels = {
  emerg: 90,
  alert: 80,
  crit: 70,
};

// In this case, only my custom levels will be logged on file
const fileStreams = Object.keys(levels).map((level) => ({
  level,
  stream: pino.destination(`${loggingDirectory}/app-${level}.log`),
}));

let logtailTransport;

const stdoutTransport = pino.transport({
  target: 'pino/file',
  options: { destination: 1 },
});

if(Boolean(process.env.LOGTAIL_DEV_ENABLED)) {

  if(!process.env.LOGTAIL_AUTH_TOKEN) {
    throw new Error("Logtail Auth Token Not Found!")
  }

  logtailTransport = pino.transport({
    target: 'pino-logtail-transport',
    options: {
      debug: true,
      logtailToken: process.env.LOGTAIL_AUTH_TOKEN,
    },
  });
}

module.exports = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    customLevels: levels,
    useOnlyCustomLevels: false,
    formatters: {
      level: (label, level) => {
        const severity = label.toUpperCase();
        return { level, severity }
      },
    },
  },
  pino.multistream([
    stdoutTransport,
    logtailTransport
  ])
);
