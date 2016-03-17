// @flow

import type { Block } from '../uiblocks-core/block';
import type { Option } from "../uiblocks-core/option";
import type { Validated } from "../uiblocks-core/validation";

import * as block from '../uiblocks-core/block';
import * as option from '../uiblocks-core/option';
import * as validation from '../uiblocks-core/validation';

var _ = require('lodash/fp');

const textEditor = require("./textEditor");
const array = require("./array");
const value = require("./value");
const tuple = require("./tuple");
const record = require("./record");
const touched = require("./touched");
const form = require("./form");

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

function buildRecordEditorBlock(spec: { [key: string]: Block }){
  const block1 = record(spec);
  const block2 = block.adaptValue(validation.combineObject)(block1);
  const block3 = block.adaptInit(option.splitObject(...Object.keys(spec)))(block2);
  const block4 = value(block3);
  const block5 = touched(block4,
    Object.keys(spec).map(k => ({ key: k, action: { type: "Touch" } }))
  );

  return block5;
}

const a = buildRecordEditorBlock({
  name: touched(value(stringEditor)),
  color: touched(value(stringEditor)),
  age: touched(value(numberEditor))
});

const b = form(a,
  {
    allowSubmit: validation.toOption,
    actionsOnSubmitFail: [{ type: "Touch" }]
  });

module.exports = block.adaptInit((x: null) => option.None)(b);
// null -> Option<Person>
