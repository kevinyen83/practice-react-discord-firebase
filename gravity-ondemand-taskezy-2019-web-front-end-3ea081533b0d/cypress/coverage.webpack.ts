import * as path from 'path';

export default {
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        loader: '@jsdevtools/coverage-istanbul-loader',
        options: { esModules: true },
        enforce: 'post',
        include: path.join(__dirname, '..', 'src'),
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/,
          /(ngfactory|ngstyle)\.js/,
          path.join(__dirname, '..', '/src/@fuse/'),
          path.join(__dirname, '..', '/src/app/fake-db/'),
          path.join(__dirname, '..', '/src/app/mock-api/'),
          path.join(__dirname, '..', '/src/app/environments/')
        ],
      },
    ],
  },
}
