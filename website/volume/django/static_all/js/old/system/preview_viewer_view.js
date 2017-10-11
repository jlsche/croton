function previewViewerView (main) {
	var ctrl = this;
	var main = main;
	var con = main.getView().children(".right-column").children(".viewer");
	this.initial = function(){
		ctrl.clear();
	}

	this.clear = function(){
		con.children(".top").children(".primary").html("");
		con.children(".top").children(".sub").html("");
		con.children(".main").html("");
	}

	// render call
	this.render = function( ){

		var record = main.getCurrentRecord();
		var groups = main.getCurrentGroups();
		ctrl.clear();
		var child = main.getRecordChild
		ctrl.filter ( record.id, [record] );
	}

	// related call
	this.filter = function( c, set ){
		var arr;
		ctrl.clear();
		console.log(set)
		ctrl.loadTopArea(c, set);
		if ( set.length > 0 ) {
			arr = set;
		}else{
			console.log(c)

			arr = [ main.getGroupById(c) ];
		}
		ctrl.loadContArea(arr);
	}

	this.loadTopArea = function( id, set ){
		var primary = con.children(".top").children(".primary");
		var sub = con.children(".top").children(".sub");
		sub.empty();
		primary.html("Group : " + id);
		/*console.log(primary)
		console.log(sub)
		for ( var ind = 0 ; ind < set.length ; ind++ ){
			var id = set[ind].id;
			var e = $("<div></div>");
			e.attr("group-id", id);
			e.addClass("entry");
			e.html(id);
			sub.append(e);
			sub.append(" ");
		}*/
	}

	this.loadContArea = function( set ){
		var list = con.children(".main");
		list.empty();
		for ( var ind = 0 ; ind < set.length ; ind++ ){
			var data = set[ind];
			var g = main.getGroupById(parseInt(data.groups[0]));
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
			var g = main.getGroupById(record.groups[0])
			var st = g.sentence.length;
			var n = 20;

			//en.children(".title").html(lang.getString("group") + " : " + id + " ( "+ lang.getString("loading") +" )");
			openLoading(function(){
				main.getGroupSentence(g.id, st, n, function(msg){
					if ( msg.type ){
						var data = msg.data;
					
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
		//console.log(data)
		var title = lang.getString("group") + " : " + parseInt(id);
		var keywords = data.keyword;
		var sentence = data.sentence;
		var total = data.total;
		var entry = jqDOM.div("entry");
		entry.attr("group-id", id);
		var e_title = jqDOM.div("title").html( title );
		entry.append(e_title);

		/*var e_keyword = jqDOM.div("keyword");		
		for ( var ind = 0 ; ind < keywords.length ; ind++ ){
			var k = keywords[ind];
			var k_en = jqDOM.div("entry").html(k);
			e_keyword.append(k_en).append(" ");
		}
		entry.append(e_keyword);*/

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
	this.show = function(){
		con.children(".fake-overview").remove()
	}
	this.lock = function(){
		ctrl.show()
		con.append(jqDOM.div("fake-overview"));
	}
	ctrl.initial();

	
}





///
/*
the method for select term for exist list
step1 view the term panel
step2 active the term entry in term panel that already exist in list
step3 choose the option 
step4 if cancel do nothing
step5 if apply, the list will remove all the term that exist in the panel, then, the list add the active term entry
step6 redraw
*/

