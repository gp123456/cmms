/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global Template, Session */

Template.InsertMachine.rendered = function () {
    var user = Session.get("user");

    if (user) {
        Session.set("departments", null);
        getDepartments(user.id);
        $("#insert-machine").bootstrapValidator({
            feedbackIcons: {
                valid: "glyphicon glyphicon-ok",
                invalid: "glyphicon glyphicon-remove",
                validating: "glyphicon glyphicon-refresh"
            },
            excluded: "disabled",
            fields: {
                department: {
                    validators: {
                        notEmpty: {
                            message: "Επέλεξε τμήμα"
                        }
                    }
                },
                input: {
                    validators: {
                        notEmpty: {
                            message: "Δώσε τον αριθμό εισόδων της μηχανής"
                        },
                        integer: {
                            message: "Δώσε τον πραγματικό αριθμό εισόδων της μηχανής"
                        },
                        between: {
                            min: 0,
                            max: 10,
                            message: "Δώσε τον αριθμό εισόδων της μηχανής με εύρος από 0 μέχρι 10"
                        }
                    }
                },
                output: {
                    validators: {
                        notEmpty: {
                            message: "Δώσε τον αριθμό εξόδων της μηχανής"
                        },
                        integer: {
                            message: "Δώσε τον πραγματικό αριθμό εξόδων της μηχανής"
                        },
                        between: {
                            min: 0,
                            max: 10,
                            message: "Δώσε τον αριθμό εξόδων της μηχανής με εύρος από 0 μέχρι 10"
                        }
                    }
                },
                description: {
                    validators: {
                        notEmpty: {
                            message: "Δώσε ένα όνομα για την νέα μηχανή"
                        }
                    }
                },
                code: {
                    validators: {
                        notEmpty: {
                            message: "Δώσε ένα κωδικό όνομα για την νέα μηχανή"
                        }
                    }
                }
            }
        }).on('success.form.bv', function (e) {
            e.preventDefault(); // Prevent the form from submitting 
        });
    } else {
        Router.go("Login");
    }
};

Template.InsertMachine.helpers({
    "departments": function () {
        var departments = Session.get("departments");

        if (departments) {
            return departments;
        }

        return null;
    }
});