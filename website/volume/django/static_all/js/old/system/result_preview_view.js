function resultPreviewView (main) {
	var ctrl = this;
	var main = main;
	var con = main.getView().children(".left-column").children(".preview");
	var graph;
	this.initial = function(){
		var panel = con.children(".term-view");
		console.log(ctrl)
		ctrl.clear();
		if ( typeof(graph) == "undefined" ){
			graph = new vOrgChart(con, ctrl);
		}else{
			graph.reset();
		}
		
	}



	this.clear = function(){

	}

	
	this.dataConvert = function( classes, cRecord, ncRecord, curRecord ){
		var findClass = function( id, obj ){
			console.log(id)
			for ( var ind = 0 ; ind < obj.classes.length ; ind++ ){
				var e = obj.classes[ind];
				console.log(e)
				if ( e.id == id ){
					return e;
				}
			}
		}

		var o = new Object({
			classes : new Array(),
			nc : new Array()
		});

		for ( var ind = 0 ; ind < classes.length ; ind++ ){
			o.classes.push({
				name : classes[ind].name,
				id : classes[ind].id,
				children : new Array()
			})
		}

		for ( var ind = 0 ; ind < cRecord.length ; ind++ ){
			var e = cRecord[ind];
			var p = findClass( e.class, o );
			var entry = new Object({
				name : e.label,
				id : e.id,
				parent : p.id
			})
			p.children.push(entry);
		}

		for ( var ind = 0 ; ind < ncRecord.length ; ind++ ){
			var e = ncRecord[ind];
			var entry = new Object({
				name : e.label,
				id : e.id,
				parent : 0
			})
			o.nc.push(entry)
		}
		return o;
	}

	this.drawChart = function( classes, cRecord, ncRecord, curRecord ){
		var object = ctrl.dataConvert( classes, cRecord, ncRecord, curRecord )
		graph.draw( object );
	}

	this.showRecord = function( id ){
		
		main.showRecord(id);
	}
	this.hideRecord = function(){
		main.hideRecord();
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