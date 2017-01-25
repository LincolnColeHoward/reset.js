'use strict'
/**
  * Creates and executes a get request using xhr.
  * 
  * @param {String} path The route to get.
  * @param {Function} cb Callback on success of the get request.
  * The argument to the function is the reponse data. If response is valid json,
  * it is parsed. Otherwise the reponse is left untouched.
  * @param {Object} cb.response The parsed response.
  * @param {Function} err On error callback. 
  */
let GET = function (path, cb, err) {
  let xhr = new XMLHttpRequest ();
  xhr.open ("GET", path);
  xhr.onload = function () {
    if (xhr.status !== 200 && err) return err ();
    try {
      cb (JSON.parse (xhr.response));
    } catch (e) {
      cb (xhr.response);
    }
  }
  xhr.send ();
}
/**
  * Creates and executes a post request using xhr.
  * 
  * @param {String} path The route to post to.
  * @param {Object} data The data to serialize and post.
  * @param {Function} cb Callback on success of the post request.
  * The argument to the function is the reponse data. If response is valid json,
  * it is parsed. Otherwise the reponse is left untouched.
  * @param {Object} cb.response The parsed response.
  * @param {Function} err On error callback.
  */
let POST = function (path, data, cb, err) {
  let xhr = new XMLHttpRequest ();
  xhr.open ("POST", path);
  xhr.setRequestHeader ('Content-Type', 'application/json');
  xhr.onload = function () {
    if (xhr.status !== 201 && err) return err ();
    try {
      cb (JSON.parse (xhr.response));
    } catch (e) {
      cb (xhr.response);
    }
  }
  xhr.send (JSON.stringify (data));
}
/**
  * Creates and executes a delete request using xhr.
  * 
  * @param {String} path The route to delete.
  * @param {Function} cb Callback on success of the delete request.
  * The argument to the function is the reponse data. If response is valid json,
  * it is parsed. Otherwise the reponse is left untouched.
  * @param {Object} cb.response The parsed response.
  * @param {Function} err On error callback. 
  */
let DELETE = function (path, cb, err) {
  let xhr = new XMLHttpRequest ();
  xhr.open ("DELETE", path);
  xhr.onload = function () {
    if (xhr.status !== 200 && err) return err ();
    try {
      cb (JSON.parse (xhr.response));
    } catch (e) {
      cb (xhr.response);
    }
  }
  xhr.send ();
}
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
        el.addClass (str);
      });
    }
    // bind chainable method
    classes (str) {
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
