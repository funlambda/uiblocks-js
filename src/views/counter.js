// @flow

const React = require('react');
import type { Model } from '../blocks/counter';

function main(model: Model){
  return (
    <div>
      Current Value!: {model.value}
      <button onClick={model.onIncrement}>Up</button>
      <button onClick={model.onDecrement}>Down</button>
    </div>
  );
}

module.exports = main;
