// @flow

import type { Option } from "../uiblocks-core/option";
import type { Block } from '../uiblocks-core/block';
import type { InitResult } from '../uiblocks-core/init-result';
import * as block from '../uiblocks-core/block';
import * as initResult from '../uiblocks-core/init-result';
import * as option from '../uiblocks-core/option';

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

type Config<InnerAction, InnerValue, a> = {
  allowSubmit: (x: InnerValue) => Option<a>,
  actionsOnSubmitFail: Array<InnerAction>
}

function mkBlock<InnerInit, InnerState, InnerAction, InnerModel, InnerValue, a>(config: Config<InnerAction, InnerValue, a>):
    (block: Block<InnerInit, InnerState, InnerAction, InnerModel, InnerValue>) => Block<InnerInit, State<InnerState, a>, Action<InnerAction>, Model<InnerModel, a>, Value<a>> {

  return innerBlock => {
    function initialize(init: InnerInit): InitResult<State<InnerState, a>, Action<InnerAction>> {
      return initResult.map(
        s => ({ type: "Editing", inner: s}),
        a => ({ type: "Inner", action: a }))
        (innerBlock.initialize(init));
    }

    function handle(state: State<InnerState, a>, action: Action<InnerAction>): InitResult<State<InnerState, a>, Action<InnerAction>> {
      switch (action.type) {
        case 'Inner':
          switch (state.type) {
            case 'Editing':
              return initResult.map(
                s => ({ type: "Editing", inner: s}),
                a => ({ type: "Inner", action: a }))
              (innerBlock.handle(state.inner, action.action));
            default: throw "unexpected";
          }
        case 'Submit':
          switch (state.type) {
            case 'Editing':
              const result = config.allowSubmit(innerBlock.readValue(state.inner));
              switch (result.type){
                case 'Some':
                  return initResult.mk({ type: "Submitted", value: result.value });
                case 'None':
                  const actions = config.actionsOnSubmitFail.map(a => ({ type: "Inner", action: a }));

                  return initResult.mk({ type: "Editing", inner: state.inner }, actions);
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

    return block.mk(initialize, handle, viewModel, readValue);
  };
}

module.exports = mkBlock;
