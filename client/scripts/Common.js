/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global Session, Meteor, Router, Papa, Excel*/

getDepartments = function getDepartments(userId) {
    Meteor.call('getDepartments', userId, function (error, response) {
        try {
            var departments = JSON.parse(response);

            if (departments) {
                Session.set("departments", departments);
            }
        } catch (error) {
        }
    });
};

getCauseType = function getCauseType(ids) {
    Meteor.call('getCauseType', ids, function (error, response) {
        try {
            var types = JSON.parse(response);

            if (types) {
                Session.set("types", types);
            }
        } catch (error) {
        }
    });
};

getCause = function getCause(userId, type, department, subcause, damage) {
    Meteor.call('getCause', userId, department, type, damage, function (error, response) {
        try {
            var causes = JSON.parse(response);
            var ids = [];

            if (causes) {
                Session.set("causes", causes);

                causes.forEach(function (cause) {
                    ids.push(cause.id);
                });

                if (subcause) {
                    getSubcause(ids);
                }
            } else {
                alert(response);
            }
        } catch (error) {
        }
    });
};

getSubcause = function getSubcause(cause) {
    Meteor.call('getSubcause', cause, function (error, response) {
        try {
            var subcauses = JSON.parse(response);

            if (subcauses) {
                Session.set("subcauses", subcauses);
            }
        } catch (error) {
        }
    });
};

getMachine = function getMachine(userId, department) {
    Meteor.call('getMachine', userId, department, function (error, response) {
        try {
            var machines = JSON.parse(response);

            if (machines) {
                Session.set("machines", machines);
            }
        } catch (error) {
        }
    });
};

getUser = function getUser(type, damage) {
    Meteor.call('getUser', type, damage, function (error, response) {
        try {
            var users = JSON.parse(response);

            if (users) {
                Session.set("users", users);
            }
        } catch (error) {
        }
    });
};

//function clickFilter() {
//    $('.filterable .btn-filter').click(function () {
//        var $panel = $(this).parents('.filterable'),
//                $filters = $panel.find('.filters input'),
//                $tbody = $panel.find('.table tbody');
//        if ($filters.prop('disabled') == true) {
//            $filters.prop('disabled', false);
//            $filters.first().focus();
//        } else {
//            $filters.val('').prop('disabled', true);
//            $tbody.find('.no-result').remove();
//            $tbody.find('tr').show();
//        }
//    });
//
//    $('.filterable .filters input').keyup(function (e) {
//        /* Ignore tab key */
//        var code = e.keyCode || e.which;
//        if (code == '9')
//            return;
//        /* Useful DOM data and selectors */
//        var $input = $(this),
//                inputContent = $input.val().toLowerCase(),
//                $panel = $input.parents('.filterable'),
//                column = $panel.find('.filters th').index($input.parents('th')),
//                $table = $panel.find('.table'),
//                $rows = $table.find('tbody tr');
//        /* Dirtiest filter function ever ;) */
//        var $filteredRows = $rows.filter(function () {
//            var value = $(this).find('td').eq(column).text().toLowerCase();
//            return value.indexOf(inputContent) === -1;
//        });
//        /* Clean previous no-result if exist */
//        $table.find('tbody .no-result').remove();
//        /* Show all rows, hide filtered ones (never do that outside of a demo ! xD) */
//        $rows.show();
//        $filteredRows.hide();
//        /* Prepend no-result row if all rows are filtered */
//        if ($filteredRows.length === $rows.length) {
//            $table.find('tbody').prepend($('<tr class="no-result text-center"><td colspan="' + $table.find('.filters th').length + '">No result found</td></tr>'));
//        }
//    });
//}

initDatePicker = function initDatePicker(id) {
    id.datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        calendarWeeks: true,
        todayHighlight: true
    });
//    id.datetimepicker();
};

initMultiselect = function initMultiselect(id, nonSelectedText, buttonWidth) {
    id.multiselect({
        buttonWidth: buttonWidth,
        includeSelectAllOption: true,
        disableIfEmpty: true,
        nonSelectedText: nonSelectedText
    });
};

getDamages = function getDamages(userId, criteria) {
    Meteor.call(
            'getDamages',
            userId,
            Router.current().params.query.machineId,
            Router.current().params.query.departmentId,
            criteria,
            function (error, response) {
                try {
                    $('#table-damage').bootstrapTable("destroy");
                    if (response) {
                        var damages = JSON.parse(response);

                        if (damages) {
                            Session.set("damages", damages);
                            damages.forEach(function (damage) {
                                if (damage.type !== 3) {
                                    damage.created = "<a id='damage-view' data-id='" + damage.id + "'>" +
                                            moment(damage.created).format("YYYY-MM-DD HH:mm:ss") + "</a>";
                                } else {
                                    damage.created = moment(damage.created).format("YYYY-MM-DD HH:mm:ss");
                                }
                                damage.minuteDuration = damage.minuteDuration + "΄";
                            });

                            $("#table-damage").bootstrapTable({data: damages});
                        }
                    }
                } catch (error) {
                }
            })
}

var json2csv = require('json2csv');

