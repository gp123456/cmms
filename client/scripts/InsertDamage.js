/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global Meteor, Template, Session, parseInt*/

function insertDamage() {
    var user = Session.get("user");

    if (user) {
        var type = Number($("#type option:selected").val());
        var created = $("#created").val();

        var damage = {
            created: created,
            user: (type !== 3) ? "0" : user.id,
            type: type,
            cause: (type !== 3) ? Number($("#subcause option:selected").val()) : Number($("#cause option:selected").val()),
            machine: Number($("#machine option:selected").val()),
            duration: Number($("#duration").val())
        };

        Meteor.call('insertDamage', damage, function (error, response) {
            if (response) {
                swal({
                    title: "Η εισαγωγή της αιτίας πέτυχε!",
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
        getMachine(null, null, user.id);
        getCauseType(null);
        getCause(user.id, null, null, true);
    } else {
        Router.go("Login");
    }
};

Template.InsertDamage.helpers({
    departments: function () {
        var departments = Session.get("departments");

        if (departments) {
            return departments;
        }

        return null;
    },
    moreDepartment: function () {
        var departments = Session.get("departments");

        if (departments) {
            return departments.length > 1;
        }

        return false;
    },
    departmentDescription: function () {
        var departments = Session.get("departments");

        if (departments) {
            var output = "";

            departments.forEach(function (department) {
                output += department.description + " ";
            });

            return output;
        }

        return null;
    },
    machines: function () {
        var machines = Session.get("machines");

        if (machines) {
            delete Session.keys["machines"];

            return machines;
        }

        return null;
    },
    types: function () {
        var types = Session.get("types");

        if (types) {
            delete Session.keys["types"];

            return types;
        }

        return null;
    },
    causes: function () {
        var causes = Session.get("causes");

        if (causes) {
            delete Session.keys["causes"];

            return causes;
        }

        return null;
    },
    subcauses: function () {
        var subcauses = Session.get("subcauses");

        if (subcauses) {
            delete Session.keys["subcauses"];

            return subcauses;
        }

        return null;
    },
    operator: function () {
        var operators = Session.get("operators");

        if (operators) {
            delete Session.keys["operators"];

            return operators;
        }

        return null;
    },
    preserver: function () {
        var preservers = Session.get("preservers");

        if (preservers) {
            delete Session.keys["preservers"];

            return preservers;
        }

        return null;
    }
});

Template.InsertDamage.events({
    "change #department": function (e) {
        e.preventDefault();

        var department = $("#department option:selected").val();

        if (department) {
            getMachine(null, department, null);
            getCause(null, null, department, true, null);
        }

    },
    "change #type": function (e) {
        e.preventDefault();

        var user = Session.get("user");
        var type = $("#type option:selected").val();
        var department = $("#department option:selected").val();
        var types = [];

        if (user) {
            types.push(type);
            if (parseInt(type) === 3) {
                $("#subcause").removeAttr("required");
                $("#subcause").prop("disabled", "disabled");
                $("#subcause option:selected").val(0);
            } else {
                $("#subcause").removeAttr("disabled");
            }
            if (department) {
                getCause(null, types, department, (type !== 3) ? true : false, null);
            } else {
                getCause(user.id, types, null, (type !== 3) ? true : false, null);
            }

        }
    },
    "change #cause": function (e) {
        e.preventDefault();

        if (parseInt($("#type option:selected").val()) !== 3) {
            var causes = [];

            causes.push($("#cause option:selected").val());
            getSubcause(causes);
        }
    },
    "submit #insert-damage": function (e) {
        e.preventDefault();

        var user = Session.get("user");

        if (user) {
            var target = event.target;
            var department = (target.hasOwnProperty("department")) ? target.department.value : user.department;
            var machine = target.machine.value;
            var type = target.type.value;
            var cause = target.cause.value;
            var subcause = target.subcause.value;
            var created = target.created.value;
            var duration = target.duration.value;

            if (department == -1) {
                swal({
                    title: "Έλεγχος τμήματος",
                    text: "Πρέπει να επιλέξεις τμήμα",
                    type: "warning",
                    showCancelButton: false,
                });

                return;
            }
            if (machine == -1) {
                swal({
                    title: "Έλεγχος μηχανής",
                    text: "Πρέπει να επιλέξεις μηχανή",
                    type: "warning",
                    showCancelButton: false,
                });

                return;
            }
            if (type == -1) {
                swal({
                    title: "Έλεγχος Τύπου Αιτίας",
                    text: "Πρέπει να επιλέξεις έναν τύπο αιτίας",
                    type: "warning",
                    showCancelButton: false,
                });

                return;
            }
            if (cause == -1) {
                swal({
                    title: "Έλεγχος Κύριας Αιτίας",
                    text: "Πρέπει να επιλέξεις μια κύρια αιτία",
                    type: "warning",
                    showCancelButton: false,
                });

                return;
            }
            if (type != 3 && subcause == -1) {
                swal({
                    title: "Έλεγχος Αιτίας",
                    text: "Πρέπει να επιλέξεις μια αιτία",
                    type: "warning",
                    showCancelButton: false,
                });

                return;
            }
            if (created == "") {
                swal({
                    title: "Έλεγχος Ημερομηνίας",
                    text: "Πρέπει να επιλέξεις μια ημερομηνία",
                    type: "warning",
                    showCancelButton: false,
                });

                return;
            }
            if (duration == "" || duration < 0) {
                swal({
                    title: "Έλεγχος Διάρκειας",
                    text: "Πρέπει να δώσεις μια θετική διάρκεια σε λεπτά",
                    type: "warning",
                    showCancelButton: false,
                });

                return;
            }
            insertDamage();
        }
    }
});
