/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global Template*/

Template.Header.helpers({
    "name": function () {

        var user = Session.get("user");

        if (user !== null) {
            return user.name;
        }

        return null;
    },
    "date": function () {
        var user = Session.get("user");

        if (user !== null) {
            return user.lastLogin;
        }
        
        return null;
    }
});