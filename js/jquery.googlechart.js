/**
 * google chart for jQuery plugin.
 *
 * @param type
 * @param options(google chart options)
 * @param callback(return data value)
 */
(function($){
    // google api
    var api_inited = false;
    var api_version = '1.1';
    var api_packages = [];
    // element data
    var chartLists = {};
    var event_plex = 'googleChart.';

    var methods = {
        draw : function(data) {
            if(!data){
                $.error('Method draw does not data on jQuery.googleChart');
            }
            var $this = $(this);
            var id = $(this).data('googleChart.ID');
            if(chartLists[id]){
                var d = chartLists[id];
                d.data = data;
                googleChart_draw(d.element, d.type, d.options, data);
            }
            return $this;
        },
        reload : function() {
            var $this = $(this);
            var id = $(this).data('googleChart.ID');
            if(chartLists[id]){
                var d = chartLists[id];
                $this.googleChart('draw', d.callback.apply(d.element));
            }
            return $this;
        },
        chart: function() {
            var $this = $(this);
            var id = $(this).data('googleChart.ID');
            if(chartLists[id]) {
                var d = chartLists[id];
                return d.chart;
            }
            return null;
        },
        type: function(opts) {
            var $this = $(this);
            var id = $(this).data('googleChart.ID');
            if (typeof opts === 'undefined') {
                if(chartLists[id]) {
                    var d = chartLists[id];
                    return d.type;
                }
                return null;
            } else {
                if(chartLists[id]) {
                    var d = chartLists[id];
                    d.type = opts;
                }
            }
        },
        options: function(opts) {
            var $this = $(this);
            var id = $(this).data('googleChart.ID');
            if (typeof opts === 'undefined') {
                if(chartLists[id]) {
                    var d = chartLists[id];
                    return d.options;
                }
                return null;
            } else {
                if(chartLists[id]) {
                    var d = chartLists[id];
                    d.options = opts;
                }
            }
        },
        init: function(type,options,callback){
            var $self = $.fn.googleChart;
            var $this = $(this);

            if(typeof callback === 'undefined'){
                $.error( 'Method ' +  method + ' does not callback exist on jQuery.googleChart' );
            }
            for(var i in events){
                this.on(event_plex+i,events[i]);
            }

            api_packages.push(googleChart_typeToPackages(type));
            api_packages = $.unique(api_packages);

            return this.each(function() {
                var uid = Math.floor(Math.random()*1000);
                $(this).data('googleChart.ID',uid);
                var opts = $.extend(true, {}, options);
                chartLists[uid] = {
                    element: this,
                    type : type,
                    options : opts,
                    callback : callback,
                    data: null,
                    chart: null
                };
            });
        }
    };
    var events = {
        load:function(){},
        draw:function(){},
        init:function(){}
    };
    var chart_types = {
        AreaChart : 'corechart',
        PieChart : 'corechart',
        LineChart : 'corechart',
        ColumnChart : 'corechart',
        Line: 'line',
        GeoChart : 'geochart'
    };
    $.fn.googleChart = function(method,options) {
        // method call
        if ( methods[method] ) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            //} else if ( typeof method === 'object' || ! method ) {
        }else if(method && options){
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.googleChart' );
        }
    };

    var googleChart_onLoad = function(){
        for(var i in chartLists){
            var d = chartLists[i];
            $(d.element).trigger(event_plex+'load');
        }
        googleChart_draws();
    };
    var googleChart_draw = function(element,type,options,data){
        var chart = null;
        if(type == 'AreaChart') {
            chart = new google.visualization.AreaChart(element);
        }else if(type == 'PieChart'){
            chart = new google.visualization.PieChart(element);
        }else if(type == 'LineChart'){
            chart = new google.visualization.LineChart(element);
        }else if(type == 'ColumnChart'){
            chart = new google.visualization.ColumnChart(element);
        }else if(type == 'Line'){
            chart = new google.charts.Line(element);
        }else{
            $.error( 'unsupport '+type+' on jQuery.googleChart' );
        }
        var id = $(element).data('googleChart.ID');
        if(chartLists[id]) {
            var d = chartLists[id];
            d.chart = chart;
        }
        $(element).trigger(event_plex+'init');
        chart.draw(data, options);
        $(element).trigger(event_plex+'draw');
    }
    var googleChart_draws = function(){
        if(!api_inited){
            return ;
        }
        for(var i in chartLists){
            var d = chartLists[i];
            $(d.element).googleChart('reload');
        }
    };
    var googleChart_init = function(){
        if(api_packages.length && !api_inited){
            google.load("visualization", api_version, {packages:api_packages});
            google.setOnLoadCallback(googleChart_onLoad);
            api_inited = true;
        }
    };
    var googleChart_typeToPackages = function(type){
        if(chart_types[type]){
            return chart_types[type];
        }
        // default
        return 'corechart';
    }

    jQuery.extend({
        googleChartLoad : function(packages) {
            if(typeof packages !== 'undefined'){
                $.extend(api_packages,packages);
            }
            if(!api_inited){
                googleChart_init();
            }
        }
    });
    $(window).resize(googleChart_draws);
}(jQuery));