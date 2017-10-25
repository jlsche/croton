function controller_ctrl (main, data) {
	var global = data;
	var ctrl = this;
	var top_cont = $("body > .main > .book > .top > .panel.ctrl");
	var bot_cont = $("body > .main > .book > .main > .ctrl");
	var searchText = top_cont.find(".input > .text");
	var searchBtn = top_cont.find(".input > .search");
	var searchClear = top_cont.find(".input > .clear");
	var output = top_cont.find(".output > .data");
	var rawData = top_cont.find(".output > .rawdata");
	var sentenceOutput = top_cont.find(".output > .sentenceOutput");
	var fun = {
		create : bot_cont.find(".create"),
		combine : bot_cont.find(".combine"),
		split : bot_cont.find(".split"),
		remove : bot_cont.find(".remove"),
		edit : bot_cont.find(".edit"),
		all : bot_cont.find(".entry")
	}

	this.outputEvt = function(){
		/*
		var LabelEvt = function (){
			main.output();
		}

		var RawdataEvt = function (){
			main.outputRawDate();
		}

		var sentenceOutputEvt = function (){
			main.outputSentence();
		}
		*/
		//rawData.unbind("click");
		//rawData.bind("click", RawdataEvt);

		//output.unbind("click");
		//output.bind("click", LabelEvt);

		//sentenceOutput.unbind("click");
		//sentenceOutput.bind("click", sentenceOutputEvt);
	}
	this.searchEvt = function(){
		var search = function (){
			main.groupBlock(searchText.val());
		}

		var clear = function (){
			main.groupBlockClear();
		}
		/* origin
		searchBtn.unbind( "click" );
		searchBtn.bind( "click", search );

		searchClear.unbind( "click" );
		searchClear.bind( "click", clear );

		看起來是整個searchEvt 可以不需要
		*/
	}	

	this.getBlockTerm = function(){
		var text = searchText.val();
		var set = new Array();
		{
			var temp = text.split(" ");
			for ( var ind = 0 ; ind < temp.length ; ind++ ){
				var str = temp[ind];
				if ( str.length > 0 ){
					set.push(str);
				}
			}
		}
		return set;
	}
	this.getBlockSet = function(){
		//var text = searchText.val();
		var set = ctrl.getBlockTerm();
		var result = new Array();
		var groups = global.group;
		for ( var ind = 0 ; ind < groups.length ; ind++ ){
			var curGroup = groups[ind];
			var exist = true;

			var sentence = curGroup.sentence[0]
			if ( typeof(sentence) == "undefined"){
				exist = false;
			}else{
				for ( var n = 0 ; n < set.length ; n++ ){
					var term = set[n];
					console.log(term)
					console.log(sentence.indexOf(term))
					if ( sentence.indexOf(term) == -1 ){
						exist = false;
						break;
					}
				}
			}
			if ( exist ) {
				result.push( curGroup.id );
			}
		}
		if (result.length==0){
			result.push(-1)
		}
		return result;
	}

	this.labelChangeEvt = function(e){
		var evt = function(){
			var entry = $(this);
		}
		e.unbind("click");
		e.bind("click", evt);
	}

	this.detectCtrlFunc = function( data ){
		fun.all.removeClass("disabled");

		if ( data.length != 1 ){
			fun.edit.addClass("disabled");
			fun.split.addClass("disabled");
			fun.remove.addClass("disabled");
		}

		if ( data.length < 2 ){
			fun.combine.addClass("disabled");
		}
	}

	this.createEvt = function(){
		var evt = function(){
			if ( !$(this).hasClass("disabled")){
				main.createdView();
			}
			
		}
		fun.create.unbind("click")
		fun.create.bind("click", evt)
	}

	this.createViewEvt = function(){
		var target = $("body > .overlay-view.create");
		
		var btn = {
			apply : target.find(".cont > .ctrl > .apply"),
			cancel : target.find(".cont > .ctrl > .cancel")
		}

		btn.apply.unbind("click");
		btn.cancel.unbind("click");
		btn.apply.bind("click", main.createLabel );
		btn.cancel.bind("click", function(){
			target.removeClass("active");
		})
	}

	this.showCreateView = function(  ){
		var target = $("body > .overlay-view.create");
		var template = target.find(".hidden > .entry");		
		var input = target.find(".cont > .cont > .text");
		input.val("")
		target.addClass("active");
	}

	this.eidtEvt = function(){
		var evt = function(){
			if ( !$(this).hasClass("disabled")){
				main.editView();
			}	
		}
		fun.edit.unbind("click")
		fun.edit.bind("click", evt)
	}

	this.editViewEvt = function(){
		var target = $("body > .overlay-view.edit");
		var btn = {
			apply : target.find(".cont > .ctrl > .apply"),
			cancel : target.find(".cont > .ctrl > .cancel")
		}
		btn.apply.unbind("click");
		btn.cancel.unbind("click");
		btn.apply.bind("click", main.editLabel );
		btn.cancel.bind("click", function(){
			target.removeClass("active");
		})
	}

	this.showEditView = function( data ){
		if ( data.length == 1 ){
			var target = $("body > .overlay-view.edit");
			var template = target.find(".hidden > .entry");
			var input = target.find(".cont > .cont > .text");
			input.val("")
			var id = data[0];
			var label = main.getLabelById(id);
			target.find(".cont > .cont > .tip > .rename").html( label.nid + " - " +label.name )
			target.addClass("active");
		}
	}

	this.removeEvt = function(){
		var evt = function(){
			if ( !$(this).hasClass("disabled")){
				main.removeView();
			}
		}
		fun.remove.unbind("click")
		fun.remove.bind("click", evt)
	}

	this.showRemoveView = function( data ){
		var target = $("body > .overlay-view.remove");
		var template = target.find(".hidden > .entry");
		var con = target.find(".cont > .cont > .list");
		if ( data.length > 0 ){
			con.empty();
			for ( var ind = 0 ; ind < data.length ; ind++ ){
				var id = data[ind];
				var label = main.getLabelById(id);
				con.append( template.clone().html(label.nid + " - " + label.name));
			}
		}
		target.addClass("active");	
	}

	this.removeViewEvt = function(){
		var target = $("body > .overlay-view.remove");
		var btn = {
			apply : target.find(".cont > .ctrl > .apply"),
			cancel : target.find(".cont > .ctrl > .cancel")
		}
		btn.apply.unbind("click")
		btn.cancel.unbind("click")
		btn.apply.bind("click", main.removeLabel );
		btn.cancel.bind("click", function(){
			target.removeClass("active");
		})
	}


	this.splitEvt = function(){
		var evt = function(){
			if ( !$(this).hasClass("disabled")){
				main.splitView();
			}
		}
		fun.split.unbind("click")
		fun.split.bind("click", evt)
	}

	this.splitViewEvt = function(){
		var target = $("body > .overlay-view.split");
		var btn = {
			apply : target.find(".cont > .ctrl > .apply"),
			cancel : target.find(".cont > .ctrl > .cancel"),
			all : target.find(".cont > .cont > .opt > .entry > .ctrl > .checkbox")
		}

		btn.apply.unbind("click")
		btn.cancel.unbind("click")
		btn.all.unbind("click");

		btn.apply.bind("click", function() {
			var set = new Array();
			var list = target.find(".cont > .cont > .list > .entry[sel='1']");
			var detailList = main.getData().labelDetail;

			for ( var ind = 0 ; ind < list.length ; ind++ ) {
				var entry = list.eq(ind);
				var rid = parseInt( entry.attr("rid") );
				for ( var jnd = 0 ; jnd < detailList.length ; jnd++ ) {
					var obj = detailList[jnd];
					if ( rid == obj.id )
						set.push(obj);
				}
			}
			main.splitLabel(set);
		});

		btn.cancel.bind("click", function(){
			target.removeClass("active");
		})

		btn.all.bind("click", function(){
			var e = $(this);
			var list = e.parent().parent().parent().parent().find(".list.rect > .entry");

			if ( e.hasClass("active")){
				e.removeClass("active");
				list.attr("sel",0)
				list.find(".ctrl > .checkbox").removeClass("active");
			}else{
				e.addClass("active");
				list.attr("sel",1)
				list.find(".ctrl > .checkbox").addClass("active");
			}
		});
	}

	this._showSplitView = function(label) {
		var evt = function() {
			var e = $(this);
			if ( e.hasClass("active")){
				e.removeClass("active");
				e.parent().parent().attr("sel", 0);
			}else{
				e.addClass("active");
				e.parent().parent().attr("sel", 1);
			}
		}
		var target = $("body > .overlay-view.split");
		var template = target.find(".hidden > .entry");
		var label_text = target.find(".cont > .cont > .text > div > .label")
		var con = target.find(".cont > .cont > .list");

		label_text.html ( label.nid + " - " + label.name);
		target.find(".cont > .cont > .opt > .entry > .ctrl > .checkbox").removeClass("active");
		con.empty();

		var params = new Object({
			labels: [label.label_id]
		});
		openLoading();
		main.getData().ajax.loadGroups(main.getTemplate().id, params, function(resp) {
			var dataset = new Array();
			for ( var ind = 0 ; ind < resp.data.length ; ind++ ) {
				var data = resp.data[ind];
				var set = resp.set[ind];
				var clone = template.clone();
				var id = set.id;
				var text = data.sentence;
				var db_id = set.db_id;
				clone.find(".text").html ( id + " - " + text);
				clone.attr("dbid", db_id);
				clone.attr("rid", id);
				clone.attr("sel",0);
				clone.find(".ctrl > .checkbox").unbind("click");
				clone.find(".ctrl > .checkbox").bind("click", evt);
				con.append( clone);

				var obj = new Object({
					id: id,
					db_id: db_id
				});
				dataset.push(obj);
			}
			target.addClass("active");
			main.getData().labelDetail = dataset;
		})
		closeLoading();
	}
	/*
	this.showSplitView = function( label, data ) {
		console.log(label);
		console.log(data);
		var evt = function() {
			var e = $(this);
			if ( e.hasClass("active")){
				e.removeClass("active");
				e.parent().parent().attr("sel", 0);
			}else{
				e.addClass("active");
				e.parent().parent().attr("sel", 1);
			}
		}
		var target = $("body > .overlay-view.split");
		var template = target.find(".hidden > .entry");
		var label_text = target.find(".cont > .cont > .text > div > .label")
		var con = target.find(".cont > .cont > .list");

		label_text.html ( label.nid + " - " + label.name);
		target.find(".cont > .cont > .opt > .entry > .ctrl > .checkbox").removeClass("active");
		con.empty();		

		for ( var ind = 0 ; ind < data.length ; ind++ ){
			var clone = template.clone();
			var id = data[ind].id;
			var text = data[ind].group_entry().sentence;
			var db_id = data[ind].db_id;
			clone.find(".text").html ( id + " " + text);
			clone.attr("dbid", db_id);
			clone.attr("rid", id);
			clone.attr("sel",0);
			clone.find(".ctrl > .checkbox").unbind("click");
			clone.find(".ctrl > .checkbox").bind("click", evt);
			con.append( clone);
		}
		target.addClass("active");
	}
	*/

	this.combineEvt = function() {
		var evt = function(){
			if ( !$(this).hasClass("disabled")){
				main.combinedView();
			}
		}
		fun.combine.unbind("click")
		fun.combine.bind("click", evt)
	}

	this.combineViewEvt = function(){
		var target = $("body > .overlay-view.combine");
		var btn = {
			apply : target.find(".cont > .ctrl > .apply"),
			cancel : target.find(".cont > .ctrl > .cancel")
		}

		btn.apply.unbind("click")
		btn.cancel.unbind("click")

		btn.apply.bind("click", main.combineLabel );
		btn.cancel.bind("click", function(){
			target.removeClass("active");
		})
	}

	this.showCombinedView = function( data ){
		var target = $("body > .overlay-view.combine");
		var template = target.find(".hidden > .entry");
		var con = target.find(".cont > .cont > .list");

		if ( data.length > 0 ){
			con.empty();
			for ( var ind = 0 ; ind < data.length ; ind++ ){
				var id = data[ind];
				var label = main.getLabelById(id);
				var name = label.name;
				var nid = label.nid
				con.append( template.clone().html(nid+" - "+name));
			}
		}
		target.addClass("active");
	}

	this.closeView = function( text ){
		var target = $("body > .overlay-view."+text);		
		target.removeClass("active");
	}

	this.errorViewEvt = function(){
		var target = $("body > .overlay-view.error");
		var btn = {
			apply : target.find(".cont > .ctrl > .apply")
		}
		btn.apply.unbind("click")
		btn.apply.bind("click", function(){
			target.removeClass("active");
		})
	}

	this.showErrorView = function(text){
		var target = $("body > .overlay-view.error");		
		target.find(".cont > .cont").html(text);
		target.addClass("active");
	}

	this.btnBind = function(){

		ctrl.errorViewEvt();

		ctrl.searchEvt();

		ctrl.createEvt();
		ctrl.createViewEvt();

		ctrl.eidtEvt();
		ctrl.editViewEvt();

		ctrl.removeEvt();
		ctrl.removeViewEvt();

		ctrl.splitEvt();
		ctrl.splitViewEvt();
		
		ctrl.combineEvt();
		ctrl.combineViewEvt();

		ctrl.outputEvt();
	}

	this.init = function(){		
		ctrl.detectCtrlFunc([]);
		ctrl.btnBind();
	}

	ctrl.init();
}
