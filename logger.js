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

let logtailStream;
if(Boolean(process.env.LOGTAIL_DEV_ENABLED)) {
  console.log({ msg: "[DEVELOPMENT] Logging to logtail..."})
  // Don't use for production!
  const { createWriteStream } = require('pino-http-send');

  if(!process.env.LOGTAIL_AUTH_TOKEN) {
    throw new Error("Logtail Auth Token Not Found!")
  }
  logtailStream = createWriteStream({
    url: 'https://in.logtail.com ',
    method: 'POST',
    bodyType: 'json',
    headers: {"Authorization": `Bearer ${process.env.LOGTAIL_AUTH_TOKEN}`}
  });
}

const streams = [
  { stream: process.stdout },
  ...(logtailStream ? [logtailStream] : fileStreams)
]


module.exports = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    customLevels: levels,
    useOnlyCustomLevels: false,
    formatters: {
      level: (label) => {
        const upperLabel = label.toUpperCase()
        return { level: upperLabel };
      },
    },
  },
  pino.multistream(streams, { levels, dedupe: true }),
);
