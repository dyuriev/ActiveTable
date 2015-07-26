var Checker = (function () {
    'use strict';

    var ulErrorsBlockTpl = $('#ul-errors-block').html();
    var ulErrorBlockRender = _.template(ulErrorsBlockTpl);

    return {
        errors: []
        ,validators: {
            required: function(val) {
                return val.trim().length > 0;
            },
            email: function(val) {
                var re = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))){2,6}$/i);
                return re.test(val);
            },
            maxlength: function(val, arg) {
                return val.trim().length <= arg;
            },
            minlength: function(val, arg) {
                return val.trim().length > arg;
            },
            numeric: function(val) {
                return $.isNumeric(val);
            }
        }
        ,messages: {
            required: function() {
                return 'This field is required';
            },
            email: function() {
                return 'You must input correct email address.';
            },
            maxlength: function(arg) {
                return 'Max length of this field is ' + arg;
            },
            minlength: function(arg) {
                return 'Min length of this field is ' + arg;
            },
            numeric: function() {
                return 'You must input correct numeric value';
            }
        }
        ,renderErrorBlock: function(fieldErrors) {
            return ulErrorBlockRender({ fieldErrors: fieldErrors });
        }
        ,addError: function(rule, $field, arg, itemVal) {
            this.errors.push({
                field: $field,
                rule: rule,
                itemVal: itemVal,
                arg: arg
            });
        }
        ,hasErrors: function() {
            return this.errors.length > 0;
        }
        ,clearErrors: function() {
            this.errors = [];
        }
        ,hideAllErrorBlocks: function() {
            if (_.isArray(this.errors) && this.errors.length > 0) {
                var that = this;
                _.forEach(this.errors, function(item) {
                    that.hideErrorBlock(item.field);
                });
            }
        }
        ,hideErrorBlock: function($field) {
            $field.removeClass('error-border');
            $field.siblings('ul.checker-error-list').remove();
        }
        ,showErrorBlock: function($field) {
            var messagesArr = [];
            var that = this;

            if (_.isArray(this.errors) && this.errors.length > 0) {
                _.forEach(this.errors, function(item) {
                    if ($field == item.field) {
                        messagesArr.push(that.messages[item.rule](item.arg));
                    }
                });
                this.hideErrorBlock($field);
                $field.addClass('error-border');
                $field.after(this.renderErrorBlock(messagesArr));
            }
        }
        ,validateField: function(rule, $field, arg) {
            var itemVal = $field.val();

            if (!this.validators[rule](itemVal, arg)) {
                this.addError(rule, $field, arg, itemVal);
            }
        }
    };
}());
