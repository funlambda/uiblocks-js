// @flow

import type { Option } from './option';

export type Validated<a> =
  { type: 'Invalid', messages: Array<string> }
  | { type: 'Valid', value: a }

export function map<a, b>(f: (a: a) => b): ((x: Validated<a>) => Validated<b>) {
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



export function combinePair<A, B>(x: [Validated<A>, Validated<B>]): Validated<[A, B]>{
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

export function combineArray(a: Array<Validated<any>>): Validated<Array<any>> {
  const invalids = a.filter(x => x.type == "Invalid").map(x => x.messages);
  if (invalids.length == 0){
    return { type: "Valid", value: a.map(x => x.value) };
  } else{
    return { type: "Invalid", messages: invalids.reduce((acc, next) => acc.concat(next), []) };
  }
}

export function combineObject(a: {[key: string]: Validated<any>}): Validated<{[key: string]: any}> {
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

export function toOption<a>(x: Validated<a>): Option<a> {
  switch (x.type){
    case "Valid":
      return { type: "Some", value: x.value };
    case "Invalid":
      return { type: "None" };
    default: throw "unexpected";
  }
}



export function validateAll<a>(v: a): Validated<a>{
  return { type: "Valid", value: v };
}

export const validateLength: (min: number, max: number) => (v: string) => Validated<string> =
  (min: number, max: number) => (v: string): Validated<string> => {
    const invalidMsgs =
      (v.length < min ? [ "Too short" ] : [ ])
      .concat((v.length > max ? [ "Too long" ] : [ ]));

    return invalidMsgs.length > 0
      ? { type: "Invalid", messages: invalidMsgs }
      : { type: "Valid", value: v};
  };

export const validateNumber = (v: string): Validated<number> => {
  const number = parseFloat(v);

  return Number.isNaN(number)
    ? { type: "Invalid", messages: [ "Number required" ] }
    : { type: "Valid", value: number };
};

export function requireOption<a>(v: Option<a>): Validated<a> {
  switch (v.type){
    case 'Some':
      return { type: "Valid", value: v.value };
    case 'None':
      return { type: "Invalid", messages: ["Value required"]};
    default: throw "unexpected";
  }
}
