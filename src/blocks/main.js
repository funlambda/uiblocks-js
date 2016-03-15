// @flow

import * as block from '../uiblocks-core/block';
import type { Block } from '../uiblocks-core/block';

const option = require("../uiblocks-core/option");
import type { Option } from "../uiblocks-core/option";

const textEditor = require("./textEditor");
const array = require("./array");
const value = require("./value");
const record = require("./record");
const touched = require("./touched");
const form = require("./form");

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

export type Validated<a> =
  { type: 'Invalid', messages: Array<string> }
  | { type: 'Valid', value: a }

function mapValidated<a, b>(f: (a: a) => b): ((x: Validated<a>) => Validated<b>) {
  return (x: Validated<a>): Validated<b> => {
    switch (x.type){
      case "Valid":
        return { type: "Valid", value: f(x.value) };
      case "Invalid":
        return { type: "Invalid", messages: x.messages };
      default: throw "unexpected";
    };
  };
}


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

const validateNumber = (v: string): Validated<number> => {
  const number = parseFloat(v);

  return Number.isNaN(number)
    ? { type: "Invalid", messages: [ "Number required" ] }
    : { type: "Valid", value: number };
};

const xx = (a: Array<Validated<string>>): Validated<Array<string>> => {
  if (a.filter(x => x.type == "Invalid").length > 0)
    return { type: "Invalid", messages: [ "Invalid found" ] };

  const c = a.map(x => {
    switch (x.type){
      case "Valid":
        return x.value;
      default: throw "unexpected";
      }
    });

  return { type: "Valid", value: c };
};

type Person = {
  name: string,
  age: number
}

function combineValidated<A, B>(x: [Validated<A>, Validated<B>]): Validated<[A, B]>{
  const a = x[0];
  const b = x[1];

  switch (a.type) {
    case "Valid":
      switch (b.type) {
        case "Valid":
          return { type: "Valid", value: [ a.value, b.value ] };
        case "Invalid":
          return { type: "Invalid", messages: b.messages };
      }
    case "Invalid":
      switch (b.type) {
        case "Valid":
          return { type: "Invalid", messages: a.messages };
        case "Invalid":
          return { type: "Invalid", messages: a.messages.concat(b.messages) };
      }
    default: throw "unexpected";
  }
}

const numberEditor =
  block.adaptInit(
    (x: Option<number>): string => {
      switch (x.type){
        case "Some": return x.value.toString();
        case "None": return "";
        default: throw "unexpected";
      }
    },
    block.adaptValue(validateNumber, textEditor)
  ); // Option<number> -> Validated<number>

const stringEditor =
  block.adaptInit(
    (x: Option<string>): string => {
      switch (x.type){
        case "Some": return x.value;
        case "None": return "";
        default: throw "unexpected";
      }
    },
  block.adaptValue(validateLength(1,20), textEditor)
); // Option<string> -> Validated<string>

function xxx<a,b>(x: Option<[a,b]>): [Option<a>, Option<b>]{
  switch (x.type){
    case "Some": return [option.Some(x.value[0]), option.Some(x.value[1])];
    case "None": return [option.None, option.None];
    default: throw "unexpected";
  }
}

function validatedToOption<a>(x: Validated<a>): Option<a> {
  switch (x.type){
    case "Valid":
      return { type: "Some", value: x.value };
    case "Invalid":
      return { type: "None" };
    default: throw "unexpected";
  }
}

// [Option<string>, Option<number>] -> [Validated<string>, Validated<number>]
const block1 = record(touched(value(stringEditor)), touched(value(numberEditor)));
// [Option<string>, Option<number>] -> Validated<[string, number]>
const block2 = block.adaptValue(combineValidated, block1);
// [Option<string>, Option<number>] -> Validated<Person>
const block3 = block.adaptValue(mapValidated((x: [string, number]): Person => ({ name: x[0], age: x[1] })), block2);
// Option<[string,number]> -> Validated<Person>
const block3a = block.adaptInit(xxx, block3);
// Option<Person> -> Validated<Person>
const block4 = block.adaptInit(option.map((x: Person) => [x.name, x.age]), block3a);
// Option<Person> -> Validated<Person>
const block5 = value(block4);
// Option<Person> -> Option<Person>
const block6 = form(block5, { allowSubmit: validatedToOption, actionsOnSubmitFail: [ { type: "one", action: { type: "Touch" } }, { type: "two", action: { type: "Touch" } } ]});

module.exports = block.adaptInit((x: null) => option.None, block6); // null -> Option<Person>
