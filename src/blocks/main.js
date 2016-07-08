import * as Option from '../uiblocks-core/option';
import * as Validation from '../uiblocks-core/validation';
import * as Helpers from '../uiblocks-blocks/helpers';
import * as Block from '../uiblocks-core/block';
import { textEditor, delayValue, chooser, form, array } from '../uiblocks-blocks/index';

type Person = {
  name: string,
  favoriteColor: string,
  age: number,
  luckyNumbers: Array<number>
}

const colorOptions = [
  { _id: "red", name: "Red" },
  { _id: "green", name: "Green" },
  { _id: "blue", name: "Blue" }
];

function pipe(fn, ...vals){
  return fn(this, ...vals)
}

const initialValue: Option<Person> =
  Option.Some({ name: 'test', favoriteColor: 'green', age: 21, luckyNumbers: [ 23, 43 ]});

const a =
  Helpers.buildRecordEditorBlock({
    name:
      Helpers.stringEditor
      ::pipe(delayValue((a,s) => a.type == "Blur")),
    favoriteColor:
      chooser(colorOptions, o => o.name, o => o._id)
      ::pipe(Block.adaptValue(Validation.requireOption)),
    age:
      Helpers.numberEditor,
    luckyNumbers:
      Helpers.buildArrayEditor(Helpers.numberEditor)
  })
  ::pipe(form({
    allowSubmit: Validation.toOption,
    actionsOnSubmitFail: [{ type: "Touch" }]
  }));

module.exports = a::pipe(Block.adaptInit((x: null) => initialValue));
