const forEach = (l, f) => {
  for (var i = 0; i < l.length; i++) {
    f(l[i], i);
  }
};

/*
 Utility function for creating dom elements.
 Used as N(dom_element_type, attributes, children)
 */
const N = (elt_ty, attrs, chldrn) => {
  attrs = attrs || {};
  chldrn = chldrn || [];

  var elt = document.createElement(elt_ty);

  // Add each of the attributes to the element
  for (var attr in attrs) {
    if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
      if (! attrs[attr]) continue;

      elt.setAttribute(attr, attrs[attr]);
    }
  }

  // Append each of the children
  forEach(chldrn, function(child) {
    if (typeof child === 'string') {
      // Automatically create text nodes
      child = document.createTextNode(child);
    }

    elt.appendChild(child);
  });

  return elt;
};

const showDataTransfer = (reasonStr, dt) => {
  let types = [];
  forEach(dt.types, t => {
    types.push(N('li', [], [t]));
  });

  let items = [];
  forEach(dt.items, i => {
    let value = N('p', [], ['pending..']);
    if (i.kind == 'string') {
      i.getAsString(s => {
        value.textContent = "String(" + s + ")";
      });
    } else {
      let file = i.getAsFile();
      value.innerHTML = "";
      value.appendChild(N('p', {}, ['File(' + file + ')']));
      if (file) {
        let url = URL.createObjectURL(file);
        value.appendChild(N('img', {src: url}, []));
      }
    }

    items.push(N('li', [], [
      N('p', [], [i.type, ' ---- ', i.kind]),
      value
    ]));
  });

  return N('div', [], [
    N('h2', [], ['reason']),
    N('p', [], [reasonStr]),

    N('h2', [], ['types']),
    N('ul', [], types),

    N('h2', [], ['items']),
    N('ul', [], items),
  ]);
};

document.body.addEventListener('paste', evt => {
  let results = document.querySelector('#results');
  results.appendChild(showDataTransfer("paste", evt.clipboardData));
  results.appendChild(showDataTransfer("paste_after", evt.clipboardData));

});


document.body.addEventListener('dragstart', evt => {
  evt.preventDefault();
});

document.body.addEventListener('dragover', evt => {
  evt.preventDefault();
});

document.body.addEventListener('drop', evt => {
  evt.preventDefault();
  let results = document.querySelector('#results');
  results.appendChild(showDataTransfer("drop", evt.dataTransfer));
  results.appendChild(showDataTransfer("drop_after", evt.dataTransfer));
});
