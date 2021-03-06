LiveChart = function (id, datasets) {
    var i, j, item, ctx, chartOptions, datasetOptions, chartDataOptions;

    this._queueSize = 50;

    chartOptions = {
        animation   : false,
        showTooltips: false,
        responsive  : true,
        //showScale   : false,
        pointDot    : false
    };

    datasetOptions = {
        fillColor           : "rgba(0,0,0,0)",
        pointColor          : "rgba(220,220,220,1)",
        pointStrokeColor    : "#fff",
        pointHighlightFill  : "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data                : []
    };

    for (item in datasets) {
        if (datasets.hasOwnProperty(item)) {
            datasets[item] = $.extend({}, datasetOptions, datasets[item]);
        }
    }

    chartDataOptions = {
        labels  : [],
        datasets: datasets
    };

    for (i = 0; i < this._queueSize; i = i + 1) {
        chartDataOptions.labels[i] = "";
        for (j = 0; j < chartDataOptions.datasets.length; j = j + 1) {
            chartDataOptions.datasets[j].data[i] = 0;
        }
    }

    // Get element by ID
    ctx = document.getElementById(id).getContext("2d");

    this._chart = new Chart(ctx).Line(chartDataOptions, chartOptions);
};

LiveChart.prototype.push = function (data) {
    var i, j;

    for (i = 0; i < this._chart.datasets.length; i = i + 1) {
        for (j = 0; j < this._queueSize - 1; j = j + 1) {
            this._chart.datasets[i].points[j].value = this._chart.datasets[i].points[j + 1].value;
        }
        this._chart.datasets[i].points[this._queueSize - 1].value = data[i];
    }
    this._chart.update();
};