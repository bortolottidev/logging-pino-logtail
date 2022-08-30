const build = require('pino-abstract-transport')
const { once } = require( 'events')
const fs = require("fs")

const { Logtail } = require("@logtail/node");

const Stream = require('stream');

module.exports = async function (opts) {
  // SonicBoom is necessary to avoid loops with the main thread.
  // It is the same of pino.destination().
  const destination = fs.createWriteStream(opts.destination);
  await once(destination, 'ready')
  
  const logtail = new Logtail(opts.logtailToken);
  const writableStream = new Stream.Writable();

  writableStream._write = (chunk, encoding, next) => {
    const toDrain = !destination.write(JSON.stringify(chunk) + "\n")
    // await logtail.info(chunk.toString());
    next();
  };

  return build(async function (source) {
    for await (let obj of source) {
      await writableStream.write(obj);
      // This block will handle backpressure
      // await logtail.warn("porco schifo" + Math.random());
      /* if (toDrain) {
        await once(destination, 'drain')
      } */
    }
   }, {
    async close (err) {
      writableStream.on('close', () => console.log('ended'));
      writableStream.destroy()
  /*    if(err) {
        destination.write("ERROR:" + JSON.stringify(err) + "\n")
      }
      destination.end()
      // logtail.end()
      await once(destination, 'close')
      // await once(logtail, 'close')
    } */
    }
  })
}
