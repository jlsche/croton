function dataSystem ( book ) {
	var fixUrl = "http://118.31.36.162:3006";
	var baseUrl = "http://118.31.36.162:3333";
	//var baseUrl = "http://192.168.10.16:3333";
	var ctrl = this;
	var book = book;
	var data = Object({
		version : new Object(),
		curRecord : -1,
		controller : {},
		views : {},
		class : new Array(),
		record : new Array(),
		group : new Array(),

		template_id: -1,
		record_id: -1,
		
		labelDetail: new Array(),

		evt : {
			body : new evtManage( $("body"))
		},
		textData : new Object({
			label : new Array(),
			data : new Object(),
			count : 0
		}),
		ajax : new Object(),
		filterList : new Array()

	});
	var pageSize = 100;

	data.ajax.getRowData = function(id, call){
		var url = fixUrl + "/dataPath?template_id=" + id;
		console.log(url);
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin:true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					console.log(msg);
					notUndefined(call, msg);	
				}
			}
		});	
	}
	
	data.ajax.exportCategorizedResult = function(record_id, call) {
		var url = baseUrl + '/export/' + record_id;
		console.log(url);
		$.getJSON( url )
		.success( function( res ) {
			var r = new Object();
			var set = new Array();
			console.log(res);
			for ( var ind = 0 ; ind < res.length ; ind++ ) {
				var obj = res[ind];
				var id = ind + 1;
				var name = obj.name;
				var members = new Array();
				for(var jnd = 0; jnd < obj.processes.length; jnd++) {
					if (jnd == 0)
						members = obj.processes[jnd].group.sentence;
					else
						members = members.concat(obj.processes[jnd].group.sentence);
				}
				set.push(
					new Object({
						id : id,
						name: name,
						members: members
					})
				);
			}
			r.data = set;
			notUndefined(call, r);
		})
		.fail(function() {
			console.log("Reuqest Failed - function exportCategorizedResult()");
		});
	}

	data.ajax.updateRecord = function( id, class_id, call ) {
		var url = fixUrl+"/updateGroup2?id="+id+"&class_id="+class_id;
		console.log(url);
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin:true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					console.log(msg);
					notUndefined(call, msg);
				}
			}
		});	
	}

	data.ajax._updateRecord = function( id, class_id, call ){
		var url = fixUrl+"/updateGroup2?id="+id+"&class_id="+class_id;
		console.log(url);
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin:true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					var r = new Object();
					if ( msg.code == 1 ) {
						r.code = 1;
						r.data = new Object();
						r.data.id = msg.data.id;
						r.data.class_id = msg.data.class_id;
					}			
					notUndefined(call, r);
				}
			}
		});	
	}

	data.ajax.getBlockSearchGroup = function( id, text, call ){
		var url = fixUrl + "/keywordSearch?template_id=" + id + "&keywords=" + text;
		console.log(url);
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin:true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					console.log('Resp of getBlockSearchGroup(200):');
					console.log(msg);
					notUndefined(call, msg);
				}
			}
		});	
	}

	data.ajax.getGroupSentence = function( id, st, n , call){
		$.ajax({
			url: fixUrl + "/getGroupSentence?group_id=" + id + "&start_val=" + st + "&n=" + n,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			//crossOrigin:true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					var r = new Object();
					r.type = true;
					r.data = msg.sentence;
					notUndefined(call, r);
				},
				400 : function(){
					console.log("400 with get template");
					var r = new Object();
					r.type = false;
					r.data = [{
						name : "template_name",
						id : 0
					}];
					notUndefined(call, r);
				},
				404 : function(){
					console.log("404 with get template");
					var r = new Object();
					r.type = false;
					r.data = [{
						name : "template_name",
						id : 0
					}];
					notUndefined(call, r);
				}
			}
		});	
	}
	data.ajax.getTemplateList = function(call) {
		$.ajax({
			url: fixUrl + "/getTemplateList",
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			//crossOrigin:true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					var r = new Object();
					r.type = true;
					r.data = msg;
					notUndefined(call, r);
				},
				400 : function(){
					console.log("400 with get template");
					var r = new Object();
					r.type = false;
					r.data = [{
						name : "template_name",
						id : 0
					}];
					notUndefined(call, r);
				},
				404 : function(){
					console.log("404 with get template");
					var r = new Object();
					r.type = false;
					r.data = [{
						name : "template_name",
						id : 0
					}];
					notUndefined(call, r);
				}
			}
		});	
	}

	data.ajax.getRecordList = function(id, call){
		$.ajax({
			url: fixUrl + "/getRecordByTemplate?template_id=" + id,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin:true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					var r = new Object();
					r.type = true;
					r.data = msg;
					notUndefined(call, r);
				},
				404 : function(){
					console.log("404 with get record list")
					var r = new Object();
					r.type = false;
					r.data = [
						{
							name : "record_1_name",
							id : 0
						},
						{
							name : "record_2_name",
							id : 1
						}
					];
					notUndefined(call, r);
				}
			}
		});	
	}

	data.ajax.getClass = function( id, call ){
		var url = fixUrl + "/getLabelList?id=" + id;
		console.log(url)
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin : true,
			method:"GET",
			dataType : "json",
			statusCode: {		
				200: function(msg){
					console.log('Resp of getClass:');
					console.log(msg);
					if ( msg.code == 1 ){
						var data = msg.data.entry;
						for ( var ind = 1; ind < (data.length+1) ; ind++){
							data[ind-1]["nid"] = ind;
						}
						var r = new Object();
						r.type = true;
						r.data = data;
						notUndefined(call, r);
					}
				}
			}
		});	
	}

	data.ajax.getLabel = function( record_id, call ) {
		var url = baseUrl + "/label/" + record_id;
		$.getJSON( url )
		.success( function( res ) {
			for ( var ind = 1; ind < (res.length + 1) ; ind++) {
				res[ind-1]["nid"] = ind;
			}
			var r = new Object();
			r.type = true;
			r.data = res;
			notUndefined(call, r);
		})
		.fail(function() {
			console.log("Reuqest Failed.");
		});
	}

	data.ajax.loadRecord = function(id, offset, call){
		var url = fixUrl + "/loadWorkingGroups2?record_id=" + id;
		console.log(url)
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin : true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					if ( (msg.code == 1)||(msg.code == true) ) {
						msg.data.entry = msg.data.entry.slice(offset, offset+pageSize);
						var data = msg.data.entry;
						var r = new Object();
						r.type = true;
						var set = new Array();
						for ( var ind = 0 ; ind < data.length ; ind++ ){
							var obj = data[ind];
							var v = new Array();
							
							set.push(
								new Object({
									id : obj.pid,
									db_id : obj.id,
									group : obj.cid[0],
									class: obj.class_id,
									group_entry : function() {
										var id = this.group;
										return ctrl.getGroupById(id);
									}
								})
							);
						}
						r.data = set;
						r.data.sort( function( a, b ){
							return a.id - b.id;
						});
						notUndefined(call, r);
					}
				},
				404 : function(){
					console.log("404 with get template");
					var r = new Object();
					r.type = false;
					r.data = [
						{
							id : 1,
							class_id : -1,
							parent : -1,
							keyword : []
						},
						{
							id : 2,
							class_id : -1,
							parent : 4,
							keyword : []
						},
						{
							id : 3,
							class_id : -1,
							parent : 4,
							keyword : []
						},
						{
							id : 4,
							class_id : -1,
							parent : -1,
							keyword : []
						}
					];	
					r.data.sort( function( a, b ){
						return a.id - b.id;
					});				
					notUndefined(call, r);
				}
			}
		});	
	}

	data.ajax.getGroupSize = function(id, params, call) {
		console.log(params);
		var url = baseUrl + "/group/" + id;
		$.getJSON( url, $.param( params ) )
		.success( function( res ) {
			var r = new Object();
			r.length = res.total;
			notUndefined(call, r);
		})
		.fail(function() {
			console.log("Request Failed - getGroupSize.");
		});
	}

	data.ajax.loadGroups = function(id, params, call) {
		console.log(params);
		var url = baseUrl + "/group/" + id;
		$.getJSON( url, $.param(params) )
		.success( function( res ) {
			var r = new Object();
			var temp_data = new Array();
			var set = new Array();
			for ( var ind = 0 ; ind < res.length ; ind++ ) {
				var obj = res[ind];
				temp_data.push(new Object({
					id: obj.group_id,
					sentence: obj.sentence,
					total: obj.total
				}));

				var v = new Array();
				set.push(new Object({
					id : obj.process.pid,
					db_id : obj.process.process_id,
					group : obj.group_id,
					class: obj.process.label_id,
					label: obj.process.label,
					group_entry : function() {
						var id = this.group;
						return ctrl.getGroupById(id);
					}
				}));
			}
			for ( var ind = 0 ; ind < res.length ; ind++ ) {
				var obj = res[ind];
				if (obj.process.label)
					set[ind].label = obj.process.label.name;
			}
			r.type = true;
			r.data = temp_data;
			r.set = set;

			r.data.sort(function( a, b ) {
				return a.id - b.id;
			});
			r.set.sort(function( a, b ) {
				return a.id - b.id;
			});
			console.log(r);
			notUndefined(call, r);
		})
		.fail(function() {
			console.log("Request Failed - loadGroups.");
		});
	}

	data.ajax.createLabel = function(id, name, call){
		var url = baseUrl + "/label";
		console.log(url);
		$.post(url, JSON.stringify({"record_id": id, "name": name}), function(msg) {
			if ( msg.success == true ) {
				var r = new Object();
				r.code = 1;
				r.data = new Object();
				r.data.label_id = msg.data.id;
				r.data.name = name;
				r.data.group_count = 0;
				r.data.comment_count = 0;
			}			
			console.log(r);
			notUndefined(call, r);
		});
	}

	data.ajax.editLabel = function(id, name, call){
		var url = baseUrl + "/label/" + id;
		console.log(url)

		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/json; charset=UTF-8'},
			crossOrigin : true,
			method:"PUT",
			data: JSON.stringify({"name": name}),
			dataType : "json",
			statusCode: {			
				200: function(msg){
					var r = new Object();
					r.code = 1;
					r.data = new Object();
					r.data.id = msg.data.id;
					r.data.name = name;
					notUndefined(call, r);
				}
			}
		});	
	}

	data.ajax.combineLabel = function(ids, call){
		var url = fixUrl+"/combineLabelGroups?ids=" + ids;
		console.log(url)
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin : true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){					
					notUndefined(call, msg);
				}
			}
		});	
	}

	data.ajax.removeLabel = function(id, call){
		var url = fixUrl + "/deleteLabel?id=" + id;
		console.log(url);
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin : true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){					
					notUndefined(call, msg);
				}
			}
		});	
	}

	this.updateRecord = function( info, call){
		data.ajax.updateRecord(info, function() {
			data.controller.group.groupFilter();
			data.controller.group.tagRender();
			notUndefined(call);
			ctrl.updateClassListView();
		})
	}

	this.clear = function() {
		data.textData.label = new Array();
		data.textData.data = new Object();
		data.textData.class = new Array();
		data.textData.count = 0;
		data.curRecord = -1;
	}

	this.clear_task = function() {
		data.group = [];
		data.class = [];
		data.record = [];
		data.textData.label = [];
		data.textData.data = [];
		data.textData.class = [];
		data.textData.count = 0;
		data.curRecord = -1;
	}

	this.start = function() {
		data.filterList = new Array();
		//ctrl.panelHeight();
		ctrl.eventBind();
		data.controller.group = new group_ctrl(ctrl, data);
		data.controller.ctrl = new controller_ctrl(ctrl, data);
		data.controller.label = new class_ctrl(ctrl, data);

		ctrl.renderGroups();
		ctrl.renderLabel();
		ctrl.updateClassListView();
	}

	this.detectCtrlFunc = function(){
		data.controller.ctrl.detectCtrlFunc( ctrl.getSelectedLabel() );
	}

	this.groupBlock = function(){
		var set = data.controller.ctrl.getBlockSet();
		data.controller.group.groupBlock( set );
	}

	this.groupBlockClear = function() {
		data.controller.group.groupBlock( [] );
	}


	this.groupFilter = function() {
		var set = data.filterList;
		data.controller.group.groupFilter( set );
	}

	this.renderLabel = function() {
		data.ajax.getLabel(data.record_id, function( classes ) {
			data.class = classes.data;
			data.controller.label.render( data.class );
			closeLoading();
		});
	}

	this.renderGroups = function() {
		data.controller.group.render( data.record );
	}

	this.panelHeight = function(){
		var evt = function(){
			var h = $(window).height();
			var con = $("body > .main > .book.container");
			var mainH = h - 120 - con.children(".top").outerHeight();
			console.log(con.children(".top").height())
			var subCon = con.children(".main");
			subCon.children(".left").css({
				height : mainH+"px"
			})

			subCon.children(".right").css({
				height : mainH-120+"px"
			})
			console.log(mainH);
		}
		$(window).bind("resize", evt);
		evt();
	}

	this.getData = function() {
		return data;
	}	

	this.getChildGroup = function( id ){
		var result = new Array();
		var id = ctrl.getRecordById(id).db_id;

		for ( var ind = 0 ; ind < data.record.length ; ind++ ){
			var e = data.record[ind];

			if ( e.parent == id ){
				var group = ctrl.getGroupById(e.groups[0]);
				if ( typeof(group) != "undefined"){
					result.push( group );
				}else{
					console.log( group );
				}
			}
		}	
		return result;
	}

	this.getChildRecord = function( id ){
		var result = new Array();
		var id = ctrl.getRecordById(id).db_id;

		for ( var ind = 0 ; ind < data.record.length ; ind++ ) {
			var e = data.record[ind];
			if ( e.parent == id ) {
				result.push( e );
			}
		}
		return result;
	}

	this.getGroupById = function(id) {
		for ( var ind = 0 ; ind < data.group.length ; ind++ ){
			var e = data.group[ind];
			if ( e.id == id ) {
				return e;
			}
		}
	}

	this.getGroupKeywords = function(id){
		var set = new Array();
		var r = ctrl.getRecordById(id);
		for ( var ind = 0 ; ind < r.groups.length ; ind++ ){
			var e = ctrl.getGroupById(r.groups[ind]);
			var k = e.keyword;
			for ( var n = 0 ; n < k.length ; n++ ){
				if ( set.indexOf(k[n]) == -1 ){
					set.push(k[n]);
				}
			}
		}
		return set;		
	}

	this.getKeywordsInGroups = function( set ){
		//console.log(set)
		var result = new Array();
		for ( var ind = 0 ; ind < set.length ; ind++ ){
			var k_set = set[ind].keyword;
			for ( var nind = 0 ; nind < k_set.length ; nind++ ){
				var k = k_set[nind];
				if ( result.indexOf(k) == -1 ){
					result.push(k);
				}
			}
		}
		return result;
	}

	this.getRecordById = function (id){
		for ( var ind = 0 ; ind < data.record.length ; ind++ ) {
			var e = data.record[ind];
			if ( e.id == id ){
				return e;
			}
		}
	}

	this.getRecordByDBId = function (id){
		for ( var ind = 0 ; ind < data.record.length ; ind++ ) {
			var e = data.record[ind];
			if ( e.db_id == id ){
				return e;
			}
		}
	}

	this.getRecordByGroupId = function (id){
		for ( var ind = 0 ; ind < data.record.length ; ind++ ) {
			var e = data.record[ind];
			if ( e.group == id ){
				return e;
			}
		}
	}
	this.getLabelList = function(){
		return data.class
	}

	this.getLabelNameById = function(id){
		var classList = data.class;
		//console.log(classList);
		for ( var ind = 0 ; ind < classList.length ; ind++ ) {
			var curClass = classList[ind];
			//if ( curClass.id == id ){
			if ( curClass.label_id == id ){
				return curClass.name;
			}
		}
	}
	

	this.getLabelById = function(id) {
		var classList = data.class;
		for ( var ind = 0 ; ind < classList.length ; ind++ ) {
			var curClass = classList[ind];
			//if ( curClass.id == id ){
			if ( curClass.label_id == id ) {
				return curClass;
			}
		}
	}

	this.getRecrodSetByLabelId = function(id) {
		var set = data.record;
		console.log()
		var result = new Array();
		for ( var ind = 0 ; ind < set.length ; ind++ ) {
			var curRecord = set[ind];
			if ( curRecord.class == id ) {
				result.push( curRecord );
			}
		}
		return result;
	}

	this.getGroupSetByLabelId = function(id) {
		var set = data.record;
		var result = new Array();
		for ( var ind = 0 ; ind < set.length ; ind++ ){
			var curRecord = set[ind];
			if ( curRecord.class == id ){
				result.push ( curRecord.group_entry() );
			}
		}
		return result;
	}

	this.getSelectedLabel = function(){
		var cont = $("body > .main > .book > .main > .panel.right.class");
		var list = cont.children(".list").children(".entry[sel='1']");
		var result = new Array();
		for ( var ind = 0 ; ind < list.length ; ind++ ){
			var curId = list.eq(ind).attr("id");
			result.push( parseInt(curId) );
		}
		return result;
	}

	this.getSelectedGroup = function(){
		var cont = $("body > .main > .book > .main > .panel.left.group");
		var list = cont.children(".list").children(".entry[sel='1']");
		return list;
	}

	this.getSelectedRecordId = function(){
		var list = ctrl.getSelectedGroup();
		var arr = new Array();
		for ( var ind = 0 ; ind < list.length ; ind++ ){
			arr.push( parseInt(list.eq(ind).attr("rid")));
		}
		return arr;
	}

	this.getSelectedRecordDBId = function(){
		var list = ctrl.getSelectedGroup();
		var arr = new Array();
		for ( var ind = 0 ; ind < list.length ; ind++ ){
			arr.push( parseInt(list.eq(ind).attr("dbid")));
		}
		return arr;
	}
	

	this.setRecord = function(id, name){
		book.attr("record-id", id);
		book.attr("record-name", name);
	}

	this.setTemplate = function(id, name){
		book.attr("template-id", id);
		book.attr("template-name", name);
	}

	this.getRecord = function(){
		return new Object({
			id : parseInt( book.attr("record-id")),
			name : book.attr("record-name")
		});
	}

	this.getTemplate = function(){
		return new Object({
			id : parseInt( book.attr("template-id")),
			name : book.attr("template-name")
		});
	}

	this.getDBIdByRecordId = function(id){
		return ctrl.getRecordById(id).db_id;

	}


	/* call view */

	this.combinedView = function(){
		data.controller.ctrl.showCombinedView ( ctrl.getSelectedLabel() );
	}

	this.createdView = function(){
		data.controller.ctrl.showCreateView ();
	}

	this.editView = function(){
		data.controller.ctrl.showEditView ( ctrl.getSelectedLabel() );
	}

	this.removeView = function(){
		data.controller.ctrl.showRemoveView ( ctrl.getSelectedLabel() );
	}

	this.splitView = function(){
		var label = ctrl.getSelectedLabel()[0];
		var label_entry = ctrl.getLabelById(label);
		var set = ctrl.getRecrodSetByLabelId(label);
		//data.controller.ctrl.showSplitView( label_entry, set );
		data.controller.ctrl._showSplitView( label_entry );
	}

	this.errorView = function(text){
		data.controller.ctrl.showErrorView ( text );
	}

	this.filterView = function(){
		var temp = new Array();
		temp.push( {
			//id: 0,
			label_id: 0,
			nid: 0,
			name: lang.getString("no-label")
		});
		for ( var ind = 0 ; ind < data.class.length ; ind++ ){
			temp.push( data.class[ind]);
		}
		console.log(temp);

		data.controller.group.showFilterView( temp );
	}

	/* view event */
	this.updateSingleGroup = function( rid, dbid, cid){
		openLoading();
		data.ajax.updateRecord ( dbid, cid, function(msg){
			if ( msg.code == 1 ){
				var record = ctrl.getRecordById(rid)
				record.class = parseInt(msg.data.class_id)

				data.controller.group.updateCombinedGroup( rid, cid );
				data.controller.group.releaseSingleGroupByRId(rid)
				ctrl.renderLabel();
			}else{
				ctrl.errorView( lang.getString("edit-fail") )
			}
			ctrl.updateClassListView();
			closeLoading();
		})
	}

	this.combineLabel = function(){
		var set = ctrl.getSelectedLabel();
		var text = ""
		for ( var ind = 0 ; ind < set.length ; ind++){
			var str = set[ind];
			text += str;
			if ( ind != ( set.length - 1 )) {
				text += ",";
			}
		}
		openLoading();
		data.ajax.combineLabel(text, function(msg){
			data.controller.ctrl.closeView("combine");
			if (msg.code == 1 ){
				var info = msg.data;
				var id = parseInt(info.id);

				for ( var ind = 0 ; ind < set.length ; ind++) {
					var num = parseInt(set[ind]);
					if ( num != id ) {
						for ( var n = 0 ; n < data.class.length ; n++ ) {
							var curLabel = data.class[n];
							if ( curLabel.id == num ){
								data.class.splice( n, 1);
							}
						}
					}
				}

				for ( var ind = 0 ; ind < set.length ; ind++) {
					var records = ctrl.getRecrodSetByLabelId( set[ind] );
					for ( var n = 0 ; n < records.length ; n++ ) {
						records[n].class = id;
						data.controller.group.updateCombinedGroup( records[n].id, id);
					}
				}

				ctrl.resortLabelId();
				ctrl.renderLabel();
				ctrl.renderGroups();
				ctrl.updateClassListView();
			}else{
				ctrl.errorView(lang.getString("combine-fail"));
				closeLoading();
			}
		})
	}

	this.updateCombinedGroup = function(id, set){
		var record = data.record;
		console.log(record);
		for ( var ind = 0 ; ind < record.length ; ind++ ){
			var curRecord = record[ind];
			var curId = curRecord.class;
			console.log(curRecord);
			console.log(curId);
			if ( set.indexOf(curId)){
				curRecord.class = id;
				data.controller.group.updateCombinedGroup( curRecord.id, id );
			}
		}
	}

	// 由面板右側新增標籤
	this.createLabel = function() {
		var target = $("body > .overlay-view.create");
		var input = target.find(".cont > .cont > .text");
		var tip = target.find(".cont > .cont > .tip_sys");
		var text = input.val();
		tip.html("");
		for ( var ind = 0 ; ind < data.class.length ; ind++ ) {
			if ( data.class[ind].name == text ) {
				tip.html( lang.getString("name-exist") );
			}
		}
		if (!( text.length > 0) && (text.length<=10)) {
			tip.html( lang.getString("str-len-wrong") );
		}

		if ( tip.html().length == 0 ){
			openLoading();
			data.ajax.createLabel( ctrl.getRecord().id, text, function(msg){
				data.controller.ctrl.closeView("create");

				if (msg.code == 1 ){
					var info = msg.data;
					data.class.push( info );
					console.log(data.class);
					ctrl.resortLabelId();
					ctrl.renderLabel();
					ctrl.renderGroups();
					ctrl.updateClassListView();
				}else{
					ctrl.errorView( lang.getString("create-fail") );
					closeLoading();
				}
			})
		}
	}

	this.editLabel = function() {
		var target = $("body > .overlay-view.edit");
		var input = target.find(".cont > .cont > .text");
		var text = input.val();
		var set = ctrl.getSelectedLabel();
		var id = "";
		for ( var ind = 0 ; ind < set.length ; ind++) {
			var str = set[ind];
			id += str;
			if ( ind != ( set.length - 1 ) ) {
				id += ",";
			}
		}
		id = parseInt(id);
		if ( ( text.length > 0) && (text.length <= 10) ) {
			openLoading();
			data.ajax.editLabel( id, text, function(msg) {
				data.controller.ctrl.closeView("edit")
				if (msg.code == 1 ) {
					var info = msg.data;
					var label = ctrl.getLabelById(id);
					label.name = text;
					ctrl.renderLabel();
					ctrl.renderGroups();	
					ctrl.updateClassListView();
				}else{
					ctrl.errorView(  lang.getString("rename-fail") );
					closeLoading();
				}
			})
		}
	}

	this.splitLabel = function(set) {
		var id_text = "";
		for ( var ind = 0 ; ind < set.length ; ind++ ) {
			id_text += set[ind].db_id;
			if (ind < set.length - 1)
				id_text += ',';
		}

		openLoading();
		data.ajax.updateRecord ( id_text, 0, function(msg){
			data.controller.ctrl.closeView("split");
			if ( msg.code == 1 ){
				data.controller.group.partialRenderLabel( set, "");
				ctrl.renderLabel();
			}else{
				ctrl.errorView(  lang.getString("split-fail") );
				closeLoading();
			}
		})
	}

	this.removeLabel = function() {
		var set = ctrl.getSelectedLabel();
		var text = ""
		for ( var ind = 0 ; ind < set.length ; ind++ ) {
			var str = set[ind];
			text += str;
			if ( ind != ( set.length - 1 ) ) {
				text += ",";
			}
		}
		openLoading();
		data.ajax.removeLabel(text, function(msg) {
			data.controller.ctrl.closeView("remove");
			
			if (msg.code == 1 ){
				var info = msg.data;
				var id = info.id;
				var record = data.record;

				for ( var ind = 0 ; ind < record.length ; ind++ ){
					var curRecord = record[ind];
					if ( curRecord.class == id ){
						curRecord.class = 0;
					}
				}

				var classSet = data.class;
				for ( var ind = 0 ; ind < classSet.length ; ind++ ){
					var classEntry = classSet[ind];
					if ( classEntry.label_id == id ) {
						classSet.splice( ind, 1);
					}
				}
				ctrl.resortLabelId();
				ctrl.renderGroups();
				ctrl.renderLabel();
				ctrl.updateClassListView();
			}else{
				ctrl.errorView(  lang.getString("remove-fail")  );
				closeLoading();
			}
		})
	}

	this.resortLabelId = function(){
		for ( var ind  = 0 ; ind < data.class.length ; ind++ ) {
			data.class[ind].nid = ind + 1;
		}
	}

	this.groupListClassed = function(){
		var target = $("body > .overlay-view.classed");
		var id = parseInt(target.find(".cont > .cont > .name").attr("id"));
		var dbSet = ctrl.getSelectedRecordDBId();
		var count = 0;
		var ids = "";
		for ( var ind = 0 ; ind < dbSet.length ; ind++ ){
			var dbid = dbSet[ind];
			ids += dbid;
			if ( ind != (dbSet.length-1) ){
				ids += ",";
			}	
		}
		openLoading();
		data.ajax.updateRecord ( ids, id, function(msg){
			data.controller.ctrl.closeView("classed")
			if ( msg.code == 1 ){
				id = parseInt(msg.data.class_id)
				var list = ctrl.getSelectedRecordId();
				for ( var ind = 0 ; ind < list.length ; ind++ ){
					var cid = list[ind];
					var record = ctrl.getRecordById(cid);
					record.class = id;
					data.controller.group.updateCombinedGroup( cid, id);
					ctrl.renderLabel();
					data.controller.group.releaseAllCheckBox();
				}
			}else{
				ctrl.errorView( lang.getString("edit-fail") )
			}
			closeLoading();
		})
	}

	this.createLabelByTyping = function(text, rid){
		openLoading();

		data.ajax.createLabel( ctrl.getRecord().id, text, function(msg){
			data.controller.ctrl.closeView("create")
			if (msg.code == 1 ){	
				var info = msg.data;
				info.nid = data.class.length+1;
				data.class.push( info );
				ctrl.renderLabel();
				ctrl.updateClassListView();
				var record = ctrl.getRecordById(rid);

				data.ajax._updateRecord( record.db_id, info.label_id, function( answer ){	
					if ( answer.code == 1 ){
						var targetCid = answer.data.class_id;
						record.class = targetCid;
						// record.id 是第幾筆資料
						data.controller.group.updateCombinedGroup(record.id, targetCid);
						ctrl.renderLabel();
					}else{
						ctrl.errorView( lang.getString("group") + record.id + lang.getString("label-fail")  );
						closeLoading();
					}
				})			
			}else{
				ctrl.errorView(  lang.getString("create-fail") );
				closeLoading();
			}
		})
	}

	this.outputEvt = function(){

	}

	this.eventBind = function(){
		ctrl.groupViewEvt();
		ctrl.errorViewEvt();
		ctrl.outputEvt();
	}

	this.groupViewEvt = function(){
		var target = $("body > .overlay-view.group");
		var btn = target.find(".cont > .ctrl > .apply");
		btn.unbind("click");
		btn.bind("click", function(){
			target.removeClass("active");
		})
	}

	this.errorViewEvt = function(){
		var target = $("body > .overlay-view.error");
		var btn = target.find(".cont > .ctrl > .apply");
		btn.unbind("click");
		btn.bind("click", function(){
			target.removeClass("active");
		})
	}

	// 看起來只有render label的名稱
	// 可以直接在group.js裡面render?
	this.updateClassListView = function() {
		var con = $("#classList");
		con.empty();
		var source = data.class;
		for ( var ind = 0 ; ind < source.length ; ind++ ){
			var e = source[ind];
			var entry = $("<option>");
			entry.attr("value", e.name);
			con.append ( entry );
		}
	}

	this.initial = function() {
		ctrl.panelHeight();
	}

	ctrl.initial();
}
