// @flow

const React = require('react');
const BS = require('react-bootstrap');
//import toClickHandler from '../uiblocks-core/view';
import type { View } from '../uiblocks-core/view';
import type { Model } from '../uiblocks-blocks/form';

function toClickHandler(handler: () => void): ((ce: any) => bool) {
  return ce => {
    ce.preventDefault();
    ce.stopPropagation();
    handler();
    return false;
  };
}

function mkView<InnerModel, a>(inner: View<InnerModel>): View<Model<InnerModel, a>> {
  return (model: Model<InnerModel, a>) => {
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
  };
}

module.exports = mkView;
