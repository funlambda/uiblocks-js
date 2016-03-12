// @flow

const React = require('react');

function main(model: any){
  return (
    <div>
      Current Value!: {model.value}
      <button onClick={model.onIncrement}>Up</button>
      <button onClick={model.onDecrement}>Down</button>
    </div>
  );
}

module.exports = main;
