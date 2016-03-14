// @flow

import { mk } from './block';
import type { Block } from './block';
const option = require("./option");
import type { Option } from './option';

export type State<InnerState, a> =
  { type: "Editing", inner: InnerState }
  | { type: "Submitted", value: a }
export type Action<InnerAction> =
  { type: "Submit" }
  | { type: "Inner", action: InnerAction }
export type Model<InnerModel, a> =
  { type: "Editing", form: { Inner: InnerModel, OnSubmit: () => void} }
  | { type: "Submitted", value: a }
export type Value<a> =
  Option<a>

function mkBlock<InnerInit, InnerState, InnerAction, InnerModel, InnerValue, a>(
    innerBlock: Block<InnerInit, InnerState, InnerAction, InnerModel, InnerValue>,
    allowSubmit: (x: InnerValue) => Option<a>)
    : Block<InnerInit, State<InnerState, a>, Action<InnerAction>, Model<InnerModel, a>, Value<a>> {

  function initialize(init: InnerInit): State<InnerState, a> {
    return { type: "Editing", inner: innerBlock.initialize(init) };
  }

  function handle(state: State<InnerState, a>, action: Action<InnerAction>): State<InnerState, a> {
    switch (action.type) {
      case 'Inner':
        switch (state.type) {
          case 'Editing':
            return { type: "Editing", inner: innerBlock.handle(state.inner, action.action) };
          default:
            return state;
        }
      case 'Submit':
        switch (state.type) {
          case 'Editing':
            const result = allowSubmit(innerBlock.readValue(state.inner));
            switch (result.type){
              case 'Some':
                return { type: "Submitted", value: result.value };
              case 'None':
                return { type: "Editing", inner: state.inner };
              default: throw "unexpected";
            }
          default: throw "unexpected";
        }
      default: throw "unexpected";
    }
  }

  function viewModel(state: State<InnerState, a>, dispatch: (a: Action<InnerAction>) => void): Model {
    switch (state.type){
      case "Editing":
        return {
          type: "Editing",
          form: {
            Inner: innerBlock.viewModel(state.inner, a => dispatch({type: "Inner", action: a})),
            OnSubmit: () => dispatch({ type: "Submit" })
          }
        };
      case "Submitted":
        return {
          type: "Submitted",
          value: state.value
        };
      default: throw "unexpected";
    }
  }

  function readValue(state: State): Value<a> {
    switch (state.type){
      case "Editing":
        return option.None;
      case "Submitted":
        return option.Some(state.value);
      default: throw "unexpected";
    }
  }

  return mk(initialize, handle, viewModel, readValue);
}

module.exports = mkBlock;
