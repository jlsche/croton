function previewKeywordView (main) {
	var ctrl = this;
	var main = main;
	var con = main.getView().children(".left-column").children(".keyword");
	this.initial = function(){

		ctrl.clear();
	}

	this.clear = function(){
		con.children(".title").html("");
		con.children(".list").html("");
	}

	// render call
	this.render = function( ){
		var record = main.getCurrentRecord();
		var groups = main.getCurrentGroups();
		ctrl.clear();
		
		ctrl.headTag(record.id);
		ctrl.tagRender(  main.getKeywordsInGroups(groups)  );

	}

	this.headTag = function(id){
		var tag = con.children(".title");
		tag.html ( "Group : "+id);
	}

	this.tagRender = function (set){
		var list = con.children(".list");
		for ( var ind = 0 ; ind < set.length ; ind++ ){
			var e = jqDOM.div("entry", set[ind]);
			ctrl.tagEvent( e );
			list.append(e);
			list.append(" ");
		}
	}

	this.tagEvent = function( e ){

		var evt = function(){
			var e = $(this);
			var add = false;
			var tag = e.html();
			if ( e.hasClass("active")){
				e.removeClass("active");
			}else{
				e.addClass("active");
				add = true;
			}

			var label = main.getTextData().label;
			if ( add ){
				if ( label.indexOf( tag ) == -1 ){
					label.push(tag)
				}
			}else{
				if ( label.indexOf( tag ) != -1 ){
					label.splice( label.indexOf( tag ), 1 );
				}
			}

			main.tagEvent(e)
		}
		e.unbind("click", evt);
		e.bind("click", evt);
	}

	this.getActivityTag = function(){
		var entry = con.children(".list").children(".entry.active");
		var set = new Array();
		for ( var ind = 0 ; ind < entry.length ; ind++ ){
			set.push( entry.eq(ind).html());
		}

		return set;
	}


	this.drawChart = function(){
		//console.log(main.textDataCheck())
		
	}


	this.fresh = function( data ){
		var entry = con.children(".list").children(".entry");
		entry.removeClass("active");
		entry.each(function(ind){
			var e = entry.eq(ind);
			if ( data.indexOf(e.html()) != -1 ){
				e.addClass("active");
			}
		})
	}
	// related call
	this.filter = function( c, set ){
		
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