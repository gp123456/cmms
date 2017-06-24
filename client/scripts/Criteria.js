/* global Template, Session, Blaze, Meteor */

function submitSearchDamage() {
    var user = Session.get("user");

    if (user) {
        var from = $("#from-criteria").val();
        var to = $("#to-criteria").val();
        var selectedDepartments = [];
        $("#department-criteria option:selected").each(function (index, value) {
            selectedDepartments.push(Number($(this).val()));
        });
        var selectedMachines = [];
        $("#machine-criteria option:selected").each(function (index, value) {
            selectedMachines.push(Number($(this).val()));
        });
        var selectedTypes = [];

        if (user.type === 2) {
            selectedTypes.push(2);
        } else if (user.type === 3) {
            selectedTypes.push(1);
        } else {
            $("#type-criteria option:selected").each(function (index, value) {
                selectedTypes.push(Number($(this).val()));
            });
        }
        var selectedCauses = [];
        $("#cause-criteria option:selected").each(function (index, value) {
            selectedCauses.push(Number($(this).val()) - 10000);
        });
        var selectedSubcauses = [];
        if (Router.current().originalUrl.search("pareto") === -1) {
            $("#subcause-criteria option:selected").each(function (index, value) {
                selectedSubcauses.push(Number($(this).val()));
            });
        }
        var selectedUsers = [];
        $("#user-criteria option:selected").each(function (index, value) {
            selectedUsers.push($(this).val());
        });


        var criteria = {
            from: from,
            to: to,
            departments: selectedDepartments,
            machines: selectedMachines,
            types: selectedTypes,
            causes: selectedCauses,
            subcauses: selectedSubcauses,
            users: selectedUsers
        };

        Session.set("criteria", criteria);

        if (from !== '' && to !== '') {
            if (from > to) {
                swal({
                    title: "Έλεγχος Ημερομηνίας",
                    text: "H ημερομηνία 'Από' πρέπει να είναι μικρότερη της 'Μεχρι'",
                    type: "warning"
                });
                $("#from-criteria").val("");
                $("#΄το-criteria").val("");
            } else if (user.type === 4 && selectedDepartments.length === 0) {
                swal({
                    title: "Έλεγχος Διαχειριστή Τμήματος",
                    text: "Πρέπει να επιλέξεις τουλάχιστον ένα τμήμα",
                    type: "warning"
                });
                $("#from-criteria").val("");
                $("#΄το-criteria").val("");
            } else {
                if (Router.current().originalUrl.search("pareto") === -1) {
                    Session.set("from", criteria.from);
                    Session.set("to", criteria.to);

                    getDamages("getDamages", null, criteria);
                } else {
                    getPareto(null, criteria);
                }
                $('.collapse').collapse("hide");
            }
        } else {
            swal({
                title: "Έλεγχος Ημερομηνίας",
                text: "Πρέπει να επιλέξεις μια ημερομηνία και για τα δύο πεδία",
                type: "warning"
            });
        }
    }
}

