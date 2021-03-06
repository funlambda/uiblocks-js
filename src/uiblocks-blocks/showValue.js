// @flow

import type { Block } from '../uiblocks-core/block';
import type { InitResult } from '../uiblocks-core/init-result';
import * as block from '../uiblocks-core/block';
import * as initResult from '../uiblocks-core/init-result';

export type Model<InnerModel, InnerValue> = {
  Inner: InnerModel,
  Value: InnerValue
}

function mkBlock<InnerInit, InnerState, InnerAction, InnerModel, InnerValue>(
    innerBlock: Block<InnerInit, InnerState, InnerAction, InnerModel, InnerValue>):
    Block<InnerInit, InnerState, InnerAction, Model<InnerModel, InnerValue>, InnerValue> {

  function viewModel(state: InnerState, dispatch: (a: InnerAction) => void): Model<InnerModel, InnerValue> {
    return {
      Inner: innerBlock.viewModel(state, dispatch),
      Value: innerBlock.readValue(state),
    };
  }

  return block.mk(innerBlock.initialize, innerBlock.handle, viewModel, innerBlock.readValue);
}

module.exports = mkBlock;
