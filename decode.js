'use strict';

var punycode = require('punycode/');
var $encode = punycode.ucs2.encode;

var entities = require('./entities.json');

module.exports = function decode(str) {
    if (typeof str !== 'string') {
        throw new TypeError('Expected a String');
    }

    return str.replace(/&(#?[^;\W]+;?)/g, function (_, match) {
        var m = (/^#(\d+);?$/).exec(match);
        if (m) {
            return $encode([parseInt(m[1], 10)]);
        }
        var m2 = (/^#[Xx]([A-Fa-f0-9]+);?/).exec(match);
        if (m2) {
            return $encode([parseInt(m2[1], 16)]);
        }
        // named entity
        var hasSemi = (/;$/).test(match);
        var withoutSemi = hasSemi ? match.replace(/;$/, '') : match;
        var target = entities[withoutSemi] || (hasSemi && entities[match]);

        if (typeof target === 'number') {
            return $encode([target]);
        } else if (typeof target === 'string') {
            return target;
        }
        return '&' + match;

    });
};
