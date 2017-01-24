'use strict'
let express = require ('express');
let app = express ();
app.use (express.static ('doc'));
app.listen (8080);