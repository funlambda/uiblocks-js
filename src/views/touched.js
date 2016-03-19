// @flow

const React = require('react');
import type { View } from '../uiblocks-core/view';
import type { Model } from '../blocks/touched';

function mkView<InnerModel>(inner: View<InnerModel>, debug?: boolean): View<Model<InnerModel>> {
  return (model: Model<InnerModel>) => (
    debug
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
