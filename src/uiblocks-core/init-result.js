// @flow

export type InitResult<State, Action> = {
  state: State,
  actions: Array<Action>
}

export function mk<State, Action>(state: State, actions?: Array<Action>): InitResult<State, Action> {
  if (actions == null)
    actions = [];

  return {
    state: state,
    actions: actions
  };
}

export function combine<State, Action>(initResults: Array<InitResult<State, Action>>): InitResult<Array<State>, Action> {
  const newState =
    initResults
      .map(x => x.state);

  const actions =
    initResults
      .map(x => x.actions)
      .reduce((acc, next) => acc.concat(next));

  return mk(newState, actions);
}

export function map<State1, State2, Action1, Action2>(stateMapper: (x: State1) => State2, actionMapper: (x: Action1) => Action2): (x: InitResult<State1, Action1>) => InitResult<State2, Action2> {
  return (x: InitResult<State1, Action1>) =>
    mk(stateMapper(x.state), x.actions.map(actionMapper));
}
