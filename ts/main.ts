// @ts-ignore
import $ from 'jquery';

const pageSize = calculatePageSize();
let pages: number = 1;

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

    // $('#txt-id, #txt-name, #txt-address').parent().removeClass('invalid');
    //
    // if (!/[^\s]{3,}$/.test(address)){
    //     txtAddress.trigger('select').parent().addClass('invalid');
    //     valid = false;
    // }
    //
    // if (!/^[A-Za-z .]{3,}$/.test(name)){
    //     txtName.trigger('select').parent().addClass('invalid').children('small').removeClass('text-muted');
    //     valid = false;
    // }
    //
    // if (!/^C\d{3}$/.test(id)){
    //     txtId.trigger('select').parent().addClass('invalid').children('small').removeClass('text-muted');
    //     valid = false;
    // }
    //
    // if (!valid) return;

    // if (txtId.attr('disabled')) {
    //     const selectedRow = $('#tbl-customers tbody tr.selected');
    //
    //     selectedRow.find('td:nth-child(2)').text(name);
    //     selectedRow.find('td:nth-child(3)').text(address);
    //     return;
    // }

    // if (existCustomer(id)) {
    //     alert('Customer already exist');
    //     txtId.trigger('select');
    //     return;
    // }

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
    initPagination();
    navigateToPage(pages);
    $('#btn-clear').trigger('click');
});

const tbody = $('#tbl-customers tbody');

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

tbody.on('click', '.trash', (eventData) => {
    if (confirm('Are you sure to delete')) {
        $(eventData.target).parents('tr').fadeOut(500, function () {
            $(this).remove();
            showOrHideTfoot();
            $('#btn-clear').trigger('click');
            showOrHidePagination();
        });
    }
});

/* Reset button event listener */
$('#btn-clear').on('click', () => {
    $('#tbl-customers tbody tr.selected').removeClass('selected');
    $('#txt-id').attr('disabled', false).trigger('focus');
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
    const tbl = $('#tbl-customers');
    const tfoot = $('#tbl-customers tfoot');
    const rowHtml = `
        <tr>
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

    while (true) {

        tbl.find('tbody').append(rowHtml);
        const bottom = tbl.outerHeight(true) + tbl.offset().top;

        if (bottom >= top) {
            const pageSize = tbl.find('tbody tr').length - 1;

            tbl.find('tbody tr').remove();
            tfoot.show();
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
}

function navigateToPage(page: number): void {
    $('.pagination .page-item').each((index, element) => {
        if (+$(element).text() === page) {
            $(element).addClass('active');
            console.log('asda')
            return false;
        }
    });

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