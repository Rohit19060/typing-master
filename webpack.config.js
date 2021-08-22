const path = require('path');

module.exports = {
    mode: "production",
    entry: './src/app.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, ''),
    },
    devtool: "inline-source-map",
    devServer: {
        inline: true,
        port: 3000,

    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
};