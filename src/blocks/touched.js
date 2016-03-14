// @flow

import { mk } from './block';
import type { Block } from './block';

export type State<InnerState> = {
  Inner: InnerState,
  IsTouched: bool
}
export type Action<InnerAction> =
  { type: "Inner", action: InnerAction }
  | { type: "Touch" }

export type Model<InnerModel> = {
  Inner: InnerModel,
  IsTouched: bool
}

function mkBlock<InnerInit, InnerState, InnerAction, InnerModel, InnerValue>(
    innerBlock: Block<InnerInit, InnerState, InnerAction, InnerModel, InnerValue>)
    : Block<InnerInit, State<InnerState>, Action<InnerAction>, Model<InnerModel>, InnerValue> {

  function initialize(init: InnerInit): State {
    return {
      Inner: innerBlock.initialize(init),
      IsTouched: false
    };
  }

  function handle(state: State, action: Action<InnerAction>): State {
    switch (action.type) {
      case "Inner":
        return {
          Inner: innerBlock.handle(state.Inner, action.action),
          IsTouched: true
        };
      case "Touch":
        return {
          Inner: state.Inner,
          IsTouched: true
        };
      default:
        return state;
    }
  }

  function viewModel(state: State, dispatch: (a: Action<InnerAction>) => void): Model<InnerModel> {
    return {
      Inner: innerBlock.viewModel(state.Inner, a => dispatch({ type: "Inner", action: a })),
      IsTouched: state.IsTouched
    };
  }

  function readValue(state: State<InnerState>): InnerValue {
    return innerBlock.readValue(state.Inner);
  }

  return mk(initialize, handle, viewModel, readValue);
}

module.exports = mkBlock;
