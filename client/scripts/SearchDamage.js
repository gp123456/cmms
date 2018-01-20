/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global Router, Template, Session, Meteor, moment, Npm, MyAppExporter */

function restoreDamage(id, name) {
    var user = Session.get("user");

    if (user) {
        swal({
            title: "Να προχωρήσω στην επαναφορά;",
            text: "Θα επανέρθει η βλάβη: '" + name + "'!",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Ναι, Επανέφερέ το!",
            closeOnConfirm: false
        }, function () {
            Meteor.call('restoreDamage', id, function (error, response) {
                if (response) {
                    swal({
                        title: "Η Επαναφορά της βλάβης πέτυχε!",
                        text: response,
                        type: "success",
                        showCancelButton: false,
                    });

                    var criteria = Session.get("criteria");

                    if (criteria) {
                        getDamages("getDamages", null, criteria);
                    } else {
                        getDamages("getDamages", user.id, null);
                    }
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
}

function deleteDamage(id) {
    var user = Session.get("user");

    if (user) {
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
                        title: "Η Διαγραφή της βλάβης πέτυχε!",
                        text: response,
                        type: "success",
                        showCancelButton: false,
                    });
                    //getDamages("getDeleteDamages", user.id, null);
                    var criteria = Session.get("criteria");

                    if (criteria) {
                        getDamages("getDamages", null, criteria);
                    } else {
                        getDamages("getDamages", user.id, null);
                    }
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
}

function updateDamage(id) {
    var user = Session.get("user");

    if (user) {
        var type = $("#cause-type-modal option:selected").val();
        var cause = (Number(type) !== 3) ? $("#subcause-modal option:selected").val() : $("#cause-modal option:selected").val();
        var damage = {
            id: Number(id),
            user: $("#user-modal option:selected").val(),
            note: $("#note-modal").val(),
            type: (user.type === 1 || user.type === 4) ? type : null,
            cause: (user.type === 1 || user.type === 4) ? cause : null,
            duration: (user.type === 1 || user.type === 4) ? $("#duration-modal").val() : null
        };

        Meteor.call('updateDamage', damage, function (error, response) {
            if (response) {
                swal({
                    title: "Η διόρθωση της βλάβης έγινε!",
                    text: response,
                    type: "success",
                    showCancelButton: false
                });
                var criteria = Session.get("criteria");

                if (criteria) {
                    getDamages("getDamages", null, criteria);
                } else {
                    getDamages("getDamages", user.id, null);
                }
            } else {
                swal({
                    title: "Η διόρθωση της βλάβης απέτυχε!",
                    text: error,
                    type: "warning",
                    showCancelButton: false,
                });
            }
        });
    }
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
    });
}

function getDepartment(department) {
    Meteor.call('getDepartment', department, function (error, response) {
        try {
            var department = JSON.parse(response);

            if (department) {
                Session.set("department", department);
            }
        } catch (error) {
        }
    });
}

function getDeleteDamages() {
    var user = Session.get("user");

    if (user) {
        Session.set("damages", null);
        Session.set("damage", null);
        Session.set("subcauses", null);
        Session.set("users", null);
        Session.set("from", null);
        Session.set("to", null);
        Session.set("damage_counters", "M:0,H:0,K:0");
        Session.set("descriptionDepartment", null);
        Session.set("descriptionMachine", null);
        Session.set("mttr", 0);
        Session.set("mtbf", 0);
        getDamages("getDeleteDamages", user.id, null);
    }
}

Template.SearchDamage.rendered = function () {
    var user = Session.get("user");

    if (user) {
        Session.set("hasDeleted", null);
        Session.set("damages", null);
        Session.set("damage", null);
        Session.set("subcauses", null);
        Session.set("users", null);
        Session.set("from", null);
        Session.set("to", null);
        Session.set("damage_counters", "M:0,H:0,K:0");
        Session.set("descriptionDepartment", null);
        Session.set("descriptionMachine", null);
        Session.set("mttr", 0);
        Session.set("mtbf", 0);
        Session.set("criteria", null);
        if (Router.current().params.query.machineId) {
            getMachine(Router.current().params.query.machineId, null, null);
        }
        if (Router.current().params.query.departmentId) {
            getDepartment(Router.current().params.query.departmentId);
        }
        getDamages("getDamages", user.id, null);
        this.$('.datetimepicker').datetimepicker({format: 'YYYY-MM-DD HH:MM:00'});
    } else {
        Router.go("Login");
    }
};

Template.SearchDamage.helpers({
    hasDepartment: function () {
        return Router.current().params.query.departmentId;
    },
    hasMachine: function () {
        return Router.current().params.query.machineId;
    },
    hasCriteria: function () {
        return Session.get("from") && Session.get("to");
    },
    hasDeleted: function () {
        var hasDeleted = Session.get("hasDeleted");

        return hasDeleted;
    },
    from: function () {
        var from = Session.get("from");

        if (from) {
            return from;
        }

        return null;
    },
    to: function () {
        var to = Session.get("to");

        if (to) {
            return to;
        }

        return null;
    },
    mtbf: function () {
        var mtbf = Session.get("mtbf");

        if (mtbf) {
            return mtbf;
        }

        return 0;
    },
    mttr: function () {
        var mttr = Session.get("mttr");

        if (mttr) {
            return mttr;
        }

        return 0;
    },
    damage_counters: function () {
        var damage_counters = Session.get("damage_counters");

        if (damage_counters) {
            return damage_counters;
        }

        return "";
    },
    descriptionDepartment: function () {
        var department = Session.get("department");

        if (department) {
            return department.description;
        }

        return null;
    },
    descriptionMachine: function () {
        var machines = Session.get("machines");

        if (machines) {
            return machines[0].code;
        }

        return null;
    },
    damages: function () {
        var damages = Session.get("damages");

        if (damages) {
            return damages;
        }

        return null;
    },
    damage: function () {
        var damage = Session.get("damage");

        if (damage) {
            damage.created = moment(damage.created).format("llll");
            damage.title = (damage.descriptionSubcause !== "")
                    ? damage.descriptionType + ": " + damage.descriptionCause + "[" + damage.descriptionSubcause + "]"
                    : damage.descriptionType + ": " + damage.descriptionCause;

            return damage;
        }

        return null;
    },
    dataPageList: function () {
        return "[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]";
    },
    hasCause: function (descriptionCause) {
        return descriptionCause;
    },
    hasSubcause: function (descriptionSubcause) {
        return descriptionSubcause;
    },
    hasUser: function (user) {
        return user !== "0";
    },
    subcauses: function () {
        var subcauses = Session.get("subcauses");

        if (subcauses) {
            return subcauses;
        }

        return null;
    },
    causes: function () {
        var causes = Session.get("causes");

        if (causes) {
            return causes;
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
    users: function () {
        var users = Session.get("users");

        if (users) {
            var _users = [];

            users.forEach(function (u) {
                _users.push(u);
            });

            return _users;
        }

        return null;
    },
    isPreservative: function () {
        var user = Session.get("user");

        if (user) {
            return user.type === 2 || user.type === 3;
        }

        return false;
    },
    isAdmin: function () {
        var user = Session.get("user");

        if (user) {
            return user.type === 1;
        }

        return false;
    },
    isAdminNoDeleted: function (damage) {
        var user = Session.get("user");

        if (user) {
            var nodeleted = (user.type === 1 || user.type === 4 && damage && damage.deleted === false) ? true : false;

            return nodeleted;
        }

        return false;
    },
    isAdminDeleted: function (damage) {
        var user = Session.get("user");

        if (user) {
            var deleted = (user.type === 1 && damage && damage.deleted === true) ? true : false;

            return deleted;
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
            if (user.type === 1) {
                getUser([2, 3], null);
                getCauseType([1, 2, 3]);
            } else if (user.type === 2 || user.type === 3) {
                getUser([user.type], null);
            }

            $("#note-modal").attr("readonly", (user.type === 1 || user.type === 2 || user.type === 3 || user.type === 4) ? false : true);
            $("#damage-modal").modal("show");
        }
    },
    "click #delete": function (e) {
        e.preventDefault();

        deleteDamage(e.target.getAttribute("data-id"));
        $("#damage-modal").modal("hide");
        $("#cause-type-modal > option").removeAttr("selected").filter("[value='null']").attr("selected", "selected");
        $("#cause-modal > option").removeAttr("selected").filter("[value='null']").attr("selected", "selected");
        $("#subcause-modal > option").removeAttr("selected").filter("[value='null']").attr("selected", "selected");
        $("#user-modal > option").removeAttr("selected").filter("[value='null']").attr("selected", "selected");
        $("#note-modal").val("");
    },
    "click #restore": function (e) {
        e.preventDefault();

        restoreDamage(e.target.getAttribute("data-id"), e.target.getAttribute("data-name"));
        $("#damage-modal").modal("hide");
        $("#cause-type-modal > option").removeAttr("selected").filter("[value='null']").attr("selected", "selected");
        $("#cause-modal > option").removeAttr("selected").filter("[value='null']").attr("selected", "selected");
        $("#subcause-modal > option").removeAttr("selected").filter("[value='null']").attr("selected", "selected");
        $("#user-modal > option").removeAttr("selected").filter("[value='null']").attr("selected", "selected");
        $("#note-modal").val("");
    },
    "click #update": function (e) {
        e.preventDefault();

        updateDamage(e.target.getAttribute("data-id"));
        $("#damage-modal").modal("hide");
        $("#cause-type-modal > option").removeAttr("selected").filter("[value='null']").attr("selected", "selected");
        $("#cause-modal > option").removeAttr("selected").filter("[value='null']").attr("selected", "selected");
        $("#subcause-modal > option").removeAttr("selected").filter("[value='null']").attr("selected", "selected");
        $("#user-modal > option").removeAttr("selected").filter("[value='null']").attr("selected", "selected");
        $("#note-modal").val("");
    },
    "click #cancel": function (e) {
        e.preventDefault();

        var user = Session.get("user");
        var damage = Session.get("damage");

        if (user && user.type === 1 && damage && damage.deleted === true) {
            getDeleteDamages();
        }
        $("#damage-modal").modal("hide");
        $("#cause-type-modal > option").removeAttr("selected").filter("[value='null']").attr("selected", "selected");
        $("#cause-modal > option").removeAttr("selected").filter("[value='null']").attr("selected", "selected");
        $("#subcause-modal > option").removeAttr("selected").filter("[value='null']").attr("selected", "selected");
        $("#user-modal > option").removeAttr("selected").filter("[value='null']").attr("selected", "selected");
        $("#note-modal").val("");
    },
    "click #recycle": function (e) {
        e.preventDefault();

        Session.set("hasDeleted", true);

        getDeleteDamages();
    },
    "click [name=\"refresh\"]": function (e, t) {
        e.preventDefault();

        Session.set("hasDeleted", null);

        var user = Session.get("user");

        if (user) {
            Session.set("damages", null);
            Session.set("damage", null);
            Session.set("causes", null);
            Session.set("subcauses", null);
            Session.set("users", null);
            Session.set("damages", null);
            Session.set("from", null);
            Session.set("to", null);
            Session.set("damage_counters", "M:0,H:0,K:0");
            Session.set("descriptionDepartment", null);
            Session.set("descriptionMachine", null);
            Session.set("mttr", 0);
            Session.set("mtbf", 0);
            Session.set("criteria", null);
            $("#header-info").html("");
            getDamages("getDamages", user.id, null);
            $(".datetimepicker").datetimepicker({format: 'YYYY-MM-DD HH:MM:00'});
        }
    },
    "change #cause-type-modal": function (e) {
        e.preventDefault();
        var user = Session.get("user");

        if (user) {
            var type = $("#cause-type-modal option:selected").val();
            var types = [];
            var damage = Session.get("damage");
            var departmentIds = (damage) ? [] : null;

            types.push(type);
            departmentIds.push(damage.department);
            getCause(null, types, departmentIds, (Number(type) !== 3) ? true : false, null);
        }
    },
    "change #cause-modal": function (e) {
        e.preventDefault();
        var user = Session.get("user");
        var type = $("#cause-type-modal option:selected").val();

        Session.set("subcauses", null);
        if (user && Number(type) !== 3) {
            var cause = $("#cause-modal option:selected").val();

            getSubcause(cause);
        }
    },
    "click #export": function (e) {
        e.preventDefault();

        var damages = Session.get("damages");

        if (damages) {
            exportAllContacts(damages);
        }
    }
});
