// @flow

const React = require('react');
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
            <form>
              {inner(model.form.Inner)}
              <button onClick={toClickHandler(model.form.OnSubmit)}>Submit</button>
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
