// @flow

const React = require('react');
import type { Model } from '../blocks/tuple2';

function mkView<InnerModel1, InnerModel2>(inner1: (model: InnerModel1) => React$Element, inner2: (model: InnerModel2) => React$Element): (model: Model<InnerModel1, InnerModel2>) => React$Element {
  function main(model: Model<InnerModel1, InnerModel2>){
    return (
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

  return main;
}

module.exports = mkView;
