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

    var data = {"OkPercent": 67.44087555446582, "KoPercent": 32.55912444553418};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.008994048547801083, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03333333333333333, 500, 1500, "8_3_View Notifications"], "isController": false}, {"data": [0.006024096385542169, 500, 1500, "5_6_Enter OTP -> Continue"], "isController": false}, {"data": [0.01764705882352941, 500, 1500, "5_4_Click Add Beneficiary"], "isController": false}, {"data": [0.01205093224192815, 500, 1500, "2_3_Open My Transactions"], "isController": false}, {"data": [0.10321100917431193, 500, 1500, "7_5_Enter Purpose and Source -> Next -> Account Transfer -> Upload Bill -> Pay Now"], "isController": false}, {"data": [0.005421184320266889, 500, 1500, "0_3_Enter Username and Password > Sign In"], "isController": false}, {"data": [0.0058823529411764705, 500, 1500, "5_5_Enter Bank Transfer Details -> Submit"], "isController": false}, {"data": [0.008333333333333333, 500, 1500, "4_6_Enter OTP -> Continue"], "isController": false}, {"data": [0.00207909604519774, 500, 1500, "0_1_Launch"], "isController": false}, {"data": [0.0, 500, 1500, "7_6_Enter OTP -> Continue"], "isController": false}, {"data": [0.021493212669683258, 500, 1500, "7_3_Click Send Money"], "isController": false}, {"data": [0.13622291021671826, 500, 1500, "6_5_Enter Purpose and Source -> Next -> Cash Counter -> Pay Now"], "isController": false}, {"data": [0.010223048327137546, 500, 1500, "9_3_Enter Username and Password > Sign In - InActive"], "isController": false}, {"data": [0.09302325581395349, 500, 1500, "5_3_Open My Beneficiaries"], "isController": false}, {"data": [0.010536951501154735, 500, 1500, "1_3_Open Forex Rates"], "isController": false}, {"data": [0.028925619834710745, 500, 1500, "4_5_Enter Cash Pickup Details > Submit"], "isController": false}, {"data": [0.04157549234135667, 500, 1500, "6_3_Click Send Money"], "isController": false}, {"data": [0.11538461538461539, 500, 1500, "3_4_Cancel One Transaction"], "isController": false}, {"data": [0.014097744360902255, 500, 1500, "9_2_Click Login with Mpin -> Enter Mpin > Sign In - InActive"], "isController": false}, {"data": [0.00398406374501992, 500, 1500, "7_4_Select Beneficiery and Enter Amount -> Click Next"], "isController": false}, {"data": [0.011037527593818985, 500, 1500, "3_3_Open My Transactions"], "isController": false}, {"data": [0.00566118350779748, 500, 1500, "0_2_Click Login with Mpin -> Enter Mpin > Sign In"], "isController": false}, {"data": [0.004076086956521739, 500, 1500, "6_4_Select Beneficiery and Enter Amount -> Click Next"], "isController": false}, {"data": [0.09375, 500, 1500, "4_3_Open My Beneficiaries"], "isController": false}, {"data": [0.0, 500, 1500, "6_6_Enter OTP->Continue"], "isController": false}, {"data": [0.01652892561983471, 500, 1500, "4_4_Click Add Beneficiary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 44863, 14607, 32.55912444553418, 330095.24958206457, 57, 1662460, 359759.0, 1056197.8000000003, 1228905.1, 1407755.2000000002, 3.5508260104752654, 86.2047245976303, 54.684350921631406], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["8_3_View Notifications", 1350, 0, 0.0, 52252.45999999994, 57, 314309, 38373.5, 118496.00000000001, 152883.1500000001, 239172.21, 0.10727435336410385, 0.38296804470837464, 0.034780356754768045], "isController": false}, {"data": ["5_6_Enter OTP -> Continue", 83, 13, 15.662650602409638, 17947.24096385543, 918, 108796, 10822.0, 52220.20000000001, 75685.59999999998, 108796.0, 0.05141811788625693, 0.3162336455151321, 0.09712889244444829], "isController": false}, {"data": ["5_4_Click Add Beneficiary", 85, 0, 0.0, 16704.270588235297, 526, 65352, 12266.0, 44740.40000000001, 54225.600000000006, 65352.0, 0.05604830440691333, 0.8801612194446075, 0.08319670185401197], "isController": false}, {"data": ["2_3_Open My Transactions", 2199, 1669, 75.8981355161437, 134552.63801728064, 351, 816540, 96662.0, 357573.0, 440465.0, 567079.0, 0.17435037241524978, 0.5605443573531695, 0.0770943009697734], "isController": false}, {"data": ["7_5_Enter Purpose and Source -> Next -> Account Transfer -> Upload Bill -> Pay Now", 436, 0, 0.0, 6167.575688073395, 84, 41073, 3445.0, 16149.1, 20505.149999999983, 37947.009999999995, 0.1577456553915909, 0.06908156210167865, 0.06608680289354736], "isController": false}, {"data": ["0_3_Enter Username and Password > Sign In", 4796, 2, 0.041701417848206836, 328981.00813177717, 773, 1398624, 191956.0, 882417.5000000001, 1013328.0999999988, 1200773.06, 0.38079775700910834, 6.664564071748499, 0.9202554824386413], "isController": false}, {"data": ["5_5_Enter Bank Transfer Details -> Submit", 85, 2, 2.3529411764705883, 28060.70588235294, 1280, 149484, 17133.0, 67867.40000000001, 81286.6, 149484.0, 0.05385063733813132, 0.3505649268423253, 0.118691036521819], "isController": false}, {"data": ["4_6_Enter OTP -> Continue", 120, 32, 26.666666666666668, 22127.750000000007, 712, 86772, 11048.0, 66300.6, 72637.64999999997, 86115.32999999997, 0.040561684689011876, 0.1877823130224641, 0.07006562299621052], "isController": false}, {"data": ["0_1_Launch", 22125, 9871, 44.614689265536725, 465102.2474124281, 941, 1662460, 395065.5, 1117430.3000000003, 1309936.1, 1437442.26, 1.7512326699202263, 59.13363703747867, 3.3619351018105332], "isController": false}, {"data": ["7_6_Enter OTP -> Continue", 433, 74, 17.090069284064665, 68902.30254041568, 5288, 427787, 52029.0, 138137.6, 158346.3, 233246.79999999987, 0.14385984263793103, 2.8074839184505733, 204.0409027763704], "isController": false}, {"data": ["7_3_Click Send Money", 884, 380, 42.98642533936651, 84494.00678733038, 351, 787169, 23764.0, 250275.5, 396450.25, 479027.49999999977, 0.07281671357743406, 0.5086472871964495, 0.0415713180350278], "isController": false}, {"data": ["6_5_Enter Purpose and Source -> Next -> Cash Counter -> Pay Now", 323, 0, 0.0, 5252.030959752316, 89, 44096, 3433.0, 12499.800000000005, 19984.600000000006, 34146.95999999998, 0.11359815654459027, 0.04974487289403789, 0.04759141519299728], "isController": false}, {"data": ["9_3_Enter Username and Password > Sign In - InActive", 538, 125, 23.234200743494423, 203756.80297397778, 1002, 1165263, 124538.5, 506366.00000000006, 772449.149999999, 1054245.1500000004, 0.04277116101203563, 0.5846165528397944, 0.08429384124994664], "isController": false}, {"data": ["5_3_Open My Beneficiaries", 86, 0, 0.0, 4408.7441860465115, 144, 36795, 3306.0, 8550.899999999994, 12733.399999999992, 36795.0, 0.05814110711484897, 0.2941987291351172, 0.018963993922226127], "isController": false}, {"data": ["1_3_Open Forex Rates", 3464, 1791, 51.70323325635104, 160036.93620092366, 372, 1150903, 110193.0, 387925.5, 491919.75, 683235.5999999997, 0.2747781210300848, 2.6037135235068556, 0.12596920218362936], "isController": false}, {"data": ["4_5_Enter Cash Pickup Details > Submit", 121, 0, 0.0, 27842.363636363636, 425, 118089, 16247.0, 75804.59999999999, 86126.29999999994, 113368.90000000002, 0.041558776990450755, 0.10423503686538287, 0.07922141863804674], "isController": false}, {"data": ["6_3_Click Send Money", 457, 89, 19.474835886214443, 22988.518599562358, 346, 115570, 9030.0, 74529.79999999999, 88314.69999999995, 106021.96000000002, 0.14005709548553383, 1.3840221373341037, 0.09465214908725374], "isController": false}, {"data": ["3_4_Cancel One Transaction", 156, 0, 0.0, 7158.301282051283, 83, 70674, 3600.5, 12349.7, 24707.70000000002, 61981.5000000001, 0.05509970751238595, 0.02984498505243832, 0.021092856782085247], "isController": false}, {"data": ["9_2_Click Login with Mpin -> Enter Mpin > Sign In - InActive", 532, 89, 16.729323308270676, 211826.45676691728, 746, 1235035, 140662.5, 513790.0, 738816.35, 1066567.2799999975, 0.042186564530773595, 2.2175614739575282, 0.09043215085066987], "isController": false}, {"data": ["7_4_Select Beneficiery and Enter Amount -> Click Next", 502, 65, 12.94820717131474, 43005.22908366534, 1161, 184948, 24323.0, 99494.6, 127070.84999999996, 160238.51999999981, 0.17307241460151973, 0.885063214419311, 0.38065069743959706], "isController": false}, {"data": ["3_3_Open My Transactions", 453, 296, 65.34216335540839, 117676.86534216342, 437, 1224745, 83228.0, 317948.4000000001, 439093.9999999999, 540822.4199999997, 0.03599065387073126, 0.1577365634693592, 0.017269573761415014], "isController": false}, {"data": ["0_2_Click Login with Mpin -> Enter Mpin > Sign In", 4681, 1, 0.021362956633198035, 332648.40653706464, 777, 1365125, 198417.0, 877164.4, 1028871.7, 1197417.4600000004, 0.37185754162206786, 11.08209528341586, 0.9174787866284841], "isController": false}, {"data": ["6_4_Select Beneficiery and Enter Amount -> Click Next", 368, 45, 12.228260869565217, 39819.2635869565, 1164, 210563, 23033.5, 112724.3, 128726.20000000001, 151824.63, 0.1266584774618467, 0.6567736412737644, 0.2812013011276046], "isController": false}, {"data": ["4_3_Open My Beneficiaries", 144, 23, 15.972222222222221, 10284.041666666666, 104, 89477, 3437.5, 20613.5, 69057.25, 89195.75, 0.04403162081925112, 0.1503562676986476, 0.014361876321904173], "isController": false}, {"data": ["6_6_Enter OTP->Continue", 321, 40, 12.461059190031152, 45372.3769470405, 2937, 217348, 31752.0, 99432.6, 132713.69999999987, 189134.9199999998, 0.10918924434920149, 2.206870474365189, 0.49929869933840165], "isController": false}, {"data": ["4_4_Click Add Beneficiary", 121, 0, 0.0, 23342.652892561982, 523, 116893, 12736.0, 57542.6, 68045.49999999996, 113107.46000000002, 0.04268318494165456, 0.6703114059126793, 0.06335785264776848], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 14605, 99.98630793455193, 32.55466642890578], "isController": false}, {"data": ["Assertion failed", 2, 0.013692065448072843, 0.0044580166284020235], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 44863, 14607, "400", 14605, "Assertion failed", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["5_6_Enter OTP -> Continue", 83, 13, "400", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["2_3_Open My Transactions", 2199, 1669, "400", 1669, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["0_3_Enter Username and Password > Sign In", 4796, 2, "400", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["5_5_Enter Bank Transfer Details -> Submit", 85, 2, "400", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["4_6_Enter OTP -> Continue", 120, 32, "400", 32, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["0_1_Launch", 22125, 9871, "400", 9871, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["7_6_Enter OTP -> Continue", 433, 74, "400", 74, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["7_3_Click Send Money", 884, 380, "400", 380, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["9_3_Enter Username and Password > Sign In - InActive", 538, 125, "400", 125, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["1_3_Open Forex Rates", 3464, 1791, "400", 1791, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["6_3_Click Send Money", 457, 89, "400", 89, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["9_2_Click Login with Mpin -> Enter Mpin > Sign In - InActive", 532, 89, "400", 89, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["7_4_Select Beneficiery and Enter Amount -> Click Next", 502, 65, "400", 65, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["3_3_Open My Transactions", 453, 296, "400", 294, "Assertion failed", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["0_2_Click Login with Mpin -> Enter Mpin > Sign In", 4681, 1, "400", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["6_4_Select Beneficiery and Enter Amount -> Click Next", 368, 45, "400", 45, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["4_3_Open My Beneficiaries", 144, 23, "400", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["6_6_Enter OTP->Continue", 321, 40, "400", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
