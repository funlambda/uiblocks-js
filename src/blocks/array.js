// @flow

import { mk } from '../uiblocks-core/block';
import type { Block } from '../uiblocks-core/block';

export type Init<InnerInit> = Array<InnerInit>
export type State<InnerState> = Array<InnerState>
export type Action<InnerAction> =
  { type: "Add" }
  | { type: "Edit", index: number, action: InnerAction }
  | { type: "Remove", index: number}
export type Model<InnerModel> =
  {
    rows: Array<{ inner: InnerModel, onRemove: () => void}>,
    onAdd: () => void
  }
export type Value<InnerValue> =
  Array<InnerValue>

function mkBlock<InnerInit, InnerState, InnerAction, InnerModel, InnerValue>(
    innerInitForNew: InnerInit,
    innerBlock: Block<InnerInit, InnerState, InnerAction, InnerModel, InnerValue>)
    : Block<Init, State<InnerState>, Action<InnerAction>, Model<InnerModel>, Value<InnerValue>> {

  function initialize(init: Init<InnerInit>): State {
    return init.map(innerBlock.initialize);
  }

  function handle(state: State, action: Action): State {
    switch (action.type) {
      case 'Add':
        const newInnerState = innerBlock.initialize(innerInitForNew);
        return [...state, newInnerState];
      case 'Edit':
        const oldInnerState = state[action.index];
        const newInnerState1 = innerBlock.handle(oldInnerState, action.action);

        return state
          .slice(0, action.index)
          .concat([newInnerState1])
          .concat(state.slice(action.index + 1));
      case 'Remove':
        return state
          .slice(0, action.index)
          .concat(state.slice(action.index + 1));
      default:
        return state;
    }
  }

  function viewModel(state: State, dispatch: (a: Action) => void): Model {
    return {
      rows: state.map((x,i) => {
        return {
          inner: innerBlock.viewModel(x, a => dispatch({ type: "Edit", index: i, action: a})),
          onRemove: () => dispatch({ type: "Remove", index: i })
        };
      }
      ),
      onAdd: () => dispatch({ type: "Add" })
    }
  }

  function readValue(state: State): Value {
    return state.map(x => innerBlock.readValue(x));
  }

  return mk(initialize, handle, viewModel, readValue);
}

module.exports = mkBlock;
