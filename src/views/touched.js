// @flow

const React = require('react');
import type { Model } from '../blocks/touched';

function mkView<InnerModel>(inner: (model: InnerModel) => React$Element): (model: Model<InnerModel>) => React$Element {
  function main(model: Model<InnerModel>){
    return inner(model.Inner);

    // for debug purposes:
    // return (
    //   <span>
    //     {inner(model.Inner)}
    //     <pre style={{display: "inline-block"}}>
    //       IsTouched == {JSON.stringify(model.IsTouched)}
    //     </pre>
    //   </span>
    // );
  }

  return main;
}

module.exports = mkView;
