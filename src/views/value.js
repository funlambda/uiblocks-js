// @flow

const React = require('react');
import type { Model } from '../blocks/value';

function mkView<InnerValue, InnerModel>(inner: (model: InnerModel) => React$Element): (model: Model<InnerValue, InnerModel>) => React$Element {
  function main(model: Model<InnerValue, InnerModel>){
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
