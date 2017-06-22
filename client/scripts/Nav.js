/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global Session, Meteor, Template */

function getDepartment(userId, userType) {
    if (userType === 4 || userType === 5 ) {
        Meteor.call('getDepartments', userId, function (error, response) {
            try {
                var departments = JSON.parse(response);

                if (departments) {
                    Session.set("nav-departments", departments);
                }
            } catch (error) {
            }
        });
    }
}

Template.Nav.rendered = function () {
    var user = Session.get("user");

    if (user) {
        Session.set("nav-departments", null);
        getDepartment(user.id, user.type);
        activeMenu(user.type);
    } else {
        Router.go("Login");
    }
};

Template.Nav.helpers({
    "navDepartments": function () {
        var departments = Session.get("nav-departments");

        if (departments) {
            var size = departments.length;

            if (size > 1) {
                for (i = 0; i < size - 1; i++) {
                    departments[i].description = departments[i].description + "-";
                }
            }

            return departments;
        }

        return null;
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
    },
    "DAdmin": function () {
        var user = Session.get("user");

        if (user) {
            return (user.type === 4);
        }

        return false;
    },
    "OUser": function () {
        var user = Session.get("user");

        if (user) {
            return (user.type === 5);
        }

        return false;
    }
});

Template.Nav.events({
    "click a.item": function (e) {
        var id = e.target.getAttribute("data-id");

        Session.set("menuId", id);
    }
});
