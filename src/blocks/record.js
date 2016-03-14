// @flow

import { mk } from './block';
import type { Block } from './block';

export type Init<InnerInit1, InnerInit2> =
  [InnerInit1, InnerInit2]
export type State<InnerState1, InnerState2> =
  [InnerState1, InnerState2]
export type Action<InnerAction1, InnerAction2> =
  | { type: 1, action: InnerAction1 }
  | { type: 2, action: InnerAction2 }
export type Model<InnerModel1, InnerModel2> =
  [InnerModel1, InnerModel2]
export type Value<InnerValue1, InnerValue2> =
  [InnerValue1, InnerValue2]

function mkBlock<InnerInit1, InnerInit2, InnerState1, InnerState2, InnerAction1, InnerAction2, InnerModel1, InnerModel2, InnerValue1, InnerValue2>(
  innerBlock1: Block<InnerInit1, InnerState1, InnerAction1, InnerModel1, InnerValue1>,
  innerBlock2: Block<InnerInit2, InnerState2, InnerAction2, InnerModel2, InnerValue2>)
    : Block<Init<InnerInit1, InnerInit2>, State<InnerState1, InnerState2>, Action<InnerAction1, InnerAction2>, Model<InnerModel1, InnerModel2>, Value<InnerValue1, InnerValue2>> {

  function initialize(init: Init<InnerInit1, InnerInit2>): State {
    return [
      innerBlock1.initialize(init[0]),
      innerBlock2.initialize(init[1])
    ];
  }

  function handle(state: State, action: Action): State {
    switch (action.type) {
      case 1:
        return [
          innerBlock1.handle(state[0], action.action),
          state[1]
        ];
      case 2:
        return [
          state[0],
          innerBlock2.handle(state[1], action.action),
        ];
      default:
        return state;
    }
  }

  function viewModel(state: State, dispatch: (a: Action) => void): Model<InnerModel1, InnerModel2> {
    return [
      innerBlock1.viewModel(state[0], a => dispatch({ type: 1, action: a })),
      innerBlock2.viewModel(state[1], a => dispatch({ type: 2, action: a }))
    ];
  }

  function readValue(state: State): Value {
    return [
      innerBlock1.readValue(state[0]),
      innerBlock2.readValue(state[1])
    ];
  }

  return mk(initialize, handle, viewModel, readValue);
}

module.exports = mkBlock;
