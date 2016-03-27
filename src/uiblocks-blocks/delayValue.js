// @flow

import type { Block } from '../uiblocks-core/block';
import type { InitResult } from '../uiblocks-core/init-result';
import * as block from '../uiblocks-core/block';
import * as initResult from '../uiblocks-core/init-result';

export type State<InnerState, InnerValue> = {
  Inner: InnerState,
  Value: InnerValue
}

function mkBlock<InnerInit, InnerState, InnerAction, InnerModel, InnerValue>(
    shouldUpdate: (action: InnerAction, state: InnerState) => bool,
    innerBlock: Block<InnerInit, InnerState, InnerAction, InnerModel, InnerValue>):
    Block<InnerInit, State<InnerState, InnerValue>, InnerAction, InnerModel, InnerValue> {

  function initialize(init: InnerInit) {
    const result = innerBlock.initialize(init);
    return initResult.map(s => ({ Inner: s, Value: innerBlock.readValue(s) }), a => a)(result);
  }

  function handle(state: State<InnerState, InnerValue>, action: InnerAction){
    const result = innerBlock.handle(state.Inner, action);
    return initResult.map(s => ({
      Inner: s,
      Value: shouldUpdate(action, s)
               ? innerBlock.readValue(s)
               : state.Value
    }), a => a)(result);
  }

  function viewModel(state: State<InnerState, InnerValue>, dispatch: (a: InnerAction) => void): InnerModel {
    return innerBlock.viewModel(state.Inner, dispatch);
  }

  function readValue(state: State<InnerState, InnerValue>): InnerValue {
    return state.Value;
  }

  console.log("delayValue made");
  return block.mk(initialize, handle, viewModel, readValue);
}

module.exports = mkBlock;
