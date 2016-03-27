// @flow

const React = require('react');
import type { View } from '../uiblocks-core/view';
import type { Model } from '../uiblocks-blocks/value';

function mkView<InnerModel, InnerValue>(inner: View<InnerModel>, debug?: boolean): View<Model<InnerModel, InnerValue>> {
  return (model: Model<InnerModel, InnerValue>) => (
    debug
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
