// @flow

import type { Block } from '../uiblocks-core/block';
import type { InitResult } from '../uiblocks-core/init-result';
import * as block from '../uiblocks-core/block';
import * as initResult from '../uiblocks-core/init-result';

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

  function initialize(init: Init<InnerInit>): InitResult<State<InnerState>, Action<InnerAction>> {
    const initResults = init.map(innerBlock.initialize);
    const state =
      initResults
        .map(r => r.state)
        .reduce((acc, s) => acc.concat([s]), []);
    const actions =
      initResults
        .map(r => r.actions)
        .map((acts, i) => acts.map(a => ({ type: "Edit", index: i, action: a })))
        .reduce((acc, x) => acc.concat(x), []);

    return initResult.mk(state, actions);
  }

  function handle(state: State<InnerState>, action: Action<InnerAction>): InitResult<State<InnerState>, Action<InnerAction>> {
    switch (action.type) {
      case 'Add':
        const result = innerBlock.initialize(innerInitForNew);
        return initResult.mk([...state, result.state], result.actions.map(a => ({ type: "Edit", index: state.length, action: a })));
      case 'Edit':
        const oldInnerState = state[action.index];
        let result1 = innerBlock.handle(oldInnerState, action.action);
        let index = action.index;

        return initResult.mk(
          state
            .slice(0, action.index)
            .concat([result1.state])
            .concat(state.slice(action.index + 1)),
          result1.actions.map(a => ({ type: "Edit", index: index, action: a }))
        );
      case 'Remove':
        return initResult.mk(state
          .slice(0, action.index)
          .concat(state.slice(action.index + 1)));
      default: throw "unexpected";
    }
  }

  function viewModel(state: State<InnerState>, dispatch: (a: Action<InnerAction>) => void): Model {
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

  function readValue(state: State<InnerState>): Value<InnerValue> {
    return state.map(x => innerBlock.readValue(x));
  }

  return block.mk(initialize, handle, viewModel, readValue);
}

module.exports = mkBlock;
