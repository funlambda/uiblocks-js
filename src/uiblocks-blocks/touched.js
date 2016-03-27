// @flow

import type { Block } from '../uiblocks-core/block';
import type { InitResult } from '../uiblocks-core/init-result';
import * as block from '../uiblocks-core/block';
import * as initResult from '../uiblocks-core/init-result';

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
      innerBlock: Block<InnerInit, InnerState, InnerAction, InnerModel, InnerValue>,
      actionsOnTouch?: Array<InnerAction>)
    : Block<InnerInit, State<InnerState>, Action<InnerAction>, Model<InnerModel>, InnerValue> {

  function initialize(init: InnerInit): InitResult<State, Action> {
    const innerResult = innerBlock.initialize(init);

    return initResult.map(
      s => ({
        Inner: s,
        IsTouched: false
      }),
      a => ({ type: "Inner", action: a })
    )(innerResult);
  }

  function handle(state: State, action: Action<InnerAction>): InitResult<State, Action> {
    switch (action.type) {
      case "Inner":
        const _action = action.action;
        return initResult.map(
          s => ({
            Inner: s,
            IsTouched: true
          }),
          a => ({ type: "Inner", action: a })
        )(innerBlock.handle(state.Inner, _action));
      case "Touch":
        const _actions =
          actionsOnTouch != null
            ? actionsOnTouch.map(a => ({ type: "Inner", action: a}))
            : [];

        console.log("actions: ", _actions);

        return initResult.mk({
          Inner: state.Inner,
          IsTouched: true
        }, _actions);
      default: throw "unexpected";
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

  return block.mk(initialize, handle, viewModel, readValue);
}

module.exports = mkBlock;
