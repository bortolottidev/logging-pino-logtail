require("dotenv").config();
const logger = require("./logger.js");

logger.info('test log!');
logger.info("Hello from Pino!");

logger.fatal("Just another log");
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

