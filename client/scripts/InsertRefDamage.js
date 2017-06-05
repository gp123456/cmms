/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global Template, Session, Meteor, damages, moment, BootstrapDialog */

function insertCause(refCause) {
    Meteor.call('insertCause', refCause, function (error, response) {
        try {
            var refCauses = JSON.parse(response);

            if (refCauses) {
                Session.set("refCauses", refCauses);

                $('#table').bootstrapTable("destroy");
                $("#table").bootstrapTable({data: refCauses});
            }
        } catch (error) {
        }
    });
}

function getCompleteCause(refCause) {
    Meteor.call('getCompleteCause', refCause, function (error, response) {
        try {
            var refCauses = JSON.parse(response);

            if (refCauses) {
                Session.set("refCauses", refCauses);

                $('#table').bootstrapTable("destroy");
                $("#table").bootstrapTable({data: refCauses});
            }
        } catch (error) {
        }
    });
}

function deleteSubcause(id) {
    swal({
        title: "Να προχωρήσω στην διαγραφή;",
        text: "Θα διαγραφή η βλάβη!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ναι, Διέγραψέ το!",
        closeOnConfirm: false
    }, function () {
        Meteor.call('deleteSubcause', id, function (error, response) {
            if (response) {
                swal({
                    title: "Η Διαγραφή της βλάβης επέτυχε!",
                    text: response,
                    type: "success",
                    showCancelButton: false,
                });
            } else {
                swal({
                    title: "Η Διαγραφή της βλάβης απέτυχε!",
                    text: error,
                    type: "warning",
                    showCancelButton: false,
                });
            }
        });
    });
}

function deleteCause(id) {
    swal({
        title: "Να προχωρήσω στην διαγραφή;",
        text: "Θα διαγραφή η βλάβη!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ναι, Διέγραψέ το!",
        closeOnConfirm: false
    }, function () {
        Meteor.call('deleteCause', id, function (error, response) {
            if (response) {
                swal({
                    title: "Η Διαγραφή της βλάβης επέτυχε!",
                    text: response,
                    type: "success",
                    showCancelButton: false,
                });
            } else {
                swal({
                    title: "Η Διαγραφή της βλάβης απέτυχε!",
                    text: error,
                    type: "warning",
                    showCancelButton: false,
                });
            }
        });
    });
}

Template.InsertRefDamage.rendered = function () {
    var user = Session.get("user");

    if (user) {
        var ct = [];

        ct.push(1);
        ct.push(2);
        Session.set("departments", null);
        Session.set("types", null);
        Session.set("causes", null);
        Session.set("completeCause", null);
        getDepartments(user.id);
        getCauseType(ct);
        getCause(null, null, null, false);
        getCompleteCause(null);
        $("#insert-ref-cause").bootstrapValidator({
            feedbackIcons: {
                valid: "glyphicon glyphicon-ok",
                invalid: "glyphicon glyphicon-remove",
                validating: "glyphicon glyphicon-refresh"
            },
            fields: {
                name: {
                    validators: {
                        notEmpty: {
                            message: "Εισήγαγε Τύπο Αιτίας"
                        }
                    }
                },
                cause: {
                    validators: {
                        notEmpty: {
                            message: "Εισήγαγε Αιτία"
                        }
                    }
                },
                subcause: {
                    notEmpty: {
                        message: "Εισήγαγε Δευτερεύουσα Αιτία"
                    }
                }
            }
        }).on("success.form.bv", function (e) {
            e.preventDefault(); // Prevent the form from submitting 

            var refCause = {
                causeId: Number($("#cause option:selected").val()),
                subcause: $("#subcause").val(),
                subcauseCode: null
            };
            $("#subcause").val("");
            getCompleteCause(refCause);
            var refCauses = Session.get("refCauses");

            if (refCauses) {
                $('#table').bootstrapTable("destroy");
                $("#table").bootstrapTable({data: refCauses});
            }
        });
    } else {
        Router.go("Login");
    }
};

Template.InsertRefDamage.helpers({
    "refDamageTypes": function () {
        var types = Session.get("types");

        if (types) {
            return types;
        }

        return null;
    },
    "dataPageList": function () {
        return "[5, 10, 15, 20, 25, 30]";
    },
    "causes": function () {
        var causes = Session.get("causes");

        if (causes) {
            return causes;
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
    "subcauseId": function () {
        var subcauseId = Session.get("subcauseId");

        if (subcauseId) {
            return subcauseId;
        }

        return null;
    }
});

Template.InsertRefDamage.events({
    "click #cancel": function (e) {
        $("#cause-modal").modal("hide");
    },
    "click #delete": function (e) {
        var causeId = Session.get("causeId");
        var subcauseId = Session.get("subcauseId");
        
        if (causeId) {
            deleteCause(causeId);
        } else if (subcauseId) {
            deleteSubcause(subcauseId);
        }
        
        $("#cause-modal").modal("hide");
    },
    "click #update": function (e) {
        var causeId = Session.get("causeId");

        if (causeId) {
            $("#department select").val();
        }
        $("#cause-modal").modal("hide");
    },
    "click .cause-modify": function (e) {
        var causeId = e.target.getAttribute("data-id");
        Session.set("causeId", causeId);
        Session.set("subcauseId", null);

        $("#cause-modal-title").text("Επέλεξε μια λειτουγία για την βλάβη:" + $("#cause-modify" + causeId).text());
        $("#cause-modal").modal("show");
    },
    "click .subcause-modify": function (e) {
        var subcauseId = e.target.getAttribute("data-id");
        Session.set("causeId", null);
        Session.set("subcauseId", subcauseId);

        $("#cause-modal-title").text("Επέλεξε μια λειτουγία για την βλάβη:" + $("#subcause-modify" + subcauseId).text());
        $("#cause-modal").modal("show");
    },
    "click #btn-new-cause": function (e) {
        var department = $("#department option:selected").val();
        var type = $("#type option:selected").val();

        if (department == -1) {
            swal({
                title: "Εισαγωγή Αιτίας",
                text: "Πρέπει να επιλέξεις ένα τμήμα",
                type: "warning",
                showCancelButton: false,
            });
        } else if (type == -1) {
            swal({
                title: "Εισαγωγή Αιτίας",
                text: "Πρέπει να επιλέξεις το τύπο της βλάβης",
                type: "warning",
                showCancelButton: false,
            });
        } else {
            $("#new-cause-modal-title").text("Εισαγωγή νέας βλάβης στο τμήμα:" + $("#department option:selected").text());
            $("#new-cause-modal").modal("show");
        }
    },
    "click #insert": function (e) {
        var refCause = {
            department: Number($("#department option:selected").val()),
            cause: $("#new-cause").val(),
            type: Number($("#type option:selected").val()),
            code: $("#new-cause-code").val()
        };

        insertCause(refCause);
        $('#new-cause-modal').modal("hide");
    }
});
