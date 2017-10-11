function previewController (main, data, book, order) {
	var ctrl = this;
	var data = data;
	var book = book;
	var main = main;
	var order = order;
	var views = new Object ({});
	this.initial = function(){

		views.keyword = new previewKeywordView(ctrl);
		views.viewer = new previewViewerView(ctrl);
		views.preview = new previewPreviewView(ctrl);
		views.controller = new previewCtrlView(ctrl);

		data.views.previewKeyword = function(){
			return ctrl.getView().children(".left-column").children(".keyword");
		}

		data.views.previewViewer = function(){
			return ctrl.getView().children(".right-column").children(".viewer");
		}

		data.views.previewPreview = function(){
			return ctrl.getView().children(".left-column").children(".preview");
		}
		ctrl.lock()
	}

	this.getOrder = function(){
		return order;
	}



	this.start = function(){
		var labels = main.getLabels();
		var target = labels.children(".index[page-ind='"+(order)+"']");
		if ( typeof(target) != 'undefined' ){
			target.siblings().removeClass("active");
			target.addClass("active");
			target.removeClass("disabled");
			labels.children(".group").addClass("disabled");
			labels.children(".result").addClass("disabled");
			main.showPage(order)
		}
		views.preview.clear();
		views.keyword.render();
		views.viewer.render();
		views.controller.show();
		openLoading();
		ctrl.recordKeywordLoad(function(){
			closeLoading();
			ctrl.show();
			ctrl.keywordListRefresh();
		});

	}

	this.back = function(){
		main.back();
	}

	this.show = function(){
		views.controller.show();
		views.keyword.show();
		views.preview.show();
		views.viewer.show()
	}

	this.lock = function(){
		views.controller.lock();
		views.keyword.lock();
		views.preview.lock();
		views.viewer.lock()
	}




	this.testCall = function(key){
		console.log("call for test relation( groupController - "+key+" )");
	}

	this.getView = function(){
		return book.find(".view > .preview-in > .container");
	}

	// next 
	this.nextPage = function(){
		var curRecord = ctrl.getCurrentRecord();
		var text = data.textData.label;
		curRecord.label = curRecord.id+" "+text;
		

		main.next();
	}

	this.getKeywordsInGroups = function( set ){
		return main.getKeywordsInGroups(set);
	}

	this.getCurrentRecord = function(){
		return main.getRecordById(data.curRecord);
	}

	this.getCurrentGroups = function(){
		var record = ctrl.getCurrentRecord();
		console.log(record)
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

	this.textDataCheck = function( ){
		var labels = ctrl.getTextData().label;
		var set = new Array();
		var data = ctrl.getTextData().data;
		for ( var ind = 0 ; ind < labels.length ; ind++ ){
			var label = labels[ind];
			var exist = false;
			for ( var n = 0 ; n < data.length ; n++ ){
				var d = data[n];
				if ( d.name == label ){
					exist = true;
					break;
				}
			}
			if ( !exist ){
				set.push( label );
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

	this.recordKeywordLoad = function(call){
		var record = ctrl.getCurrentRecord();
		if ( typeof (record) != "undefined" ){
			var keywords = main.getGroupKeywords(record.id);
			ctrl.loadUnknowText( keywords, call)
		}else{
			notUndefined(call);
		}
	}

	this.loadUnknowText = function( set, call ){
		var unknowList = new Array();
		for ( var ind = 0 ; ind < set.length ; ind++ ){
			var label = set[ind];
			if ( typeof ( ctrl.getTextData().data[label] ) == "undefined" ){
				unknowList.push( label );
			}
		}
		console.log(unknowList)
		if ( unknowList.length > 0 ){
			data.ajax.getKeywordAssoc(unknowList, function( msg ){
				//console.log(msg)
				notUndefined(call)
			});
		}else{
			notUndefined(call)
		}
		
	}

	this.tagEvent = function(e){
		var text = ctrl.getTextData().label;
		var key = e.html();
		var ind = text.indexOf(key);
		if ( e.hasClass("active")){			
			if ( ind == -1 ){
				text.push(key)
			}
		}else{
			if ( ind != -1 ){
				text.splice( ind, 1);
			}
		}
		//console.log(text)

		ctrl.draw();
	}

	this.keywordListRefresh = function(){
		views.keyword.fresh( data.textData.label );
	}

	this.termPanelRemove = function(key, call){
		console.log(key)
		var ind = data.textData.label.indexOf(key);
		if ( ind != -1 ){
			data.textData.label.splice(ind, 1);
		}

		notUndefined(call)
	}

	this.draw = function(){
		var text = ctrl.getTextData().label;
		openLoading();
		ctrl.loadUnknowText( text, function(){
			var set = new Array();
			for ( var ind = 0 ; ind < text.length ; ind++ ){
				var key = text[ind];
				if ( typeof( ctrl.getTextData().data[key] ) != "undefined"){
					set.push( key );
				}
			}
			console.log(set)
			views.preview.drawChart( set );
			closeLoading();
		})
	}

	ctrl.initial();
}