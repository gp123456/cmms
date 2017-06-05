/* global Meteor, Email, Contacts, _, moment */
Meteor.methods({
    "getUser": function (type, damage) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = (type)
                    ? Meteor.settings.backendURL + "/user/type?id=" + type
                    : (damage) ? Meteor.settings.backendURL + "/user/damage?id=" + damage : Meteor.settings.backendURL + "/user/all";
            var response = Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("getUser", error);
        }
    },
    "userUpdate": function (user) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + "/user/update";
            var response = Meteor.wrapAsync(apiCallPost)(apiUrl, user);

            return response;
        } catch (error) {
            console.log("userUpdate", error);
        }
    },
    "recycleDamage": function (damage) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + "/damage/delete?id=" + damage;
            var response = Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("deleteDamage", error);
        }
    },
    "deleteDamage": function (damage) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + "/damage/delete?id=" + damage;
            var response = Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("deleteDamage", error);
        }
    },
    "restoreDamage": function (damage) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + "/damage/restore?id=" + damage;
            var response = Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("restoreDamage", error);
        }
    },
    "updateDamage": function (damage) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + "/damage/update";
            var response = Meteor.wrapAsync(apiCallPost)(apiUrl, damage);

            return response;
        } catch (error) {
            console.log("updateDamage", error);
        }
    },
    "insertDamage": function (damage) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + "/damage/insert";
            var response = Meteor.wrapAsync(apiCallPost)(apiUrl, damage);

            return response;
        } catch (error) {
            console.log("updateDamage", error);
        }
    },
    "addUser": function (user) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + "/user/create";
            var response = Meteor.wrapAsync(apiCallPost)(apiUrl, user);

            return response;
        } catch (error) {
            console.log("userAdd", error);
        }
    },
    "loginUser": function (username, password) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + "/user/login?username=" + username + "&password=" + password;
            var response = Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("loginUser", error);
        }
    },
    "getDepartments": function (user) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + "/department/user?id=" + user;
            var response = Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("getDepartments", error);
        }
    },
    "getUserType": function () {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + "/usertype/all";
            var response = Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("getUserType", error);
        }
    },
    "overviewDepartment": function (user) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + "/overview/department?userId=" + user;
            var response = Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("overviewDepartment", error);
        }
    },
    "overviewMachine": function (department, user) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + "/overview/machine?departmentId=" + department + "&userId=" + user;
            var response = Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("overviewMachine", error);
        }
    },
    "getDamages": function (user, machine, department, criteria) {
        var self = this;
        self.unblock();
        
        try {
            var apiUrl = (criteria)
                    ? Meteor.settings.backendURL + "/damage/filter"
                    : (machine)
                    ? Meteor.settings.backendURL + "/damage/machine?id=" + machine
                    : (department)
                    ? Meteor.settings.backendURL + "/damage/department?id=" + department
                    : Meteor.settings.backendURL + "/damage/user?id=" + user;
            var response = (criteria) ? Meteor.wrapAsync(apiCallPost)(apiUrl, criteria) : Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("getDamages", error);
        }
    },
    "getDamage": function (id) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + "/damage?id=" + id;
            var response = Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("getDamage", error);
        }
    },
    "getCauseType": function (ids) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = (ids) ? Meteor.settings.backendURL + "/causetype?id=" + ids : Meteor.settings.backendURL + "/causetype/all";
            var response = Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("getCauseType", error);
        }
    },
    "getMachine": function (user, department) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = (department)
                    ? Meteor.settings.backendURL + "/machine/department?id=" + department
                    : apiUrl = Meteor.settings.backendURL + "/machine/user?id=" + user;
            var response = Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("getMachine", error);
        }
    },
    "getCause": function (user, department, type, damage) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = 
                    (type && department)
                    ? Meteor.settings.backendURL + "/cause/type-department?type=" + type + "&department=" + department
                    : (department)
                    ? apiUrl = Meteor.settings.backendURL + "/cause/department?id=" + department
                    : (type && user)
                    ? apiUrl = Meteor.settings.backendURL + "/cause/type-user?type=" + type + "&user=" + user
                    : (type)
                    ? Meteor.settings.backendURL + "/cause/type?id=" + type
                    : (user)
                    ? Meteor.settings.backendURL + "/cause/user?id=" + user
                    : (damage)
                    ? Meteor.settings.backendURL + "/cause/damage?id=" + damage
                    : Meteor.settings.backendURL + "/cause/all";
            var response = Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("getCause", error);
        }
    },
    "getSubcause": function (cause) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + "/subcause/cause?id=" + cause;

            var response = (apiUrl) ? Meteor.wrapAsync(apiCallGet)(apiUrl) : null;

            return response;
        } catch (error) {
            console.log("getSubcause", error);
        }
    },
    "getCompleteCause": function (refCause) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + ((refCause) ? "/cause/insert" : "/cause/complete");
            var response = (refCause) ? Meteor.wrapAsync(apiCallPost)(apiUrl, refCause) : Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("getCompleteCause", error);
        }
    },
    "insertCause": function (refCause) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + "/cause/insert-first";
            var response = Meteor.wrapAsync(apiCallPost)(apiUrl, refCause);

            return response;
        } catch (error) {
            console.log("getCompleteCause", error);
        }
    },
    "deleteCause": function (id) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + "/cause/delete?id=" +id;
            var response = Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("deleteCause", error);
        }
    },
    "deleteSubcause": function (id) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = Meteor.settings.backendURL + "/subcause/delete?id=" +id;
            var response = Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("deleteSubcause", error);
        }
    },
    "getPareto": function (user, machine, department, criteria) {
        var self = this;
        self.unblock();

        try {
            var apiUrl = (criteria)
                    ? Meteor.settings.backendURL + "/damage/pareto/filter"
                    : (machine)
                    ? Meteor.settings.backendURL + "/damage/pareto/machine?id=" + machine
                    : (department)
                    ? Meteor.settings.backendURL + "/damage/pareto/departmentId?id=" + department
                    : Meteor.settings.backendURL + "/damage/pareto/department?user=" + user;
            var response = (criteria) ? Meteor.wrapAsync(apiCallPost)(apiUrl, criteria) : Meteor.wrapAsync(apiCallGet)(apiUrl);

            return response;
        } catch (error) {
            console.log("getPareto", error);
        }
    },
    exportAllContacts: function () {
        var fields = [
            "Name",
            "Gender",
            "Date of Affiliation",
            "Country",
            "City"
        ];

        var data = [];

        var contacts = Contacts.find().fetch();
        _.each(contacts, function (c) {
            data.push([
                c.name,
                c.gender,
                moment.utc(c.createdAt).format("DD/MM/YYYY"),
                c.address.country,
                c.address.city
            ]);
        });

        return {fields: fields, data: data};
    },
    exportContact: function (id) {
        var fields = [
            "Name",
            "Gender",
            "Date of Affiliation",
            "Country",
            "City"
        ];

        var data = [];

        var c = Contacts.findOne(id);
        data.push([
            c.name,
            c.gender,
            moment.utc(c.createdAt).format("DD/MM/YYYY"),
            c.address.country,
            c.address.city
        ]);

        return {fields: fields, data: data};
    }
});

