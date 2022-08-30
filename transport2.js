const build = require('pino-abstract-transport')
const fs = require("fs")
const { pipeline, Transform } = require('stream')
const { Logtail } = require("@logtail/node");
const { once } = require( 'events')

function defaultParseLine (line) {
  const obj = JSON.parse(line)
  obj.logId = Math.floor(Math.random() * 100000)

  return obj
}

module.exports = function (opts) {
  const parseLine = typeof opts.parseLine === 'function' ? opts.parseLine : defaultParseLine;
  const  stream = fs.createWriteStream(opts.destination);
  if(!opts.logtailToken) {
    throw new Error("Logtail Token is Required!");
  }
  const logtail = new Logtail(opts.logtailToken);

  return build(function (source) {
    const myTransportStream = new Transform({
      // Make sure autoDestroy is set,
      // this is needed in Node v12 or when using the
      // readable-stream module.
      autoDestroy: true,

      objectMode: true,
      transform (chunk, enc, cb) {

        // stringify the payload again
        this.push(`${JSON.stringify(chunk)}\n`)
        stream.write(`Shooting: ${JSON.stringify(chunk)}\n`)

        let severity;
        switch(chunk.level) {
          case 20:
            severity = "debug";
            break;
          case 30:
            severity = "info";
            break;
          case 40:
            severity = "warn";
            break;
          case 50:
            severity = "error";
            break;
          default:
            severity = "warn";
            stream.write(`Logging as warn: ${JSON.stringify(chunk)}\n`);
        }

        stream.write(`Logging [${new Date().toISOString()}]: ${chunk.level} -> ${severity}\n`) 
        logtail.log(chunk);
        cb()
      }
    });

    let destination = stream
    pipeline(source, myTransportStream, destination, () => {})
    return myTransportStream
  }, {
    // This is needed to be able to pipeline transports.
    enablePipelining: true,
    parseLine,
    // async close(err) {
    // //   stream.write(err ? `Ending stream with err: ${JSON.stringify(err)}` : "Ending stream without error")
    // //   stream.destroy()
    // //   await once(stream, 'close');
    //   /* logtail.end()
    //   await once(logtail, 'close'); */
    // }
  })
}
