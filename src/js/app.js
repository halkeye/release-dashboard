'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

import WebFont from 'webfontloader';
import '../scss/app.scss';

import Root from './containers/Root.js';

WebFont.load({ google: { families: [ 'Roboto:400,700:latin', 'Roboto+Mono:400,700:latin' ] } });

const elm = document.getElementById('content');
const attrs = {};
for (let i = 0; i < elm.attributes.length; i++) {
  let attr = elm.attributes[i];
  let name = attr.name;
  if (name === 'config-repo') {
    name = 'configRepo';
  }
  if (name !== 'id') { attrs[name] = attr.value; }
}
ReactDOM.render(<Root {...attrs} />, elm);
