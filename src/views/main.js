// @flow

const array = require('../uiblocks-views/array');
const textEditor = require("../uiblocks-views/textEditor");
const value = require('../uiblocks-views/value');
const record = require('../uiblocks-views/record');
const form = require('../uiblocks-views/form');
const touched = require('../uiblocks-views/touched');
const chooser = require('../uiblocks-views/chooser');
const block = require('../uiblocks-core/block');
const validation = require('../uiblocks-core/validation');
const React = require("react");
const BS = require('react-bootstrap');

import type { View } from '../uiblocks-core/view';
import type { Model as TextModel } from '../uiblocks-blocks/textEditor';
import type { Model as ValueModel } from '../uiblocks-blocks/value';
import type { Model as TouchedModel } from '../uiblocks-blocks/touched';
import type { Validated } from '../uiblocks-core/validation';

const toChangeHandler: (handler: (x: string) => void) => ((ce: any) => void) =
  handler => (ce => handler(ce.target.value));


function validatedTouched<a, b>(inner: (validationStatus: any) => (model: b) => React$Element) {
  return (model: TouchedModel<ValueModel<b, Validated<a>>>): React$Element => {
    const validationStatus = model.IsTouched && model.Inner.Value.type == "Invalid" ? "error" : null;
    return inner(validationStatus)(model.Inner.Inner);
  }
}

function wrapInPanel<Model>(view: View<Model>): View<Model>{
  return (m: Model) => (
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
            color: validatedTouched((s) => chooser({ bsStyle: s, label: "Favorite Color", noneLabel: "Select...", optionView: x => x })),
            age: validatedTouched((s) => textEditor({ bsStyle: s, label: "Age", placeholder: "Age" }))
          }), true
        )
      )
    )
  );

module.exports = a;
