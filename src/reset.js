'use strict'
/**
  * Create a DOM node based on the provided string and append it to the provided node.
  * 
  * @param {HTMLElement} el The DOM node to append the created node to.
  * @param {String} str A dom string to create. Includes css classes separated by '.'.
  * @return {HTMLElement} The same node that was provided.
  */
let dom = function (el, str) {
  let list = str.split (".");
  let ret = document.createElement (list [0]);
  for (let i = 1; i < list.length; i++)
    ret.classList.add (list [i]);
  el.appendChild (ret);
  return ret;
}

let html = function (el, value) {
  el.innerHTML = value;
  return el;
}
// set k/v for a property
let prop = function (el, property, value) {
  el.setAttribute (property, value);
  return el;
}
// add a class to the class list
let addClass = function (el, str) {
  el.classList.add (str);
  return el;
}
// remove class
let removeClass = function (el, str) {
  el.classList.remove (str);
}
// add or remove a class
let toggleClass = function (el, str) {
  el.classList.toggle (str);
  return el;
}
// remove all classes and add new ones
let classes = function (el, str) {
  let adjust = str || '';
  let list = adjust.split ('.');
  if (list [0] === '') list.splice (0, 1);
  el.className = '';
  list.forEach (function (cls) {
    el.classList.add (cls);
  });
  return el;
}
// remove a property
let unset = function (el, property) {
  el.removeAttribute (property);
  return el;
}
// add an event handler
let evt = function (el, name, fn) {
  el.addEventListener (name, fn, false);
  return el;
}
// trigger an event
let trigger = function (el, event) {
  el.dispatchEvent (event);
  return el;
}
// bind all the above methods and make chainable
Element.prototype.dom = function (str) {
  return dom (this, str);
}
Element.prototype.html = function (value) {
  return html (this, value);
}
Element.prototype.addClass = function (str) {
  return addClass (this, str);
}
Element.prototype.classes = function (str) {
  return classes (this, str);
}
Element.prototype.prop = function (property, value) {
  return prop (this, property, value);
}
Element.prototype.unset = function (property) {
  return unset (this, property);
}
Element.prototype.evt = function (name, fn) {
  return evt (this, name, fn);
}
Element.prototype.trigger = function (event) {
  return trigger (this, event);
}
// dom for shadow root
ShadowRoot.prototype.dom = function (str) {
  return dom (this, str);
}
// create the FN alias for the NodeWrapper
let FN = null;
(function () {
  // symbol to encapsulate the node list
  let list = Symbol ();
  FN = class NodeWrapper {
    constructor (initial) {
      // start with an empty array
      this [list] = [];
      if (initial instanceof NodeList)
        // if provided a NodeList, turn it into an array
        this [list] = Array.from (initial);
      if (initial instanceof String || typeof initial === 'string')
        // if provided a query, turn it into a nodelist, then an array
        this [list] = Array.from (document.querySelectorAll (initial));
    }
    // add an element or set of elements to the array
    // accepts queryselectorall strings 
    add (el) {
      if (el instanceof Element)
        this [list].push (el);
      if (el instanceof NodeList)
        this [list] = this [list].concat (el)
      if (typeof el === 'string' || el instanceof String)
        this [list] = this [list].concat (Array.from (document.querySelectorAll (el)));
      return this;
    }
    // get the element at an index
    at (index) {
      return this [list] [index];
    }
    // remove element
    remove (el) {
      if (typeof el === Element)
        this [list].splice (this [list].indexOf (el), 1);
      if (typeof el === 'string' || el instanceof String) {
        let todelete = document.querySelector (el);
        let index = this [list].indexOf (todelete);
        if (todelete && index !== -1)
          this [list].splice (index, 1);
      } 
      if (typeof el === 'number')
        this [list].splice (el, 1);
      return this;
    }
    // get the length of the list
    get length () {
      return this [list].length;
    }
    // bind chainable method
    // returns the list of child elements created
    dom (str) {
      let ret = new FN ();
      this.forEach (function (el) {
        ret.add (el.dom (str));
      });
      return ret;
    }
    // bind chainable method
    html (str) {
      this.forEach (function (el) {
        el.html (str);
      });
      return this;
    }
    // bind chainable method
    prop (property, value) {
      this.forEach (function (el) {
        el.prop (property, value);
      });
      return this;
    }
    // bind chainable method
    unset (property) {
      this.forEach (function (el) {
        el.unset (property);
      });
      return this;
    }
    // bind chainable method
    addClass (str) {
      this.forEach (function (el) {
        el.classList (str);
      });
    }
    removeClass (str) {
      this.forEach (function (el) {
        el.classList.remove (str);
      });
      return this;
    }
    toggleClass (str) {
      this.forEach (function (el) {
        el.classList.toggle (str);
      });
      return this;
    }
    // bind chainable method
    classList (str) {
      this.forEach (function (el) {
        el.classes (str);
      });
      return this;
    }
    // check if element is contained
    contains (el) {
      return this [list].indexOf (el) !== -1;
    }
    // get a new NodeWrapper as the intersection of two NodeWrappers
    // if second argument is true, only add elements that are different
    intersect (rhs, keepDiff) {
      let self = this;
      let setting = keepDiff || false;
      let ret = new FN ();
      this.forEach (function (el) {
        if (rhs.contains (el) && !setting)
          ret.add (el);
        else if (!rhs.contains (el) && setting)
          ret.add (el);
      });
      return ret;
    }
    // only keep whatever matches the qsa
    filter (qsa) {
      let list = this [list];
      let i = 0;
      while (i < list.length) {
        if (!list [i].matches (qsa)) {
          this.remove (i);
        } else {
          i++;
        }
      }
      return this;
    }
    // bind chainable method
    trigger (event) {
      this.forEach (function (el) {
        el.trigger (event);
      });
      return this;
    }
    // alias forEach method
    forEach (fn) {
      this [list].forEach (fn);
      return this;
    }
  }
}) ();
module.exports = FN;