/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

function toChars(s) { return String(s).split(''); }
function toCharCodes(s) { return toChars(s).map(toCharCodes.at0); }
toCharCodes.at0 = function (s) { return s.charCodeAt(0); };

function type0f(x) {
  if (arguments.length > 1) {
    return Array.prototype.slice.call(arguments
      ).map(function (arg) { return type0f(arg); });
  }
  if (x === null) { return 'null'; }
  var t = typeof x;
  if (t === 'object') {
    if (Array.isArray(x)) { return 'array'; }
    if (Buffer.isBuffer(x)) { return 'buffer'; }
  }
  return t;
}

function toFuncArgs() { return arguments; }

var gcp = require('generic-common-prefix'), assert = require('assert'),
  eq = assert.deepStrictEqual, a, b, tmp;


eq(gcp('watercraft', ''), '');
eq(gcp('watercraft', 'waterfall'), 'water');
eq(gcp('watercraft', 'what a craft'), 'w');
eq(gcp('watercraft', 'what a raft!', 6, 7), 'raft');


a = ['bacon', 'lettuce', 'tomato'];
b = ['bacon', 'sandwich'];
eq(gcp(a, b), ['bacon']);


a = [          'bacon', 'lettuce', 'tomato'];
b = ['tomato', 'bacon', 'lettuce', 'sandwich'];
eq(gcp(a, b, 0, 1), ['bacon', 'lettuce']);


a = ['bacon',   'lettuce', 'tomato'];
b = ['chicken', 'lettuce', 'tomato', 'cheese'];
eq(gcp.strip(a, b), []);
eq([a.length, b.length], [3, 4]);


a = ['bacon',   'lettuce', 'tomato'];
b = ['chicken', 'lettuce', 'tomato', 'cheese'];
eq(gcp.strip(a, b, 1, 1), ['lettuce', 'tomato']);
eq(a, ['bacon']);
eq(b, ['chicken', 'cheese']);


a = Buffer.from([0xC1, 0xC2, 0xA3]);
b = Buffer.from([0xC1, 0xC2, 0xB3]);
eq(gcp(a, b), Buffer.from([0xC1, 0xC2]));


a = Buffer.from('watercraft');
b = 'waterfall';
eq(gcp(a, b), Buffer.from(''));


a = Buffer.from('watercraft');
b = 'waterfall';
eq(gcp(a, b), Buffer.from(''));   // why? types inside containers.
eq([ a[0], b[0] ], [ 119, 'w' ]);
eq(type0f(a[0], b[0]), ['number', 'string']);


a = Buffer.from('watercraft');
b = toCharCodes('waterfall');
eq(gcp(a, b), Buffer.from([ 0x77, 0x61, 0x74, 0x65, 0x72 ]));
eq(gcp(b, a),             [ 0x77, 0x61, 0x74, 0x65, 0x72 ]);


a = Buffer.from('snow☃man');
b = toCharCodes('snow☃man');
eq(gcp(a, b), Buffer.from([ 0x73, 0x6e, 0x6f, 0x77 ]));
eq(gcp(b, a),             [ 0x73, 0x6e, 0x6f, 0x77 ]);
tmp = gcp.strip(a, b);
eq(Object.keys(tmp).sort(), ['a', 'b', 'c', 'length']);
eq(tmp.length, 4);
eq(type0f(tmp.a, tmp.b, tmp.c), ['function', 'function', 'function']);
eq(tmp.a(), Buffer.from([ 0xE2, 0x98, 0x83, 0x6D, 0x61, 0x6E ]));
eq(tmp.b(),             [      0x2603,      0x6D, 0x61, 0x6E ]);
eq(tmp.c(), Buffer.from('snow'));


a = 'watercraft';
b = toFuncArgs('w', 'a', 't', 'e', 'r', 'f', 'a', 'l', 'l');
eq(b.length, 9);
eq(b.slice, undefined);
eq(b.splice, undefined);
eq(b.concat, undefined);
eq(gcp(a, b), 'water');
eq(gcp(b, a), [ 'w', 'a', 't', 'e', 'r' ]);


tmp = { offsetA: 0, offsetB: 0 };
a =   [ 0, 1, 2, 3, 4, 'a', 'A', ];
b =   [ 0, 1, 2, 3, 4, 'b', 'B', ];
eq(gcp.strip(a, b, tmp.offsetA, tmp.offsetB),
      [ 0, 1, 2, 3, 4 ]);
eq(a, [                'a', 'A' ]);
eq(b, [                'b', 'B' ]);


tmp = { offsetA: 1, offsetB: 1 };
a =   [ 0, 1, 2, 3, 4, 'a', 'A', ];
b =   [ 0, 1, 2, 3, 4, 'b', 'B', ];
eq(gcp.strip(a, b, tmp.offsetA, tmp.offsetB),
      [    1, 2, 3, 4 ]);
eq(a, [ 0,             'a', 'A' ]);
eq(b, [ 0,             'b', 'B' ]);


tmp = { offsetA: 1, offsetB: 1 };
a =   [ 0, 1, 2, 3, 4, 'a', 'A', ];
b =   [    1, 2, 3, 4, 'b', 'B', ];
eq([ a[tmp.offsetA], b[tmp.offsetB] ], [ 1, 2 ]);   // no common prefix
eq(gcp.strip(a, b, tmp.offsetA, tmp.offsetB),
      []);


tmp = { offsetA: 2, offsetB: 1 };
a =   [ 0, 1, 2, 3, 4, 'a', 'A', ];
b =   [    1, 2, 3, 4, 'b', 'B', ];
eq([ a[tmp.offsetA], b[tmp.offsetB] ], [ 2, 2 ]);   // yup
eq(gcp.strip(a, b, tmp.offsetA, tmp.offsetB),
      [       2, 3, 4]);
eq(a, [ 0, 1,          'a', 'A' ]);
eq(b, [    1,          'b', 'B' ]);


tmp = { offsetA: 2, offsetB: 2, keep: 3 };
a =   [ 'a', 'A', 0, 1, 2,   3, 4, 5,   6,    8, 9 ];
b =   [ 'b', 'B', 0, 1, 2,   3, 4, 5,      7, 8, 9 ];
eq(gcp.strip(a, b, tmp.offsetA, tmp.offsetB, tmp.keep),
      [           0, 1, 2]); // v-- the 3 kept values
eq(a, [ 'a', 'A',            3, 4, 5,   6,    8, 9 ]);
eq(b, [ 'b', 'B',            3, 4, 5,      7, 8, 9 ]);


















console.log('+OK all tests passed.');
