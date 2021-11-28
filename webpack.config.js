const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    watchContentBase: true, //следить за изменением контента в директории указанной выше
  },
  module: {
    /*правило проверяет все импорты в модулях и если путь у импорта оканчивается на .css, то к файлу применяются  'style-loader'(берёт полученные инструкции и вставляет в тег <style></style>) и 'css-loader'(превращает css в js инструкции), лоадеры работают справа налево, то есть вначале  'css-loader' затем 'style-loader'*/
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
