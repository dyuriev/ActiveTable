$(function() {
    /* *********************** Defenitions *************************/
    var productItems = [
        {
            id: 1,
            name: 'Boots',
            price: 1000,
            count: 2,
            email: 'coolkid00@gmail.com'
        },
        {
            id: 2,
            name: 'T-shirt',
            price: 50,
            count: 3,
            email: 'coolkid00@gmail.com'
        },
        {
            id: 3,
            name: 'Jeans',
            price: 150,
            count: 10,
            email: 'coolkid00@gmail.com'
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

    function getByID(id) {
        return _.filter(productItems,  function(item) {
            return item.id == id;
        });
    }

    function getAllButID(id) {
        return _.filter(productItems,  function(item) {
            return item.id != id;
        });
    }

    function init() {
        renderAll();
        changeSortIcons(sortType, sortOrder);
        sortOrder = 'desc';
    }

    function openModal(modalID) {
        var modal = $('div.dm-overlay[data-modal-id="' + modalID + '"]');
        modal.show();
    }

    function closeModal(modalID) {
        var modal = $('div.dm-overlay[data-modal-id="' + modalID + '"]');
        modal.hide();
        $(modal).find('input').val('');
    }

    /* *********************** Code flow *************************/
    init();

    var $formAddItem = $('#formAddItem');
    var $productPrice = $formAddItem.find('input[name="productPrice"]');
    var checker = new CHECKER.checker.Checker($formAddItem);

    $formAddItem.on('submit', function(e) {

        var itemID = $formAddItem.find('[name="productID"]').val();
        var newID;

        if (itemID) {
            productItems = getAllButID(itemID);
            newID = itemID;
        } else {
            newID = getMaxID() + 1;
        }

        productItems.push({
            id: newID,
            name: $formAddItem.find('[name="productName"]').val(),
            price: helpers.formatMoneyBack($formAddItem.find('[name="productPrice"]').val()),
            count: $formAddItem.find('[name="productCount"]').val(),
            email: $formAddItem.find('[name="supplierEmail"]').val()
        });

        closeModal('modalForm');
        renderAll();

        e.preventDefault();
        e.stopImmediatePropagation();
    });

    $productPrice.on('focus', function() {
        var itemVal = $.trim($(this).val());

        if (itemVal.length > 0) {
            $(this).val(helpers.formatMoneyBack(itemVal));
        }
    });

    $productPrice.on('blur', function() {
        var itemVal = $.trim($(this).val());

        if (itemVal.length > 0 && $.isNumeric(itemVal)) {
            $(this).val(helpers.formatMoney(itemVal));
        }
    });

    productsTable.on('click', 'th.th-sorted-column', function() {
        var sortType = $(this).attr('data-sort-type');
        console.log(productItems);
        productItems = _.sortByOrder(productItems, [sortType], [sortOrder]);
        renderAll();
        changeSortIcons(sortType, sortOrder);
        sortOrder = sortOrder == 'asc' ? 'desc' : 'asc';
    });

    productsTable.on('click', '.btn-delete-item', function() {
        var itemID = $(this).attr('data-item-id');
        $deleteConfirmButton = $('div[data-modal-id="modalDelete"]').find('button.btn-delete-item-confirm');
        $deleteConfirmButton.attr('data-item-id', itemID);
        openModal('modalDelete');
    });

    productsTable.on('click', '.btn-edit-item', function() {
        var itemID = $(this).attr('data-item-id');
        var item = getByID(itemID)[0];
        modalForm = $('div[data-modal-id="modalForm"]');
        modalForm.find('[name="productName"]').val(item.name);
        modalForm.find('[name="productPrice"]').val(item.price);
        modalForm.find('[name="productCount"]').val(item.count);
        modalForm.find('[name="supplierEmail"]').val(item.email);
        modalForm.find('[name="productID"]').val(itemID);
        openModal('modalForm');
    });

    $('button.btn-delete-item-confirm').on('click', function() {
        var itemID = $(this).attr('data-item-id');
        productItems = _.filter(productItems,  function(item) {
            return item.id != itemID;
        });
        renderAll();
        closeModal('modalDelete');
    });

    var inputFilter = $('.input-filter');
    inputFilter.on('keyup', function() {
        var searchString = $(this).val();
        var items = filterByProductName(searchString);
        renderAll(items);
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

    $('[data-modal-opener]').on('click', function() {
        var modalID = $(this).attr('data-modal-opener');
        openModal(modalID);
    });

    $('[data-modal-closer]').on('click', function() {
        var modalID = $(this).attr('data-modal-closer');
        closeModal(modalID);
        return false;
    });

}());
