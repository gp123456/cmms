/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global Meteor, Template, Session, parseInt*/

function insertDamage() {
    var user = Session.get("user");

    if (user) {
        var subcauses = [];
        subcauses.push({
            id: Number($("#subcause option:selected").val())
        });
        var damage = {
            created: $("#created").val() + ".000",
            user: user.id,
            type: Number($("#type option:selected").val()),
            cause: Number($("#cause option:selected").val()),
            machine: Number($("#machine option:selected").val()),
            duration: Number($("#duration").val()),
            subcauses: subcauses
        };

        Meteor.call('insertDamage', damage, function (error, response) {
            if (response) {
                swal({
                    title: "Η εισαγωγή της αιτίας επέτυχε!",
                    text: response,
                    type: "success",
                    showCancelButton: false,
                });
            } else {
                swal({
                    title: "Η εισαγωγή της αιτίας απέτυχε!",
                    text: error,
                    type: "warning",
                    showCancelButton: false,
                });
            }
        });
    }
}

Template.InsertDamage.rendered = function () {
    var user = Session.get("user");

    if (user) {
        $("#created").datetimepicker({
            format: "YYYY-MM-DD HH:mm:ss",
            sideBySide: true
        });
        Session.set("departments", null);
        Session.set("machines", null);
        Session.set("causes", null);
        Session.set("subcauses", null);
        getDepartments(user.id);
        getMachine(user.id, null);
        getCauseType(null);
        getCause(user.id, null, null, true);
        $("#insert-damage").bootstrapValidator({
            feedbackIcons: {
                valid: "glyphicon glyphicon-ok",
                invalid: "glyphicon glyphicon-remove",
                validating: "glyphicon glyphicon-refresh"
            },
            excluded: "disabled",
            fields: {
                machine: {
                    validators: {
                        notEmpty: {
                            message: "Επέλεξε μηχανή"
                        }
                    }
                },
                type: {
                    validators: {
                        notEmpty: {
                            message: "Επέλεξε τύπο αιτίας"
                        }
                    }
                },
                cause: {
                    validators: {
                        notEmpty: {
                            message: "Επέλεξε κύρια αιτία"
                        }
                    }
                },
                subcause: {
                    validators: {
                        notEmpty: {
                            message: "Επέλεξε αιτία"
                        }
                    }
                },
                operator: {
                    validators: {
                        notEmpty: {
                            message: "Επέλεξε χειριστή"
                        }
                    }
                },
                preserver: {
                    validators: {
                        notEmpty: {
                            message: "Επέλεξε συντηρητή"
                        }
                    }
                },
                created: {
                    validators: {
                        notEmpty: {
                            message: "Επέλεξε ημερομηνία"
                        }
                    }
                },
                duration: {
                    validators: {
                        notEmpty: {
                            message: "Δώσε δάρκεια βλάβης σε λεπτά"
                        },
                        integer: {
                            message: "Δώσε μια πραγματική δάρκεια βλάβης σε λεπτά"
                        },
                        between: {
                            min: 1,
                            max: 1000,
                            message: "Δώσε μια δάρκεια βλάβης σε λεπτά με εύρος από 1 μέχρι 1000"
                        }
                    }
                }
            }
        }).on('success.form.bv', function (e) {
            e.preventDefault(); // Prevent the form from submitting 

            insertDamage();
        });
    } else {
        Router.go("Login");
    }
};

Template.InsertDamage.helpers({
    "departmentDescription": function () {
        var departments = Session.get("departments");

        if (departments) {
            return departments[0].description;
        }

        return null;
    },
    "machines": function () {
        var machines = Session.get("machines");

        if (machines) {
            delete Session.keys["machines"];

            return machines;
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
    },
    "causes": function () {
        var causes = Session.get("causes");

        if (causes) {
            delete Session.keys["causes"];

            return causes;
        }

        return null;
    },
    "subcauses": function () {
        var subcauses = Session.get("subcauses");

        if (subcauses) {
            delete Session.keys["subcauses"];

            return subcauses;
        }

        return null;
    },
    "operator": function () {
        var operators = Session.get("operators");

        if (operators) {
            delete Session.keys["operators"];

            return operators;
        }

        return null;
    },
    "preserver": function () {
        var preservers = Session.get("preservers");

        if (preservers) {
            delete Session.keys["preservers"];

            return preservers;
        }

        return null;
    }
});

Template.InsertDamage.events({
    "change #type": function (e) {
        var user = Session.get("user");
        var type = $("#type option:selected").val();

        if (user) {
            if (parseInt(type) === 3) {
                $("#subcause").removeAttr("required");
                $("#subcause").prop("disabled", "disabled");
                $("#subcause option:selected").val(0);
            } else {
                $("#subcause").removeAttr("disabled");
            }
            getCause(user.id, type, null, true);
        }
    },
    "change #cause": function (e) {
        if (parseInt($("#type option:selected").val()) !== 3) {
            getSubcause($("#cause option:selected").val());
        }
    }
});
