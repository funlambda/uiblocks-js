// @flow

import type { Block } from '../uiblocks-core/block';
import type { InitResult } from '../uiblocks-core/init-result';
import * as block from '../uiblocks-core/block';
import * as initResult from '../uiblocks-core/init-result';

export type Init = object
export type State = object
export type Action = { key: string, action: any }
export type Model = object
export type Value = object

function mkBlock(innerBlocks: { [key: string]: Block })
    : Block<Init, State, Action, Model, Value> {

  function initialize(init: Init): InitResult<State, Action> {
    const xx =
      Object.keys(innerBlocks)
            .map(k => [ k, innerBlocks[k].initialize(init[k]) ]);

    const state = xx.map(x => [ x[0], x[1].state ])
                    .reduce((acc, next) => { acc[next[0]] = next[1]; return acc; }, {});
    const actions = xx.map(x => x[1].actions.map(y => ({ key: x[0], action: y })))
                      .reduce((acc, next) => acc.concat(next), []);

    return initResult.mk(state, actions);
  }

  function handle(state: State, action: Action): InitResult<State, Action> {
    const innerBlock = innerBlocks[action.key];
    const result = innerBlock.handle(state[action.key], action.action);

    return initResult.map(
      s => {
        const x =
          Object.keys(state)
                .map(k => [ k, (k == action.key ? s : state[k]) ])
                .reduce((acc, next) => { acc[next[0]] = next[1]; return acc; }, {})

        return x;
      },
      a => ({ key: action.key, action: a})
    )(result);
  }

  function viewModel(state: State, dispatch: (a: Action) => void): Model {
    const xx =
      Object.keys(innerBlocks)
            .map(k => [ k, innerBlocks[k].viewModel(state[k], a => dispatch({key: k, action: a})) ])
            .reduce((acc, next) => { acc[next[0]] = next[1]; return acc; }, {});

    return xx;
  }

  function readValue(state: State): Value {
    const xx =
      Object.keys(innerBlocks)
            .map(k => [ k, innerBlocks[k].readValue(state[k]) ])
            .reduce((acc, next) => { acc[next[0]] = next[1]; return acc; }, {});

    return xx;
  }

  return block.mk(initialize, handle, viewModel, readValue);
}

module.exports = mkBlock;
