// @flow

import type { Block } from '../uiblocks-core/block';
import type { InitResult } from '../uiblocks-core/init-result';
import * as block from '../uiblocks-core/block';
import * as initResult from '../uiblocks-core/init-result';

export type Init = Array<any>
export type State = Array<any>
export type Action = { index: number, action: any }
export type Model = Array<any>
export type Value = Array<any>

function mkBlock(...innerBlocks: Array<Block>)
    : Block<Init, State, Action, Model, Value> {

  function initialize(init: Init): InitResult<State, Action> {
    const initResults =
      init.map((x, i) => innerBlocks[i].initialize(x));

    const state =
      initResults
        .map(r => r.state)
        .reduce((acc, s) => acc.concat([s]), []);

    const actions =
     initResults
       .map(r => r.actions)
       .map((acts, i) => acts.map(a => ({ index: i, action: a })))
       .reduce((acc, x) => acc.concat(x), []);

    return initResult.mk(state, actions);
  }

  function handle(state: State, action: Action): InitResult<State, Action> {
    const innerBlock = innerBlocks[action.index];
    const result = innerBlock.handle(state[action.index], action.action);

    return initResult.map(
      s => state
             .slice(0, action.index)
             .concat([result.state])
             .concat(state.slice(action.index + 1)),
      a => ({ index: action.index, action: a})
    )(result);
  }

  function viewModel(state: State, dispatch: (a: Action) => void): Model {
    return state.map((x, i) => innerBlocks[i].viewModel(x, a => dispatch({ index: i, action: a })));
  }

  function readValue(state: State): Value {
    return state.map((x, i) => innerBlocks[i].readValue(x));
  }

  return block.mk(initialize, handle, viewModel, readValue);
}

module.exports = mkBlock;
