// @flow

const view = require("./views/main");
const block = require("./blocks/main");
const ReactDOM = require("react-dom");
import { createStore } from 'redux'

function reducer(state, action){
  if (action.type == "blah"){
    return block.handle(state, action.action);
  } else {
    return state;
  }
}

let initState = block.initialize(null);
let store = createStore(reducer, initState);

function renderState(state){
  const model = block.viewModel(state, a => store.dispatch({ type: 'blah', action: a }));
  const elem = view(model);
  ReactDOM.render(elem, document.getElementById('root'));
}

renderState(store.getState());

store.subscribe(() => {
  renderState(store.getState());
});
