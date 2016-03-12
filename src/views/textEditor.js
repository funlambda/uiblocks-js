// @flow

const React = require('react');

const toChangeHandler: (handler: (x: string) => void) => ((ce: any) => void) =
  handler => (ce => handler(ce.target.value));

function main(model: any){
  return (
    <input type="text" value={model.value} onChange={toChangeHandler(model.onChange)} />
  );
}

module.exports = main;
