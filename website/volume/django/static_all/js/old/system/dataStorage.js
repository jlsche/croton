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
		label : {
			group : function(){
				return book.children(".label").children(".group");
			},
			preview : function(){
				return book.children(".label").children(".preview");
			},
			result : function(){
				return book.children(".label").children(".result");
			}
		},
		evt : {
			body : new evtManage( $("body"))
		},
		textData : new Object({
			label : new Array(),
			data : new Object(),
			count : 0
		}),
		ajax : new Object()

	});

	/*this.testKeyword = function (argument) {
		var set = ["痴情" ,"太子" ,"什么","眼睫毛"];
		data.ajax.getKeywordAssoc( set ,function(msg){
			for ( var ind = 0 ; ind < set.length ; ind++ ){
				console.log( data.textData.data[set[ind]])
			}
		})
	}*/
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
	}
	

	data.ajax.getGroupSentence = function( id, st, n , call){
		$.ajax({
			url: fixUrl+"/getGroupSentence?group_id="+id+"&start_val="+st+"&n="+n,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			//crossOrigin:true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					console.log(msg)
					var r = new Object();
					r.type = true;
					r.data = msg.sentence;
					var g = ctrl.getGroupById(parseInt(id));
					console.log(g)
					var data = r.data;
					for ( var ind = 0 ; ind < data.length ; ind++ ){
						g.sentence.push(data[ind]);
					}
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
		var url = fixUrl+"/getClass?record_id=" + id;
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
					var r = new Object();
					r.type = true;
					r.data = msg;
					notUndefined(call, r);
				}
			}
		});	
	}

	data.ajax.loadRecord = function(id, call){
		var url = fixUrl+"/loadWorkingGroups?record_id=" + id;
		console.log(url)
		$.ajax({
			url: url,
			headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			crossOrigin : true,
			method:"GET",
			dataType : "json",
			statusCode: {			
				200: function(msg){
					//console.log(msg)
					var r = new Object();
					r.type = true;
					var set = new Array();
					for ( var ind = 0 ; ind < msg.length ; ind++ ){
						var obj = msg[ind];
						
						var v = new Array();
						
						set.push(new Object({
							id : obj.pid,
							db_id : obj.id,
							groups : obj.cid,
							label : obj.label,
							parent:obj.parent,
							class:obj.class_id
						}));
					}
					r.data = set;
					r.data.sort( function( a, b ){
						return a.id - b.id;
					});

					//console.log(r.data)
					notUndefined(call, r);
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
					//console.log(msg)
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


	this.updateRecord = function( info, call){
		console.log(data.ajax)
		
		data.ajax.updateRecord(info, function(){
			data.controller.group.groupFilter();
			data.controller.group.tagRender();
			notUndefined(call)
		})
	}
	

	this.initial = function(){
		data.controller.group = new groupController( ctrl, data, book, 0 );
		data.controller.preivew = new previewController( ctrl, data, book, 1 );
		data.controller.result = new resultController( ctrl, data, book, 2 );
		
		//


		var indexBtn = book.children(".label").children(".index");
		indexBtn.unbind("click");
		indexBtn.bind("click", function(){
			var e = $(this);
			var ind = parseInt( e.attr("page-ind") );
			if ( !e.hasClass("disabled")){
				console.log(ind)
				var target = book.children(".view").children(".page0"+ind);
				target.siblings().removeClass("active");
				target.addClass("active")
			}
		});


		
		//ctrl.getPageController(0).start();
	}
	this.clear = function(){
		data.textData.label = new Array();
		data.textData.data = new Object();
		data.textData.class = new Array();
		data.textData.count = 0;
		data.curRecord = -1;;
	}

	this.start = function(){
		ctrl.getPageController(0).start();
		data.controller.result.draw();
		
	}

	this.getData = function () {
		return data;
	}

	this.next = function(){
		var curPage = book.children(".label").children(".index.active");
		var ind = parseInt(curPage.attr("page-ind"));
		var targetId = ind+1;
		var target = book.children(".label").children(".index[page-ind='"+(targetId)+"']");
		if ( target.length == 0 ){	
			target = book.children(".label").children(".index[page-ind='0']");
			targetId = 0;
		}
		console.log( target )

		var nextCtrl = ctrl.getPageController( targetId );
		console.log( nextCtrl )
		if ( typeof(nextCtrl) != 'undefined'){
			nextCtrl.start()
		}
	}

	this.back = function(){
		var curPage = book.children(".label").children(".index.active");
		console.log(curPage)
		var ind = parseInt(curPage.attr("page-ind"));
		var targetId = ind-1;
		if ( targetId >= 0 ){
			var target = book.children(".label").children(".index[page-ind='"+(targetId)+"']");
			if ( typeof(target) != 'undefined' ){	
				var preCtrl = ctrl.getPageController( targetId );
				if ( typeof(preCtrl) != 'undefined'){
					preCtrl.start()
				}
			}
		}
	}

	this.showPage = function( n ){
		book.children(".view").children(".page").removeClass("active");
		book.children(".view").children( "."+ ctrl.getPageCode(n) ).addClass("active");
	}

	this.getPageController = function( n ){
		for ( str in data.controller ){
			if ( data.controller[str].getOrder() == n ){
				return data.controller[str];
			}
		}
	}

	this.getLabels = function(){
		return curPage = book.children(".label");
	}

	this.getPageCode = function( n ){
		var num = "";
		if ( parseInt(n) < 10 ){
			num = "0"+n;
		}else{
			num = n.toString();
		}
		return "page"+num;
	}

	// modify function
	this.isCombinedRecord = function(id){
		if ( ctrl.getChildGroup(id).length > 0 ){
			return true;
		}
		return false;
	}



	// create
	/*this.createRecord = function( set ) {
		var del = new Array();
		var child = new Array();
		for ( var ind = 0 ; ind < set.length ; ind++ ){
			var id = set[ind];
			if ( ctrl.isCombinedRecord(id) ){
				var c = ctrl.getChildGroup(id);
				for ( var nind = 0 ; nind < c.length ; nind++ ){
					child.push( c[nind] );
				}
				del.push( id );
			}else{
				child.push( ctrl.getGroupById(id) );
			}
		}

		for ( var ind = 0 ; ind < data.record.length ; ind++ ){
			var record = data.record[ind];
			var id = record.id;
			if ( del.indexOf(record.id) != -1 ){
				data.record.splice(ind, 1);
				ind--;
			}
		}

		data.record.sort( function( a, b ){
			return a.id - b.id;
		});
		var newId = data.record [ data.record.length - 1 ].id + 1;
		data.record.push( new Object({
			id : newId,
			class_id : -1,
			parent : -1,
			keyword : []
		}));
		for ( var ind = 0 ; ind < child.length ; ind++ ){
			ctrl.getRecordById(child[ind].id).parent = newId;
		}	
		
		return newId;
	}*/


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

	//merge
	this.mergeChildKeyword = function( set ){
		var result = new Array();
		for ( var ind = 0 ; ind < set.length ; ind++ ){
			var e = set[ind];
			for ( var nind = 0 ; nind < e.keyword.length ; nind++ ){
				var k = e.keyword[nind];
				if ( result.indexOf(k) == -1 ){
					result.push(k)
				}
			}
		}
		return result;
	}

	this.mergeChildsentence = function( set ){
		var result = new Array();
		for ( var ind = 0 ; ind < set.length ; ind++ ){
			var e = set[ind];
			for ( var nind = 0 ; nind < e.sentence.length ; nind++ ){
				var k = e.sentence[nind];
				if ( result.indexOf(k) == -1 ){
					result.push(k)
				}
			}
		}
		return result;
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



	this.deleteRecordByDBId = function(id){
		for ( var ind = 0 ; ind < data.record.length ; ind++ ){
			var e = data.record[ind];
			if ( e.db_id == id ){
				data.record.splice(ind, 1);
				break;
			}
		}
	}
	this.combineGroup = function( set, call){
		var record = ctrl.getRecord().id;
		var newId = -1;
		data.ajax.mergeWorkingGroup( record, set, function( back ){
			if ( back.delete.id.length > 0 ){
				for ( var ind = 0 ; ind < back.delete.id.length ; ind++ ){
					var curId = parseInt(back.delete.id[ind]);
					ctrl.deleteRecordByDBId(curId);
				}
			}

			if ( back.update.length > 0 ){
				for ( var ind = 0 ; ind < back.update.length ; ind++ ){
					var entry = back.update[ind];
					var record = ctrl.getRecordById( parseInt( entry.pid ));					
					record.parent = parseInt( entry.parent );
					console.log(record)
				}
			}
			if ( back.create.length > 0 ){
				var obj = back.create[0];
				var set = JSON.parse( "["+ obj.cid +"]");
				newId = obj.pid;
				data.record.push(new Object({
					id : obj.pid,
					db_id : obj.id,
					groups : set,
					label : "",
					parent: -1,
					class:0
				}));
			}



			notUndefined( call, newId);
		} )
	}

	this.decomposeGroup = function( source, target, call){
		var record = ctrl.getRecord().id;
		var newId = -1;
		data.ajax.decompositeWorkingGroup( record, source, target, function( back ){
			if ( back.delete.length > 0 ){
				for ( var ind = 0 ; ind < back.delete.length ; ind++ ){
					var curId = parseInt(back.delete[ind]);
					ctrl.deleteRecordByDBId(curId);
				}
			}

			if ( back.update.length > 0 ){
				for ( var ind = 0 ; ind < back.update.length ; ind++ ){
					var entry = back.update[ind];
					var record = ctrl.getRecordById( parseInt( entry.pid ));					
					record.parent = parseInt( entry.parent );
					record.groups = entry.cid;	
					console.log(record)
				}
			}
			
			notUndefined( call );
		} )
	}


	this.testCall = function(){
		console.log("call for test relation");
	}

	this.getDBIdByRecordId = function(id){
		return ctrl.getRecordById(id).db_id;

	}

	this.output = function(){
		var r_id = parseInt(book.attr("record-id"));
		data.ajax.loadGroups(r_id, 10, function(msg){
			openLoading()
			var group = msg.data;
			var csvContent = "data:text/csv;charset=utf-8,\uFEFF"+lang.getString("output-row");
			var set = new Array();
			for ( var ind = 0 ; ind < data.record.length ; ind++ ){
				var e = data.record[ind];
				if ( e.class != 0 ){
					set.push(e)
				}
			}

			var cSet = new Array();
			for ( var ind = 0 ; ind < data.class.length ; ind++ ){
				var e = data.class[ind];
				cSet.push( new Object({
					id : e.id,
					name : e.name,
					children : new Array()
				}))
			}

			for ( var ind = 0 ; ind < set.length ; ind++ ){
				var e = set[ind];
				for ( var n = 0 ; n < cSet.length ; n++ ){
					var ce = cSet[n];
					if (e.class == ce.id){
						ce.children.push(e)
					}
				}
			}

			for ( var n = 0 ; n < cSet.length ; n++ ){
				var ce = cSet[n];
				console.log(ce)
				if ( ce.children.length == 0 ){
					cSet.splice(n, 1);
					n--;
				}
			}
			
			for ( var n = 0 ; n < cSet.length ; n++ ){
				var ce = cSet[n];
				
				var child = ce.children;
				for ( var k = 0 ; k < child.length ; k++ ){
					var string = "";
					var ke = child[k]
					if ( k == 0 ){
						string += ce.name+","
					}else{
						string += ","
					}
					string += ke.groups.toString().replace(/,/g, " ")+","+ke.label.replace(/,/g," ").replace(/\n/," ")+",";
					
					
					var key_set = new Array();
					var sentence = new Array();
					for ( var l = 0 ; l < ke.groups.length ; l++ ){
						var gId = ke.groups[l];
						var ge;
						for ( var t = 0 ; t < group.length ; t++ ){
							if ( gId == group[t].id ){
								ge = group[t];
							}
						}
						for ( var t = 0 ; t < ge.keyword.length ; t++ ){
							var tentry = ge.keyword[t].replace(/ /g,"").replace(/,/g," ");
							if ( key_set.indexOf(tentry) == -1 ){
								key_set.push(tentry)
							}
						}

						for ( var t = 0 ; t < ge.sentence.length ; t++ ){
							var tentry = ge.sentence[t].replace(/ /g,"").replace(/,/g," ");
							if ( sentence.indexOf(tentry) == -1 ){
								sentence.push(tentry)
							}
						}
					}

					string += key_set.toString().replace(/,/g," ")+",";
					string += sentence.toString().replace(/,/g," ")+" ";
					
					
					csvContent += string+"\n";
				}
				
			}

			var encodedUri = encodeURI(csvContent);
			var link = document.createElement("a");
			link.setAttribute("href", encodedUri);
			link.setAttribute("download", ctrl.getTemplate().name+"_"+ctrl.getRecord().name+"_"+(parseInt(new Date().getTime()/1000))+".csv");
			document.body.appendChild(link); // Required for FF

			link.click(); // This will download the data file named "my_data.csv".
			//console.log(link)
			$(link).remove();
			closeLoading();
		})
		
	}


	ctrl.initial();

}