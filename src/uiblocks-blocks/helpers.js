// @flow

import * as Block from '../uiblocks-core/block';
import * as Validation from '../uiblocks-core/validation';
import * as Option from '../uiblocks-core/option';
import { textEditor, showValue, record, touched, array } from './index';
var _ = require('lodash/fp');


export function buildRecordEditorBlock(spec: { [key: string]: Block.Block }): Block.Block {
  const spec2 = _.mapValues(x => touched(showValue(x)))(spec);
  const block1 = record(spec2);
  const block2 = Block.adaptValue(Validation.combineObject)(block1);
  const block3 = Block.adaptInit(Option.splitObject(...Object.keys(spec)))(block2);
  const block4 = showValue(block3);
  const block5 = touched(block4,
    Object.keys(spec).map(k => ({ key: k, action: { type: "Touch" } }))
  );

  return block5;
}

export const numberEditor =
  _.flow(
    Block.adaptInit(
      (x: Option.Option<number>): string => {
        switch (x.type){
          case "Some": return x.value.toString();
          case "None": return "";
          default: throw "unexpected";
        }
      }),
    Block.adaptValue(Validation.validateNumber)
  )(textEditor);
// Option<number> -> Validated<number>

export const stringEditor =
  _.flow(
    Block.adaptInit(
      (x: Option.Option<string>): string => {
        switch (x.type){
          case "Some": return x.value;
          case "None": return "";
          default: throw "unexpected";
        }
      }),
    Block.adaptValue(Validation.validateLength(1,20))
  )(textEditor);
// Option<string> -> Validated<string>

export function buildArrayEditor<InnerInit, InnerState, InnerAction, InnerModel, InnerValue>(innerBlock: Block.Block<InnerInit, InnerState, InnerAction, InnerModel, InnerValue>): Block.Block {
  const inner2 = touched(showValue(innerBlock));
  const xx = array(Option.None, inner2);
  const xx1 = Block.adaptInit(Option.splitArray(0))(xx);
  const xx2 = Block.adaptValue(Validation.combineArray)(xx1);
  return xx2;
}
