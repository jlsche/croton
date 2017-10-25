function group_ctrl (main, data) { 	// main: dataSystem
	var global = data;
	var ajax = data.ajax;
	var ctrl = this;
	var cont = $("body > .main > .book > .main > .panel.left");
	var full_btn = cont.find(".item > .entry > .id.sel > .checkbox") ;
	var filter_btn = cont.find(".item > .entry > .label > .mark > .sel");

	this.render = function( data ) {
		var con = cont.children(".list");
		con.empty();

		for ( var ind = 0 ; ind < data.length ;ind++) {
			var curData = data[ind];
			var clone = cont.find(".hidden > .entry").clone();
			var check = clone.find(".id.sel > .checkbox");

			ctrl.listCheckBoxEvt(check);
			clone.find(".id.sel > .text").html( curData.id );
			//console.log( curData.group)
			clone.children(".string").html( curData.group_entry().sentence );
			ctrl.sentenceTrigger(clone.children(".string"));
			clone.children(".num").html( curData.group_entry().total );
			clone.find(".label > .text").val( main.getLabelNameById( curData.class ) );

			ctrl.labelSelEvt( clone.children(".label") );
			/*ctrl.labelChangeEvt ( clone.children(".label") );*/
			clone.attr("sel", 0);
			clone.attr("gid", curData.group );
			clone.attr("rid", curData.id );
			clone.attr("cid", curData.class );
			clone.attr("dbid", curData.db_id);

			con.append(clone);
		}
	}

	this.partialRenderLabel = function(data, value) {
		var con = cont.children(".list").children(".entry");

		con.each(function() {
			for ( var ind = 0 ; ind < data.length ; ind++ ) {
				if ($(this).attr("rid") == data[ind].id){
					$(this).attr("cid", 0);
					$(this).children(".label").find(".text").val(value);
				}	
			}
		})
	}

	this.sentenceTrigger = function(e) {
		var evt = function() {
			var entry = $(this).parent();
			var rid = parseInt( entry.attr("rid"));
			var record = main.getRecordById(rid);
			var group = record.group_entry();
			
			openLoading();
			ajax.getGroupSentence(group.id, 0, group.total, function(msg) {
				if ( msg.type ) {
					var data = msg.data;
					group.sentence = data;
					ctrl.sentenceView(data);
					closeLoading();
				}
			})
			// WTF is the if-else condition for???
			/*
			if ( group.sentence.length != group.total ){
				openLoading();
				console.log( group.total );
				ajax.getGroupSentence(group.id, 0, group.total, function(msg) {
					console.log(msg);
					if ( msg.type ) {
						var data = msg.data;
						group.sentence = data;
						ctrl.sentenceView(data);
						closeLoading();
					}
				})
			}else{
				ctrl.sentenceView(group.sentence);
			}
			*/
		}
		e.unbind("click");
		e.bind("click", evt);
	}

	this.sentenceView = function(data){
		var target = $("body > .overlay-view.group");
		var template = jqDOM.div("entry");
		var con = target.find(".cont > .cont > .list");
		target.find(".cont > .cont > .tip > .default").html( data[0])
		target.find(".cont > .cont > .tip > .num").html( data.length)
		if ( data.length > 0 ){
			con.empty();

			for ( var ind = 0 ; ind < data.length ; ind++ ){
				con.append( template.clone().html(data[ind]));
			}
		}
		con = target.find(".cont > .cont > .opt > .entry > .ctrl > .checkbox").removeClass("active");
		target.addClass("active");
	}

	this.listCheckBoxEvt = function( e ){
		var evt = function(){
			var entry = $(this);
			if  ( entry.hasClass("active") ){
				entry.removeClass("active");
				full_btn.removeClass("active");
				entry.parent().parent().attr("sel", 0)
			}else{
				entry.addClass("active")
				entry.parent().parent().attr("sel", 1)
			}
		}
		e.unbind("click");
		e.bind("click", evt);
	}

	/*this.entryChange = function(){
		var list = cont.children(".list").children(".entry");

	}*/

	this.fullSelectEvt = function() {
		var evt = function(){
			var entry = $(this);

			var list = cont.children(".list").children(".entry");
			list.attr("sel",0);
			list.find(".id.sel > .checkbox").removeClass("active")
			if  ( entry.hasClass("active") ){
				entry.removeClass("active");
			}else{
				entry.addClass("active");
				var subList = list.not(".block").not(".filter");
				for (var ind = 0; ind < subList.length ; ind++ ){
					var entry = subList.eq(ind);
					entry.attr("sel",1);
					entry.find(".id.sel > .checkbox").addClass("active");
				}
			}
		}
		full_btn.unbind("click");
		full_btn.bind("click", evt);
	}

	this.releaseAllCheckBox = function(){
		var list = cont.children(".list").children(".entry");
		list.attr("sel",0);
		list.find(".id.sel > .checkbox").removeClass("active");
		full_btn.removeClass("active")
	}

	this.releaseSingleGroupByRId = function(rid){
		var list = cont.children(".list").children(".entry[rid='"+rid+"']");
		list.attr("sel",0);
		list.find(".id.sel > .checkbox").removeClass("active");
		full_btn.removeClass("active")
	}

	this.removeBlock = function(){
		var list = cont.children(".list").children(".entry");
		list.removeClass("block");
	}

	this.groupBlock = function(set){
		var list = cont.children(".list").children(".entry");
		ctrl.removeBlock();
		if ( set.length > 0 ){
			ctrl.releaseAllCheckBox()
		}
		/*for ( var ind = 0 ; ind < set.length ; ind++ ){
			var curGid = set[ind];
			var target = list.parent().children(".entry[gid='"+curGid+"']");
			target.addClass("block");
		}*/
		if ( set.length > 0){
			for ( var ind = 0 ; ind < set.length ; ind++ ){
				var curGid = set[ind];
				var list = list.not("[gid='"+curGid+"']");
				
			}
			list.addClass("block");
		}else{
			list.removeClass("block")
		}
	}

	this.groupFilter = function(set){
		var list = cont.children(".list").children(".entry");
		list.removeClass("filter")
		if ( set.length > 0 ){
			list.each( function(ind ){
				var entry = list.eq(ind);
				var cid = parseInt( entry.attr("cid") );
				if ( set.indexOf(cid) == -1 ){
					entry.addClass("filter")
				}
			})
		}
	}

	this.updateCombinedGroup = function(id, class_id){
		var target = cont.children(".list").children(".entry[rid='"+id+"']");
		target.attr("cid", class_id);
		target.find(".label > .text").val( function(){
			return main.getLabelNameById( class_id );
		})
	}

	/*this.updateSingleGroupById = function( id ){
		var record = main.getRecordById (id);
		var target = cont.children(".list").children(".entry[rid='"+id+"']");
	}*/

	this.labelSelEvt = function( obj ){
		var btn = {
			entry : obj,
			sel : obj.find(".mark > .sel"),
			add : obj.find(".mark > .add"),
			text : obj.find(".text")
		}

		var optClick = function(){
			var e = $(this);
			console.log(e.html())
			var cid = parseInt( e.attr("cid") );
			var rid = parseInt( e.parent().attr("rid"))
			var dbid = parseInt( e.parent().attr("dbid"));
			console.log(cid)
			console.log(rid)
			console.log(dbid)
			main.updateSingleGroup( rid, dbid, cid);
		}

		var checkClassByName = function( name ){
			var set = main.getLabelList();
			var result = { id :-1, name:""};
			for ( var ind = 0 ; ind < set.length ; ind++ ){
				if ( set[ind].name == name ){
					result = set[ind];
					break;
				}
			}

			return result;

		}

		var optPanelEvt = function(){
			var ele = $(this);
			var con = ele.parent();
			var current = cont.find(".list > .entry").has( ele ).css("z-index", 51);
			cont.find(".list > .entry").not( current ).css("z-index", "");
			
			var text = this.value; //输入框的内容
			//opt
			cont.find(".list > .entry .opt.opt-panel").remove();
			var opt = jqDOM.div ("opt opt-panel");
			opt.css("z-index",999999)
			var list = new Array()
			var curLabelId = parseInt(con.parent().attr("cid"));

			opt.attr("rid", con.parent().attr("rid"));
			opt.attr("dbid", con.parent().attr("dbid"));
			//list.push({id:0, name: ""});
			list.push({label_id:0, name: ""});
			var set = main.getLabelList();

			for ( var ind = 0 ; ind < set.length ; ind++ ){
				list.push( set[ind])
			}

			for ( var ind = 0 ; ind < list.length ; ind++ ){
				//var id = list[ind].id;
				var id = list[ind].label_id;
				var name = list[ind].name;
				var entry = jqDOM.div("entry");
				entry.attr("cid", id)
				entry.html(name);
				if ( id == curLabelId ){
					entry.addClass("active")
				}
				if ( text.length > 0 ){
					if ( name.indexOf(text) == -1 ){
						entry.addClass("hide")
					}
				}			
				entry.bind("click", optClick);
				opt.append(entry);			
			}

			if ( opt.children().length > 0 )
				con.append(opt);
			else
				opt.remove();
		}

		btn.entry.bind("mouseleave", function(){
			$(this).children(".opt").remove();
		})

		btn.sel.bind("click", function(){
			btn.entry.children(".opt").remove();
			var opt = jqDOM.div ("opt");
			var list = new Array()
			var curLabelId = parseInt(btn.entry.parent().attr("cid"));
			opt.attr("rid", btn.entry.parent().attr("rid"));
			opt.attr("dbid", btn.entry.parent().attr("dbid"));
			list.push({id:0, name:""});
			var set = main.getLabelList();
			for ( var ind = 0 ; ind < set.length ; ind++ ){
				list.push( set[ind])
			}
			for ( var ind = 0 ; ind < list.length ; ind++ ){
				var id = list[ind].id;
				var name = list[ind].name;
				var entry = jqDOM.div("entry");
				entry.attr("cid", id)
				entry.html(name);
				if ( id == curLabelId ){
					entry.addClass("active")
				}
				entry.bind("click", optClick);
				opt.append(entry);
			}
			btn.entry.append(opt);

		})

		btn.text.bind("input", function() {
			var text = $(this).val();
			var list = btn.entry.children(".opt");
			list.children(".entry").each( function(ind) {
				var entry = list.children(".entry").eq(ind);
				entry.removeClass("hide");
				if ( entry.html().indexOf(text) == -1 ) {
					entry.addClass("hide");
				}
			})
		});

		btn.text.bind("click", optPanelEvt);

		btn.text.bind("keyup", function(event){
			var e = $(this);
			var text = e.val();
			var target = checkClassByName(text);
			
			btn.add.removeClass("active")
			btn.sel.addClass("active")
			if ( target.id == -1 ){
				btn.add.addClass("active")
				btn.sel.removeClass("active")
			}
			if (event.keyCode == 13){
				btn.entry.children(".opt").remove();
				btn.text.blur();
			}
		})

		btn.text.bind("blur", function(){
			var e = $(this);
			var text = e.val();
			var opt = $(this).parent().children(".opt");

			if ( opt.length == 0 ){
				if ( text.length > 0 ){
					var target = checkClassByName(text);
					btn.add.removeClass("active")
					btn.sel.addClass("active")
					if (( target.id == -1 )){
						var entry = e.parent().parent();
						var cid = parseInt( entry.attr("cid"));
						var dbid =  parseInt( entry.attr("dbid"));
						var rid =  parseInt( entry.attr("rid"));
						var result = main.getLabelNameById(cid)
						main.createLabelByTyping( text, rid);
					
					}else{
						//var cid = parseInt( target.id );
						var cid = parseInt( target.label_id );
						var row = e.parent().parent();

						var rid = parseInt( row.attr("rid"))
						var dbid = parseInt( row.attr("dbid"));

						if ( parseInt(row.attr("cid")) != cid ){
							main.updateSingleGroup( rid, dbid, cid);
						}
					}
				}else{
					var row = e.parent().parent();
					var rid = parseInt( row.attr("rid"))
					var dbid = parseInt( row.attr("dbid"));
					if ( parseInt(row.attr("cid")) != 0 ){
						main.updateSingleGroup( rid, dbid, 0);
					}
				}
			}
			//$(this).parent().children(".opt").remove();	
		})
	}

	this.filterEvt = function() {
		var evt = function() {
			var e = $(this);
			main.filterView();
		}
		filter_btn.unbind("click");
		filter_btn.bind("click", evt);
	}

	this.filterViewEvt = function() {
		var fillEvt = function() {
			var e = $(this);
			var list = e.parent().parent().parent().parent().parent().find(".list > .entry");
			if ( e.hasClass("active") ) {
				e.removeClass("active");
				list.find(".ctrl > .checkbox").removeClass("active");
				list.attr("sel", 0);
			}else {
				e.addClass("active");
				list.find(".ctrl > .checkbox").addClass("active");
				list.attr("sel", 1);
			}
		}
		var target = $("body > .overlay-view.label");
		var fill_check = target.find(".cont > .cont > .opt > .entry > .ctrl > .checkbox");
		var list = target.find(".cont > .cont > .list > .entry");
		var btn = {
			apply : target.find(".cont > .ctrl > .apply"),
			cancel : target.find(".cont > .ctrl > .cancel")
		};

		btn.apply.unbind("click");
		btn.cancel.unbind("click");
		fill_check.unbind("click");
		btn.apply.bind("click", function(){
			var e = $(this);
			var list = e.parent().parent().find(".cont > .list > .entry[sel='1']");
			var array = new Array();
			for ( var ind = 0 ; ind < list.length ; ind++ ){
				var id = parseInt(list.eq(ind).attr("cid"));
				array.push(id)
			}
			global.filterList = array;
			target.removeClass("active");
			main.groupFilter();
		});
		btn.cancel.bind("click", function(){
			target.removeClass("active");
		})
		fill_check.bind("click", fillEvt);
	}

	this.showFilterView = function( data ) {
		var evt = function(){
			var entry = $(this);		
			if  ( entry.hasClass("active") ) {
				entry.removeClass("active");
				entry.parent().parent().attr("sel", 0);
			}else{
				entry.addClass("active");
				entry.parent().parent().attr("sel", 1);
			}
		}

		var target = $("body > .overlay-view.label");
		var template = target.find(".hidden > .entry");
		var con = target.find(".cont > .cont > .list");
		if ( data.length > 0 ) {
			con.empty();
			for ( var ind = 0 ; ind < data.length ; ind++ ){
				var curData = data[ind];
				var clone = template.clone();
				var box = clone.find(".ctrl > .checkbox");
				console.log(curData);
				box.bind("click", evt);
				//clone.attr("cid", curData.id );
				clone.attr("cid", curData.label_id );
				clone.attr("sel", 0);
				clone.children(".text").html ( curData.nid + " - "+ curData.name);

				if ( global.filterList.length > 0 ){
					//if ( global.filterList.indexOf(curData.id) != -1 ){
					if ( global.filterList.indexOf(curData.label_id) != -1 ){
						clone.attr("sel", 1);
						box.addClass("active");
					}
				}
				con.append( clone );
			}
		}
		target.addClass("active");	
	}

	this.init = function() {
		full_btn.removeClass("active");
		ctrl.fullSelectEvt();
		//ctrl.filterEvt();
		//ctrl.filterViewEvt();
	}

	ctrl.init();
}
