// @flow

const React = require('react');
import type { View } from '../uiblocks-core/view';
import type { Model } from '../uiblocks-blocks/touched';

type Config = {
  debug?: bool
}

function mkView<InnerConfig, InnerModel>(cfg: Config): (inner: View<InnerModel>) => View<Model<InnerModel>> {
  return (inner: View<InnerModel>) => (model: Model<InnerModel>) => (
    cfg.debug
      ? (
          <span>
            {inner(model.Inner)}
            <pre style={{display: "inline-block"}}>
              IsTouched == {JSON.stringify(model.IsTouched)}
            </pre>
          </span>
      )
      : inner(model.Inner)
  );
}

module.exports = mkView;
