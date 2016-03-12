// @flow

type init = null
type state = number
type action = "Increment" | "Decrement"
type model = {
  value: number,
  onIncrement: () => void,
  onDecrement: () => void
}

function initialize(init: init): state {
  console.log("initialize");
  return 0;
}

function handle(state: state, action: action): state {
  switch (action) {
    case 'Increment':
      return state + 1
    case 'Decrement':
      return state - 1
    default:
      return state
  }
}

function viewModel(state: state, dispatch: (a: action) => void): model {
  return {
    value: state,
    onIncrement: () => dispatch("Increment"),
    onDecrement: () => dispatch("Decrement")
  }
}

module.exports = { initialize, handle, viewModel };
