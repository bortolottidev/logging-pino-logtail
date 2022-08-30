require("dotenv").config();
const logger = require("./logger.js");
/*
const Stream = require('stream');

// const readableStream = new Stream.Readable({
//   read() {},
// });
const writableStream = new Stream.Writable();
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.LOGTAIL_AUTH_TOKEN)

writableStream._write = async (chunk, encoding, next) => {
  console.log("CHUNKINGGGG: " + chunk)
  await logtail.info(chunk.toString());
  next();
};

/* readableStream.pipe(writableStream);

readableStream.push('hi!');
readableStream.push('ho!'); */

// readableStream.on('close', () => writableStream.end());
/* writableStream.on('close', () => console.log('ended'));
writableStream.destroy() */

// readableStream.destroy(); */

/* (async () => {
  for(let i = 0; i < 15; i++) {
    await logger.info(`hey! ${i}!\n`);
  }
})().then(() => console.log("OK")); */
// return;

logger.info('test log!');
logger.info("Hello from Pino!");

logger.error("Just another log");
logger.warn("Just another log");
logger.info("Just another log");
logger.debug("Just another log");
logger.trace("Just another log");

logger.info('More logging test...');

// Will log msg with additional info in obj
// name is a special prop for pino pretty formatter
logger.info(
  { name: 'bucky.mp5', mime_type: 'video/mp4' },
  'Upload successful!'
);

// Will log only msg correctly completed
logger.info(
  "Upload of file '%s' with mime type '%s' is successful!",
  'bucky.mp4',
  'video/mp4'
);

logger.info(
  { name: 'bucky.mp4', mime_type: 'video/mp4' },
  '[%s]: file upload succeeded.',
  'bucky.mp4'
);

// Additional custom log level 
// Not logged to Logtail with development lib http-pino-send
logger.emerg({ emergencyId: 123 }, 'Emergency log!!!');
logger.alert({ alertId: 'alert_id123' }, 'Alert log!!!');
logger.crit('Critical log!!!');

// Child logger with shared context props
const childLogger = logger.child({
  requestId: 'req_123321'
});

childLogger.info('Child log 1');
childLogger.info('Child log 2');

logger.fatal("The fatal log will flush all!")
