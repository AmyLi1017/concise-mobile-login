/**
 * Created by PC150430-1 on 2017/6/14.
 */
var $loginForm = $('form[name=login]');
$loginForm.on('submit', function (e) {
    e.preventDefault();
    var string = $loginForm.serialize();

    $.ajax({
        url: $loginForm.attr('action'),
        method: $loginForm.attr('method'),
        data: string,
        success: function (response) {
            location.href = '/home.html'
        },
        error: function (xhr) {
            var errors = JSON.parse(xhr.responseText)
            showErrors($loginForm,errors)
        }
    })
});

var $signUpForm = $('form[name=signUp]');
$signUpForm.on('submit',function (e) {
   e.preventDefault();
    var string = $signUpForm.serialize();

    //check Form
    var errors = checkForm($signUpForm);
    if (Object.keys(errors).length !== 0){
        showErrors($signUpForm, errors)
    }else {
        $.ajax({
            url: $signUpForm.attr('action'),
            method: $signUpForm.attr('method'),
            data: string,
            success: function (response) {
                location.href = '/index'
            },
            error: function (xhr) {
               var errors = JSON.parse(xhr.responseText)
                showErrors($signUpForm,errors)
            }
        })
    }
});

function checkForm($signUpForm) {
    var tel = $signUpForm.find('[name=tel]').val();
    var message = $signUpForm.find('[name=message]').val();
    var userName = $signUpForm.find('[name=userName]').val();
    var password = $signUpForm.find('[name=password]').val();
    var confirmPassword = $signUpForm.find('[name=confirmPassword]').val();
    var errors = {};
    if (tel.length < 8){
        errors.tel = '号码格式错误!'
    }
    if(message.length !== 6){
        errors.message = '短信验证码错误!'
    }
    if (!isNaN(userName[0])){
        errors.userName = '用户名开头不能为数字!'
    }
    if (password.lenght < 6){
        errors.password = '密码太短!'
    }
    if (confirmPassword !== password){
        errors.confirmPassword = '两次输入密码不匹配!'

    }
    return errors;
}

function showErrors($form,errors) {
    $form.find('span[name$=_error]').each(function () {
        $(this).text('');
    });
    for (var key in errors){
        var value = errors[key];
        $form.find('span[name=' + key + '_error]').text(value);
    }
}