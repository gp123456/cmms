Router.configure({
    layoutTemplate: 'Layout',
    loadingTemplate: 'Loading',
    notFoundTemplate: 'notFound'
});

Router.route("/", {
    name: "Login"
});

Router.route("/register", {
    name: "Register"
});

Router.route("/home", {
    name: "Home"
});

Router.route("/logout", {
    name: "Logout"
});

Router.route("/search-damage", {
    name: "SearchDamage"
});

Router.route("/pareto", {
    name: "Pareto"
});

Router.route("/insert-department", {
    name: "InsertDepartment"
});

Router.route("/insert-machine", {
    name: "InsertMachine"
});

Router.route("/insert-cause", {
    name: "InsertCause"
});

Router.route("/insert-damage", {
    name: "InsertDamage"
});

Router.route("/insert-refdamage", {
    name: "InsertRefDamage"
});
