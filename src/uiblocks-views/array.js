// @flow

const React = require('react');
import type { View } from '../uiblocks-core/view';
import type { Model } from '../uiblocks-blocks/array';

function mkView<InnerModel>(inner: View<InnerModel>): View<Model<InnerModel>> {
  return (model: Model<InnerModel>) => (
    <div>
      <h2>Array</h2>
      <div>
        <button onClick={model.onAdd}>Add</button>
      </div>
      {model.rows.map(r => (
        <div>
          <button style={{display: "inline-block"}} onClick={r.onRemove}>X</button>
          {inner(r.inner)}
        </div>
      ))}
    </div>
  );
}

module.exports = mkView;
