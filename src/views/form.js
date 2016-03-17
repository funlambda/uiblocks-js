// @flow

const React = require('react');
const BS = require('react-bootstrap');
import type { Model } from '../blocks/form';

const toClickHandler: (handler: () => void) => ((ce: any) => bool) =
  handler => (ce => {
    ce.preventDefault();
    ce.stopPropagation();
    handler();
    return false;
  });

function mkView<InnerModel, a>(inner: (model: InnerModel) => React$Element): (model: Model<InnerModel, a>) => React$Element {
  function main(model: Model<InnerModel, a>){
    switch (model.type){
      case "Editing":
        return (
          <div>
            <form onSubmit={toClickHandler(model.form.OnSubmit)}>
              {inner(model.form.Inner)}
              <BS.ButtonInput type="submit" value="Submit" />
            </form>
          </div>
        );
      case "Submitted":
        return (
          <div>
            Submitted! <br />
            {JSON.stringify(model.value)}
          </div>
        );
      default: throw "unexpected";
    }
  }

  return main;
}

module.exports = mkView;
