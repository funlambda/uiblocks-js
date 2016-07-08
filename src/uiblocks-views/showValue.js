// @flow

const React = require('react');
import type { View } from '../uiblocks-core/view';
import type { Model } from '../uiblocks-blocks/showValue';

type Config = {
  debug?: bool,
}

function mkView<InnerModel, InnerValue>(cfg: Config): (inner: View<InnerModel>) => View<Model<InnerModel, InnerValue>> {
  return (inner: View<InnerModel>) => (model: Model<InnerModel, InnerValue>) => (
    cfg.debug
      ? (
        <span>
          {inner(model.Inner)}
          <pre style={{display: "inline-block"}}>
            {JSON.stringify(model.Value)}
          </pre>
        </span>
      )
      : inner(model.Inner)
  );
}

module.exports = mkView;
