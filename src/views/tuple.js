// @flow

const React = require('react');
import type { View } from '../uiblocks-core/view';
import type { Model } from '../blocks/tuple';

function mkView(...innerViews: Array<View<any>>): View<Model> {
  return (model: Model) => (
    <div>
      <div>
        {model.map((x,i) => innerViews[i](x))}
      </div>
    </div>
  );
}

module.exports = mkView;
