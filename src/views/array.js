// @flow

const React = require('react');

function mkView(inner: (model: any) => React$Element): (model: any) => React$Element {
  function main(model: any){
    return (
      <div>
        <h2>Array</h2>
        {model.rows.map(r => (
          <div>
            {inner(r.inner)}
            <button onClick={r.onRemove}>Remove</button>
          </div>
        ))}
        <div>
          <button onClick={model.onAdd}>Add</button>
        </div>
      </div>
    );
  }

  return main;
}

module.exports = mkView;
