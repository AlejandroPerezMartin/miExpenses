$(function () {

    // Variable declaration
    var regExps = {
            name: /^[A-z0-9áéíóúñçÁÉÍÓÚÑÇ \-,.]+$/,
            date: /^([0-9]{4}-[0-9]{2}-[0-9]{2})+$/,
            amount: /^(?=.)([+-]?([0-9]*)(\.([0-9]+))?)+$/,
        },
        nameInput = $('#name'),
        dateInput = $('#date'),
        amountInput = $('#amount'),
        categoryInput = $('#category'),
        errors = [];

    // Init
    miExpenses.open(refreshExpenses);
    loadFieldDefaults();

    // Add expense event listener
    $('#addExpense').submit(function (evt) {

        // Avoid page refresh on form submit
        evt.preventDefault();

        // Create expense object
        var expense = {
            name: nameInput.val().trim(),
            date: dateInput.val().trim(),
            amount: amountInput.val().trim(),
            category: categoryInput.val().trim()
        };

        // Validate fields
        if (validateFields()) {
            miExpenses.addExpense(expense, function (expense) {
                $('#addExpenseModal').removeClass("active"); // close modal window after adding expense
                refreshExpenses();
                loadFieldDefaults();
            });
        }
        else {
            console.info("There were errors! Please check your inputs!", errors);
        }
    });

    // Validate fields
    function validateFields() {
        errors = [];

        if (!regExps.name.test(nameInput.val())) {
            errors.push("Please enter a valid name");
        }
        if (!regExps.date.test(dateInput.val())) {
            errors.push("Please enter a valid date");
        }
        if (!regExps.amount.test(amountInput.val())) {
            errors.push("Please enter a valid amount");
        }

        return (errors.length === 0); // = 0, no errors, otherwise there are errors
    }

    // Refresh expenses
    function refreshExpenses() {

        miExpenses.fetchExpenses(function (expenses) {
            var list = $('#expensesList');

            list.empty(); // empty list to refresh it with updated data

            if (expenses.length <= 0) {
                list.append('<p class="align-center">You don\'t have any expense. You are a good saver!</p>');
            }

            for (var i = expenses.length - 1; i >= 0; i--) {
                var expense = expenses[i],
                    deleteButton = $('<button class="btn btn-negative"><i class="fa fa-trash-o fa-lg"></i></button>').attr('data-id', expense.timeStamp),
                    expenseItem = $('<li class="table-view-cell media"><span class="media-object pull-left icon fa fa-' + expense.category + '"></span>' + expense.name + ' - ' + expense.amount + '€ (' + expense.date + ')</li>').append(deleteButton);

                deleteButton.on('click', function (evt) {
                    miExpenses.removeExpense($(this).attr('data-id'), refreshExpenses);
                });

                list.append(expenseItem);
            };

        });
    }

    // Restore
    function loadFieldDefaults() {
        nameInput.val("");
        amountInput.val("");
        var todayDate = new Date();
        dateInput.val(todayDate.getFullYear() + "-" + ("0" + (todayDate.getMonth() + 1)).slice(-2) + "-" + ("0" + (todayDate.getDate())).slice(-2));
    }


    // Get context with jQuery - using jQuery's .get() method.
    var ctx = $("#myChart").get(0).getContext("2d");

    var data = [{
            value: 300,
            color: "#F7464A",
            highlight: "#FF5A5E",
            label: "Red"
        }, {
            value: 50,
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Green"
        }, {
            value: 100,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Yellow"
        }, {
            value: 40,
            color: "#949FB1",
            highlight: "#A8B3C5",
            label: "Grey"
        }, {
            value: 120,
            color: "#4D5360",
            highlight: "#616774",
            label: "Dark Grey"
        }

    ];

    var options = {
        //Boolean - Show a backdrop to the scale label
        scaleShowLabelBackdrop: true,

        //String - The colour of the label backdrop
        scaleBackdropColor: "rgba(255,255,255,0.75)",

        // Boolean - Whether the scale should begin at zero
        scaleBeginAtZero: true,

        //Number - The backdrop padding above & below the label in pixels
        scaleBackdropPaddingY: 2,

        //Number - The backdrop padding to the side of the label in pixels
        scaleBackdropPaddingX: 2,

        //Boolean - Show line for each value in the scale
        scaleShowLine: true,

        //Boolean - Stroke a line around each segment in the chart
        segmentShowStroke: true,

        //String - The colour of the stroke on each segement.
        segmentStrokeColor: "#fff",

        //Number - The width of the stroke value in pixels
        segmentStrokeWidth: 2,

        //Number - Amount of animation steps
        animationSteps: 100,

        //String - Animation easing effect.
        animationEasing: "easeOutBounce",

        //Boolean - Whether to animate the rotation of the chart
        animateRotate: true,

        //Boolean - Whether to animate scaling the chart from the centre
        animateScale: false,

        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

    };
    // This will get the first returned node in the jQuery collection.
    var myNewChart = new Chart(ctx).PolarArea(data, options);

});
