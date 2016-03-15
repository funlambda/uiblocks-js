// @flow

import { mk } from '../uiblocks-core/block';
import type { Block } from '../uiblocks-core/block';

type Init = string
type State = string
type Action =
  { type: "Change", value: string }
  | { type: "Dummy" }
export type Model = {
  value: string,
  onChange: (x: string) => void
}
type Value = string

function initialize(init: Init): State {
  return init;
}

function handle(state: State, action: Action): State {
  switch (action.type) {
    case 'Change':
      console.log("change");
      console.log(action);
      return action.value;
    default:
      return state;
  }
}

function viewModel(state: State, dispatch: (a: Action) => void): Model {
  return {
    value: state,
    onChange: (txt: string) => dispatch({ type: "Change", value: txt })
  }
}

function readValue(state: State): Value {
  return state;
}

const block: Block<Init, State, Action, Model, Value> = { initialize, handle, viewModel, readValue };

module.exports = block;
