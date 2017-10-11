function groupViewerView (main) {
	var ctrl = this;
	var main = main;
	var con = main.getView().children(".right-column").children(".viewer");
	this.initial = function(){
		//console.log( " init the class ")
		//main.testCall("viewer");
		ctrl.clear();
	}

	this.clear = function(){
		con.children(".top").children(".primary").html("");
		con.children(".top").children(".sub").html("");
		con.children(".main").html("");
	}

	// render call
	this.render = function( group ){

	}

	// related call
	this.filter = function( c, set ){
		console.log(c)
		var arr;
		ctrl.clear();
		ctrl.loadTopArea(c, set);
		if ( set.length > 0 ) {
			arr = set;
		}else{
			arr = new Array();
			var record = main.getRecordById(c);
			for ( var ind = 0 ; ind < record.groups.length ; ind++ ){
				var g_id = record.groups[ind];
				var entry = main.getGroupById(g_id);
				if ( typeof (entry) != "undefined"){
					arr.push(record)
				}
			}
		}
		console.log(arr)
		ctrl.loadContArea(arr);
	}

	this.loadTopArea = function( id, set ){
		var primary = con.children(".top").children(".primary");
		var sub = con.children(".top").children(".sub");
		sub.empty();
		primary.html("Group : " + id);

		for ( var ind = 0 ; ind < set.length ; ind++ ){
			var id = set[ind].id;
			var e = $("<div></div>");
			e.attr("group-id", id);
			e.addClass("entry");
			e.html(id);
			sub.append(e);
			ctrl.decomposeEvent(e);
			sub.append(" ");
		}
	}

	this.loadContArea = function( set ){
		console.log(set)
		var list = con.children(".main");
		list.empty();
		for ( var ind = 0 ; ind < set.length ; ind++ ){
			var data = set[ind];
			var g = main.getGroupById(parseInt(data.groups[0]));
			console.log(g)
			var entry = ctrl.createGroupEntry( data.id, g );
			list.append(entry);
		}
	}

	this.loadMore = function( e ){
		e.unbind("click");
		e.bind("click", function(){
			$(this).hide();
			var en = $(this).parent();
			var id = en.attr("group-id");
			var record = main.getRecordById(parseInt(id));
			var g = main.getGroupById( record.groups[0]);
			console.log(record)
			console.log(g)
			var st = g.sentence.length;
			var n = 20;

			//en.children(".title").html(lang.getString("group") + " : " + id + " ( "+ lang.getString("loading") +" )");
			openLoading(function(){
				main.getGroupSentence(g.id, st, n, function(msg){
					if ( msg.type ){
						
						var entry = ctrl.createGroupEntry( id, g );
						en.html("");
						en.append(entry.children())
					}
					closeLoading();
				})
			})
			
		})
	}


	this.createGroupEntry = function( id, data ){
		console.log(data)
		var title = lang.getString("group") + " : " + parseInt(id);
		var keywords = data.keyword;
		var sentence = data.sentence;
		var total = data.total;
		var entry = jqDOM.div("entry");
		entry.attr("group-id", id);
		var e_title = jqDOM.div("title").html( title );
		entry.append(e_title);

		var e_keyword = jqDOM.div("keyword");		
		for ( var ind = 0 ; ind < keywords.length ; ind++ ){
			var k = keywords[ind];
			var k_en = jqDOM.div("entry").html(k);
			e_keyword.append(k_en).append(" ");
		}
		entry.append(e_keyword);

		var e_list = jqDOM.div("list");
		for ( var ind = 0 ; ind < sentence.length ; ind++ ){
			var k = sentence[ind];
			var k_en = jqDOM.div("sentence").html(k);
			e_list.append(k_en).append(" ");
		}
		entry.append(e_list);

		if ( sentence.length < total ){
			var more = jqDOM.div("more").html( lang.getString("more"));
			more.attr("group-id", id);
			ctrl.loadMore(more);
			entry.append(more);
		}
		return entry;
	}

	this.decomposeEvent = function(e){
		e.after().unbind("click");
		e.after().bind("click", function(){
			var en = $(this);
			var id = en.attr("group-id");
			main.decomposeGroup(id);
		})
	}

	this.show = function(){
		var target = con.children(".top").children(".sub");
		target.children(".fake-overview").remove()
	}
	this.lock = function(){
		var target = con.children(".top").children(".sub");
		ctrl.show()

		target.append(jqDOM.div("fake-overview"));
	}

	ctrl.initial();
}