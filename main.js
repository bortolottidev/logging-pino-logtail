const path = require('path');

require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});
const logger = require("./logger.js");

logger.info({ msg: '0 what the heck is dis log!' });
logger.info("1 Hello from Pino!");

logger.error("2 Just another log");
logger.warn("3 Just another log");
logger.info("4 Just another log");
logger.debug("5 Just another log");
logger.trace("6 Just another log");

logger.info('7 More logging test...');

// Will log msg with additional info in obj
// name is a special prop for pino pretty formatter
logger.info(
  { name: 'bucky.mp5', mime_type: 'video/mp4' },
  '8 Upload successful!'
);

// Will log only msg correctly completed
logger.info(
  "9 Upload of file '%s' with mime type '%s' is successful!",
  'bucky.mp4',
  'video/mp4'
);

logger.info(
  { name: 'bucky.mp4', mime_type: 'video/mp4' },
  '10 [%s]: file upload succeeded.',
  'bucky.mp4'
);

// Additional custom log level 
// Not logged to Logtail with development lib http-pino-send
logger.emerg({ emergencyId: 123 }, '11 Emergency log!!!');
logger.alert({ alertId: 'alert_id123' }, '12 Alert log!!!');
logger.crit('13 Critical log!!!');

// Child logger with shared context props
const childLogger = logger.child({
  requestId: 'req_123321'
});

childLogger.info('14 Child log 1');
childLogger.info('15 Child log 2');

logger.fatal("16 The fatal log will flush all!")

