/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Template.InsertCause.rendered = function () {
    var user = Session.get("user");

    if (user) {
        Session.set("departments", null);
        getDepartments(user.id);
        getCauseType(null);

        $("#insert-cause").bootstrapValidator({
            feedbackIcons: {
                valid: "glyphicon glyphicon-ok",
                invalid: "glyphicon glyphicon-remove",
                validating: "glyphicon glyphicon-refresh"
            },
            fields: {
                department: {
                    validators: {
                        notEmpty: {
                            message: "Επέλεξε τμήμα"
                        }
                    }
                },
                type: {
                    validators: {
                        notEmpty: {
                            message: "Επέλεξε Τύπο Αιτίας"
                        }
                    }
                },
                description: {
                    validators: {
                        notEmpty: {
                            message: "Δώσε Όνομα Νέας Αιτίας"
                        }
                    }
                },
                code: {
                    validators: {
                        notEmpty: {
                            message: "Δώσε Κωδικό Όνομα Νέας Αιτίας"
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

Template.InsertCause.helpers({
    "departments": function () {

        var departments = Session.get("departments");

        if (departments) {
            delete Session.keys["departments"];

            return departments;
        }

        return null;
    },
    "types": function () {

        var types = Session.get("types");

        if (types) {
            delete Session.keys["types"];

            return types;
        }

        return null;
    }
});
