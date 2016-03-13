// @flow

const React = require('react');
import type { Model } from '../blocks/textEditor';

const toChangeHandler: (handler: (x: string) => void) => ((ce: any) => void) =
  handler => (ce => handler(ce.target.value));

function main(model: Model){
  return (
    <input type="text" value={model.value} onChange={toChangeHandler(model.onChange)} />
  );
}

module.exports = main;
