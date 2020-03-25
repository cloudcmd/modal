'use strict';

const {run} = require('madrun');

module.exports = {
    'watch': () => 'nodemon --watch lib --exec',
    'watch:client': () => run('compile:client', '--watch'),
    'watch:test': () => run('watch', 'npm test'),
    'watch:lint': () => run('watch', '\'npm run lint\''),
    'watch:lint:js': () => run('watch', '"run lint:js"'),
    'watch:coverage': () => run('watch', 'redrun coverage'),
    'coverage': () => 'nyc npm test',
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
    'lint:css': () => 'stylelint css/*.css',
    'lint:js': () => 'putout lib .madrun.js webpack.config.js',
    'lint': () => run('lint:*'),
    'fix:lint': () => run(['lint:js', 'lint:css'], '--fix'),
    'test': () => 'tape \'lib/**/*.spec.js\'',
    'test:update': () => 'UPDATE_FIXTURE=1 redrun test',
};

