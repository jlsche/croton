function resultViewerView (main) {
	var ctrl = this;
	var main = main;
	var con = main.getView().children(".right-column").children(".viewer");
	var save = con.children(".group").children(".save");
	this.initial = function(){
		
		ctrl.clear();
		ctrl.saveEvent(save)
	}

	this.clear = function(){
		var panel = con.children(".group");
		panel.attr("id", "");
		panel.children(".list").empty();
		panel.children(".label-text").val("");
		panel.children(".class-value").html("")
		save.addClass("disabled")
	}

	// render call
	this.render = function( record, classes ){
		console.log(record)
		var panel = con.children(".group");
		ctrl.clear();

		panel.attr("id", record.id)
		var data = main.getGroupsByRecordId(record.id);


		for ( var ind = 0 ; ind < data.length ; ind++ ){
			var cur_record = data[ind].record;
			var e = data[ind].group;
			panel.children(".list").append( jqDOM.div("entry", cur_record.id));
		}

		console.log(record)
		console.log(record.label)
		console.log(panel.children(".label-text"))
		panel.children(".label-text").val( record.label)


		panel.children(".class-value").append(jqDOM.option(0, "none"));

		for ( var ind = 0 ; ind < classes.length ;ind++){
			var e = classes[ind];
			panel.children(".class-value").append(jqDOM.option(e.id, e.name));
		}
		save.removeClass("disabled")
	}

	// related call
	this.filter = function( ){
	
	}

	this.saveEvent = function(e){
		var evt = function(){
			var e = $(this);
			if ( !e.hasClass("disabled")){

				main.save();
				//main.draw();

			}
		}

		e.unbind("click", evt);
		e.bind("click", evt);
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