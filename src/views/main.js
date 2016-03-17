// @flow

const array = require('./array');
const textEditor = require("./textEditor");
const value = require('./value');
const record = require('./record');
const form = require('./form');
const touched = require('./touched');
const React = require("react");
const BS = require('react-bootstrap');

import type { Model as TextModel } from '../blocks/textEditor';
import type { Model as ValueModel } from '../blocks/value';
import type { Model as TouchedModel } from '../blocks/touched';
import type { Validated } from '../blocks/main';

const toChangeHandler: (handler: (x: string) => void) => ((ce: any) => void) =
  handler => (ce => handler(ce.target.value));


function validatedTouched<a, b>(inner: (validationStatus: string) => (model: b) => React$Element) {
  return (model: TouchedModel<ValueModel<TextModel, Validated<a>>>): React$Element => {
    const validationStatus = model.IsTouched && model.Inner.Value.type == "Invalid" ? "error" : null;
    return inner(validationStatus)(model.Inner.Inner);
  }
}

function buildRecordEditorView(spec: { [key: string]: (m: any) => React$Element }){
  const block1 = record(spec);
  const block2 = block.adaptValue(combineValidated3)(block1);
  const block3 = block.adaptInit(splitOptionObject(...Object.keys(spec)))(block2);
  const block4 = value(block3);
  const block5 = touched(block4,
    Object.keys(spec).map(k => ({ key: k, action: { type: "Touch" } }))
  );

  return block5;
}

function wrapInPanel<Model>(view: (m: Model) => React$Element){
  return m => (
    <BS.Panel style={{width: 500}}>
      {view(m)}
    </BS.Panel>
  );
}


const a =
  form(
    touched(
      value(
        record({
          name: validatedTouched(s => textEditor({ bsStyle: s, label: "Name", placeholder: "Name" })),
          color: validatedTouched(s => textEditor({ bsStyle: s, label: "Favorite Color", placeholder: "Favorite Color" })),
          age: validatedTouched(s => textEditor({ bsStyle: s, label: "Age", placeholder: "Age" }))
        })
      )
    )
  );

module.exports = wrapInPanel(a);