apiCallGet = function (apiUrl, callback) {
    // try…catch allows you to handle errors
    try {
        console.log("*** API CALL URL: " + apiUrl);
        var response = HTTP.get(apiUrl, {timeout: Meteor.settings.restApiTimeout});

        // A successful API call returns no error
        // but the contents from the JSON response
        callback(null, response.content);
    } catch (error) {
        // If the API responded with an error message and a payload
        if (error.response) {
            var errorCode = error.response.data.code;
            var errorMessage = error.response.data.message;
            // Otherwise use a generic error message
        } else {
            var errorCode = 500;
            var errorMessage = "Cannot access the API";
        }
        // Create an Error object and return it via callback
        var myError = new Meteor.Error(errorCode, errorMessage);
        callback(myError, null);
    }
};

apiCallPost = function (apiUrl, data, callback) {
    try {
        console.log("*** API CALL URL: " + apiUrl + ", data:" + data);
        Meteor.http.call("POST", apiUrl,
                {
                    data: data,
                    headers: {"content-type": "application/json"}
                },
                function (error, result) {
                    if (error) {
                        console.log(error);
                    } else {
                        callback(null, result.content);
                    }
                });
    } catch (error) {
        // If the API responded with an error message and a payload
        if (error.response) {
            var errorCode = error.response.data.code;
            var errorMessage = error.response.data.message;
            // Otherwise use a generic error message
        } else {
            var errorCode = 500;
            var errorMessage = "Cannot access the API";
        }
        // Create an Error object and return it via callback
        var myError = new Meteor.Error(errorCode, errorMessage);
        callback(myError, null);
    }
};

apiCallSimplePost = function (apiUrl, callback) {
    try {
        Meteor.http.call("POST", apiUrl, function (error, result) {
            if (error) {
                console.log(error);
            } else {
                callback(null, result.content);
            }
        });

    } catch (error) {
        // If the API responded with an error message and a payload
        if (error.response) {
            var errorCode = error.response.data.code;
            var errorMessage = error.response.data.message;
            // Otherwise use a generic error message
        } else {
            var errorCode = 500;
            var errorMessage = "Cannot access the API";
        }
        // Create an Error object and return it via callback
        var myError = new Meteor.Error(errorCode, errorMessage);
        callback(myError, null);
    }
};

apiCallGetHeaders = function (apiUrl, callback) {
    // try…catch allows you to handle errors
    try {
        console.log("*** API CALL AND HEADERS URL: " + apiUrl);
        var response = HTTP.get(apiUrl, {timeout: Meteor.settings.restApiTimeout});
        // A successful API call returns no error
        // but the contents from the JSON response
        callback(null, response);
    } catch (error) {
        // If the API responded with an error message and a payload
        if (error.response) {
            var errorCode = error.response.data.code;

            var errorMessage = error.response.data.message;
            // Otherwise use a generic error message
        } else {
            var errorCode = 500;
            var errorMessage = "Cannot access the API";
        }
        // Create an Error object and return it via callback
        var myError = new Meteor.Error(errorCode, errorMessage);
        callback(myError, null);
    }
};
