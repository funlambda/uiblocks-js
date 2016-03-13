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
