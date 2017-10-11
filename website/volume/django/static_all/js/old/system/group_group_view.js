function groupGroupView (main) {
	var ctrl = this;
	var main = main;
	var con = main.getView().children(".left-column").children(".groups");

	// initial
	this.initial = function(){
		//console.log( " init the class ")
		//main.testCall("group");
		$(".clear", con).unbind("click", ctrl.clear)
		$(".clear", con).bind("click", ctrl.clear)
	}


	// event bind
	this.groupSelect = function(entry){		
		entry.unbind("click");
		entry.bind("click", function(){
			var e = $(this);
			if ( e.hasClass("active") ){
				e.removeClass("active");
			}else{
				e.addClass("active");
			}
			main.groupSelect();
		})
	}

	// event call


	// related call
	this.filter = function(arr, classed, set){
		var list = con.children(".list");
		var entry = list.children(".entry").not("item");
		if ( set.length == 0 ){
			entry.removeClass("disabled");
		}else{
			entry.addClass("disabled");
			entry.removeClass("active");
			for ( var ind = 0 ; ind < arr.length ; ind++ ){
				var e = arr[ind];
				if ( !e.hide ){
					var id = e.id;
					var target = entry.parent().find(".entry[group-id='"+id+"']").not("item");
					target.removeClass("disabled");
				}
			}
		}

		for ( var ind = 0 ; ind < classed.length ; ind++ ){
			var id = classed[ind].id;
			var target = entry.parent().find(".entry[group-id='"+id+"']").not("item");
			target.addClass("disabled")
		}
	}


	// view render
	this.groupRender = function ( array ){
		var list = con.children(".list");
		list.find(".entry").not(".item").remove();
		for ( var ind = 0 ; ind < array.length ; ind++ ){
			var e = array[ind];
			//var id = parseInd(e.id);
			ctrl.addGroup(e);
		}
	}

	this.addGroup = function(e){
		var list = con.children(".list");
		var entry = ctrl.genGroup(e);
		ctrl.groupSelect(entry);
		list.append(entry);
	}

	this.genGroup = function(e){
		//console.log(e)
		var ref = main.getRecordById( e.id );

		var entry = $("<div></div>");
		entry.addClass("entry");
		if ( e.class != 0 ){
			entry.addClass("disabled")
		}
		entry.attr("group-id", e.id);
		var idEntry = $("<div></div>");
		var sentence = $("<div></div>");
		var cont = "";
		idEntry.addClass("id-entry");
		sentence.addClass("sentence");
		sentence.addClass("ellipsis");

		idEntry.html( e.id );
		for ( var nind = 0 ; nind < e.sentence.length ; nind++ ){
			var s = e.sentence[nind];
			cont += s+" ";
		}

		sentence.html(cont);
		entry.append(idEntry);
		entry.append(sentence);
		return entry;
	}

	this.combinedCheck = function( data ){
		var list = con.children(".list");
		var entry = list.children(".entry").not("item");
		entry.removeClass("combined");
		for ( var ind = 0 ; ind < data.length ; ind++ ){
			var record = data[ind];
			if ( record.parent != -1 ){
				var e = list.children(".entry[group-id='"+record.id+"']").not(".item");
				e.addClass("combined");
			}
		}
	}

	this.groupActive = function( id ){		
		var list = con.children(".list");
		var entry = list.children(".entry[group-id='"+id+"']").not(".item");
		entry.addClass("active");
	}

	this.clear = function(){
		var list = con.children(".list");
		var entry = list.children(".entry[group-id]").not(".item");
		entry.removeClass("active");
		main.groupSelect();
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