// @flow

import type { InitResult } from './init-result';

export type Block<Init, State, Action, Model, Value> = {
  initialize: (init: Init) => InitResult<State, Action>,
  handle: (state: State, action: Action) => InitResult<State, Action>,
  viewModel: (state: State, dispatch: (a: Action) => void) => Model,
  readValue: (state: State) => Value
}

export function mk<Init, State, Action, Model, Value>(
    initialize: (init: Init) => InitResult<State, Action>,
    handle: (state: State, action: Action) => InitResult<State, Action>,
    viewModel: (state: State, dispatch: (a: Action) => void) => Model,
    readValue: (state: State) => Value): Block<Init, State, Action, Model, Value> {

  return { initialize, handle, viewModel, readValue };
}

export function adaptInit<InitA, InitB, State, Action, Model, Value>(
  adapter: (i: InitB) => InitA):
    (x: Block<InitA, State, Action, Model, Value>) => Block<InitB, State, Action, Model, Value> {

  return block => ({
    initialize: (init: InitB) => block.initialize(adapter(init)),
    handle: block.handle,
    viewModel: block.viewModel,
    readValue: block.readValue
  });
}

export function adaptValue<Init, State, Action, Model, ValueA, ValueB>(
  adapter: (i: ValueA) => ValueB):
    (x: Block<Init, State, Action, Model, ValueA>) => Block<Init, State, Action, Model, ValueB> {

    return block => ({
      initialize: block.initialize,
      handle: block.handle,
      viewModel: block.viewModel,
      readValue: (state: State) => {
        const value = block.readValue(state);
        return adapter(value);
      }
    });
  }
