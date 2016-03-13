// @flow

import type { Block } from './block';

type Init = null
type State = number
type Action = "Increment" | "Decrement"
export type Model = {
  value: number,
  onIncrement: () => void,
  onDecrement: () => void
}
type Value = number

function initialize(init: Init): State {
  console.log("initialize");
  return 0;
}

function handle(state: State, action: Action): State {
  switch (action) {
    case 'Increment':
      return state + 1
    case 'Decrement':
      return state - 1
    default:
      return state
  }
}

function viewModel(state: State, dispatch: (a: Action) => void): Model {
  return {
    value: state,
    onIncrement: () => dispatch("Increment"),
    onDecrement: () => dispatch("Decrement")
  }
}

function readValue(state: State): Value {
  return state;
}

const block: Block<Init, State, Action, Model, Value> =
  { initialize, handle, viewModel, readValue };

module.exports = block;