Template.Criteria.rendered = function () {
    Session.set("types", null);
    Session.set("causes", null);
    Session.set("subcauses", null);
    Session.set("departments", null);
    Session.set("machines", null);
    Session.set("users", null);
    $("#from-criteria").datetimepicker({
        format: "YYYY-MM-DD HH:mm:ss",
        sideBySide: true
    });
    $("#to-criteria").datetimepicker({
        format: "YYYY-MM-DD HH:mm:ss",
        sideBySide: true
    });
    var user = Session.get("user");

    if (user) {
        getDepartments(user.id);
        getMachine(null, null, user.id);
        if (user.type === 2) {
            getCauseType([2]);
        } else if (user.type === 3) {
            getCauseType([1]);
        } else {
            getCauseType(null);
        }
        getCause(user.id, null, null, true);
        getUser(user.type, null);

        $("#form-criteria").bootstrapValidator({
            framework: 'bootstrap',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                fromCriteria: {
                    validators: {
                        date: {
                            max: "toCriteria",
                            message: "Πρέπει να είναι μικρότερη από την 'Μέχρι'"
                        },
                        notEmpty: {
                            message: "Πρέπει να επιλέξεις μια ημερομηνία"
                        }
                    }
                },
                toCriteria: {
                    validators: {
                        date: {
                            min: "fromCriteria",
                            message: "Πρέπει να είναι μεγαλύτερη από την 'Από'"
                        },
                        notEmpty: {
                            message: "Πρέπει να επιλέξεις μια ημερομηνία"
                        }
                    }
                }
            }
        }).on("success.form.bv", function (e, data) {
            e.preventDefault(); // Prevent the form from submitting 

            if (data.field === "fromCriteria" && !data.fv.isValidField("toCriteria")) {
                // We need to revalidate the end date
                data.fv.revalidateField("toCriteria");
            }
        });
        initMultiselect($("#type-criteria"), "Επέλεξε Τύπο(ους) αιτίας(ιών)", "240px");
        if (Router.current().originalUrl.search("pareto") === -1) {
            initMultiselect($("#cause-criteria"), "Επέλεξε Αιτία(ίες)", "240px");
            initMultiselect($("#subcause-criteria"), "Επέλεξε Δευτερεύουσα(ες) Αιτία(ίες)", "340px");
        } else {
            initMultiselect($("#cause-criteria"), "Επέλεξε Αιτία(ίες)", "340px");
        }
        initMultiselect($("#department-criteria"), "Επέλεξε Τμήμα(τα)", "240px");
        initMultiselect($("#machine-criteria"), "Επέλεξε Μηχανή(ές)", "340px");
        initMultiselect($("#user-criteria"), "Επέλεξε Χρήστη(ες)", "340px");
    }
};

Template.Criteria.helpers({
    noPUser: function () {
        var user = Session.get("user");

        if (user) {
            return user.type !== 2 && user.type !== 3;
        }

        return null;
    },
    types: function () {
        var types = Session.get("types");

        if (types) {
            return types;
        }

        return null;
    },
    "causes": function () {
        var causes = Session.get("causes");

        if (causes) {
            return causes;
        }

        return null;
    },
    "subcauses": function () {
        var subcauses = Session.get("subcauses");

        if (subcauses) {
            return subcauses;
        }

        return null;
    },
    "departments": function () {
        var departments = Session.get("departments");

        if (departments) {
            return departments;
        }

        return null;
    },
    "machines": function () {
        var machines = Session.get("machines");

        if (machines) {
            return machines;
        }

        return null;
    },
    "users": function () {
        var users = Session.get("users");

        if (users) {
            return users;
        }

        return null;
    },
    "NoPareto": function () {
        var path = Router.current().originalUrl;

        return path.search("pareto") === -1;
    },
    "Pareto": function () {
        var path = Router.current().originalUrl;

        return path.search("pareto") !== -1;
    }
});

