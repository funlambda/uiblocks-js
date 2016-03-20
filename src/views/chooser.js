// @flow

const React = require('react');
const BS = require('react-bootstrap');
const _ = require('lodash/fp');
import type { View } from '../uiblocks-core/view';
import type { Model } from '../blocks/chooser';
//import toClickHandler from '../uiblocks-core/view';

function toClickHandler(handler: () => void): ((ce: any) => bool) {
  return ce => {
    ce.preventDefault();
    ce.stopPropagation();
    handler();
    return false;
  };
}

type Config<OptionModel> = {
  optionView: View<OptionModel>,
  noneLabel?: string,
  label?: string,
  bsStyle?: string,
}



function mkView<OptionModel>(config: Config<OptionModel>): View<Model<OptionModel>> {
  return model => {
    function handleValueChange(x){
      const i = x.target.value;
      if (i == -1) {
        model.onClear();
      } else{
        model.options[i].onSelect();
      }
    }

    const selectedIndex = _.findIndex(o => o.isSelected)(model.options);

    return (
      <BS.Input type="select" value={selectedIndex} label={config.label} bsStyle={config.bsStyle} placeholder="select" onChange={handleValueChange}>
        {
          [ (<option value={-1}>{config.noneLabel}</option>) ].concat(
            model.options.map((o,i) => (
              <option value={i}>{config.optionView(o.option)}</option>
            ))
          )
        }
      </BS.Input>
    );
  }
}

module.exports = mkView;

// function mkView2<OptionModel>(optionView: View<OptionModel>): View<Model<OptionModel>> {
//   return model => (
//     <div>
//       <ul>
//         {model.options.map((o,i) => (
//           <li>
//             {o.isSelected
//                ? <span>{optionView(o.option)}</span>
//                : <a href="#" onClick={toClickHandler(o.onSelect)}>{optionView(o.option)}</a> }
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
