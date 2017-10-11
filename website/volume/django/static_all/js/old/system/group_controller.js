function groupController (main, data, book, order) {
	var ctrl = this;
	var data = data;
	var book = book;
	var main = main;
	var order = order;
	var views = new Object ({});
	this.initial = function(){
		//console.log( " init the class ")
		//main.testCall();
		views.keyword = new groupKeywordView(ctrl);
		views.viewer = new groupViewerView(ctrl);
		views.group = new groupGroupView(ctrl);
		views.controller = new groupCtrlView(ctrl);

		data.views.groupList = function(){
			return ctrl.getView().children(".left-column").children(".groups");
		}
		data.views.groupKeyword = function(){
			return ctrl.getView().children(".right-column").children(".keyword");
		}
		data.views.groupView = function(){
			return ctrl.getView().children(".right-column").children(".viewer");
		}
		data.views.groupCtrl = function(){
			return ctrl.getView().children(".right-column").children(".controller");
		}

		ctrl.lock()
	}



	this.start = function(){
		var labels = main.getLabels();
		var target = labels.children(".index[page-ind='"+(order)+"']");
		//console.log(data.group)
		views.viewer.clear();
		views.group.clear();
		views.group.groupRender( ctrl.getRenderGroup() );
		views.group.combinedCheck( data.record );
		ctrl.tagRender()
		if ( typeof(target) != 'undefined' ){
			target.siblings().removeClass("active");
			target.addClass("active");
			target.removeClass("disabled");
			labels.children(".result").removeClass("disabled");
			labels.children(".preview").addClass("disabled");

			main.showPage(order)
		}

		if ( data.curRecord != -1 ){
			views.group.groupActive( data.curRecord  );
		}
		//views.controller.show();
		ctrl.show();
	}

	this.tagRender = function(){
		var set = new Array();
		var keyword = new Array();
		for ( var ind = 0 ; ind < data.record.length ; ind++ ){
			var e = data.record[ind];

			if (( e.class == 0 ) && (e.parent==-1)){
				//console.log("main gc")
				var gSet = main.getChildGroup(e.id);
				//console.log(e)
				if ( gSet.length == 0 ){
					//gSet.push( main.getGroupById(e.id) );
					for ( var n = 0 ; n < e.groups.length ; n++ ){
						var g_id = e.groups[n];
						var g_entry = main.getGroupById( g_id );
						if ( typeof(g_entry) != "undefined") {
							gSet.push( g_entry );
						}else{
							console.log( "can't find the group id ("+g_id+") of working group : "+e.db_id)
						}
						
					}
				}
				//console.log(gSet)
				for ( var n = 0 ; n < gSet.length ; n++ ){
					var g = gSet[n];
					if ( typeof(g) != "undefined"){
						for ( var k = 0 ; k < g.keyword.length ; k++ ){
							var key = g.keyword[k];
							if ( keyword.indexOf(key) == -1 ) {
								keyword.push(key)
							}
						}
					}else{
						console.log(g)
					}
					
				}
			}
		}
		views.keyword.tagRender( keyword );
		
	}

	// decompose and combine
	this.decomposeGroup = function(id){
		console.log(id)
		var record = ctrl.getRecordById(id);
		console.log(record)
		var source = ctrl.getRecordByDBId(record.parent);
		//var child = ctrl.getChildGroup(source.id);
		record.parent = -1;
		openLoading();
		main.decomposeGroup( source.db_id, record.groups[0], function(){

			views.group.groupRender( ctrl.getRenderGroup() );
			views.group.combinedCheck( data.record );
			if ( typeof(record) != 'undefined' ){
				views.group.groupActive(source.id);
			}
			ctrl.groupSelect();
			ctrl.groupFilter();
			closeLoading()

		})
		
		
	}

	// filter function
	this.keywordFilter = function(str){
		views.keyword.filter(str);
	}

	this.groupFilter = function(){
		var set = ctrl.getFilterGroup();
		views.group.filter( set.unHide, set.classed , ctrl.getActiveTag() );
		ctrl.groupSelect();
	}

	this.groupSelect = function(){
		//var con = data.views.groupCtrl();
		data.curRecord = -1;
		var set = ctrl.getActiveGroup();
		views.viewer.clear();
		if ( set.length == 1 ){
			var id = set[0];
			console.log(id)
			var child = ctrl.getChildRecord(id);
			console.log(child)
			data.curRecord = id;
			views.viewer.filter( id, child );
		}else if ( set.length > 1 ){
			data.record.sort( function(a, b){
				return a.id - b.id;
			})
			var id = data.record[ data.record.length - 1 ] + 1;
		}
		views.controller.filter(set.length);
	}


	this.testCall = function(key){
		//console.log("call for test relation( groupController - "+key+" )");
	}

	// modify function
	this.isCombinedRecord = function(id){
		return main.isCombinedRecord(id);
	}

	this.combineGroup = function(){
		var arr = ctrl.getActiveGroup();
		var set = new Array();
		for ( var ind = 0 ; ind < arr.length ; ind++ ){
			var obj = main.getDBIdByRecordId( arr[ind] )
			set.push(obj )

		}
		console.log(set)
		if ( set.length > 1 ){
			//openLoading();

			main.combineGroup( set, function( newId ){
				views.group.groupRender( ctrl.getRenderGroup() );
				views.group.combinedCheck( data.record );
				if ( newId > 0 ){					
					views.group.groupActive( newId );
				}
				ctrl.groupSelect();
				ctrl.groupFilter();
				closeLoading();
			})
		}
	}

	

	this.getRenderGroup = function (){
		var result = new Array();
		var group = data.group;
		var record = data.record;
		//console.log(record)
		for ( var ind = 0 ; ind < record.length ; ind++ ){
			var re = record[ind];
			var group = re.groups;

			if ( re.class != 0 ){
				console.log(re)
			}
			
			if ( group.length > 1 ){
				//console.log(re)
				var o = new Object ();
				var c = ctrl.getChildGroup( re.id )
				o.class = re.class;
				//	console.log(c)
				o.id = re.id;
				o.keyword = ctrl.mergeChildKeyword( c );
				o.sentence = ctrl.mergeChildsentence( c );
				o.total = 0;

				for ( var n = 0 ; n < c.length ; n++ ){
					o.total += c[n].total;
				}
				result.push ( o );
			}else{
				var e = ctrl.getGroupById( parseInt(group[0]) );
				var o = (cloneObject( e ));
				o.class = re.class;
				o.id = re.id;
				result.push ( o )
			}			
		}
		console.log(result)
		return result;
	}
	
	this.getChildGroup = function( id ){
		return main.getChildGroup(id);
	}

	this.getChildRecord = function( id ){		
		return main.getChildRecord(id);
	}

	this.mergeChildKeyword = function( set ){
		return main.mergeChildKeyword(set);
	}

	this.mergeChildsentence = function( set ){
		return main.mergeChildsentence(set);
	}

	// get function

	this.getOrder = function(){
		return order;
	}

	this.getActiveTag = function(){
		var con = data.views.groupKeyword();
		var list = con.children(".list");
		var tags = list.children(".tag.active");
		var arr = new Array();
		for ( var ind = 0 ; ind < tags.length ; ind++ ){
			var e = tags.eq(ind);
			arr.push( e.attr("value") );
		}
		return arr;
	}

	this.getActiveGroup = function(){
		var con = data.views.groupList();
		var list = con.children(".list");
		var entry = list.children(".entry.active").not(".item");
		//console.log(list)
		var arr = new Array();
		for ( var ind = 0 ; ind < entry.length ; ind++ ){
			var e = entry.eq(ind);
			arr.push( parseInt(e.attr("group-id")) );
		}
		return arr;
	}

	this.getView = function(){
		return book.find(".view > .group-in > .container");
	}


	this.getGroupById = function(id){
		return main.getGroupById(id);
	}

	this.getRecordById = function (id){
		return main.getRecordById(id);
	}


	this.getRecordByDBId = function (id){
		return main.getRecordByDBId(id);
	}

	this.getFilterGroup = function(){
		var arr = ctrl.getActiveTag();
		var record = data.record
		var classed = new Array();
		var result = new Array ();
		if ( arr.length > 0 ){
			for ( var ind = 0 ; ind < record.length ; ind++ ){
				var e = record[ind];
				var keywords = ctrl.getGroupKeywords(e.id);
				var exist = true;

				for ( var rind = 0 ; rind < arr.length ; rind++ ){
					if ( keywords.indexOf(arr[rind]) == -1 ){
						exist = false;
						break;
					}
				}
				if ( !((!exist) && ( arr.length > 0 ) )){
					//result.push( new Object( { id : e.id, hide : true } ));
					result.push( new Object( { id : e.id, hide : false } ));
				}
			}
		}

		for ( var ind = 0 ; ind < record.length ; ind++ ){
			var e = record[ind];
			if ( e.class != 0 ){
				classed.push( {id : e.id});
			}
		}

		
		return {
			unHide : result, 
			classed : classed
		};
	}

	this.getGroupKeywords = function(id){
		return main.getGroupKeywords(id);
	}

	this.getGroups = function(){
		return data.group;
	}


	this.getGroupSentence = function(id, st, n, call){
		data.ajax.getGroupSentence(id, st, n, call);
	}


	//ajax loader



	
	// next 
	this.show = function(){
		views.controller.show();
		views.keyword.show();
		views.group.show();
		views.viewer.show()
	}

	this.lock = function(){
		views.controller.lock();
		views.keyword.lock();
		views.group.lock();
		views.viewer.lock()
	}
	this.nextPage = function(){
		ctrl.lock();
		data.textData.label = new Array();
		main.next();
	}



	ctrl.initial();	
}