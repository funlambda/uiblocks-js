// @flow

import type { Block } from './block';
import type { Option } from './option';
import { mk } from './block';
var option = require('./option');

export type State<InnerValue, InnerState> = {
  Inner: InnerState,
  Value: Option<InnerValue>
}

export type Action<InnerAction> =
  { type: "Inner", action: InnerAction }

export type Model<InnerValue, InnerModel> = {
  Inner: InnerModel,
  Value: Option<InnerValue>
}
export type Value<InnerValue> = Option<InnerValue>

type Config<InnerState, InnerAction, InnerValue> = {
  rebindTrigger: (action: InnerAction, state: InnerState) => bool
}

function mkBlock<InnerInit, InnerState, InnerAction, InnerModel, InnerValue>(
    config: Config<InnerState, InnerAction, InnerValue>,
    innerBlock: Block<InnerInit, InnerState, InnerAction, InnerModel, InnerValue>):
    Block<InnerInit, State<InnerValue, InnerState>, Action<InnerAction>, Model<InnerValue, InnerModel>, Option<InnerValue>> {

  function initialize(init: InnerInit): State<InnerValue, InnerState> {
    const innerInitResult = innerBlock.initialize(init);
    return {
      Inner: innerInitResult,
      Value: option.None
    };
  }

  function handle(state: State<InnerValue, InnerState>, action: Action<InnerAction>): State<InnerValue, InnerState> {
    switch (action.type) {
      case 'Inner':
        const newInner = innerBlock.handle(state.Inner, action.action);
        const newValue =
          config.rebindTrigger(action.action, newInner)
            ? (function () {
              const value = innerBlock.readValue(newInner);
              return option.Some(value);
            })()
            : state.Value;

        return {
          Inner: newInner,
          Value: newValue
        };
      default:
        return state;
    }
  }

  function viewModel(state: State<InnerValue, InnerState>, dispatch: (a: Action<InnerAction>) => void): Model<InnerValue, InnerModel> {
    return {
      Value: state.Value,
      Inner: innerBlock.viewModel(state.Inner, a => dispatch({type: "Inner", action: a}))
    };
  }

  function readValue(state: State<InnerValue, InnerState>): Value<InnerValue> {
    return state.Value;
  }

  return mk(initialize, handle, viewModel, readValue);
}

module.exports = mkBlock;
