// @flow

import * as Block from '../uiblocks-core/block';
import * as Validation from '../uiblocks-core/validation';
import * as View from '../uiblocks-core/view';
var _ = require('lodash/fp');
import type { Model as TouchedModel } from '../uiblocks-blocks/touched';
import type { Model as ValueModel } from '../uiblocks-blocks/showValue';
import type { Validated } from '../uiblocks-core/validation';
const React = require("react");
const BS = require("react-bootstrap");

import { touched, showValue, record, textEditor, array } from './index';

function validatedTouched<a, b>(inner: (validationStatus: any) => (model: b) => React$Element) {
  return (model: TouchedModel<ValueModel<b, Validated<a>>>): React$Element => {
    const validationStatus = model.IsTouched && model.Inner.Value.type == "Invalid" ? "error" : null;
    return inner(validationStatus)(model.Inner.Inner);
  }
}

export function wrapInPanel<Model>(view: View<Model>): View<Model>{
  return (m: Model) => (
    <div>
      <BS.Panel style={{width: 500}}>
        {view(m)}
      </BS.Panel>
    </div>
  );
}

export function recordEditor(spec: { [key: string]: { view: (attr: any) => View.View, invalidMap: (invalid: string) => any, attr: { [key:string]: any } } }): View.View {
  const spec2 = _.mapValues(x => {
    return validatedTouched(s => {
      let y = x.invalidMap(s);
      let z = _.merge(y, x.attr);
      return x.view(z);
    });
  })(spec);

  const view1 =
    touched({debug: false})(
      showValue({debug: true})(
        record(spec2)
      )
    );

  return view1;
}


export function arrayEditor(config: any): (inner: { view: (attr: any) => View.View, invalidMap: (invalid: string) => any, attr: { [key:string]: any } }) => View.View {
  return inner => array(config)(validatedTouched(s => {
    let y = inner.invalidMap(s);
    let z = _.merge(y, inner.attr);
    return inner.view(z);
  }));
}
