// @ts-ignore
import $ from 'jquery';

let pageSize = calculatePageSize();
let pages: number = 1;
let selectedPage: number = 1;

$(()=>{
    $('#txt-id').trigger('focus');
});

/* Add or update a row */
$('#btn-save').on('click', (eventData) => {

    eventData.preventDefault();

    const txtId = $('#txt-id');
    const txtName = $('#txt-name');
    const txtAddress = $('#txt-address');

    const id = txtId.val().trim();
    const name = txtName.val().trim();
    const address = txtAddress.val().trim();
    let valid = true;

    $('#txt-id, #txt-name, #txt-address').parent().removeClass('invalid');

    if (!/[^\s]{3,}$/.test(address)){
        txtAddress.trigger('select').parent().addClass('invalid');
        valid = false;
    }

    if (!/^[A-Za-z .]{3,}$/.test(name)){
        txtName.trigger('select').parent().addClass('invalid').children('small').removeClass('text-muted');
        valid = false;
    }

    if (!/^C\d{3}$/.test(id)){
        txtId.trigger('select').parent().addClass('invalid').children('small').removeClass('text-muted');
        valid = false;
    }

    if (!valid) return;

    if (txtId.attr('disabled')) {
        const selectedRow = $('#tbl-customers tbody tr.selected');

        selectedRow.find('td:nth-child(2)').text(name);
        selectedRow.find('td:nth-child(3)').text(address);
        return;
    }

    if (existCustomer(id)) {
        alert('Customer already exist');
        txtId.trigger('select');
        return;
    }

    const rowHtml = `
        <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${address}</td>
            <td><div class="trash"></div></td>
        </tr>
    `;

    $('#tbl-customers tbody').append(rowHtml);
    showOrHideTfoot();
    showOrHidePagination();

    if(($('#tbl-customers tbody tr').length - 1) % pageSize === 0){
        initPagination();
    }

    navigateToPage(pages);
    $('#btn-clear').trigger('click');
});

const tbody = $('#tbl-customers tbody');

/* Table row selection event listener */
tbody.on('click', 'tr', function () {

    const id = $(this).find('td:first-child').text();
    const name = $(this).find('td:nth-child(2)').text();
    const address = $(this).find('td:nth-child(3)').text();

    $('#txt-id').val(id).attr('disabled', true);
    $('#txt-name').val(name);
    $('#txt-address').val(address);

    $('#tbl-customers tbody tr').removeClass('selected');
    $(this).addClass('selected');
});

/* Table row deletion event listener */
tbody.on('click', '.trash', (eventData) => {
    if (confirm('Are you sure to delete')) {
        $(eventData.target).parents('tr').fadeOut(500, function () {
            $(this).remove();
            showOrHideTfoot();
            showOrHidePagination();

            if ($('#tbl-customers tbody tr').length % pages === 0) {
                initPagination();
                if (selectedPage >= pages) {
                    selectedPage = pages;
                }
            }
            navigateToPage(selectedPage);

            $('#btn-clear').trigger('click');
        });
    }
});

/* Reset button event listener */
$('#btn-clear').on('click', () => {
    $('#tbl-customers tbody tr.selected').removeClass('selected');
    $('#txt-id').attr('disabled', false).trigger('focus');
});

/* Window resize event listener */
$(window).on('resize', () => {
    pageSize = calculatePageSize();
    initPagination();
    navigateToPage(1);
    showOrHidePagination();
});

/* Utility functions */
function existCustomer(id: string): boolean {
    let result: boolean = false;
    $('#tbl-customers tbody tr td:first-child').each((index, element) => {
        if ($(element).text() === id) {
            result = true;
            return false;
        }
    });
    return result;
}

function showOrHideTfoot(){
    const tfoot = $('#tbl-customers tfoot');
    $('#tbl-customers tbody tr').length > 0 ? tfoot.hide() : tfoot.show();
}

function showOrHidePagination(){
    const nav = $('nav');
    ($('#tbl-customers tbody tr').length > pageSize)? nav.removeClass('d-none') : nav.addClass('d-none');
}

function calculatePageSize(){

    if ($(window).width() <= 992) {
        return 7;
    }

    const tbl = $('#tbl-customers');
    const tfoot = $('#tbl-customers tfoot');
    const rowHtml = `
        <tr class="dummy-data">
            <td>C001</td>
            <td>Dhanushka</td>
            <td>Matara</td>
            <td><div class="trash"></div></td>
        </tr>
    `;

    const nav = $('nav');
    nav.removeClass('d-none');

    const top = $(window).height()! - ($('footer').height()! + nav.outerHeight(true)!);

    nav.addClass('d-none');
    tfoot.hide();

    tbl.find('tbody tr').hide();

    while (true) {

        tbl.find('tbody').append(rowHtml);
        const bottom = tbl.outerHeight(true) + tbl.offset().top;
        if (bottom >= top) {
            const pageSize = tbl.find('tbody tr.dummy-data').length - 1;

            tbl.find('tbody tr.dummy-data').remove();

            if (tbl.find('tbody tr').length === 0) tfoot.show();
            return pageSize;
        }
    }
}

function initPagination(): void{
    const totalRows = $('#tbl-customers tbody tr').length;
    pages = Math.ceil(totalRows / pageSize);
    let paginationHtml = `
                    <li class="page-item">
                        <a class="page-link" href="#">
                            <i class="fas fa-backward"></i>
                        </a>
                    </li>
    `;

    for (let i = 0; i < pages; i++) {
        paginationHtml += `<li class="page-item"><a class="page-link" href="#">${i+1}</a></li>`;
    }

    paginationHtml += `<li class="page-item">
                            <a class="page-link" href="#">
                                <i class="fas fa-forward"></i>
                            </a>
                        </li>`

    $('.pagination').html(paginationHtml);

    $('.page-item:first-child').on('click', function () {
        navigateToPage(selectedPage - 1)
    });

    $('.page-item:last-child').on('click', function () {
        navigateToPage(selectedPage + 1)
    });

    $('.page-item:not(.page-item:first-child, .page-item:last-child)').on('click', function () {
        navigateToPage(+$(this).text())
    });
}

function navigateToPage(page: number): void {

    if (page <= 0 || page > pages) return;

    selectedPage = page;

    $('.pagination .page-item.active').removeClass('active');

    $('.pagination .page-item').each((index, element) => {
        if (+$(element).text() === page) {
            $(element).addClass('active');
            return false;
        }
    });

    $('.pagination .page-item:last-child, .pagination .page-item:first-child').removeClass('disabled');

    if (page === pages) {
        $('.pagination .page-item:last-child').addClass('disabled');
    }else if (page === 1) {
        $('.pagination .page-item:first-child').addClass('disabled');
    }

    const rows = $('#tbl-customers tbody tr');
    const start = (page - 1) * pageSize;

    rows.each((index, element) => {
        if (index >= start && index < start + pageSize) {
            $(element).show();
        } else {
            $(element).hide();
        }
    });


}