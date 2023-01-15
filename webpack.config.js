'use strict';

const path = require('path');
const dir = './lib';

const dist = path.resolve(__dirname, 'dist');
const devtool = 'source-map';

const rules = [{
    test: /\.js$/,
    exclude: /node_modules|\.spec\.js$/,
    loader: 'babel-loader',
}, {
    test: /\.css$/,
    use: ['style-loader', 'css-loader', 'clean-css-loader'],
}, {
    test: /\.(png|gif|svg|woff|woff2|eot|ttf)$/,
    use: [{
        loader: 'url-loader',
        
        options: {
            limit: 50_000,
        },
    }],
}];

const filename = `[name].min.js`;

module.exports = {
    devtool,
    entry: {
        modal: `${dir}/modal.js`,
    },
    output: {
        library: 'modal',
        filename,
        path: dist,
        pathinfo: true,
        libraryTarget: 'var',
        devtoolModuleFilenameTemplate,
    },
    module: {
        rules,
    },
};

function devtoolModuleFilenameTemplate(info) {
    const resource = info.absoluteResourcePath.replace(__dirname + path.sep, '');
    return `file://modal.js/${resource}`;
}

