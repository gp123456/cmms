/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global Template, Session, Router, Meteor, _this */

Template.Pareto.rendered = function () {
    var user = Session.get("user");

    if (user) {
        getPareto(user.id, null);
    } else {
        Router.go("Login");
    }
};
