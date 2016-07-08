// @flow

import { array, textEditor, record, form, chooser } from "../uiblocks-views/index";
import * as Helpers from '../uiblocks-views/helpers';

const React = require('react');

function wrapInDiv(style, inner) {
  return model =>
    <div style={style}>
      {inner(model)}
    </div>;
}

const numberArrayEditor =
  Helpers.arrayEditor({})(
    { view: a => wrapInDiv({ width: 30 }, textEditor(a)), attr: { placeholder: "Lucky Number" }, invalidMap: s => ({ bsStyle: s }) }
  );

const b =
  Helpers.wrapInPanel(
    form(
      Helpers.recordEditor({
        name: { view: textEditor, attr: { label: "Name", placeholder: "Name" }, invalidMap: s => ({ bsStyle: s }) },
        favoriteColor: { view: chooser, attr: { label: "Favorite", noneLabel: "Select...", optionView: x => x }, invalidMap: s => ({ bsStyle: s }) },
        age: { view: textEditor, attr: { label: "Age", placeholder: "Age" }, invalidMap: s => ({ bsStyle: s }) },
        luckyNumbers: { view: a => numberArrayEditor, attr: { label: "what" }, invalidMap: s => ({}) }
      })
    )
  );

module.exports = b;
