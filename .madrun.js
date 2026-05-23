import {run, cutEnv} from 'madrun';
import {defineEnv} from 'supertape/env';

const env = defineEnv({
    css: true,
});

export default {
    'watch': () => 'nodemon --watch lib --exec',
    'watch:client': () => run('compile:client', '--watch'),
    'watch:test': () => run('watch', 'npm test'),
    'watch:lint': async () => await run('watch', `'npm run lint'`),
    'watch:lint:js': () => run('watch', '"run lint:js"'),
    'watch:coverage': () => run('watch', 'redrun coverage'),
    'coverage': async () => [env, `c8 ${await cutEnv('test')}`],
    'report': () => 'c8 report --reporter=lcov',
    'lint': () => 'putout .',
    'fix:lint': async () => await run('lint', '--fix'),
    'test': () => [env, `tape 'lib/**/*.spec.js'`],
    'test:update': async () => [
        await cutEnv('redrun test'), {
            ...env,
            UPDATE_FIXTURE: 1,
        }],
};
