function dataSystem ( book ) {
	var fixUrl = "http://lingtelli.com:3006";
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
	data.ajax.getRowData = function(id, call){
		
		var url = fixUrl+"/dataPath?template_id="+id;
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin:true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					console.log(msg)
					notUndefined(call, msg)
					
				}
			}
		});	
	}

	data.ajax.updateRecord = function( id, class_id, call ){
		var url = fixUrl+"/updateGroup2?id="+id+"&class_id="+class_id;
		console.log(url)
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin:true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					console.log(msg)
					notUndefined(call, msg)
					
				}
			}
		});	
	}

	///keywordSearch?template_id=TemplateID&keywords=KEYWORDS
	data.ajax.getBlockSearchGroup = function( id, text, call ){
		var url = fixUrl+"/keywordSearch?template_id="+id+"&keywords="+text;
		console.log(url)
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin:true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					console.log(msg)
					notUndefined(call, msg)
					
				}
			}
		});	
	}
	/*

	data.ajax.updateRecord = function( data, call ){
		var url = fixUrl+"/updateGroup?id="+data.id+"&label="+encodeURIComponent(data.label)+"&class_id="+data.class;
		console.log(url)
		console.log(data)
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin:true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					if ( typeof(msg.action) != "undefined" ){
						notUndefined(call)
					}else{
						console.log(msg)
						notUndefined(call, msg)
					}
					
				}
			}
		});	
	}
	data.ajax.getKeywordAssoc = function( set, call ){
		var url = fixUrl+"/getKeywordAssoc";
		console.log(url)
		console.log(set)
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin:true,
			method:"POST",
			data : { "keyword" : set },
			dataType : "json",
			statusCode: {			
				200: function(msg){
					if ( typeof(msg.action) != "undefined" ){
						notUndefined(call)
					}else{
						for ( var ind = 0 ; ind < msg.length ; ind++ ){
						var obj = msg[ind];
						if ( typeof( data.textData.data[obj.name] ) == "undefined"){
							var object = new Object({
									parent : obj.parents,
									sibling : obj.sibling,
									children : obj.children,
									id : data.textData.count++
								});
								data.textData.data[obj.name] = object;
							}

						}
						notUndefined(call, data.textData.data)
					}
					
				}
			}
		});	

	}
	
	data.ajax.mergeWorkingGroup = function( record, set, call ){
		var url = fixUrl+"/mergeGroups?record_id="+record+"&group_ids="+set.toString();
		console.log(url)
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			//crossOrigin:true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					//console.log(msg)
					notUndefined(call, msg)
				}
			}
		});	
	}

	data.ajax.decompositeWorkingGroup = function( record, source, target, call ){
		var url = fixUrl+"/decomposeGroups?record_id="+record+"&source="+source+"&target="+target;
		console.log(url)
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			//crossOrigin:true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					console.log(msg)
					notUndefined(call, msg)
					
				}
			}
		});	
	}*/

	data.ajax.getGroupSentence = function( id, st, n , call){
		$.ajax({
			url: fixUrl+"/getGroupSentence?group_id="+id+"&start_val="+st+"&n="+n,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			//crossOrigin:true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					//console.log(msg)
					var r = new Object();
					r.type = true;
					r.data = msg.sentence;
					/*var g = ctrl.getGroupById(parseInt(id));
					console.log(g)
					var data = r.data;
					for ( var ind = 0 ; ind < data.length ; ind++ ){
						g.sentence.push(data[ind]);
					}*/
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
	data.ajax.getTemplateList = function(call){
		$.ajax({
			url: fixUrl+"/getTemplateList",
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			//crossOrigin:true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					//console.log(msg)
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
			url: fixUrl+"/getRecordByTemplate?template_id=" + id,
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
		var url = fixUrl+"/getLabelList?id=" + id;
		console.log(url)
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin : true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					console.log(msg)
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

	data.ajax.loadRecord = function(id, call){
		var url = fixUrl+"/loadWorkingGroups2?record_id=" + id;
		//console.log(url)
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin : true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){

					if ( (msg.code == 1)||(msg.code == true) ){
						console.log(msg)
						var data = msg.data.entry;
						console.log(data)
						var r = new Object();
						r.type = true;
						var set = new Array();
						for ( var ind = 0 ; ind < data.length ; ind++ ){
							var obj = data[ind];
							
							var v = new Array();
							
							set.push(new Object({
								id : obj.pid,
								db_id : obj.id,
								group : obj.cid[0],
								class:obj.class_id,
								group_entry : function(){
									var id = this.group;
									return ctrl.getGroupById(id);
								}
							}));
						}
						r.data = set;
						r.data.sort( function( a, b ){
							return a.id - b.id;
						});

						//console.log(r.data)
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

	data.ajax.loadGroups = function(id, n, call){
		var url = fixUrl+"/getTemplateGroups?template_id="+id+"&n="+n;
		console.log(url)
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin:true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					console.log(msg)
					var r = new Object();
					r.type = true;

					for ( var ind = 0 ; ind < msg.length ; ind++ ){
						var e = msg[ind];
						for ( var n = 0 ; n < e.keyword.length ; n++ ){
							var k = e.keyword[n];
							if ( k.length == 0 ){
								e.keyword.splice( n, 1 );
							}
							e.keyword[n] = k.replace(/ /g, "");
						}
					}

					r.data = msg;
					r.data.sort( function( a, b ){
						return a.id - b.id;
					});	

					notUndefined(call, r);
				},
				404 : function(){
					console.log("404 with get template");
					var r = new Object();
					r.type = false;
					r.data = [ 
					new Object({
						id : 1,
						keyword : [ 'test', '測試', '功能', '動物'],
						sentence : [
							"測試動物的功能",
							"test functionbility",
							"animals function---------------------------------"
						],
						total : 3
					}),new Object({
						id : 2,
						keyword : [ 'test02', '測試', '功能', '動物02'],
						sentence : [
							"測試動物的功能02",
							"test functionbility",
							"animals function02---------------------------------"
						],
						total : 4
					}),  new Object({
						id : 3,
						keyword : [ 'test03', '測試', '功能', '動物03'],
						sentence : [
							"測試動物的功能03",
							"test functionbility",
							"animals function---------------------------------"
						],
						total : 3
					})];	
					r.data.sort( function( a, b ){
						return a.id - b.id;
					});			
					notUndefined(call, r);
				}
			}
		});	
	}


	data.ajax.createLabel = function(id, name, call){
		var url = fixUrl+"/createLabel?record_id="+id+"&class="+name;
		console.log(url)
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin : true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					if ( msg.code == 1 ){
						msg.data.name = name;
					}
					
					notUndefined(call, msg);
				}
			}
		});	
	}

	data.ajax.editLabel = function(id, name, call){
		var url = fixUrl+"/editLabel?id="+id+"&name="+name;
		console.log(url)
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin : true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					msg.data.name = name;
					notUndefined(call, msg);
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
		var url = fixUrl+"/deleteLabel?id=" + id;
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

	


	this.updateRecord = function( info, call){
		console.log(data.ajax)
		
		data.ajax.updateRecord(info, function(){
			data.controller.group.groupFilter();
			data.controller.group.tagRender();
			notUndefined(call)
			ctrl.updateClassListView();
		})
	}
	

	this.initial = function(){
		ctrl.panelHeight();
	}

	this.clear = function(){
		data.textData.label = new Array();
		data.textData.data = new Object();
		data.textData.class = new Array();
		data.textData.count = 0;
		data.curRecord = -1;
	}

	this.start = function(){


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
		console.log(set)
		data.controller.group.groupBlock( set );
		/*var set = data.controller.ctrl.getBlockTerm();
		if (set.length > 0 ){
			var text = ""
			for ( var ind = 0 ; ind < set.length ; ind++ ){
				var str = set[ind];
				text += encodeURIComponent(str);
				if ( ind != (set.length-1)){
					text +=","
				}
			}

			openLoading();
			data.ajax.getBlockSearchGroup ( ctrl.getTemplate().id, text, function(msg){
				closeLoading();
				if ( msg.code == 1 ){
					//console.log(msg.data)
					data.controller.group.groupBlock( msg.data.id );
				}else{
					ctrl.errorView( lang.getString("search-fail") )
				}
			})
		}else{
			data.controller.group.removeBlock( );
		}*/
		
		//data.controller.group.groupBlock( set );
	}

	this.groupBlockClear = function(){
		//var set = data.controller.ctrl.getBlockSet();
		data.controller.group.groupBlock( [] );
	}


	this.groupFilter = function(){
		var set = data.filterList;
		data.controller.group.groupFilter( set );
	}

	this.renderLabel = function(){
		data.controller.label.render( data.class );
	}

	this.renderGroups = function(){
		data.controller.group.render( data.record );
		ctrl.groupBlock();
		ctrl.groupFilter();
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
			console.log(mainH)

		}
		$(window).bind("resize", evt);

		evt();

	}

	this.getData = function () {
		return data;
	}

	
	

	// get function
	this.getChildGroup = function( id ){
		var result = new Array();
		//console.log(id)
		var id = ctrl.getRecordById(id).db_id;
		//console.log(id)
		for ( var ind = 0 ; ind < data.record.length ; ind++ ){
			var e = data.record[ind];

			if ( e.parent == id ){
				var group = ctrl.getGroupById(e.groups[0]);
				if ( typeof(group) != "undefined"){
					result.push( group );
				}else{
					console.log(group)
				}
			}
		}
		
		return result;
	}

	this.getChildRecord = function( id ){
		var result = new Array();
		//console.log(id)
		var id = ctrl.getRecordById(id).db_id;
		//console.log(id)
		for ( var ind = 0 ; ind < data.record.length ; ind++ ){
			var e = data.record[ind];

			if ( e.parent == id ){
				result.push( e );
			}
		}
		
		return result;
	}

	this.getGroupById = function(id){
		for ( var ind = 0 ; ind < data.group.length ; ind++ ){
			var e = data.group[ind];
			if ( e.id == id ){
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
		for ( var ind = 0 ; ind < data.record.length ; ind++ ){
			var e = data.record[ind];
			if ( e.id == id ){
				return e;
			}
		}
	}

	this.getRecordByDBId = function (id){
		for ( var ind = 0 ; ind < data.record.length ; ind++ ){
			var e = data.record[ind];
			if ( e.db_id == id ){
				return e;
			}
		}
	}
	this.getLabelList = function(){
		return data.class
	}
	this.getLabelNameById = function(id){
		var classList = data.class;
		for ( var ind = 0 ; ind < classList.length ; ind++ ){
			var curClass = classList[ind];
			if ( curClass.id == id ){
				return curClass.name;
			}
		}
	}
	

	this.getLabelById = function(id){
		var classList = data.class;
		for ( var ind = 0 ; ind < classList.length ; ind++ ){
			var curClass = classList[ind];
			if ( curClass.id == id ){
				return curClass;
			}
		}
	}

	this.getRecrodSetByLabelId = function(id){
		var set = data.record;
		var result = new Array();
		for ( var ind = 0 ; ind < set.length ; ind++ ){
			var curRecord = set[ind];
			if ( curRecord.class == id ){
				result.push ( curRecord );
			}
		}
		return result;
	}


	this.getGroupSetByLabelId = function(id){
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

	this.  getSelectedLabel = function(){
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
		var label_entry = ctrl.getLabelById(label)
		var set = ctrl.getRecrodSetByLabelId(label)
		data.controller.ctrl.showSplitView ( label_entry, set );
	}


	this.errorView = function(text){
		data.controller.ctrl.showErrorView ( text );
	}

	this.filterView = function(){
		var temp = new Array();
		temp.push( {id:0,nid:0,name:lang.getString("no-label")});
		for ( var ind = 0 ; ind < data.class.length ; ind++ ){
			temp.push( data.class[ind]);
		}
		data.controller.group.showFilterView ( temp );
	}



	/* view event */

	this.updateSingleGroup = function( rid, dbid, cid){
		openLoading();
		data.ajax.updateRecord ( dbid, cid, function(msg){
			
			if ( msg.code == 1 ){
				console.log(msg)
				var record = ctrl.getRecordById(rid)
				record.class = parseInt(msg.data.class_id)
				//console.log(record)
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
		//console.log(set);
		var text = ""
		for ( var ind = 0 ; ind < set.length ; ind++){
			var str = set[ind];
			text+=str;
			if ( ind != ( set.length - 1 )){
				text+=","
			}
		}
		openLoading();
		data.ajax.combineLabel(text, function(msg){
			console.log(msg)

			data.controller.ctrl.closeView("combine")
			closeLoading();
			if (msg.code == 1 ){

				var info = msg.data;
				var id = parseInt(info.id);

				for ( var ind = 0 ; ind < set.length ; ind++){
					var num = parseInt(set[ind]);
					if ( num != id ){
						for ( var n = 0 ; n < data.class.length ; n++ ){
							var curLabel = data.class[n];
							if ( curLabel.id == num ){
								data.class.splice( n, 1);
							}
						}
					}
				}

				for ( var ind = 0 ; ind < set.length ; ind++){
					var records = ctrl.getRecrodSetByLabelId( set[ind] );
					for ( var n = 0 ; n < records.length ; n++ ){
						records[n].class = id;
						data.controller.group.updateCombinedGroup( records[n].id, id);
					}
				}

				ctrl.resortLabelId();
				ctrl.renderLabel();
				ctrl.renderGroups();
				ctrl.updateClassListView();
			}else{
				ctrl.errorView( lang.getString("combine-fail")  )
			}
		})
	}

	this.updateCombinedGroup = function(id, set){
		var record = data.record;
		for ( var ind = 0 ; ind < record.length ; ind++ ){
			var curRecord = record[ind];
			var curId = curRecord.class;
			if ( set.indexOf(curId)){
				curRecord.class = id;
				data.controller.group.updateCombinedGroup( curRecord.id, id );
			}
		}
	}

	this.createLabel = function(){
		var target = $("body > .overlay-view.create");
		var input = target.find(".cont > .cont > .text");
		var tip = target.find(".cont > .cont > .tip_sys");
		var text = input.val();
		tip.html("")
		for ( var ind = 0 ; ind < data.class.length ; ind++ ){
			if ( data.class[ind].name == text ){
				tip.html( lang.getString("name-exist") )
			}
		}
		if (!( text.length > 0) && (text.length<=10)){
			tip.html( lang.getString("str-len-wrong") )
		}

		if ( tip.html().length == 0 ){
			openLoading();
			data.ajax.createLabel( ctrl.getRecord().id, text, function(msg){
				closeLoading();
				console.log(msg)
				data.controller.ctrl.closeView("create")
				if (msg.code == 1 ){
					var info = msg.data;
					data.class.push( info );
					ctrl.resortLabelId();
					ctrl.renderLabel();
					ctrl.renderGroups()
					ctrl.updateClassListView();

				}else{
					ctrl.errorView(  lang.getString("create-fail")  )
				}
			})
		}
	}


	this.editLabel = function(){
		var target = $("body > .overlay-view.edit");
		var input = target.find(".cont > .cont > .text");
		var text = input.val();
		var set = ctrl.getSelectedLabel();
		var id = ""
		for ( var ind = 0 ; ind < set.length ; ind++){
			var str = set[ind];
			id+=str;
			if ( ind != ( set.length - 1 )){
				id+=","
			}
		}
		id = parseInt(id);
		if (( text.length > 0) && (text.length<=10)){
			openLoading();
			data.ajax.editLabel( id, text, function(msg){
				closeLoading();
				//console.log(msg)
				data.controller.ctrl.closeView("edit")
				if (msg.code == 1 ){
					var info = msg.data;
					var label = ctrl.getLabelById(id);
					label.name = text;
					ctrl.renderLabel();
					ctrl.renderGroups();	
					ctrl.updateClassListView();

				}else{
					ctrl.errorView(  lang.getString("rename-fail") )
				}
			})
		}
	}

	this.splitLabel = function(entry){
		var id = ctrl.getSelectedLabel()[0];
		var id_text = "";
		for ( var ind = 0 ; ind < entry.length ; ind++ ){
			var e = entry[ind];
			id_text += e.db_id;
			if ( ind != (entry.length-1 ) ){
				id_text +=",";
			}
		}

		openLoading()
		data.ajax.updateRecord ( id_text, 0, function(msg){
			data.controller.ctrl.closeView("split")
			if ( msg.code == 1 ){
				id = parseInt(msg.data.class_id)
				for ( var ind = 0 ; ind < entry.length ; ind++ ){
					var e = entry[ind];
					e.class = 0;
				}
				ctrl.renderGroups();
				ctrl.renderLabel();

			}else{
				ctrl.errorView(  lang.getString("split-fail") )
			}
			closeLoading();
		})
	}

	this.removeLabel = function(){
		var set = ctrl.getSelectedLabel();
		console.log(set);
		var text = ""
		for ( var ind = 0 ; ind < set.length ; ind++){
			var str = set[ind];
			text+=str;
			if ( ind != ( set.length - 1 )){
				text+=","
			}
		}
		openLoading();
		data.ajax.removeLabel(text, function(msg){
			console.log(msg)
			data.controller.ctrl.closeView("remove")
			closeLoading();
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
					if ( classEntry.id == id ){
						classSet.splice( ind, 1);
					}
				}
				ctrl.resortLabelId();
				ctrl.renderGroups();
				ctrl.renderLabel();
				ctrl.updateClassListView();
			}else{
				ctrl.errorView(  lang.getString("remove-fail")  )
			}
		})
	}
	this.resortLabelId = function(){
		for ( var ind  = 0 ; ind < data.class.length ; ind++ ){
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
			ids+=dbid;
			if ( ind != (dbSet.length-1) ){
				ids+=","
			}
			
		}
		openLoading()
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

				data.ajax.updateRecord( record.db_id, info.id, function( answer){
					closeLoading()
					if ( answer.code == 1 ){
						var targetCid = answer.data.class_id;
						record.class = targetCid;
						data.controller.group.updateCombinedGroup(record.id, targetCid);
						ctrl.renderLabel();

					}else{
						ctrl.errorView( lang.getString("group") +record.id+ lang.getString("label-fail")  )
					}
				})
				
			}else{
				ctrl.errorView(  lang.getString("create-fail") )
				closeLoading()
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

	this.outputRawDate = function(){
		var id = ctrl.getTemplate().id
		data.ajax.getRowData( id,function( msg ){
			//console.log(msg)
			if ( msg.code == 1 ){
				var name = "rawdata_"+ctrl.getTemplate().name;
				var a = $("<a></a>");
				
				a.attr("download","rawdata_"+ctrl.getTemplate().name+".csv");

				var link = msg.filelocation+"?download="+name;
				
				a.attr("href", link );
				a.css("z-index",9999999999)
				console.log(a.attr("href"));
				$("body").append(a);
				a[0].click();

				a.remove();
			}
		})
	}

	this.output = function(){
		var count = 0;
		var set = new Array();
		var tag = new Date().getTime();
		openLoading()
		for ( var ind = 0 ; ind < data.group.length ; ind++ ){
			var curGroup = data.group[ind];
			if ( curGroup.sentence.length != curGroup.total ){
				set.push( curGroup );
			}
		}
		if ( set.length > 0 ){
			var max = -1;
			for ( var ind = 0 ; ind < set.length ; ind++ ){
				var curGroup = set[ind];
				if ( curGroup.total > max ){
					max = curGroup.total;
				}
				/*data.ajax.getGroupSentence ( curGroup.id, 0, curGroup.total, function(msg){
					count++;
					if ( count == set.length ){
						
						ctrl.outputLabel(tag);
						ctrl.outputGroup(tag);
						closeLoading()
					}
				})*/
			}
			data.ajax.loadGroups( ctrl.getRecord().id, max, function(){
				ctrl.outputLabel(tag);
				ctrl.outputGroup(tag);
				closeLoading()
			})
		}else{
			
			closeLoading()
		}
	}

	this.outputGroup = function(tag){
		var csvContent = "";
		var string = lang.getString("output-row00");
		var set = new Array();
		set.push( {nid:0, id:0, name:lang.getString("output-term00")});
		for ( var ind = 0 ; ind < data.class.length ; ind++ ){
			set.push(data.class[ind])
		}
		for ( var ind = 0 ; ind < set.length ; ind++ ){
			var curLabel = set[ind];
			var groups = ctrl.getGroupSetByLabelId( curLabel.id );
			//var total = 0;
			for ( var n = 0 ; n < groups.length ; n++ ){
				var curGroup = groups[n];
				for ( var i = 0 ; i < curGroup.sentence.length ; i++ ){
					string += curLabel.nid + ","+curLabel.name+","+curGroup.sentence[i]+"\n";
				}
			}			
		}
		csvContent += string;
		var encodedUri = encodeURI(csvContent);
		var csvData = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		
	    saveAs(csvData, lang.getString("output-name00")+tag+".csv");
		closeLoading();
	}

	this.outputLabel = function(tag){
		var csvContent = "";
		var string = lang.getString("output-row01");
		var set = new Array();
		set.push( {nid:0, id:0, name:lang.getString("output-term00")});
		for ( var ind = 0 ; ind < data.class.length ; ind++ ){
			set.push(data.class[ind])
		}
		for ( var ind = 0 ; ind < set.length ; ind++ ){
			var curLabel = set[ind];
			var groups = ctrl.getGroupSetByLabelId( curLabel.id );
			var total = 0;
			for ( var n = 0 ; n < groups.length ; n++ ){
				total += groups[n].total;
			}
			string += curLabel.nid + ","+curLabel.name+","+total+"\n";
		}
		csvContent += string;
		var encodedUri = encodeURI(csvContent);
		var csvData = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		
	    saveAs(csvData, lang.getString("output-name01")+tag+".csv");
		closeLoading();
	}

	this.updateClassListView = function(){
		var con = $("#classList");
		con.empty();
		var source = data.class;
		for ( var ind = 0 ; ind < source.length ; ind++ ){
			var e = source[ind];
			var entry = $("<option>");
			entry.attr("value", e.name);
			con.append ( entry )
		}
	}


	ctrl.initial();

}