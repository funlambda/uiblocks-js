// @flow

export type Option<a> =
  { type: "None" }
  | { type: "Some", value: a }

export const None = { type: "None" };
export function Some<a>(value: a): Option<a>{
  return { type: "Some", value: value };
}

export function map<a, b>(f: (a: a) => b): ((x: Option<a>) => Option<b>) {
  return (x: Option<a>) => {
    switch (x.type){
      case "None":
        return { type: "None" }
      case "Some":
        return { type: "Some", value: f(x.value) }
      default:
        return { type: "None" }
    }
  };
}

export function splitPair<a,b>(x: Option<[a,b]>): [Option<a>, Option<b>]{
  switch (x.type){
    case "Some": return [Some(x.value[0]), Some(x.value[1])];
    case "None": return [None, None];
    default: throw "unexpected";
  }
}

export function splitArray(n: number): (x: Option<Array<any>>) => Array<Option<any>> {
  return x => {
    switch (x.type){
      case "Some": return x.value.map(Some);
      case "None":
        const aa = [...Array(n)];
        return aa.map(y => None);
      default: throw "unexpected";
    }
  };
}

export function splitObject(...keys: Array<string>): (x: Option<{ [key: string]: any }>) => { [key: string]: Option<any> } {
  return x => {
    switch (x.type){
      case "Some":
        const val = x.value;
        return keys.map(k => [ k, Some(val[k]) ])
                   .reduce((acc, next) => { acc[next[0]] = next[1]; return acc; }, {});

      case "None":
        return keys.map(k => [ k, None ])
                   .reduce((acc, next) => { acc[next[0]] = next[1]; return acc; }, {});
      default: throw "unexpected";
    }
  }
}
