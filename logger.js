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
if(Boolean(process.env.LOGTAIL_DEV_ENABLED)) {

  if(!process.env.LOGTAIL_AUTH_TOKEN) {
    throw new Error("Logtail Auth Token Not Found!")
  }

  logtailTransport = pino.transport({
        target: `${__dirname}/transport2.js`,
        options: {
          logtailToken: process.env.LOGTAIL_AUTH_TOKEN,
          destination: `${loggingDirectory}/transport.log`
        },
        levels
    /* pipeline: [
      {
        target: `${__dirname}/transport.js`,
        options: {
          logtailToken: process.env.LOGTAIL_AUTH_TOKEN,
          destination: "./test.log"
        },
        levels
      },
      {
        target: 'pino-pretty'
      }
    ] */
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
  logtailTransport
  //pino.multistream(streams, { levels, dedupe: true }),
);
