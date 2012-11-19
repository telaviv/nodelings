$(function() {
    var form = $('form[name="signup-form"]');
    var msg = $('.error-msg');

    new AjaxSubmitter(form, msg);
    new SignupValidator(form);
});