exportAllContacts = function exportAllContacts(damages) {
    var data = [];
    var fields = ["Ημερομηνία", "Τύπος", "Τμήμα", "Μηχανή", "Χρήστης", "Αιτία", "Δευτερεύουσα Αιτία", "Διάρκεια", "Σχόλιο"];
    damages.forEach(function (damage) {
        data.push({
            "Ημερομηνία": damage.created,
            "Τύπος": damage.descriptionType,
            "Τμήμα": damage.descriptionDepartment,
            "Μηχανή": damage.descriptionMachine,
            "Χρήστης": damage.descriptionUser,
            "Αιτία": damage.descriptionCause,
            "Δευτερεύουσα Αιτία": damage.descriptionSubcause,
            "Διάρκεια": damage.duration,
            "Σχόλιο": damage.note
        });
    });

    try {
        var csv = "\"sep=,\"\n" + json2csv({data: data, fields: fields});

        console.log(csv);

    } catch (err) {
        console.error(err);
    }

    _downloadCSV(csv);
};

function  _downloadCSV(csv) {
    var blob = new Blob([csv], {type: 'application/x-ms-excel'});

    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, "damage.xls");
    } else {
        var a = window.document.createElement("a");

        a.href = window.URL.createObjectURL(blob);
        a.download = "damage.xls";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

activeMenu = function activeMenu(userType) {
    var menuId = Session.get("menuId");

    if (menuId) {
        var menuCount = (userType === 1) ? 5 : ((userType === 2 || userType === 3 || userType === 4 || userType === 5) ? 4 : 0);

        for (var i = 1; i <= menuCount; i++) {
            $("#menu-" + i).removeClass($("#menu-" + i).attr("class")).addClass("item");
        }

        $("#menu-" + menuId).removeClass("item").addClass("active item");
        $("#menu-" + menuId).css("background-color", "rgba(0,0,0,0.2");
    } else {
        $("#menu-1").removeClass("item").addClass("active item");
        $("#menu-1").css("background-color", "rgba(0,0,0,0.2");
    }
}

awesomeChartClear = function awesomeChartClear(canvasElementId) {
    var canvas = (typeof canvasElementId === 'string') ? document.getElementById(canvasElementId) : canvasElementId;
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function awesomeChartDraw(name, type, title, labels, data) {
    var chart13 = new AwesomeChart(name);
    chart13.chartType = type;
    chart13.title = title;
    chart13.labels = labels;
    chart13.data = data;
    chart13.draw();
}

getPareto = function getPareto(userId, criteria) {
    var FusionCharts = require("fusioncharts");
    require("fusioncharts/fusioncharts.charts")(FusionCharts);
    require("fusioncharts/themes/fusioncharts.theme.ocean")(FusionCharts);

    Meteor.call(
            'getPareto',
            userId,
            Router.current().params.query.machineId,
            Router.current().params.query.departmentId,
            criteria,
            function (error, response) {
                try {
                    if (response) {
                        var info = JSON.parse(response);
                        
                        console.log(info);
                        
                        if (info) {
                            var categories = [];
                            var delays = [];
                            var percents = [];

                            info.paretos.forEach(function (pareto) {
                                if (pareto.label) {
                                    categories.push({"label": pareto.label});
                                    delays.push({"value": pareto.delay});
                                    percents.push({"value": pareto.percent});
                                }
                            });

                            new FusionCharts({
                                "type": "mscolumnline3d",
                                "width": "1300",
                                "height": "800",
                                "dataFormat": "json",
                                "dataSource": {
                                    "chart": {
                                        "showvalues": "0",
                                        "caption": "Pareto Analysis",
                                        "subcaption":
                                                "Περίοδος: " +
                                                criteria.from +
                                                " - " +
                                                criteria.to +
                                                " - MTTR(ώρες): " +
                                                info.mttr +
                                                " - MTTBF(ώρες): " +
                                                info.mtbf,
                                        "numberprefix": "",
                                        "yaxisname": "Ώρες καθυστέρησης",
                                        "showborder": "0",
                                        "bgcolor": "#ffffff",
                                        "canvasbgcolor": "#ffffff",
                                        "captionfontsize": "18",
                                        "subcaptionfontsize": "14",
                                        "subcaptionfontbold": "0",
                                        "divlinecolor": "#999999",
                                        "divlineisdashed": "1",
                                        "divlinedashlen": "1",
                                        "divlinegaplen": "1",
                                        "tooltipcolor": "#ffffff",
                                        "tooltipborderthickness": "0",
                                        "tooltipbgcolor": "#000000",
                                        "tooltipbgalpha": "80",
                                        "tooltipborderradius": "2",
                                        "tooltippadding": "5",
                                        "legendbgcolor": "#ffffff",
                                        "legendborderalpha": "0",
                                        "legendshadow": "0",
                                        "legenditemfontsize": "10",
                                        "legenditemfontcolor": "#666666",
                                        "exportEnabled": "1",
                                        "exportAtClientSide": "1",
                                        "labelDisplay": "auto"
                                    },
                                    "categories": [{"category": categories}],
                                    "dataset": [
                                        {"seriesname": "Ώρες καθυστέρησης", "showvalues": "1", "data": delays},
                                        {"seriesname": "Ποσοστό επί του συνόλου", "renderas": "Line", "showvalues": "1", "data": percents}
                                    ]
                                }
                            }).render("chartContainer");
                        }
                    }
                } catch (error) {

                }
            });
}

clearSession = function clearSession() {
    // your cleanup code here
    Object.keys(Session.keys).forEach(function (key) {
        Session.set(key, undefined);
    });
    Session.keys = {}; // remove session keys
}
