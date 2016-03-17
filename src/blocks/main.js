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

function combineValidated2(a: Array<Validated<any>>): Validated<Array<any>> {
  const invalids = a.filter(x => x.type == "Invalid").map(x => x.messages);
  if (invalids.length == 0){
    return { type: "Valid", value: a.map(x => x.value) };
  } else{
    return { type: "Invalid", messages: invalids.reduce((acc, next) => acc.concat(next), []) };
  }
}

function combineValidated3(a: any): Validated<any> {
  const dict =
    Object.keys(a)
          .map(k => [ k, a[k] ]);

  const invalids =
    dict.filter(x => x[1].type == "Invalid")
        .map(x => x[1].messages);

  if (invalids.length == 0){
    return {
      type: "Valid",
      value: dict.map(x => [ x[0], x[1].value ])
                 .reduce((acc, next) => { acc[next[0]] = next[1]; return acc; }, {})
    };
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

function splitOptionObject(...keys: Array<string>): (x: Option<{ [key: string]: any }>) => { [key: string]: Option<any> } {
  return x => {
    switch (x.type){
      case "Some":
        return keys.map(k => [ k, option.Some(x.value[k]) ])
                   .reduce((acc, next) => { acc[next[0]] = next[1]; return acc; }, {});

      case "None":
        return keys.map(k => [ k, option.None ])
                   .reduce((acc, next) => { acc[next[0]] = next[1]; return acc; }, {});
      default: throw "unexpected";
    }
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

function applyToSnd<A,B,C>(f: (y: B) => C): (x: [A,B]) => [A,C] {
  return (x: [A, B]) => {
    const [a,b] = x;
    return [a,f(b)];
  };
}

function buildRecordEditorBlock(spec: { [key: string]: Block }){
  const block1 = record(spec);
  const block2 = block.adaptValue(combineValidated3)(block1);
  const block3 = block.adaptInit(splitOptionObject(...Object.keys(spec)))(block2);
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
    allowSubmit: validatedToOption,
    actionsOnSubmitFail: [{ type: "Touch" }]
  });

module.exports = block.adaptInit((x: null) => option.None)(b);
// null -> Option<Person>
