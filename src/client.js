// @flow

const block = require("./blocks/main");
const React = require("react");
const ReactDOM = require("react-dom");
import { createStore } from 'redux'

function reducer(state, action){
  console.log("action:", action);

  if (action.type == "blah"){
    const result = block.handle(state, action.action);
    console.log("result", result);

    // TODO: Do this more cleanly (a bit hackish as-is)
    window.setTimeout(
      () =>
        result.actions.map(a =>
          store.dispatch({ type: 'blah', action: a })
        ),
      50);

    return result.state;
  } else {
    return state;
  }
}

let result = block.initialize(null);
console.log("initial result", result);
let store = createStore(reducer, result.state);

result.actions.map(a =>
  store.dispatch({ type: 'blah', action: a })
);

const rootEl = document.getElementById('root')

function renderState(state){
  const model = block.viewModel(state, a => store.dispatch({ type: 'blah', action: a }));
  const view = require("./views/main.js");
  const elem = view(model);
  ReactDOM.render(elem, rootEl);
}

const render = () => renderState(store.getState());
const renderWithErrorCatch = () => {
  try {
    return render();
  } catch (error) {
    const RedBox = require('redbox-react');
    return ReactDOM.render(
      <RedBox error={error} />,
      rootEl
    );
  }
};

render();
store.subscribe(render);

if (module.hot) {
  module.hot.accept('./views/main.js', function() {
    setTimeout(render);
  });
}
