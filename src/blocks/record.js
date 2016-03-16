// @flow

import type { Block } from '../uiblocks-core/block';
import type { InitResult } from '../uiblocks-core/init-result';
import * as block from '../uiblocks-core/block';
import * as initResult from '../uiblocks-core/init-result';

export type Init<InnerInit1, InnerInit2> =
  [InnerInit1, InnerInit2]
export type State<InnerState1, InnerState2> =
  [InnerState1, InnerState2]
export type Action<InnerAction1, InnerAction2> =
  | { type: "one", action: InnerAction1 }
  | { type: "two", action: InnerAction2 }
export type Model<InnerModel1, InnerModel2> =
  [InnerModel1, InnerModel2]
export type Value<InnerValue1, InnerValue2> =
  [InnerValue1, InnerValue2]

function mkBlock<InnerInit1, InnerInit2, InnerState1, InnerState2, InnerAction1, InnerAction2, InnerModel1, InnerModel2, InnerValue1, InnerValue2>(
  innerBlock1: Block<InnerInit1, InnerState1, InnerAction1, InnerModel1, InnerValue1>,
  innerBlock2: Block<InnerInit2, InnerState2, InnerAction2, InnerModel2, InnerValue2>)
    : Block<Init<InnerInit1, InnerInit2>, State<InnerState1, InnerState2>, Action<InnerAction1, InnerAction2>, Model<InnerModel1, InnerModel2>, Value<InnerValue1, InnerValue2>> {

  function initialize(init: Init<InnerInit1, InnerInit2>): InitResult<State<InnerState1, InnerState2>, Action<InnerAction1, InnerAction2>> {
    const result1 = innerBlock1.initialize(init[0]);
    const result2: InitResult<InnerState2, InnerAction2> = innerBlock2.initialize(init[1]);
    return initResult.mk(
      [ result1.state, result2.state ],
      result1.actions.map(a => ({ type: "one", action: a }: Action<InnerAction1, InnerAction2>))
        .concat(result2.actions.map(a => ({ type: "two", action: a }: Action<InnerAction1, InnerAction2>)))
    );
  }

  function handle(state: State, action: Action): InitResult<State<InnerState1, InnerState2>, Action<InnerAction1, InnerAction2>> {
    switch (action.type) {
      case "one":
        const _action1: InnerAction1 = action.action;
        return initResult.map(
          s => [ s, state[1] ],
          a => ({ type: "one", action: a})
        )(innerBlock1.handle(state[0], _action1));
      case "two":
        const _action2: InnerAction2 = action.action;
        return initResult.map(
          s => [ state[0], s ],
          (a: InnerAction2) => ({ type: "two", action: a})
        )(innerBlock2.handle(state[1], _action2));
      default: throw "unexpected";
    }
  }

  function viewModel(state: State, dispatch: (a: Action) => void): Model<InnerModel1, InnerModel2> {
    return [
      innerBlock1.viewModel(state[0], a => dispatch({ type: "one", action: a })),
      innerBlock2.viewModel(state[1], a => dispatch({ type: "two", action: a }))
    ];
  }

  function readValue(state: State): Value {
    return [
      innerBlock1.readValue(state[0]),
      innerBlock2.readValue(state[1])
    ];
  }

  return block.mk(initialize, handle, viewModel, readValue);
}

module.exports = mkBlock;
