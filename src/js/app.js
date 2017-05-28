'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

import WebFont from 'webfontloader';
import '../scss/app.scss';

import Root from './containers/Root.js';

WebFont.load({ google: { families: [ 'Roboto:400,700:latin', 'Roboto+Mono:400,700:latin' ] } });
OfflinePluginRuntime.install();

const elm = document.getElementById('content');
const attrs = {};
for (let i = 0; i < elm.attributes.length; i++) {
  let attr = elm.attributes[i];
  if (attr.name !== 'id') { attrs[attr.name] = attr.value; }
}
ReactDOM.render(<Root {...attrs} />, elm);
