// @flow

const React = require('react');
import type { Model } from '../blocks/record';

function mkView(innerViews: { [key: string]: ((model: any) => React$Element) }): (model: Model) => React$Element {
  function main(model: Model){
    return (
      <div>
        <div>
          {Object.keys(innerViews)
                 .map(k => innerViews[k](model[k]))}
        </div>
      </div>
    );
  }

  return main;
}

module.exports = mkView;
