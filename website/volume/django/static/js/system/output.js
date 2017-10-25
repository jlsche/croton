
function outputController(dataSystem) { 
	var ctrl = this;
	var ds_ctrl = dataSystem;
	var serveDataPath = '../static';

	// 按下"导出"後，輸出使用者自行定義的群組資料(面板右側)
	this.output = function(call) {
		var tag = new Date().getTime();

		ds_ctrl.getData().ajax.getLabel(ds_ctrl.getRecord().id, function(label_data) {
			var itemsFormatted = [];
			label_data.data.forEach((item) => {
    			itemsFormatted.push({
        			col1: item.nid.toString(),
        			col2: item.name,
        			col3: item.comment_count.toString()
    			});
			});

			var headers = {
				col1: '标签ID',
				col2: '观点标签',
				col3: '评论条数'
			};

        	itemsFormatted.unshift(headers);
        	var jsonObject = JSON.stringify(itemsFormatted);
			var csv = ctrl.Json2CSV(jsonObject);
			var blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'})

			saveAs(blob, lang.getString("output-name01") + tag + ".csv");
			notUndefined(call);
		});
	}

	// 按下"导出"後，輸出所有有標籤的群組
	this.outputCategorized = function(call) {
		ds_ctrl.getData().ajax.exportCategorizedResult(ds_ctrl.getRecord().id, function(resp) {
			var itemsFormatted = [];
			resp.data.forEach((item) => {
				for (var ind = 0 ; ind < item.members.length ; ind++ ) {
					var sentence = item.members[ind];
					itemsFormatted.push({
        				col1: item.id,
        				col2: '"' + item.name + '"',
        				col3: '"' + sentence + '"'
    				});	
				}
			});

			var headers = {
				col1: '标签ID',
				col2: '观点',
				col3: '原始语句'
			};

			itemsFormatted.unshift(headers);
        	var jsonObject = JSON.stringify(itemsFormatted);
			var csv = ctrl.Json2CSV(jsonObject);
			var blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'})

			saveAs(blob, lang.getString("output-name00") + new Date().getTime() + ".csv");
			notUndefined(call);
		})
	}

	// 還要輸出分群結果的檔案
	// 按下"导出典型评论"後，輸出分群結果（面板左側）
	this.outputTypical = function(call) {
		var tag = new Date().getTime();
		//var params = new requestController();
		ds_ctrl.getData().ajax.loadGroups(ds_ctrl.getTemplate().id, {}, function(resp) {
			var itemsFormatted = [];
			var headers = {
				col1: '组别',
				col2: '典型评论',
				col3: '评论数',
				col4: '标签'
			};

			for (var idx = 0; idx < resp.data.length; idx++) {
				itemsFormatted.push({
					col1: resp.set[idx].id,
					col2: '"' + resp.data[idx].sentence + '"',
					col3: resp.data[idx].total,
					col4: resp.set[idx].label
				});
			}
			
        	itemsFormatted.unshift(headers);
        	var jsonObject = JSON.stringify(itemsFormatted);
			var csv = ctrl.Json2CSV(jsonObject);
			var blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'})

			saveAs(blob, lang.getString("output-name02") + tag + ".csv");
			notUndefined(call);
		});
	}

	this.outputRawData = function(call) {
		var task_id = ds_ctrl.getTemplate().id;
        $.get(serveDataPath + '/data/' + task_id + '/rawdata.csv', function( data ) {
        	var csvData = new Blob([data], { type: "text/csv;charset=utf-8;" });
        	saveAs(csvData, lang.getString("output-name02a") + new Date().getTime() + ".csv");
        	notUndefined(call);
		})
        .fail(function() {
        	console.log("Error Export Cluster Result - Cannot locate file location.");
        	notUndefined(call);
        });
		/*
		ds_ctrl.getData().ajax.getRowData(task.id, function( msg ) {
			if ( msg.code == 1 ){
				var name = "rawdata.csv";
				var a = $("<a></a>");
				
				a.attr("download", "rawdata_" + task.name + ".csv");
				var link = serveDataPath + msg.filelocation + name;
				a.attr("href", link );
				a.css("z-index",9999999999);
				//console.log(a.attr("href"));
				$("body").append(a);
				a[0].click();
				a.remove();
				notUndefined(call);
			}else {
				console.log("Error Export Raw Data - Cannot locate file location.");
				notUndefined(call);
			}
		})
		*/
	}

	// 輸出原始的分群結果
	this.outputClusterResult = function(call) {
		var id = ds_ctrl.getTemplate().id;
        //ds_ctrl.Done[ctrl.Done.length] = 1;
        $.get(serveDataPath + '/data/' + id + '/cluster_result.csv', function( data ) {
        	/*
        	var ar = data.split("\n");
            for ( i = ar.length-1 ; i > 0 ; i-- ) {
            	var co = ar[i].indexOf(",");
            	var gnum = parseInt(ar[i].substring(0, co));
            	if ( (-1 == co || 0 == gnum) && 0 != i ) {
            		ar[i-1] = ar[i-1] + ar[i].substring(co+1, ar[i].length-1);
                }
            }
           	ctrl.context[ctrl.Done.length-1] = "";
            for (i = 0; i < ar.length; i++) {
               	var co = ar[i].indexOf(",")
                var gnum = parseInt(ar[i].substring(0, co));
                if (1 == gnum) {
                    ctrl.context[ctrl.Done.length-1] += "\"" + lang.getString("output-term02a") + "\",\"" + ar[i].substring(co+1, ar[i].length-1) + "\"\n";
                }
            }
            */
            //ctrl.Done[ctrl.Done.length-1] = 2;
            //ctrl.outputSentenceDone(ctrl.Done,ctrl.context,tag);

            //var encodedUri = encodeURI(string);
        	var csvData = new Blob([data], { type: "text/csv;charset=utf-8;" });

        	saveAs(csvData, lang.getString("output-name02a") + new Date().getTime() + ".csv");
        	notUndefined(call);
        })
        .fail(function() {
        	console.log("Error Export Cluster Result - Cannot locate file location.");
        	notUndefined(call);
        });
	}

	this.Json2CSV = function(objArray) { 
	    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    	var str = '';

    	for (var i = 0; i < array.length; i++) {
        	var line = '';
        	for (var index in array[i]) {
            	if (line != '') 
            		line += ','
            	line += array[i][index];
        	}
        	str += line + '\r\n';
    	}
    	return str;
	}
}
