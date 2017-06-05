/* global moment, Router, Meteor, Template, Session */

function loginUser() {
    Meteor.call('loginUser', $("#username").val(), $("#password").val(), function (error, response) {
        try {
            var user = JSON.parse(response);
            
            if (user !== null) {
                var date = new Date();
                
                user.lastLogin = moment(date).format("llll");
                Session.set("user", user);
                Router.go("Home");
            }
        } catch (error) {
            swal({
                title: "Login Unsuccessful!",
                text: response,
                type: "warning",
                showCancelButton: false,
            }, function () {
                Router.go("Login");
            });
        }
    })
}

Template.Login.rendered = function () {
    Session.set("user", null);
    Session.set("menuId", null);
    $("#login-form").bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }
    }).on('success.form.bv', function (e) {
        e.preventDefault(); // Prevent the form from submitting 

        loginUser();
    });
};
