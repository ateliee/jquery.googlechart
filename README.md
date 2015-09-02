
# google chart for jQuery plugin

## Description
[google chart](https://developers.google.com/chart/) use jQuery.
this plugin will resize your chart if the browser changes size, along with providing the perfect scale granularity for that size.

## support
* AreaChart
* PieChart
* LineChart
* ColumnChart
* Line

## how to use
```
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript" src="/jquery.googlechart/js/jquery.googlechart.js"></script>
<script type="text/javascript">
    (function(){
        $('#sample').googleChart('LineChart',{
            // google chart option
            title: 'Company Performance',
            curveType: 'function',
            legend: { position: 'bottom' }
        },function(elm){
            // data return 
            return google.visualization.arrayToDataTable([
                             ['Year', 'Sales', 'Expenses'],
                             ['2004',  1000,      400],
                             ['2005',  1170,      460],
                             ['2006',  660,       1120],
                             ['2007',  1030,      540]
                           ]);
        });
        // on event
        $('#sample').on('googleChart.init',function(){
        });
        // method
        $('#sample').googleChart('init');
    }($));
    // load packages
    googleChartLoad();
</script>
```

## event
* googleChart.load
* googleChart.draw

## method
* draw
* reload
