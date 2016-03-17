// @flow

const array = require('./array');
const textEditor = require("./textEditor");
const value = require('./value');
const record = require('./record');
const form = require('./form');
const touched = require('./touched');
const block = require('../uiblocks-core/block');
const validation = require('../uiblocks-core/validation');
const React = require("react");
const BS = require('react-bootstrap');

import type { Model as TextModel } from '../blocks/textEditor';
import type { Model as ValueModel } from '../blocks/value';
import type { Model as TouchedModel } from '../blocks/touched';
import type { Validated } from '../uiblocks-core/validation';

const toChangeHandler: (handler: (x: string) => void) => ((ce: any) => void) =
  handler => (ce => handler(ce.target.value));


function validatedTouched<a, b>(inner: (validationStatus: any) => (model: b) => React$Element) {
  return (model: TouchedModel<ValueModel<b, Validated<a>>>): React$Element => {
    const validationStatus = model.IsTouched && model.Inner.Value.type == "Invalid" ? "error" : null;
    return inner(validationStatus)(model.Inner.Inner);
  }
}

function wrapInPanel<Model>(view: (m: Model) => React$Element){
  return (m: Model): React$Element => (
    <BS.Panel style={{width: 500}}>
      {view(m)}
    </BS.Panel>
  );
}


const a =
  wrapInPanel(
    form(
      touched(
        value(
          record({
            name: validatedTouched((s) => textEditor({ bsStyle: s, label: "Name", placeholder: "Name" })),
            color: validatedTouched((s) => textEditor({ bsStyle: s, label: "Favorite Color" })),
            age: validatedTouched((s) => textEditor({ bsStyle: s, label: "Age", placeholder: "Age" }))
          })
        )
      )
    )
  );

module.exports = a;
