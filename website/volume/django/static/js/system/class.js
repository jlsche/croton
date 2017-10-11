function class_ctrl (main, data) {

	var ctrl = this;
	var cont = $("body > .main > .book > .main > .panel.right.class");
	var full_btn = cont.find(".item > .entry > .sel > .checkbox") ;

	this.render = function( data ) {
		var con = cont.children(".list");
		con.empty();
		for ( var ind = 0 ; ind < data.length ;ind++){
			var name = data[ind].name;
			var id = data[ind].label_id;
			//var id = data[ind].id;
			var nid = data[ind].nid;
			var clone = cont.find(".hidden > .entry").clone();
			var set = main.getGroupSetByLabelId(id);
			var sel_tag = clone.children(".apply-tag");

			ctrl.groupListClassedEvt( sel_tag );
			clone.children(".id").html( nid );
			clone.children(".string").html( name );
			
			clone.children(".set").html( data[ind].group_count );
			clone.children(".num").html( data[ind].comment_count ); 
			
			/*
			clone.children(".set").html( set.length+ lang.getString("term10"));
			clone.children(".num").html( function() {
				var count = 0;
				for ( var n = 0 ; n < set.length ; n++ ){
					count += set[n].total;
				}
				return count;
			});
			*/

			ctrl.listCheckBoxEvt( clone.find(".sel > .checkbox") );
			clone.attr("sel", 0);
			clone.attr("id", id);

			con.append(clone);
		}
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
			main.detectCtrlFunc();
		}
		e.unbind("click");
		e.bind("click", evt);
	}

	this.fullSelectEvt = function(){
		var evt = function(){
			var entry = $(this);
			var list = cont.children(".list").children(".entry");
			list.attr("sel",0);
			list.find(".sel > .checkbox").removeClass("active")
			if  ( entry.hasClass("active") ){
				entry.removeClass("active");


			}else{
				entry.addClass("active");
				for (var ind = 0; ind < list.length ; ind++ ){
					var entry = list.eq(ind);
					entry.attr("sel",1);
					entry.find(".sel > .checkbox").addClass("active")
				}
			}
			main.detectCtrlFunc();
		}
		full_btn.unbind("click");
		full_btn.bind("click", evt);

	}

	this.groupListClassedEvt = function( e ){
		var evt = function(){
			var set = main.getSelectedGroup();
			if ( set.length > 0 ){
				var entry = $(this);
				var id = parseInt( entry.parent().attr("id") );
				ctrl.showGroupListClassedView( id );
			}
		}
		e.unbind("click")
		e.bind("click", evt)
	}

	this.groupListClassedViewEvt = function(){
		var target = $("body > .overlay-view.classed");
		var btn = {
			apply : target.find(".cont > .ctrl > .apply"),
			cancel : target.find(".cont > .ctrl > .cancel")
		}

		btn.apply.bind("click", main.groupListClassed );
		btn.cancel.bind("click", function() {
			target.removeClass("active");
		})
	}

	this.showGroupListClassedView = function( id ) {
		var target = $("body > .overlay-view.classed");
		var name = main.getLabelNameById(id);
		var label = main.getLabelById(id);
		var text = target.find(".cont > .cont > .name");
		text.html(label.nid+" "+name);
		text.attr("id", id);
		target.addClass("active");
	}

	this.init = function() {
		full_btn.removeClass("active")
		ctrl.fullSelectEvt();
		ctrl.groupListClassedViewEvt();
	}

	ctrl.init();
}