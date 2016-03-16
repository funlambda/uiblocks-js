// @flow

import type { Block } from '../uiblocks-core/block';
import type { Option } from "../uiblocks-core/option";

import * as block from '../uiblocks-core/block';
import * as option from '../uiblocks-core/option';
var _ = require('lodash/fp');

const textEditor = require("./textEditor");
const array = require("./array");
const value = require("./value");
const tuple = require("./tuple");
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
  color: string,
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

function combineValidated(a: Array<Validated<any>>): Validated<Array<any>> {
  const invalids = a.filter(x => x.type == "Invalid").map(x => x.messages);
  if (invalids.length == 0){
    return { type: "Valid", value: a.map(x => x.value) };
  } else{
    return { type: "Invalid", messages: invalids.reduce((acc, next) => acc.concat(next), []) };
  }
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
    block.adaptValue(validateNumber)
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
    block.adaptValue(validateLength(1,20))
  )(textEditor);
// Option<string> -> Validated<string>

function splitOptionTuple<a,b>(x: Option<[a,b]>): [Option<a>, Option<b>]{
  switch (x.type){
    case "Some": return [option.Some(x.value[0]), option.Some(x.value[1])];
    case "None": return [option.None, option.None];
    default: throw "unexpected";
  }
}

function splitOptionArray(n: number): (x: Option<Array<any>>) => Array<Option<any>> {
  return x => {
    switch (x.type){
      case "Some": return x.value.map(option.Some);
      case "None":
        const aa = [...Array(n)];
        return aa.map(y => option.None);
      default: throw "unexpected";
    }
  };
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

function applyToSnd<A,B,C>(f: (y: B) => C): (x: [A,B]) => [A,C] {
  return (x: [A, B]) => {
    const [a,b] = x;
    return [a,f(b)];
  };
}


const a = touched(value(stringEditor));
const b = touched(value(stringEditor));
const c = touched(value(numberEditor));


const block1 = record(a,b,c);
// [Option<string>, Option<string>, Option<number>] -> [Validated<string>, Validated<string>, Validated<number>]

console.log("block1", block1);

const block2 =
  _.flow(
      block.adaptValue(combineValidated),
      // [Option<string>, Option<string>, Option<number>] -> Validated<[string, string, number]>
      block.adaptValue(mapValidated((x: [string, string, number]): Person => ({ name: x[0], color: x[1], age: x[2] }))),
      // [Option<string>, Option<string>, Option<number>] -> Validated<Person>
      block.adaptInit(splitOptionArray(3)),
      // Option<[string, string, number]> -> Validated<Person>
      block.adaptInit(option.map((x: Person) => [x.name, x.color, x.age]))
      // Option<Person> -> Validated<Person>
    )(block1);

console.log("block2", block2);

const block3 = value(block2);

console.log("block3", block3);

const block4 = form(block3,
  {
    allowSubmit: validatedToOption,
    actionsOnSubmitFail: [
      { index: 0, action: { type: "Touch" } },
      { index: 1, action: { type: "Touch" } },
      { index: 2, action: { type: "Touch" } }
    ]
  });
// Option<Person> -> Option<Person>

console.log("block4", block4);

module.exports = block.adaptInit((x: null) => option.None)(block4);
// null -> Option<Person>



//
// const block1 = tuple(a, tuple(b, c));
// // [Option<string>, [Option<string>, Option<number>]] -> [Validated<string>, [Validated<string>, Validated<number>]]
//
// const block2 =
//   _.flow(
//       block.adaptValue(applyToSnd(combineValidated)),
//       // [Option<string>, [Option<string>, Option<number>]] -> [Validated<string>, Validated<[string, number]>>
//       block.adaptValue(combineValidated),
//       // [Option<string>, [Option<string>, Option<number>]] -> Validated<[string, [string, number]]>
//       block.adaptValue(mapValidated((x: [string, [string, number]]): Person => ({ name: x[0], color: x[1][0], age: x[1][1] }))),
//       // [Option<string>, [Option<string>, Option<number>]] -> Validated<Person>
//       block.adaptInit(applyToSnd(splitOptionTuple)),
//       // [Option<string>, Option<[string,number]> -> Validated<Person>
//       block.adaptInit(splitOptionTuple),
//       // Option<[string, [string,number]]> -> Validated<Person>
//       block.adaptInit(option.map((x: Person) => [x.name, [x.color, x.age]]))
//       // Option<Person> -> Validated<Person>
//     )(block1);
//
// const block3 = value(block2);
// // Option<Person> -> Option<Person>
//
// const block4 = form(block3,
//   {
//     allowSubmit: validatedToOption,
//     actionsOnSubmitFail: [
//       { type: "one", action: { type: "Touch" } },
//       { type: "two", action: { type: "one", action: { type: "Touch" } } },
//       { type: "two", action: { type: "two", action: { type: "Touch" } } }
//     ]
//   });
//
// module.exports = block.adaptInit((x: null) => option.None, block4); // null -> Option<Person>
