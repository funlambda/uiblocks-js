// @flow

import type { Block } from '../uiblocks-core/block';
import type { InitResult } from '../uiblocks-core/init-result';
import * as block from '../uiblocks-core/block';
import * as initResult from '../uiblocks-core/init-result';

type Init = null
type State = number
type Action = "Increment" | "Decrement"
export type Model = {
  value: number,
  onIncrement: () => void,
  onDecrement: () => void
}
type Value = number

function initialize(init: Init): InitResult<State, Action> {
  console.log("initialize");
  return initResult.mk(0);
}

function handle(state: State, action: Action): InitResult<State, Action> {
  switch (action) {
    case 'Increment':
      return initResult.mk(state + 1);
    case 'Decrement':
      return initResult.mk(state - 1);
    default:
      return initResult.mk(state);
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

module.exports = block.mk(initialize, handle, viewModel, readValue);
