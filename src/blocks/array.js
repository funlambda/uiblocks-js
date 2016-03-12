// @flow

type init = null
type state<InnerState> = Array<InnerState>
type action<InnerAction> =
  { type: "Add" }
  | { type: "Edit", index: number, action: InnerAction }
  | { type: "Remove", index: number}
type model<InnerModel> =
  {
    rows: Array<{ inner: InnerModel, onRemove: () => void}>,
    onAdd: () => void
  }


function mkBlock<InnerState, InnerAction, InnerModel>(innerBlock: { initialize: (x: null) => InnerState, handle: (s: InnerState, a: InnerAction) => InnerState, viewModel: (s: InnerState, d: (x: InnerAction) => void) => InnerModel }): any {
  function initialize(init: init): state {
    return [];
  }

  function handle(state: state, action: action): state {
    switch (action.type) {
      case 'Add':
        const newInnerState = innerBlock.initialize(null);
        return [...state, newInnerState];
      case 'Edit':
        const oldInnerState = state[action.index];
        const newInnerState1 = innerBlock.handle(oldInnerState, action.action);

        return state
          .slice(0, action.index)
          .concat([newInnerState1])
          .concat(state.slice(action.index + 1));
      case 'Remove':
        return state
          .slice(0, action.index)
          .concat(state.slice(action.index + 1));
      default:
        return state;
    }
  }

  function viewModel(state: state, dispatch: (a: action) => void): model {
    return {
      rows: state.map((x,i) => {
        return {
          inner: innerBlock.viewModel(x, a => dispatch({ type: "Edit", index: i, action: a})),
          onRemove: () => dispatch({ type: "Remove", index: i })
        };
      }
      ),
      onAdd: () => dispatch({ type: "Add" })
    }
  }

  return { initialize, handle, viewModel };
}

module.exports = mkBlock;
