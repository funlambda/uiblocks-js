// @flow

import * as _ from 'lodash/fp';
import type { Block } from '../uiblocks-core/block';
import type { InitResult } from '../uiblocks-core/init-result';
import type { Option } from '../uiblocks-core/option';
import * as block from '../uiblocks-core/block';
import * as initResult from '../uiblocks-core/init-result';
import * as option from '../uiblocks-core/option';

type Init<Value> = Option<Value>
type State = {
  selected: Option<number>
}
type Action =
  { type: "Select", index: number }
  | { type: "Clear" }
export type Model<OptionModel> = {
  options: Array<{ option: OptionModel, isSelected: bool, onSelect: () => void }>,
  onClear: () => void
}

function mkBlock<A, OptionModel, Value>(options: Array<A>, toOptionModel: (x: A) => OptionModel, toValue: (x: A) => Value): Block<Init, State, Action, Model<OptionModel>, Option<Value>> {
  function initialize(init: Init): InitResult<State, Action> {
    const selected = (function () {
      switch (init.type){
        case "Some":
          const value = init.value;
          const index = _.findIndex(o => _.isEqual(toValue(o), value))(options);
          if (index == -1)
            return option.None;
          else
            return option.Some(index);
        case "None": return option.None;
        default: throw "unexpected";
      }
    })();

    return initResult.mk({selected: selected});
  }

  function handle(state: State, action: Action): InitResult<State, Action> {
    switch (action.type) {
      case 'Select':
        return initResult.mk({selected: option.Some(action.index) });
      case 'Clear':
        return initResult.mk({selected: option.None });
      default: throw "unexpected";
    }
  }

  function viewModel(state: State, dispatch: (a: Action) => void): Model<OptionModel> {
    return {
      options: options.map((o, i) => ({
        option: toOptionModel(o),
        isSelected: _.isEqual(state.selected, option.Some(i)),
        onSelect: () => dispatch({ type: "Select", index: i })
      })),
      onClear: () => dispatch({ type: "Clear" })
    };
  }

  function readValue(state: State): Option<Value> {
    console.log(state);
    return option.map(_.flow(i => options[i], toValue))(state.selected);
  }

  return block.mk(initialize, handle, viewModel, readValue);
}

module.exports = mkBlock;
