/**
 * Checker - JavaScript form validator.
 * @version 0.1
 * @author Dmitrii Iurev
 */

var CHECKER = CHECKER || {};

CHECKER.namespace = function (string) {
    var parts = string.split('.'),
        parent = CHECKER, i;

    if (parts[0] === 'CHECKER') {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i += 1) {
        if (typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

CHECKER.namespace('CHECKER.checker');
CHECKER.namespace('CHECKER.validators');
