if (process.env.NODE_ENV === 'development') {
    require('file-loader!../src/index.html');
}
require('webpack-jquery-ui');
require('webpack-jquery-ui/css');

import "@babel/polyfill";
import '../src/assets/stylesheets/styles.scss';
import 'bootstrap';
import '../src/services';
import '../src/map';
import '../src/restaurant';

