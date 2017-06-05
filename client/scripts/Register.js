/* global Router, Meteor, Session, Template */

function registerUser() {
    var departments = [];
    $("#department option:selected").each(function (index, value) {
        departments.push(Number($(this).val()));
    });

    var user = {
        departments: departments,
        type: $("#type option:selected").val(),
        id: $("#id").val(),
        name: $("#name").val(),
        username: $("#username").val(),
        password: $("#password").val()
    };

    Meteor.call("addUser", user, function (error, response) {
        if (response === "Exist User") {
            swal({
                title: "This user is already registered!",
                text: "Please proceed to login.",
                type: "warning"
            }, function () {
                Router.go("Login");
            });
        } else {
            swal({
                title: "Registration Successful!",
                text: "Please proceed to login.",
                type: "success"
            }, function () {
                Router.go("Login");
            });
        }
    });
}

function getUserType() {
    Meteor.call("getUserType", function (error, response) {
        try {
            var types = JSON.parse(response);

            if (types) {
                Session.set("types", types);
            }
        } catch (error) {
        }
    });
}

Template.Register.rendered = function () {
    var user = Session.get("user");

    if (user) {
        Session.set("departments", null);
        getDepartments(user.id);
        getUserType();
        initMultiselect($("#department"), "Επέλεξε Τμήμα(τα)", "340px");

        $("#register").bootstrapValidator({
            feedbackIcons: {
                valid: "glyphicon glyphicon-ok",
                invalid: "glyphicon glyphicon-remove",
                validating: "glyphicon glyphicon-refresh"
            },
            fields: {
                department: {
                    validators: {
                        integer: {
                            message: "Επέλεξε τμήμα"
                        },
                        notEmpty: {
                            message: "Επέλεξε τμήμα"
                        }
                    }
                },
                type: {
                    validators: {
                        notEmpty: {
                            message: "Επέλεξε τύπο χρήστη"
                        }
                    }
                },
                name: {
                    validators: {
                        notEmpty: {
                            message: "Δώσε όνομα χρήστη"
                        }
                    }
                },
                username: {
                    validators: {
                        notEmpty: {
                            message: "Δώσε όνομα κωδικό χρήστη"
                        }
                    }
                },
                password: {
                    validators: {
                        notEmpty: {
                            message: "Δώσε κωδικό χρήστη"
                        },
                        identical: {
                            field: "password_confirmation",
                            message: "Μη επιβεβαιωμένος κωδικός χρήστη"
                        }
                    }
                },
                password_confirmation: {
                    validators: {
                        notEmpty: {
                            message: "Δώσε κωδικό χρήστη για επιβεβαίωση"
                        },
                        identical: {
                            field: "password",
                            message: "Μη επιβεβαιωμένος κωδικός χρήστη"
                        }
                    }
                }
            }
        }).on("success.form.bv", function (e) {
            e.preventDefault(); // Prevent the form from submitting 

            registerUser();
        });
    } else {
        Router.go("Login");
    }
};

Template.Register.helpers({
    "departments": function () {

        var departments = Session.get("departments");

        if (departments) {
            return departments;
        }

        return null;
    },
    "types": function () {

        var types = Session.get("types");

        if (types) {
            return types;
        }

        return null;
    }
});
