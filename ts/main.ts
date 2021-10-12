import $ from 'jquery';

$(()=>{
    $('#txt-id').trigger('focus');
});

$('#btn-save').on('click',()=> {
    let id = $('#txt-id').val();
    let name = $('#txt-name').val();
    let address = $('#txt-address').val();

    $('#txt-id, #txt-name, #txt-address').parent().removeClass('invalid');

    if (!/[^\s]{3,}$/.test(address.trim())){
        $('#txt-address').trigger('select').parent().addClass('invalid');
    }

    if (!/^[A-Za-z .]{3,}$/.test(name.trim())){
        $('#txt-name').trigger('select').parent().addClass('invalid').children('small').removeClass('text-muted');
    }

    if (!/^C\d{3}$/.test(id.trim())){
        $('#txt-id').trigger('select').parent().addClass('invalid').children('small').removeClass('text-muted');
    }

});