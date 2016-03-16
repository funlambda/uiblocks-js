// @flow

const React = require('react');
import type { Model } from '../blocks/record';

function mkView(...innerViews: Array<(model: any) => React$Element>): (model: Model) => React$Element {
  function main(model: Model){
    return (
      <div>
        <div>
          {model.map((x,i) => innerViews[i](x))}
        </div>
      </div>
    );
  }

  return main;
}

module.exports = mkView;
