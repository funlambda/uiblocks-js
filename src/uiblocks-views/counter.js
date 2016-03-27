// @flow

const React = require('react');
import type { View } from '../uiblocks-core/view';
import type { Model } from '../uiblocks-blocks/counter';

const view: View<Model> =
  model => (
    <div>
      Current Value!: {model.value}
      <button onClick={model.onIncrement}>Up</button>
      <button onClick={model.onDecrement}>Down</button>
    </div>
  );

module.exports = view;
