/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global Meteor, Session, Template, Router */

function overviewDepartment(user) {
    Meteor.call('overviewDepartment', user, function (error, response) {
        try {
            var departments = JSON.parse(response);

            if (departments) {
                departments.forEach(function (department) {
                    $("#department-menu-" + department.id).metisMenu();
                    department.search = "search-damage?departmentId=" + department.id;
                    department.pareto = "pareto?departmentId=" + department.id;
                });
                Session.set("homeDepartments", departments);
            }
        } catch (error) {
        }
    })
}

function overviewMachine(department, user) {
    Meteor.call('overviewMachine', department, user, function (error, response) {
        try {
            var machines = JSON.parse(response);

            if (machines) {
                machines.forEach(function (machine) {
                    $("#machine-menu-" + machine.id).metisMenu();
                    machine.search = "search-damage?machineId=" + machine.id;
                    machine.pareto = "pareto?machineId=" + machine.id;
                });
                Session.set("homeMachines", machines);
            }
        } catch (error) {
        }
    })
}

Template.Home.rendered = function () {
    var user = Session.get("user");

    if (user) {
        if (user.type === 5) {
            Router.go("InsertDamage");
        } else {
            Session.set("homeDepartments", null);
            Session.set("homeMachines", null);
            overviewDepartment(user.id);
        }
    } else {
        Router.go("Login");
    }
};

Template.Home.helpers({
    "homeDepartments": function () {
        var departments = Session.get("homeDepartments");

        if (departments) {
            return departments;
        }

        return null;
    },
    "machines": function () {
        var machines = Session.get("homeMachines");

        if (machines) {
            return machines;
        }

        return null;
    },
    "PAdmin": function () {
        var user = Session.get("user");

        if (user) {
            return (user.type === 1);
        }

        return false;
    }
});

Template.Home.events({
    "click #department": function (e) {
        var department = e.target.getAttribute("data-id");
        var user = Session.get("user");

        $("div[data-id='" + Session.get("prev-department", department) + "']").attr("class", "btn");
        $("div[data-id='" + department + "']").attr("class", "btn btn-primary");
        Session.set("homeMachines", null);
        Session.set("prev-department", department);
        overviewMachine(department, user.id);
    },
    "click #department1": function (e) {
        var department = e.target.getAttribute("data-id");

        if ($("#department-menu-" + department).css("display") === "none") {
            $("#department-menu-" + department).show();
        } else {
            $("#department-menu-" + department).hide();
        }
    },
    "click #machine": function (e) {
        var id = e.target.getAttribute("data-id");


        if ($("#machine-menu-" + id).css("display") === "none") {
            $("#machine-menu-" + id).show();
        } else {
            $("#machine-menu-" + id).hide();
        }
    },
    "click a.item": function (e) {
        var id = e.target.getAttribute("data-id");

        Session.set("menuId", id);
    }
});
