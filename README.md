
<!--#echo json="package.json" key="name" underline="=" -->
generic-common-prefix
=====================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Find a common prefix between two Array-like containers (arrays, strings,
buffers, arguments), measure its length, slice it, strip it. Also concat two
containers.
<!--/#echo -->


API
---

  * `gcp(a, b[, offsetA, offsetB])`
  * `gcp.measure(a, b[, offsetA, offsetB])`
  * `gcp.strip(a, b[, offsetA, offsetB[, keep]])`
  * `gcp.concat(a, b)`


Usage
-----

see [test.js](test.js)



<!--#toc stop="scan" -->


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
