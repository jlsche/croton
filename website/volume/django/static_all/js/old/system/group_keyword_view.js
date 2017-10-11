function groupKeywordView (main) {
	var ctrl = this;
	var main = main;
	var con = main.getView().children(".right-column").children(".keyword");

	// initial
	this.initial = function(){
		//console.log( " init the class ")
		//main.testCall("keyword");
		//console.log( main.getView())
		//ctrl.fakeTagSelectBind();
		this.eventBind();

	}

	// event bind

	this.eventBind = function(){
		ctrl.keyInEvent();		
	}


	this.fakeTagSelectBind = function(){
		ctrl.tagRender(["攝氏", "華視"])
	}

	this.keyInEvent = function(){
		console.log("bind keyInEvent");		
		var input = con.children(".filter");
		input.unbind("keyup");
		input.bind("keyup", function(){
			console.log("key up");
			var e = $(this);
			main.keywordFilter( e.val() );
		})
	}

	this.tagSelect = function(entry){		
		entry.unbind("click");
		entry.bind("click", function(){
			var e = $(this);
			if ( e.hasClass("active") ){
				e.removeClass("active");
			}else{
				e.addClass("active");
			}
			main.groupFilter();
		})
	}

	// event call

	this.keyInFilter = function( entry ){
		//console.log("Key-in filter");
		//console.log( entry.attr("class") );
	}
	



	// related call
	this.filter = function( str ){
		console.log('filter in keyword with ' + str );		
		var list = con.children(".list");
		var tags = list.children(".tag");
		var empty = true;
		if ( str.length > 0 ){
			empty = false;
		}
		
		tags.removeClass("hide");

		if ( ! empty ){
			tags.each(function(ind) {
				var e = tags.eq(ind);
				if ( e.attr("value").indexOf(str) == -1 ){
					e.addClass("hide")
				}
			})
		}
	}


	// view render
	this.tagRender = function ( array ){
		console.log(array)
		var list = con.children(".list");
		list.empty();
		for ( var ind = 0 ; ind < array.length ; ind++ ){
			var e = array[ind];
			//console.log(e)
			var tag = $("<div></div>");
			tag.addClass("tag");
			tag.attr("value", e);
			tag.html(e);
			ctrl.tagSelect( tag );
			list.append( tag );
			list.append( " " );
		}
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