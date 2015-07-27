var VALIDATORS = (function(){
    return {
        validators: {
            required: function (val) {
                return val.trim().length > 0;
            },
            email: function (val) {
                var re = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))){2,6}$/i);
                return re.test(val);
            },
            maxlength: function (val, arg) {
                return val.trim().length <= arg;
            },
            minlength: function (val, arg) {
                return val.trim().length > arg;
            },
            numeric: function (val) {
                return $.isNumeric(val);
            }
        }
        , messages: {
            required: function () {
                return 'This field is required';
            },
            email: function () {
                return 'You must input correct email address.';
            },
            maxlength: function (arg) {
                return 'Max length of this field is ' + arg;
            },
            minlength: function (arg) {
                return 'Min length of this field is ' + arg;
            },
            numeric: function () {
                return 'You must input correct numeric value';
            }
        }
    }
}());



var AUDITOR = (function() {
    var checkedItems = [];
    var $validatingForm;
    var $validatingFields;
    var ulErrorsBlockTpl = $('#ul-errors-block').html();
    var ulErrorBlockRender = _.template(ulErrorsBlockTpl);

    function Auditor($form) {
        this.init($form)
    }

    Auditor.prototype.init = function($form) {
        if ($form.attr('data-checker-validate')) {
            $validatingForm = $form;
            $validatingFields = $validatingForm.find('[data-checker-rules]');

            var that = this;
            if (_.isObject($validatingFields) && $validatingFields.length > 0) {
                _.forEach($validatingFields, function (item, i) {
                    checkedItems.push({
                        field: item,
                        rules: that.getFieldRules(item),
                        errors: []
                    });
                });

                this.handleEvents($validatingForm, $validatingFields);
            }
        }
    };

    Auditor.prototype.handleEvents = function($form, $fields) {
        var that = this;

        $fields.on('blur', function(e) {
            that.validateField(this);
        });

        $form.on('submit', function(e) {
            var hasValidationErrors = that.validateAllFields();
            console.log(hasValidationErrors);

            if (hasValidationErrors) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        });
    };

    Auditor.prototype.getFieldRules = function(field) {
        var $field = $(field);
        var rules = [];
        var _rules = $field.attr('data-checker-rules').split(',');

        _.forEach(_rules, function(rule, i) {

            var attributes = [];
            var arg, ruleName;

            if (rule.indexOf('=') > 0) {
                attributes = rule.split('=');
                ruleName = attributes[0];
                arg = attributes[1];
            } else {
                ruleName = rule;
                arg = undefined;
            }

            rules.push([ruleName, arg]);
        });

        return rules;
    };

    Auditor.prototype.renderErrorBlock = function(fieldErrors) {
        return ulErrorBlockRender({ fieldErrors: fieldErrors });
    };

    Auditor.prototype.hideErrorTooltip = function(field) {
        var $field = $(field);

        $field.removeClass('error-border');
        $field.siblings('ul.checker-error-list').remove();
    };

    Auditor.prototype.showErrorTooltip = function(field) {
        var errorMessages = [];
        var that = this;

        _.forEach(checkedItems, function(item, i) {

            if (item.field == field) {
                var $field = $(field);

                if (_.isArray(item.errors) && item.errors.length > 0) {

                    _.forEach(item.errors, function(error) {
                        errorMessages.push(error.message);
                    });

                    that.hideErrorTooltip(field);
                    $field.addClass('error-border');
                    $field.after(that.renderErrorBlock(errorMessages));
                }
            }
        });
    };

    Auditor.prototype.validateField = function(field) {
        var fieldValue = $(field).val();
        var hasError = false;

        _.forEach(checkedItems, function(item, i) {

            if (item.field == field) {
                item.errors = [];

                _.forEach(item.rules, function(ruleItem, i) {
                    var rule = ruleItem[0];
                    var arg = ruleItem[1];
                    var currRule = VALIDATORS.validators[rule];

                    if (!currRule) {
                        throw new Error('Wrong rule name.');
                    }

                    if (!currRule(fieldValue, arg)) {
                        item.errors.push({
                            message: VALIDATORS.messages[rule](arg),
                            rule: rule,
                            value: fieldValue,
                            arg: arg
                        });

                        hasError = true;
                    }
                });
            }
        });

        if(hasError) {
            this.showErrorTooltip(field);
        }
        else {
            this.hideErrorTooltip(field);
        }

        return hasError;
    };

    Auditor.prototype.validateAllFields = function() {
        var that = this;
        var hasErrors = false;

        _.forEach(checkedItems, function (item, i) {
            if (that.validateField(item.field)) {
                hasErrors = true;
            }
        });

        return hasErrors;
    };

    Auditor.prototype.getItems = function() {
        return checkedItems;
    };

    return {
        Auditor: Auditor
    };
}());



/*
 $_item.on('focusout', function(e) {

 var rule = $_item
 that.validateField()
 });
 */
