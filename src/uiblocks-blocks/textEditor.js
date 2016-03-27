// @flow

import type { Block } from '../uiblocks-core/block';
import type { InitResult } from '../uiblocks-core/init-result';
import * as block from '../uiblocks-core/block';
import * as initResult from '../uiblocks-core/init-result';

type Init = string
type State = string
type Action =
  { type: "Change", value: string }
  | { type: "Focus" }
  | { type: "Blur" }
export type Model = {
  value: string,
  onChange: (x: string) => void,
  onFocus: () => void,
  onBlur: () => void
}
type Value = string

function initialize(init: Init): InitResult<State, Action> {
  return initResult.mk(init);
}

function handle(state: State, action: Action): InitResult<State, Action> {
  switch (action.type) {
    case 'Change':
      return initResult.mk(action.value);
    case 'Focus':
      return initResult.mk(state, []);
    case 'Blur':
      return initResult.mk(state, []);
    default: throw "unexpected";
  }
}

function viewModel(state: State, dispatch: (a: Action) => void): Model {
  return {
    value: state,
    onChange: (txt: string) => dispatch({ type: "Change", value: txt }),
    onFocus: () => dispatch({ type: "Focus" }),
    onBlur: () => dispatch({ type: "Blur" }),
  }
}

function readValue(state: State): Value {
  return state;
}

module.exports = block.mk(initialize, handle, viewModel, readValue);
