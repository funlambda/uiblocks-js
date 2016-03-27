// @flow

const React = require('react');
const BS = require('react-bootstrap');

import type { View } from '../uiblocks-core/view';
import type { Model } from '../blocks/textEditor';

const toChangeHandler: (handler: (x: string) => void) => ((ce: any) => void) =
  handler => (ce => handler(ce.target.value));

type Config = {
  placeholer?: string,
  label?: string,
  bsStyle?: string
}

function mkView(config: Config): View<Model> {
  return (model: Model) => (
    <BS.Input type="text" bsStyle={config.bsStyle} bsSize="medium" hasFeedback label={config.label} placeholder={config.placeholder} value={model.value} onChange={toChangeHandler(model.onChange)} />
  );
}

module.exports = mkView;