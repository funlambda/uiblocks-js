// @flow

const React = require('react');
import type { Model } from '../blocks/array';

function mkView<InnerModel>(inner: (model: InnerModel) => React$Element): (model: Model<InnerModel>) => React$Element {
  function main(model: Model<InnerModel>){
    return (
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

  return main;
}

module.exports = mkView;
