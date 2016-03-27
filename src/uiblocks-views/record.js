// @flow

const React = require('react');
import type { View } from '../uiblocks-core/view';
import type { Model } from '../blocks/record';

function mkView(innerViews: { [key: string]: View<any> }): View<Model> {
  return (model: Model) => (
    <div>
      <div>
        {Object.keys(innerViews)
               .map(k => innerViews[k](model[k]))}
      </div>
    </div>
  );
}

module.exports = mkView;
