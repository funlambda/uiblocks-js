// @flow

import { mk } from '../uiblocks-core/block';
import type { Block } from '../uiblocks-core/block';

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

  return mk(innerBlock.initialize, innerBlock.handle, viewModel, innerBlock.readValue);
}

module.exports = mkBlock;
