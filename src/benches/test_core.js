import stream from "../lib/stream";

export default function testParser(parser, string) {
  let myStream = stream.ofString(string);
  const t0 = new Date();
  let result = parser.parse(myStream);
  const duration = new Date() - t0;
  console.log('Done ' + duration + 'ms [' + Math.trunc(string.length/duration.valueOf()) + ' kb/s]');
  return result;
}
