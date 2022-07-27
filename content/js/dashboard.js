/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9666666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://hruat.programming-hero.com/api/v1/extra-work/extra-work?startIndex=0&limit=10&search=&teamName=19"], "isController": false}, {"data": [1.0, 500, 1500, "https://hruat.programming-hero.com/api/v1/expense?startIndex=15"], "isController": false}, {"data": [1.0, 500, 1500, "https://hruat.programming-hero.com/api/v1/expense/detail/undefined"], "isController": false}, {"data": [1.0, 500, 1500, "https://hruat.programming-hero.com/api/v1/extra-work/extra-work?startIndex=0&limit=10&search=&teamName=17"], "isController": false}, {"data": [1.0, 500, 1500, "https://hruat.programming-hero.com/api/v1/extra-work/extra-work?startIndex=0&limit=10&search=&teamName=15"], "isController": false}, {"data": [1.0, 500, 1500, "https://hruat.programming-hero.com/api/v1/expense/status-count"], "isController": false}, {"data": [1.0, 500, 1500, "https://hruat.programming-hero.com/api/v1/extra-work/extra-work?startIndex=0&limit=10&search=&teamName=20"], "isController": false}, {"data": [1.0, 500, 1500, "https://hruat.programming-hero.com/api/v1/extra-work/extra-work?startIndex=0&limit=10&search=&teamName=null"], "isController": false}, {"data": [1.0, 500, 1500, "https://hruat.programming-hero.com/api/v1/extra-work/extra-work?startIndex=0&limit=10&search=&teamName="], "isController": false}, {"data": [0.5, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "https://hruat.programming-hero.com/api/v1/extra-work/extra-work?startIndex=0&limit=10&search=&teamName=1"], "isController": false}, {"data": [1.0, 500, 1500, "https://hruat.programming-hero.com/api/v1/team"], "isController": false}, {"data": [1.0, 500, 1500, "https://hruat.programming-hero.com/api/v1/expense?startIndex=0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 280, 0, 0.0, 71.4678571428571, 54, 359, 62.0, 74.0, 167.95, 195.95, 26.76352513859683, 51.15238482125789, 27.728699698910344], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://hruat.programming-hero.com/api/v1/extra-work/extra-work?startIndex=0&limit=10&search=&teamName=19", 20, 0, 0.0, 63.05, 56, 71, 62.0, 70.9, 71.0, 71.0, 2.1482277121374866, 4.944699919441461, 2.2531216433942], "isController": false}, {"data": ["https://hruat.programming-hero.com/api/v1/expense?startIndex=15", 20, 0, 0.0, 66.85000000000001, 58, 85, 65.5, 78.80000000000001, 84.69999999999999, 85.0, 2.148920167615773, 13.756027049532609, 2.1657086064252713], "isController": false}, {"data": ["https://hruat.programming-hero.com/api/v1/expense/detail/undefined", 20, 0, 0.0, 61.300000000000004, 55, 74, 60.0, 69.80000000000001, 73.8, 74.0, 2.149151085321298, 0.6338316677412422, 2.172237669245648], "isController": false}, {"data": ["https://hruat.programming-hero.com/api/v1/extra-work/extra-work?startIndex=0&limit=10&search=&teamName=17", 20, 0, 0.0, 62.75000000000001, 56, 85, 61.0, 73.50000000000001, 84.44999999999999, 85.0, 2.1496130696474633, 0.6696548527515047, 2.2545746453138436], "isController": false}, {"data": ["https://hruat.programming-hero.com/api/v1/extra-work/extra-work?startIndex=0&limit=10&search=&teamName=15", 20, 0, 0.0, 61.64999999999999, 56, 69, 62.0, 67.80000000000001, 68.95, 69.0, 2.1482277121374866, 0.6692232814178303, 2.2531216433942], "isController": false}, {"data": ["https://hruat.programming-hero.com/api/v1/expense/status-count", 20, 0, 0.0, 63.15, 57, 68, 63.0, 68.0, 68.0, 68.0, 2.1486892995272884, 0.7616935700472712, 2.163377605285776], "isController": false}, {"data": ["https://hruat.programming-hero.com/api/v1/extra-work/extra-work?startIndex=0&limit=10&search=&teamName=20", 20, 0, 0.0, 61.9, 57, 71, 62.0, 67.9, 70.85, 71.0, 2.149151085321298, 3.576321727917473, 2.2540901031592524], "isController": false}, {"data": ["https://hruat.programming-hero.com/api/v1/extra-work/extra-work?startIndex=0&limit=10&search=&teamName=null", 20, 0, 0.0, 61.25, 55, 69, 61.0, 66.9, 68.9, 69.0, 2.147074610842727, 0.6688640633387011, 2.256105743424584], "isController": false}, {"data": ["https://hruat.programming-hero.com/api/v1/extra-work/extra-work?startIndex=0&limit=10&search=&teamName=", 20, 0, 0.0, 63.95, 56, 83, 62.0, 72.9, 82.5, 83.0, 2.1447721179624666, 7.6449396782841825, 2.245308310991957], "isController": false}, {"data": ["Test", 20, 0, 0.0, 1000.55, 923, 1212, 993.0, 1096.6000000000001, 1206.3, 1212.0, 1.9042178425211844, 50.95270398933638, 27.62045665524136], "isController": true}, {"data": ["https://hruat.programming-hero.com/api/v1/extra-work/extra-work?startIndex=0&limit=10&search=&teamName=1", 40, 0, 0.0, 62.225, 56, 74, 61.0, 70.8, 72.89999999999999, 74.0, 4.148947204646821, 3.188692822321336, 4.452825173737164], "isController": false}, {"data": ["https://hruat.programming-hero.com/api/v1/team", 40, 0, 0.0, 122.70000000000002, 54, 359, 114.5, 193.8, 199.74999999999997, 359.0, 3.847633705271258, 6.150953491727587, 3.911510436706425], "isController": false}, {"data": ["https://hruat.programming-hero.com/api/v1/expense?startIndex=0", 20, 0, 0.0, 64.85, 59, 75, 63.5, 73.7, 74.95, 75.0, 2.1468441391155, 13.97125912408759, 2.161519831472735], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 280, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
