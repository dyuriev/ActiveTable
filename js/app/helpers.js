/**
 * Helpers library
 * @type {{stopEvent, log, array2JSON, JSON2Array, addEvent, removeEvent}}
 */
var helpers = (function () {

    return {
        log: log,
        array2JSON: array2JSON,
        JSON2Array: JSON2Array,
        formatMoney: formatMoney,
        formatMoneyBack: formatMoneyBack
    };

    /**
     * Log to console
     */
    function log() {
        if(console) {
            console.log.apply(console, arguments);
        }
    }

    /**
     * Converts array to JSON
     * @param array
     */
    function array2JSON(array) {
        return JSON.stringify(array);
    }

    /**
     * Converts JSON to array
     * @param string
     */
    function JSON2Array(string) {
        return $.parseJSON(string);
    }

    function formatMoney(string) {
        var parts = string.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".") + ' $';
    }

    function formatMoneyBack(val) {
        var _val = val.replace(',','').replace(' $', '');

        if ($.isNumeric(_val)) {
            return parseFloat(_val);
        }

        return _val;
    }
}());