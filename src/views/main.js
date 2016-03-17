// @flow

const array = require('./array');
const textEditor = require("./textEditor");
const value = require('./value');
const record = require('./record');
const form = require('./form');
const touched = require('./touched');
const React = require("react");

import type { Model as TextModel } from '../blocks/textEditor';
import type { Model as ValueModel } from '../blocks/value';
import type { Model as TouchedModel } from '../blocks/touched';
import type { Validated } from '../blocks/main';

const toChangeHandler: (handler: (x: string) => void) => ((ce: any) => void) =
  handler => (ce => handler(ce.target.value));


function validatedTextEditor<a>(model: TouchedModel<ValueModel<TextModel, Validated<a>>>): React$Element {
  const style = {
    backgroundColor: (model.IsTouched && model.Inner.Value.type == "Invalid" ? "red" : "")
  };
  return (<input type="text" value={model.Inner.Inner.value} onChange={toChangeHandler(model.Inner.Inner.onChange)} style={style}/>);
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



const a =
  form(
    touched(
      value(
        record({
          name: validatedTextEditor,
          color: validatedTextEditor,
          age: validatedTextEditor
        })
      )
    )
  );

module.exports = a;
