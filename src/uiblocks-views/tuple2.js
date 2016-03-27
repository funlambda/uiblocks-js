// @flow

const React = require('react');
import type { View } from '../uiblocks-core/view';
import type { Model } from '../uiblocks-blocks/tuple2';

function mkView<InnerModel1, InnerModel2>(inner1: View<InnerModel1>, inner2: View<InnerModel2>): View<Model<InnerModel1, InnerModel2>> {
  return (model: Model<InnerModel1, InnerModel2>) => (
    <div>
      <div>
        {inner1(model[0])}
      </div>
      <div>
        {inner2(model[1])}
      </div>
    </div>
  );
}

module.exports = mkView;