Template.Criteria.events({
    "change #department-criteria": function (e) {
        e.preventDefault();
        var departments = $("#department-criteria option:selected");
        var selectedDepartment = [];
        $(departments).each(function (index, department) {
            selectedDepartment.push([$(this).val()]);
        });
        var types = $("#type-criteria option:selected");
        var selectedType = [];
        $(types).each(function (index, type) {
            selectedType.push([$(this).val()]);
        });
        var user = Session.get("user");

        Session.set("machines", null);
        Session.set("causes", null);
        Session.set("subcauses", null);
        getMachine(null, (selectedDepartment.length > 0) ? selectedDepartment : null, (selectedDepartment.length <= 0) ? user.id : null);
        getCause(
                (selectedType.length <= 0 && selectedDepartment.length <= 0) ? user.id : null,
                (selectedType.length > 0) ? selectedType : null,
                (selectedDepartment.length > 0) ? selectedDepartment : null,
                true
                );
    },
    "click #sb-department-criteria": function (e) {
        e.preventDefault();

        $("#machine-criteria").multiselect("destroy");
        $("#machine-criteria").prop("disabled", false);
        initMultiselect($("#machine-criteria"), "Επέλεξε Μηχανή(ές)", "340px");
        $("#cause-criteria").multiselect("destroy");
        $("#cause-criteria").prop('disabled', false);
        if (Router.current().originalUrl.search("pareto") === -1) {
            initMultiselect($("#cause-criteria"), "Επέλεξε Αιτία(ίες)", "240px");
            $("#subcause-criteria").multiselect("destroy");
            $("#subcause-criteria").prop('disabled', false);
            initMultiselect($("#subcause-criteria"), "Επέλεξε Δευτερεύουσα(ες) Αιτία(ίες)", "340px");
        } else {
            initMultiselect($("#cause-criteria"), "Επέλεξε Αιτία(ίες)", "340px");
        }
    },
    "change #type-criteria": function (e) {
        e.preventDefault();

        var user = Session.get("user");

        if (user) {
            var departments = $("#department-criteria option:selected");
            var selectedDepartment = [];
            $(departments).each(function (index, department) {
                selectedDepartment.push([$(this).val()]);
            });
            var types = $("#type-criteria option:selected");
            var selectedType = [];
            var userType = [];
            $(types).each(function (index, type) {
                var value = $(this).val();
                
                selectedType.push([value]);
                if (value == 1) {
                    userType.push(3);
                }
                if (value == 2) {
                    userType.push(2);
                }
            });
            Session.set("causes", null);
            Session.set("subcauses", null);
            Session.set("users", null);
            
            getCause(
                    (selectedType.length <= 0 && selectedDepartment.length <= 0) ? user.id : null,
                    (selectedType.length > 0) ? selectedType : null,
                    (selectedDepartment.length > 0) ? selectedDepartment : null,
                    (selectedType.length == 1 && selectedType[0] == 3) ? false : true
                    );
            getUser(userType, null);
        }
    },
    "click #sb-type-criteria": function (e) {
        e.preventDefault();

        $("#cause-criteria").multiselect("destroy");
        $("#cause-criteria").prop("disabled", false);
        if (Router.current().originalUrl.search("pareto") === -1) {
            initMultiselect($("#cause-criteria"), "Επέλεξε Αιτία(ίες)", "240px");
            $("#subcause-criteria").multiselect("destroy");
            $("#subcause-criteria").prop("disabled", false);
            initMultiselect($("#subcause-criteria"), "Επέλεξε Δευτερεύουσα(ες) Αιτία(ίες)", "340px");
            $("#user-criteria").multiselect("destroy");
            $("#user-criteria").prop("disabled", false);
            initMultiselect($("#user-criteria"), "Επέλεξε Χρήστη(ες)", "340px");
        } else {
            initMultiselect($("#cause-criteria"), "Επέλεξε Αιτία(ίες)", "340px");
        }
    },
    "change #cause-criteria": function (e) {
        e.preventDefault();

        var causes = $("#cause-criteria option:selected");
        var selectedCause = [];
        $(causes).each(function (index, department) {
            selectedCause.push([$(this).val()]);
        });

        Session.set("subcauses", null);
        getSubcause((selectedCause.length > 0) ? selectedCause : null)
    },
    "click #sb-cause-criteria": function (e) {
        e.preventDefault();

        $("#subcause-criteria").multiselect("destroy");
        $("#subcause-criteria").prop("disabled", false);
        initMultiselect($("#subcause-criteria"), "Επέλεξε Δευτερεύουσα(ες) Αιτία(ίες)", "340px");
    },
    "click #sb-criteria": function (e) {
        e.preventDefault();

        submitSearchDamage();
    },
    "click #clear-pareto": function () {
        awesomeChartClear("canvas1");
    }
});
