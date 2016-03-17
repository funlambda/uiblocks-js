// @flow

const React = require('react');
const BS = require('react-bootstrap');

import type { Model } from '../blocks/textEditor';

const toChangeHandler: (handler: (x: string) => void) => ((ce: any) => void) =
  handler => (ce => handler(ce.target.value));

type Config = {
  placeholer?: string,
  label?: string,
  bsStyle?: string
}

function main(config: Config): (m: Model) => React$Element {
  return function(model: Model): React$Element {
    return (
      <BS.Input type="text" bsStyle={config.bsStyle} bsSize="medium" hasFeedback label={config.label} placeholder={config.placeholder} value={model.value} onChange={toChangeHandler(model.onChange)} />
    );
  }
}

module.exports = main;
