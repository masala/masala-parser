module.exports = function (path) {
    return require('../lib' + (process.env.COVERAGE || '') + path);
};