// @flow

import type { Block } from './block';
import type { Option } from './option';

const textEditor = require("./textEditor");
const array = require("./array");
const value = require("./value");
const option = require("./option");
const block = require("./block");

type NutritionalContent = {
  Fat: number,
  Carbs: number,
  Protein: number
}

type Ingredient = {
  Name: string,
  Description: string
  //NutritionalContent: Option<NutritionalContent>
}

type Validated<a> =
  { type: 'Invalid', messages: Array<string> }
  | { type: 'Valid', value: a }

function validateAll<a>(v: a): Validated<a>{
  return { type: "Valid", value: v };
}

const validateLength = (min: number, max: number) => (v: string): Validated<string> => {
  const invalidMsgs =
    (v.length < min ? [ "Too short" ] : [ ])
    .concat((v.length > max ? [ "Too long" ] : [ ]));

  return invalidMsgs.length > 0
    ? { type: "Invalid", messages: invalidMsgs }
    : { type: "Valid", value: v};
};

const xx = (a: Array<Option<Validated<string>>>): Option<Validated<Array<string>>> => {
  if (a.filter(x => x.type == "None").length > 0)
    return { type: "None" };

  const b = a.map(x => {
    switch (x.type){
      case "Some":
        return x.value;
      default:
        return { type: "Invalid", messages: [ "Unexpected error" ]};
      }
    });

  if (b.filter(x => x.type == "Invalid").length > 0)
    return option.Some({ type: "Invalid", messages: [ "Invalid found" ] });

  const c = b.map(x => {
    switch (x.type){
      case "Valid":
        return x.value;
      default:
        return "";
      }
    });

  return option.Some({ type: "Valid", value: c });
};



const block1 = textEditor; // string -> string
const block12 = block.adaptValue(validateLength(1,10), block1); // string -> Validated<string>
const block2 = value({ rebindTrigger: (x,y) => true }, block12); // string -> Option<Validated<string>>
const block3 = array("", block2); // Array<string> -> Array<Option<Validated<string>>>
const block4 = block.adaptValue(xx, block3); // Array<string> -> Option<Array<Validated<string>>>
const block5 = value({ rebindTrigger: (x,y) => true }, block4); // Array<string> -> Option<Option<Array<Validated<string>>>>


module.exports = block.adaptInit((x: null) => [], block5); // null -> Option<Option<Array<Validated<string>>>>
