module.exports = (function () {
  return require(process.env.APP_DIR_FOR_CODE_COVERAGE || '../lib/index.js');
}());