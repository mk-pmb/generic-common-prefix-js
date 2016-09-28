/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

module.exports = (function setup() {
  var gcp, isFunc = function (x) { return ((typeof x) === 'function'); };

  gcp = function (a, b, offsetA, offsetB) {
    offsetA = (+offsetA || 0);
    if (!isFunc(a.slice)) { a = gcp.toArray(a); }
    return a.slice(offsetA, offsetA + gcp.measure(a, b, offsetA, offsetB));
  };

  gcp.measure = function (a, b, offsetA, offsetB) {
    offsetA = (+offsetA || 0);
    offsetB = (+offsetB || 0);
    var cpLen;
    for (cpLen = 0; cpLen < a.length; cpLen += 1) {
      if (a[cpLen + offsetA] !== b[cpLen + offsetB]) { return cpLen; }
    }
    return cpLen;
  };

  gcp.toArray = function (x) {
    if (x === '') { return []; }
    if (!x) { return x; }
    if (Array.isArray(x)) { return x; }
    return Array.prototype.slice.call(x);
  };

  gcp.concat = function concatMostContainers(a, b) {
    if (!a) { return b; }
    if ((typeof a) === 'object') {
      if (Buffer.isBuffer(a)) {
        b = gcp.toArray(b);
        return Buffer.concat([a, Buffer.from(b)]);
      }
      return gcp.toArray(a).concat(gcp.toArray(b));
    }
    if (Array.isArray(b)) { b = b.join(''); }
    return String(a).concat(String(b));
  };

  gcp.slices = function (container, ranges) {
    if (!ranges) {
      ranges = container;
      container = this;
    }
    var result = false;
    ranges.forEach(function (range) {
      if (!range) { return; }
      result = gcp.concat(result, container.slice.apply(container, range));
    });
    return result;
  };

  gcp.strip = function (a, b, offsetA, offsetB, keep) {
    offsetA = (+offsetA || 0);
    offsetB = (+offsetB || 0);
    if (a === '') { return a; }
    var cpLen = gcp.measure(a, b, offsetA, offsetB);
    cpLen = Math.max(cpLen - (+keep || 0), 0);
    if (isFunc(a.splice) && isFunc(b.splice)) {
      b.splice(offsetB, cpLen);
      return a.splice(offsetA, cpLen);
    }
    return { length: cpLen,
      a: gcp.slices.bind(a, [ offsetA && [0, offsetA], [offsetA + cpLen] ]),
      b: gcp.slices.bind(b, [ offsetB && [0, offsetB], [offsetB + cpLen] ]),
      c: a.slice.bind(a, offsetA, offsetA + cpLen) };
  };











  return gcp;
}());
