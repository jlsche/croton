function resultController (main, data, book, order) {
	var ctrl = this;
	var data = data;
	var book = book;
	var main = main;
	var order = order;
	var views = new Object ({});
	this.initial = function(){
		
		views.viewer = new resultViewerView(ctrl);
		views.preview = new resultPreviewView(ctrl);		
		views.controller = new resultCtrlView(ctrl);

		/*data.views.previewKeyword = function(){
			return ctrl.getView().children(".left-column").children(".keyword");
		}

		data.views.previewViewer = function(){
			return ctrl.getView().children(".right-column").children(".viewer");
		}

		data.views.previewPreview = function(){
			return ctrl.getView().children(".left-column").children(".preview");
		}*/
		ctrl.lock();
		ctrl.draw();

	}

	this.getOrder = function(){
		return order;
	}

	this.output = function(){
		main.output();
	}

	this.start = function(){
		var labels = main.getLabels();
		var target = labels.children(".index[page-ind='"+(order)+"']");
		if ( typeof(target) != 'undefined' ){
			target.siblings().removeClass("active");
			target.addClass("active");
			target.removeClass("disabled");
			labels.children(".group").removeClass("disabled");
			labels.children(".preview").addClass("disabled");
			main.showPage(order)
		}

		ctrl.show();
		ctrl.draw();
		ctrl.controllerFilter()
		views.viewer.clear();
		

	}

	this.show = function(){
		views.controller.show();
		views.preview.show();
		views.viewer.show()
	}

	this.lock = function(){
		views.controller.lock();
		views.preview.lock();
		views.viewer.lock()
	}

	this.back = function(){
		main.back();
	}




	this.getView = function(){
		return book.find(".view > .result-in > .container");
	}

	
	this.getKeywordsInGroups = function( set ){
		return main.getKeywordsInGroups(set);
	}

	this.getCurrentRecord = function(){
		return main.getRecordById(data.curRecord);
	}

	this.getGroupsByRecordId = function(id){
		var record = ctrl.getRecordById(id);
		var record_child = main.getChildRecord(id)
		console.log(record)
		var groupIds = record.groups;
		var set = new Array();
		if ( record_child.length > 0){
			for ( var ind = 0 ; ind < record_child.length ; ind++ ){
				var group = main.getGroupById( record_child[ind].groups[0]);
				if ( typeof(group) != "undefined" ){
					set.push({
						record:record_child[ind],
						group : group
					})
				}
			}
		}else{
			set.push({
				record:record,
				group : main.getGroupById( record.groups[0])
			})
		}
		
		return set;
	}
	this.getCurrentGroups = function(){
		var record = ctrl.getCurrentRecord();
		var groupIds = record.groups;
		var set = new Array();
		for ( var ind = 0 ; ind < groupIds.length ; ind++ ){
			var group = main.getGroupById( groupIds[ind]);
			if ( typeof(group) != "undefined" ){
				set.push(group)
			}
		}
		return set;
	}


	this.getTextData = function(){
		return data.textData;
	}

	this.getGroupById = function(id){
		return main.getGroupById(id);
	}

	this.getRecordById = function (id){
		return main.getRecordById(id);
	}

	this.getGroupSentence = function(id, st, n, call){
		data.ajax.getGroupSentence(id, st, n, call);
	}

	this.nextPage = function(){
		data.curRecord = -1;
		main.next();
	}

	this.hideRecord = function(){
		views.viewer.clear( );

	}

	this.showRecord = function(id ){
		var record = main.getRecordById(id)
		console.log(record)
		views.viewer.render( record, data.class);
	}


	this.draw = function(){
		var curRecord = ctrl.getCurrentRecord();

		var classes = data.class;
		var recordSet = new Array();
		var nonClass = new Array();

		for ( var ind = 0 ; ind < data.record.length ; ind++ ){
			var e = data.record[ind];
			if ( e.class != 0 ){
				recordSet.push(e);
			}else if ( e.label.length > 0 ){
				nonClass.push(e)
			}
		}

		
		views.preview.drawChart( classes, recordSet, nonClass, curRecord );



	}

	this.save = function(){
		var panel = ctrl.getView().children(".right-column").children(".viewer").children(".group");
		var data = new Object();
		var recordId = parseInt(panel.attr("id"));
		var record = ctrl.getRecordById(recordId);
		var dbId = record.db_id;
		data.id = dbId;
		data.label = panel.children(".label-text").val();
		data.class = panel.children(".class-value").val();

		main.updateRecord(data, function(){
			record.class = data.class;
			record.label = data.label;
			ctrl.draw();
		})
	}

	this.controllerFilter = function(){
		var record = data.record;
		var curRecord = ctrl.getCurrentRecord();

		var counter = 0;
		for ( var ind = 0 ; ind < record.length ; ind++ ){
			var e = record[ind];
			if ( e.id != curRecord.id ){
				if ( e.class == 0 ){
					counter++;
					views.controller.filter(counter);
					break;
				}
			}
			
		}

	}

	ctrl.initial();
}