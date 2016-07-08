// @flow

const React = require('react');
const BS = require('react-bootstrap');
import type { View } from '../uiblocks-core/view';
import type { Model } from '../uiblocks-blocks/array';
import { toClickHandler } from '../uiblocks-core/view';

type Config = {
  label?: string
}

function mkView<InnerModel>(cfg: Config): (inner: View<InnerModel>) => View<Model<InnerModel>> {
  return (inner: View<InnerModel>) => (model: Model<InnerModel>) => (
    <div>
      <h2>Array</h2>
      <div>
        <BS.Button bsSize="small" onClick={toClickHandler(model.onAdd)}>Add</BS.Button>
      </div>
      {model.rows.map(r => (
        <div>
          {inner(r.inner)}
          <a href="#" onClick={toClickHandler(r.onRemove)} style={{float: "left"}}>x</a>
          {/*<BS.Button bsSize="small" style={{display: "inline-block"}} onClick={toClickHandler(r.onRemove)}>X</BS.Button>*/}
        </div>
      ))}
    </div>
  );
}

module.exports = mkView;
