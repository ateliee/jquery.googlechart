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
            var $this = $(this);
            var id = $(this).data('googleChart.ID');
            if(chartLists[id]){
                var d = chartLists[id];
                googleChart_draw(d.element, d.type, d.options, data);
            }
            return $this;
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
                    callback : callback
                };
            });
        }
    };
    var events = {
        load : function(){
        },
        draw : function(){
        }
    };
    var chart_types = {
        AreaChart : 'corechart',
        PieChart : 'corechart',
        LineChart : 'corechart',
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
            $(d.element).on(event_plex+'load');
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
        }else{
            chart = new google.visualization.AreaChart(element);
        }
        chart.draw(data, options);
        $(element).on(event_plex+'draw');
    }
    var googleChart_draws = function(){
        if(!api_inited){
            return ;
        }
        for(var i in chartLists){
            var d = chartLists[i];
            var data = d.callback.apply(d.element);
            $(d.element).googleChart('draw',data);
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
        googleChartLoad : function() {
            if(!api_inited){
                googleChart_init();
            }
        }
    });
    $(window).resize(googleChart_draws);
}(jQuery));