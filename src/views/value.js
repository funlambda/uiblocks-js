// @flow

const React = require('react');
import type { Model } from '../blocks/value';

function mkView<InnerModel, InnerValue>(inner: (model: InnerModel) => React$Element): (model: Model<InnerModel, InnerValue>) => React$Element {
  function main(model: Model<InnerModel, InnerValue>){
    return (
      <span>
        {inner(model.Inner)}
        <pre style={{display: "inline-block"}}>
          {JSON.stringify(model.Value)}
        </pre>
      </span>
    );
  }

  return main;
}

module.exports = mkView;
