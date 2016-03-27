// @flow

import type { Block } from '../uiblocks-core/block';
import type { InitResult } from '../uiblocks-core/init-result';
import * as block from '../uiblocks-core/block';
import * as initResult from '../uiblocks-core/init-result';

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

function initialize(init: Init): InitResult<State, Action> {
  return initResult.mk(init);
}

function handle(state: State, action: Action): InitResult<State, Action> {
  switch (action.type) {
    case 'Change':
      return initResult.mk(action.value);
    default: throw "unexpected";
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

module.exports = block.mk(initialize, handle, viewModel, readValue);
