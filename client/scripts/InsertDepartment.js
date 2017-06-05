/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global Template */

Template.InsertDepartment.rendered = function () {
    var user = Session.get("user");

    if (user) {
        $("#insert-department").bootstrapValidator({
            feedbackIcons: {
                valid: "glyphicon glyphicon-ok",
                invalid: "glyphicon glyphicon-remove",
                validating: "glyphicon glyphicon-refresh"
            },
            excluded: "disabled",
            fields: {
                "running-duration": {
                    validators: {
                        notEmpty: {
                            message: "Δώσε μια διάρκεια σε λεπτά που η μηχανή θεωρείται σε λειτουργία"
                        },
                        integer: {
                            message: "Δώσε μια πραγματική διάρκεια σε λεπτά που η μηχανή θεωρείται σε λειτουργία"
                        },
                        between: {
                            min: 1,
                            max: 10,
                            message: "Δώσε μια διάρκεια σε λεπτά με εύρος από 1 μέχρι 10"
                        }
                    }
                },
                "stopping-duration": {
                    validators: {
                        notEmpty: {
                            message: "Δώσε μια διάρκεια σε λεπτά που η μηχανή θεωρείται σταματημένη"
                        },
                        integer: {
                            message: "Δώσε μια πραγματική διάρκεια σε λεπτά που η μηχανή θεωρείται σταματημένη"
                        },
                        between: {
                            min: 1,
                            max: 2,
                            message: "Δώσε μια διάρκεια σε λεπτά με εύρος από 1 μέχρι 2"
                        }
                    }
                },
                description: {
                    validators: {
                        notEmpty: {
                            message: "Δώσε ένα όνομα για το νέο τμήμα"
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