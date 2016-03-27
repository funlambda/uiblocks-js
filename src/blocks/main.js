// @flow

import type { Block } from '../uiblocks-core/block';
import type { Option } from "../uiblocks-core/option";
import type { Validated } from "../uiblocks-core/validation";

import * as block from '../uiblocks-core/block';
import * as option from '../uiblocks-core/option';
import * as validation from '../uiblocks-core/validation';

var _ = require('lodash/fp');

const textEditor = require("../uiblocks-blocks/textEditor");
const array = require("../uiblocks-blocks/array");
const value = require("../uiblocks-blocks/value");
const tuple = require("../uiblocks-blocks/tuple");
const record = require("../uiblocks-blocks/record");
const touched = require("../uiblocks-blocks/touched");
const form = require("../uiblocks-blocks/form");
const chooser = require("../uiblocks-blocks/chooser");
const delayValue = require("../uiblocks-blocks/delayValue");

type Person = {
  name: string,
  color: string,
  age: number
}

const numberEditor =
  _.flow(
    block.adaptInit(
      (x: Option<number>): string => {
        switch (x.type){
          case "Some": return x.value.toString();
          case "None": return "";
          default: throw "unexpected";
        }
      }),
    block.adaptValue(validation.validateNumber)
  )(textEditor);
// Option<number> -> Validated<number>

const stringEditor =
  _.flow(
    block.adaptInit(
      (x: Option<string>): string => {
        switch (x.type){
          case "Some": return x.value;
          case "None": return "";
          default: throw "unexpected";
        }
      }),
    block.adaptValue(validation.validateLength(1,20))
  )(textEditor);
// Option<string> -> Validated<string>

const colorOptions = [
  { _id: "red", name: "Red" },
  { _id: "green", name: "Green" },
  { _id: "blue", name: "Blue" }
];

function buildRecordEditorBlock(spec: { [key: string]: Block }){
  const spec2 = _.mapValues(x => touched(value(x)))(spec);
  const block1 = record(spec2);
  const block2 = block.adaptValue(validation.combineObject)(block1);
  const block3 = block.adaptInit(option.splitObject(...Object.keys(spec)))(block2);
  const block4 = value(block3);
  const block5 = touched(block4,
    Object.keys(spec).map(k => ({ key: k, action: { type: "Touch" } }))
  );

  return block5;
}

// Option<string> -> Validated<string>
const colorChooser =
  block.adaptValue(validation.requireOption)(
    chooser(colorOptions, o => o.name, o => o._id));

const a = buildRecordEditorBlock({
  name: value(delayValue((a,s) => a.type == "Blur", stringEditor)),
  color: colorChooser,
  age: numberEditor
});

const b = form(a,
  {
    allowSubmit: validation.toOption,
    actionsOnSubmitFail: [{ type: "Touch" }]
  });

module.exports = block.adaptInit((x: null) => option.None)(b);
// module.exports = block.adaptInit((x: null) => option.Some({name: "Brooks", color: "blue", age: 31}))(b);
// null -> Option<Person>
