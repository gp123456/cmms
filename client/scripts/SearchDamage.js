/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global Router, Template, Session, Meteor, moment, Npm, MyAppExporter */

function restoreDamage(id) {
    swal({
        title: "Να προχωρήσω στην επαναφορά;",
        text: "Θα επανέρθει η αιτία: '" + $("#cause-modal").val() + "' και όλες οι δευτερεύουσες αιτίες αυτής!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ναι, Επανέφερέ το!",
        closeOnConfirm: false
    }, function () {
        Meteor.call('restoreDamage', id, function (error, response) {
            if (response) {
                swal({
                    title: "Η Επαναφορά της βλάβης επέτυχε!",
                    text: response,
                    type: "success",
                    showCancelButton: false,
                });
            } else {
                swal({
                    title: "Η Επαναφορά της βλάβης απέτυχε!",
                    text: error,
                    type: "warning",
                    showCancelButton: false,
                });
            }
        });
    });
}

function deleteDamage(id) {
    swal({
        title: "Να προχωρήσω στην διαγραφή;",
        text: "Θα διαγραφή η αιτία: '" + $("#cause-modal").val() + "' και όλες οι δευτερεύουσες αιτίες αυτής!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ναι, Διέγραψέ το!",
        closeOnConfirm: false
    }, function () {
        Meteor.call('deleteDamage', id, function (error, response) {
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

function updateDamage(id) {
    var damage = {
        id: Number(id),
        user: $("#user-modal option:selected").val(),
        note: $("#note-modal").val(),
        cause: $("#subcause-modal option:selected").val()
    };

    Meteor.call('updateDamage', damage, function (error, response) {
        if (response) {
            swal({
                title: "Η διόρθωση της βλάβης έγινε!",
                text: response,
                type: "success",
                showCancelButton: false,
            });
        } else {
            swal({
                title: "Η διόρθωση της βλάβης απέτυχε!",
                text: error,
                type: "warning",
                showCancelButton: false,
            });
        }
    })
}

function getDamage(id) {
    Meteor.call('getDamage', id, function (error, response) {
        try {
            var damage = JSON.parse(response);

            if (damage) {
                Session.set("damage", damage);
            }
        } catch (error) {
        }
    })
}

Template.SearchDamage.rendered = function () {
    var user = Session.get("user");

    if (user) {
        Session.set("damages", null);
        Session.set("damage", null);
        Session.set("subcauses", null);
        Session.set("users", null);
        getDamages(user.id, null);
        this.$('.datetimepicker').datetimepicker({format: 'YYYY-MM-DD HH:MM:SS'});
    } else {
        Router.go("Login");
    }
};

Template.SearchDamage.helpers({
    "damages": function () {
        var damages = Session.get("damages");

        if (damages) {
            return damages;
        }

        return null;
    },
    "damage": function () {
        var damage = Session.get("damage");

        if (damage) {
            damage.created = moment(damage.created).format("llll");
            damage.title = damage.descriptionType + ": " + damage.descriptionCause;
            if (damage.deleted === 1) {
                $("#restore").show();
                $("#delete").hide();
            } else {
                $("#delete").show();
                $("#restore").hide();
            }

            return damage;
        }

        return null;
    },
    "dataPageList": function () {
        return "[5, 10, 15, 20, 25, 30]";
    },
    "hasCause": function (descriptionCause) {
        return descriptionCause;
    },
    "hasSubcause": function (descriptionSubcause) {
        return descriptionSubcause;
    },
    "hasUser": function (user) {
        return user !== "0";
    },
    "subcauses": function () {
        var subcauses = Session.get("subcauses");

        if (subcauses) {
            return subcauses;
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
    "users": function () {
        var users = Session.get("users");

        if (users) {
            return users;
        }

        return null;
    },
    "Preservative": function () {
        var user = Session.get("user");

        if (user) {
            return (user.type === 1 || user.type === 2 || user.type === 3);
        }

        return false;
    },
    "PAdmin": function () {
        var user = Session.get("user");

        if (user) {
            return (user.type === 1);
        }

        return false;
    },
    "PUser": function () {
        var user = Session.get("user");

        if (user) {
            return (user.type === 2 || user.type === 3);
        }

        return false;
    }
});

Template.SearchDamage.events({
    "click #damage-view": function (e) {
        e.preventDefault();

        var user = Session.get("user");

        if (user) {
            Session.set("subcauses", null);
            Session.set("_users", null);
            getDamage(e.target.getAttribute("data-id"));
            getCause(null, null, null, true, e.target.getAttribute("data-id"));
            getUser(null, e.target.getAttribute("data-id"));

            if (user.type === 1 || user.type === 2 || user.type === 3) {
                $("#note-modal").attr("readonly", false);
            }
            $('#damage-modal').modal('show');
        }
    },
    "click #edit": function (e) {
        e.preventDefault();
        $("#created-modal").datepicker({
            format: "dd/mm/yyyy",
            autoclose: true,
            calendarWeeks: true,
            todayHighlight: true
        });
        $("#created-modal").removeAttr('readonly');
        $("#type-modal").removeAttr('readonly');
        $("#department-modal").removeAttr('readonly');
        $("#machine-modal").removeAttr('readonly');
        $("#cause-modal").removeAttr('readonly');
        $("#user-modal").removeAttr('readonly');
    },
    "click #delete": function (e) {
        e.preventDefault();

        deleteDamage(e.target.getAttribute("data-id"));
        $("#damage-modal").modal("hide");
    },
    "click #restore": function (e) {
        e.preventDefault();

        restoreDamage(e.target.getAttribute("data-id"));
        $("#damage-modal").modal("hide");
    },
    "click #update": function (e) {
        e.preventDefault();

        updateDamage(e.target.getAttribute("data-id"));
        $("#damage-modal").modal("hide");
    },
    "click #cancel": function (e) {
        e.preventDefault();

        $("#damage-modal").modal("hide");
    },
    "click #recycle": function (e) {
        e.preventDefault();

        recycleDamage(e.target.getAttribute("data-id"))
    },
    "click [name=\"refresh\"]": function (e, t) {
        e.preventDefault();

        var user = Session.get("user");

        if (user) {
            Session.set("damages", null);
            Session.set("damage", null);
            Session.set("subcauses", null);
            Session.set("users", null);
            getDamages(user.id, null);
            $(".datetimepicker").datetimepicker({
                format: 'YYYY-MM-DD HH:MM:SS'
            });
        }
    },
    "change #cause-modal": function (e) {
        e.preventDefault();
        var user = Session.get("user");
        
        if (user) {
            var cause = $("#cause-modal option:selected").val();
            
            console.log("cause", cause);
            
            Session.set("subcauses", null);
            getSubcause(cause);
        }
    },
    "click #export": function (e) {
        e.preventDefault();

        var damages = Session.get("damages");

        if (damages) {
//            var $table = $('#table');
//            $table.bootstrapTable('destroy').bootstrapTable({
//                exportData: damages
//            });
//            exports.parse("");
//            excelBuilder.
            //require('tableexport');
//            var workSheet = excelBuilder.SimpleExcel
//                    createWorkbook('./', 'sample.xlsx');

//            var excel = new Excel("xls");

//            excel.createWorkbook();

//            console.log("get excel");

            exportAllContacts(damages);
        }
    }
});
