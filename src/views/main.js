// @flow

const array = require('./array');
const textEditor = require("./textEditor");
const counter = require('./counter');
const value = require('./value');
const tuple = require('./tuple');
const record = require('./record');
const touched = require('./touched');
const form = require('./form');
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

//const a = form(value(tuple(validatedTextEditor, tuple(validatedTextEditor, validatedTextEditor))));
const a = form(value(record(validatedTextEditor, validatedTextEditor, validatedTextEditor)));

module.exports = a;
