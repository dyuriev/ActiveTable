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
    window.productsTableRender = _.template(productsTableTpl);

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
        if (_.isObject(items)) {
            productsTable.html(renderProductsTable(items));
        } else {
            productsTable.html(renderProductsTable(productItems));
        }
    }

    function getMaxID() {
        var max =  _.max(productItems, function(item) {
            return item.id;
        }).id;

        return Number.isInteger(max) ? max : 0;
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
        console.log(productItems);
        renderAll();
        changeSortIcons(sortType, sortOrder);
        sortOrder = sortOrder == 'asc' ? 'desc' : 'asc';
    });

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

    productsTable.on('click', '.btn-delete-item', function() {
        var itemID = $(this).attr('data-item-id');
        console.log(itemID);
        productItems = _.filter(productItems,  function(item) {
            return item.id != itemID;
        });
        console.log(productItems);
        renderAll();
    });

    var inputFilter = $('.input-filter');
    inputFilter.on('keyup', function() {
        var searchString = $(this).val();
        var items = filterByProductName(searchString);
        renderAll(items);
    });
}());
