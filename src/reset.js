// iterate over keys and assign values
function assign (assigner, assignee) {
	for (var k in assigner)
		assignee [k] = assigner [k];
}
// create a dom element
function DOM (element) {
	var list = element.split (".");
	var ret = document.createElement (list [0]);
	for (var i = 1; i < list.length; i++)
		ret.classList.add (list [i]);
	return ret;
}
// create a dom element that is a child of this
Element.prototype.DOM = function (element) {
	var ret = DOM (element);
	this.appendChild (ret);
	return ret;
}
// routes
function GET (route, _opts) {
	var opts = {
		cb: false,
		err: false,
		id: false
	}
	assign (_opts, opts);
	var path = route;
	if (opts.id) path += "/" + opts.id;
	var xhr = new XMLHttpRequest ();
	xhr.open ("GET", path);
	xhr.onload = function () {
		if (xhr.status === 200) {
			if (opts.cb) {
				try {
					return opts.cb (JSON.parse (this.response));
				} catch (e) {
					return opts.cb (this.response);
				}
			}
		} else {
			if (opts.err) return opts.err (xhr.status);
		}
	}
	xhr.send ();
}
// post
function POST (route, _opts) {
	var opts = {
		data: null,
		cb: false,
		err: false
	}
	assign (_opts, opts);
	var xhr = new XMLHttpRequest ();
	xhr.open ("POST", route);
	xhr.setRequestHeader ("Content-Type", "application/json");
	xhr.onload = function () {
		if (xhr.status === 201) {
			if (opts.cb && this.response) {
				try {
					return opts.cb (JSON.parse (this.response));
				} catch (e) {
					return opts.cb (this.response);
				}
			}
			if (opts.cb && !this.response) return opts.cb ();
		} else {
			if (opts.err) opts.err (xhr.status);
		}
	}
	if (opts.data)
		xhr.send (JSON.stringify (data));
	else xhr.send ();
}
// expanding textarea elements
function Expander (textarea) {
	textarea.addEventListener ("keyup", function () {
		this.style.height = this.scrollHeight + "px";
	}, false);
}
// create the modal
var modal;
// clear the modal message
function closeMessage () {
	modal.className = "modal";
	modal.innerHTML = "";
	var close = modal.DOM ("span.modal-close");
	close.innerHTML = "close";
	close.addEventListener ("click", closeMessage, false);
}
// flash text or DOM element for a modal
function flashMessage (text) {
	var area;
	if (text instanceof Element) {
		modal.appendChild (text);
		area = text;
	} else {
		area = modal.DOM ("textarea");
		area.setAttribute ("readonly", "true");
		area.value = text;
		area.style.height = 0;
		area.style.height = this.scrollHeight + "px";
	}
	modal.className = "modal intro";
	modal.className = "modal intro show";
	var adjust = function () {
		var calc = {
			w: area.scrollWidth,
			h: area.scrollHeight
		}
		calc.x = (modal.clientWidth - calc.w) / 2;
		calc.y = (modal.clientHeight - calc.h) / 2;
		area.style.width = calc.w + "px";
		area.style.height = calc.h + "px";
		area.style.left = calc.x + "px";
		area.style.top = calc.y + "px";
	}
	adjust ();
	window.addEventListener ("resize", adjust, false);
	return area;
}

document.addEventListener ("DOMContentLoaded", function () {
	modal = document.body.DOM ("div");
	modal.addEventListener ("click", closeMessage, false);
	closeMessage ();
	var txts = document.querySelectorAll ("textarea");
	for (var i = 0; i < txts.length; i++)
		Expander (txts [i]);
}, false);