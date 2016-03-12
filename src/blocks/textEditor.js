// @flow

type init = null
type state = string
type action =
  { type: "Change", value: string }
  | { type: "Dummy" }
type model = {
  value: string,
  onChange: (x: string) => void
}

function initialize(init: init): state {
  return "";
}

function handle(state: state, action: action): state {
  switch (action.type) {
    case 'Change':
      console.log("change");
      console.log(action);
      return action.value;
    default:
      return state;
  }
}

function viewModel(state: state, dispatch: (a: action) => void): model {
  return {
    value: state,
    onChange: (txt: string) => dispatch({ type: "Change", value: txt })
  }
}

module.exports = { initialize, handle, viewModel };
