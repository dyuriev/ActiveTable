/**
 * CHECKER main file
 * @type {{validators, messages}}
 */

CHECKER.checker = (function() {
    var checkedItems = [];
    var $validatingForm;
    var $validatingFields;
    var invalidFields = [];
    var ulErrorsBlockTpl = $('#ul-errors-block').html();
    var ulErrorBlockRender = _.template(ulErrorsBlockTpl);

    var validators = CHECKER.validators.validators;
    var messages = CHECKER.validators.messages;

    function Checker($form) {
        this.init($form)
    }

    Checker.prototype.init = function($form) {
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

    Checker.prototype.handleEvents = function($form, $fields) {
        var that = this;

        $fields.on('blur', function(e) {
            that.validateField(this);
        });

        $form.on('submit', function(e) {
            var hasValidationErrors = that.validateAllFields();
            console.log(hasValidationErrors);

            if (hasValidationErrors) {
                var $firstField = $(invalidFields[0]);
                $firstField.focus();
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        });
    };

    Checker.prototype.getFieldRules = function(field) {
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

    Checker.prototype.renderErrorBlock = function(fieldErrors) {
        return ulErrorBlockRender({ fieldErrors: fieldErrors });
    };

    Checker.prototype.hideErrorTooltip = function(field) {
        var $field = $(field);

        $field.removeClass('error-border');
        $field.siblings('ul.checker-error-list').remove();
    };

    Checker.prototype.showErrorTooltip = function(field) {
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

    Checker.prototype.validateField = function(field) {
        var fieldValue = $(field).val();
        var hasError = false;

        _.forEach(checkedItems, function(item, i) {

            if (item.field == field) {
                item.errors = [];

                _.forEach(item.rules, function(ruleItem, i) {
                    var rule = ruleItem[0];
                    var arg = ruleItem[1];
                    var currRule = validators[rule];

                    if (!currRule) {
                        throw new Error('Wrong rule name.');
                    }

                    if (!currRule(fieldValue, arg)) {
                        item.errors.push({
                            message: messages[rule](arg),
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

    Checker.prototype.validateAllFields = function() {
        var that = this;
        var hasErrors = false;

        invalidFields = [];

        _.forEach(checkedItems, function (item, i) {
            if (that.validateField(item.field)) {
                invalidFields.push(item.field);
                hasErrors = true;
            }
        });

        return hasErrors;
    };

    Checker.prototype.getItems = function() {
        return checkedItems;
    };

    return {
        Checker: Checker
    };
}());
