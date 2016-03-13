// @flow

export type Block<Init, State, Action, Model, Value> = {
  initialize: (init: Init) => State,
  handle: (state: State, action: Action) => State,
  viewModel: (state: State, dispatch: (a: Action) => void) => Model,
  readValue: (state: State) => Value
}

export function mk<Init, State, Action, Model, Value>(
    initialize: (init: Init) => State,
    handle: (state: State, action: Action) => State,
    viewModel: (state: State, dispatch: (a: Action) => void) => Model,
    readValue: (state: State) => Value): Block<Init, State, Action, Model, Value> {

  return { initialize, handle, viewModel, readValue };
}

export function adaptInit<InitA, InitB, State, Action, Model, Value>(
  adapter: (i: InitB) => InitA,
  block: Block<InitA, State, Action, Model, Value>
): Block<InitB, State, Action, Model, Value> {

  return {
    initialize: (init: InitB) => block.initialize(adapter(init)),
    handle: block.handle,
    viewModel: block.viewModel,
    readValue: block.readValue
  }
}

export function adaptValue<Init, State, Action, Model, ValueA, ValueB>(
  adapter: (i: ValueA) => ValueB,
  block: Block<Init, State, Action, Model, ValueA>
): Block<Init, State, Action, Model, ValueB> {

    return {
      initialize: block.initialize,
      handle: block.handle,
      viewModel: block.viewModel,
      readValue: (state: State) => {
        const value = block.readValue(state);
        return adapter(value);
      }
    }
  }
