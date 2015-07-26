$(function() {
    /* *********************** Defenitions *************************/
    var productItems = [
        {
            id: 1,
            name: 'Boots',
            price: 1200,
            count: 2
        },
        {
            id: 2,
            name: 'Кеды',
            price: 2200,
            count: 3
        },
        {
            id: 3,
            name: 'Ботинки',
            price: 45630,
            count: 10
        }
    ];

    var productsTableTpl = $('#tpl-table-products').html();
    var productsTable = $('#table-products');
    var sortOrder = 'asc';
    var sortType = 'id';
    var productsTableRender = _.template(productsTableTpl);

    function renderProductsTable(products) {
        return productsTableRender({ products: products });
    }

    function changeSortIcons(sortType, sortOrder) {
        var columns = $('th.th-sorted-column');
        var column = $('th[data-sort-type="' + sortType + '"]');
        columns.removeClass('th-sorted-asc th-sorted-desc');
        column.addClass('th-sorted-' + sortOrder);
    }

    function renderAll(items) {
        var renderItems = _.isObject(items) ? items : productItems;
        productsTable.html(renderProductsTable(renderItems));
    }

    function getMaxID() {
        var max =  _.max(productItems, function(item) {
            return item.id;
        });

        return max && Number.isInteger(max.id) ? max.id : 0;
    }

    function filterByProductName(name) {
        return _.filter(productItems,  function(item) {
            return item.name.indexOf(name) > -1;
        });
    }

    function init() {
        renderAll();
        changeSortIcons(sortType, sortOrder);
        sortOrder = 'desc';
    }

    /* *********************** Code flow *************************/
    init();

    productsTable.on('click', 'th.th-sorted-column', function() {
        var sortType = $(this).attr('data-sort-type');
        productItems = _.sortByOrder(productItems, [sortType], [sortOrder]);
        renderAll();
        changeSortIcons(sortType, sortOrder);
        sortOrder = sortOrder == 'asc' ? 'desc' : 'asc';
    });
/*
    var btnAddProduct = $('button.btnAddProduct');
    btnAddProduct.on('click', function() {
        productItems.push({
            id: getMaxID() + 1,
            name: 'Галошы',
            price: parseInt(Math.floor(Math.random() * (1000 - 50 + 1)) + 50),
            count: parseInt(Math.floor(Math.random() * (10 - 2 + 1)) + 2)
        });

        renderAll();
    });
*/
    productsTable.on('click', '.btn-delete-item', function() {
        if (confirm('Are you sure you want delete this item?')) {
            var itemID = $(this).attr('data-item-id');
            productItems = _.filter(productItems,  function(item) {
                return item.id != itemID;
            });
            renderAll();
        }
    });

    var inputFilter = $('.input-filter');
    inputFilter.on('keyup', function() {
        var searchString = $(this).val();
        var items = filterByProductName(searchString);
        renderAll(items);
    });

    var $formValidate = $('form[data-checker-validate]');
    var $fieldsForValidate = $formValidate.find('[data-checker-rules]');

    $formValidate.on('submit', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();

        $fieldsForValidate.each(function(i, item) {
            $(item).trigger('focusout');
        });

        if (!Checker.hasErrors()) {


            productItems.push({
                id: getMaxID() + 1,
                name: $formValidate.find('[name="productName"]').val(),
                price: $formValidate.find('[name="productPrice"]').val(),
                count: $formValidate.find('[name="productCount"]').val()
            });

            $fieldsForValidate.val('');
            $('#addProductModal').modal('hide');
            renderAll();
        }
    });

    $fieldsForValidate.on('focusout', function() {
        var $item = $(this);
        var rules = $item.attr('data-checker-rules').split(',');

        $(rules).each(function(i, rule) {
            var attrs = [];
            var arg;

            if (rule.indexOf('=') > 0) {
                attrs = rule.split('=');
                rule = attrs[0];
                arg = attrs[1];
            }
            Checker.validateField(rule, $item, arg);
        });

        Checker.showErrorBlock($item);
    });

    $fieldsForValidate.on('focusin', function() {
        var item = $(this);
        Checker.clearErrors();
        Checker.hideErrorBlock(item);
    });

    var $selector = $('#selector');
    var $radioGroup1 = $('div.radio-group1');
    var $checkboxGroup1 = $('div.checkbox-group1');

    $selector.on('change', function() {
        var selectorVal = $(this).val();

        switch (selectorVal) {
            case 'empty':
                $radioGroup1.hide();
                $checkboxGroup1.hide();
                break;
            case 'radio':
                $radioGroup1.show();
                $checkboxGroup1.hide();
                break;
            case 'checkbox':
                $radioGroup1.hide();
                $checkboxGroup1.show();
                break;
        }
    });

    $('[name="select-checkboxes1"]').change(function() {
        var checkboxes = $checkboxGroup1.find(':checkbox');

        if($(this).is(':checked')) {
            checkboxes.prop('checked', true);
        } else {
            checkboxes.prop('checked', false);
        }
    });

}());
