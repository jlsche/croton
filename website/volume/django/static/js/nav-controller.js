function navController(lan, dataSystem) {
	var ctrl = this;
	var lang = lan;
	var ajax = dataSystem.getData().ajax;
	var ds_ctrl = dataSystem;

	this.selectInit = function(e) {
		e.html("");
		var gen = $("<div></div>");
		gen.addClass("option");
		gen.addClass("active");
		gen.html( lang.getString("none"));
		gen.attr("value", -1);
		e.append(gen);
	}

	this.getNav = function() {
		return $("body > .nav");
	}

	this.getNavItem = function( term ) {
		var e = ctrl.getNav();
		var condtition = "*[label='"+term+"']";
		var target = e.find(condtition);
		return target;
	}
	
	this.renderTemplate = function () {
		var entry = ctrl.getNavItem("template").children(".entry");
		try{
			ajax.getTemplateList(function(msg){
				console.log('Resp of getTemplateList: ' + msg);
				if ( msg.type ){
					var temp_ind = 0;
					if ( window.location.href.indexOf("#") != -1 ) {
						var param = window.location.href.split('#')[1].split("&");
						for ( var ind = 0 ; ind < param.length ; ind++ ) {
							var item = param[ind];
						  	var pair = item.split("=");
							console.log(item, pair);
						  	if ( pair[0] == "template" ) {
						    	var temp = parseInt( pair[1] );
						    	if ( Number.isInteger (temp)) {
						    		if ( temp >=0 ) {
						    			temp_ind = temp;
						    		}
						    	}
						  	}
						}
					}

					console.log(temp_ind);
					entry.html("");
					var data = msg.data;
					data = data.reverse();
					for ( var ind = 0 ; ind < data.length ; ind++ ){
						var e = data[ind];
						var gen = jqDOM.div();
						gen.addClass("option");
						gen.html ( e.name );
						gen.attr("value", e.id );
						entry.append(gen);

						if ( parseInt(e.id) == temp_ind ){
							console.log(e.id);
							console.log( e.name );
							console.log( gen );
							gen.addClass("active");
						}
					}
				}
				entry.children(".option").unbind("click");
				entry.children(".option").bind("click", function(){
					var e = $(this);
					e.siblings().removeClass("active");
					e.addClass("active");

					var val = e.attr("value");
					window.location.href = "#template=" + val;
					if ( val != -1 ) {
						console.log(" template : "+val);
						openLoading(function(){
							ctrl.renderRecordList( val, function(){
								closeLoading();
							});							
						});
					}
				});
				if ( entry.children(".option[value='" + temp_ind + "']").length > 0 ) {
					entry.children(".option[value='" + temp_ind + "']").click();
				}else {
					entry.children(".option").eq(0).click();
				}
			});
		}catch(e) {}
	}

	this.renderRecordList = function(id, call) {
		var entry = ctrl.getNavItem("record").children(".entry");

		ajax.getRecordList(id, function(msg){			
			if ( msg.type ){
				entry.html("");
				var data = msg.data;
				for ( var ind = 0 ; ind < data.length ; ind++ ){
					var e = data[ind];
					var gen = $("<div></div>");
					gen.addClass("option");
					gen.html ( e.name );
					gen.attr("value", e.id );

					if ( ind == 0 ){
						gen.addClass("active");
					}
					entry.append(gen);
				}
				entry.children(".option").unbind("click");
				entry.children(".option").bind("click", function(){
					var e = $(this);
					e.siblings().removeClass("active");
					e.addClass("active");
					var val = e.attr("value");
					if ( val != -1 ){
						console.log(" record : "+val);						
					}
				});
				notUndefined(call);
			}
		});
	}

	this.loadData = function(req, call) {
		openLoading();
		var template_id = ctrl.getNavItem("template").find(".entry > .option.active").attr("value");
		var record_id = ctrl.getNavItem("record").find(".entry > .option.active").attr("value");
		var tag = new Object({
			"template" : ctrl.getNavItem("template").find(".entry > .option.active").html(),
			"record" : ctrl.getNavItem("record").find(".entry > .option.active").html()
		});

		//record_id = 1;
		ds_ctrl.getData().template_id = template_id;
		ds_ctrl.getData().record_id = record_id;

		if ( record_id > 0 ) {
			ds_ctrl.getData().version = tag;
			ds_ctrl.setRecord(record_id, ctrl.getNavItem("record").find(".entry > .option.active").html());
			ds_ctrl.setTemplate(template_id, ctrl.getNavItem("template").find(".entry > .option.active").html());

			var params = req.getData();

			ajax.test_loadGroups(template_id, params, function(msg) {
				if ( msg.type ) {
					ds_ctrl.getData().group = msg.data;
					ds_ctrl.getData().record = msg.set;

					ajax.getLabel( record_id, function( classes ) {
						if ( classes.type ) {
							ds_ctrl.getData().class = classes.data;
							ds_ctrl.start();
							closeLoading();
						}		
					});
				}else {
					console.log( "load group error");
				}
			});
		}
	}	

	this.buildPagination = function(size, req) {
		$('.pagination').removeClass('hidden');
		$('#pagination-demo').twbsPagination({
	        totalPages: Math.ceil(size / rowPerPage),
	        visiblePages: 6,
	        startPage: 1,
	        initiateStartPageClick: true,
	        pageVariable: '{{page}}',
	        next: '下页',
	        prev: '前页',
	        first: '最前',
	        last: '最后',
	        onPageClick: function (event, page) {
	            //fetch content and render here
	            req.setOffset(rowPerPage * (page-1));
	            ctrl.loadData(req);
	            $('#page-content').text('第 ' + page + ' 页') + ' content here';
	        }
	    });
    }

    this.filterViewEvt = function() {
		var fillEvt = function() {
			var e = $(this);
			var list = e.parent().parent().parent().parent().parent().find(".list > .entry");
			if ( e.hasClass("active") ) {
				e.removeClass("active");
				list.find(".ctrl > .checkbox").removeClass("active");
				list.attr("sel", 0);
			}else {
				e.addClass("active");
				list.find(".ctrl > .checkbox").addClass("active");
				list.attr("sel", 1);
			}
		}
		var target = $("body > .overlay-view.label");
		var fill_check = target.find(".cont > .cont > .opt > .entry > .ctrl > .checkbox");
		var list = target.find(".cont > .cont > .list > .entry");
		var btn = {
			apply : target.find(".cont > .ctrl > .apply"),
			cancel : target.find(".cont > .ctrl > .cancel")
		};

		btn.apply.unbind("click");
		btn.cancel.unbind("click");
		fill_check.unbind("click");
		btn.apply.bind("click", function(){
			openLoading();
			var e = $(this);
			var list = e.parent().parent().find(".cont > .list > .entry[sel='1']");
			var array = new Array();
			for ( var ind = 0 ; ind < list.length ; ind++ ){
				var id = parseInt(list.eq(ind).attr("cid"));
				array.push(id);
			}
			ds_ctrl.getData().filterList = array;
			target.removeClass("active");

			$('#pagination-demo').twbsPagination('destroy');
			var template_id = ctrl.getNavItem("template").find(".entry > .option.active").attr("value");
			req.setOffset(-1);
			req.setLabels(ds_ctrl.getData().filterList);
			ajax.getGroupSize(template_id, req.getData(), function(res) {
				req.setOffset(0);
				if (res.length > rowPerPage) 
					ctrl.buildPagination(res.length, req);
				else {
					$('#page-content').text('');
					ctrl.loadData(req);
				}
					
			});
		});
		btn.cancel.bind("click", function() {
			target.removeClass("active");
		})
		fill_check.bind("click", fillEvt);
	}

	this.init = function() {
		ctrl.selectInit( ctrl.getNavItem("record").children(".entry") );
		ctrl.selectInit( ctrl.getNavItem("template").children(".entry") );
		var cont = $("body > .main > .book > .main > .panel.left > .list");

		ctrl.getNavItem("load").bind("click", function() {
			//cont.empty(); 			// 需要先清除之前的紀錄，否則第二次按下"讀取"按鈕，scroll的捲軸位置會錯誤，造成再次讀取。
			openLoading();
			ds_ctrl.clear_task();
			req = new requestController();
			$('#pagination-demo').twbsPagination('destroy');
			var template_id = ctrl.getNavItem("template").find(".entry > .option.active").attr("value");

			ajax.getGroupSize(template_id, req.getData(), function(res) {
				req.setOffset(0);
				if (res.length > rowPerPage) 
					ctrl.buildPagination(res.length, req);
				else {
					$('#page-content').text('');
					ctrl.loadData(req);
				}
			});
		});

		$("#search").bind("click", function() {
			openLoading();
			var cont = $("body > .main > .book > .main > .panel.left");
			var top_cont = $("body > .main > .book > .top > .panel.ctrl");
			var searchText = top_cont.find(".input > .text");
			var set = searchText.val();

			req.setOffset(-1);
			if ( set.length == 0) {
				req.setKeywords(new Array());
			}
			else 
				req.setKeywords(set.split(" "));
			
			$('#pagination-demo').twbsPagination('destroy');
			var template_id = ctrl.getNavItem("template").find(".entry > .option.active").attr("value");

			ajax.getGroupSize(template_id, req.getData(), function(res) {
				req.setOffset(0);
				if (res.length > rowPerPage)
					ctrl.buildPagination(res.length, req);
				else {
					$('#page-content').text('');
					ctrl.loadData(req);
				}
			});
		});

		var filter_ctrl = new filterSystem();
		$("#filter").bind("click", function() {
			filter_ctrl.filterView(ds_ctrl.getData(), lang, function() {
				console.log('good');
			});
		});

		var output_ctrl = new outputController(ds_ctrl);
		$("#output").bind("click", function() {
			openLoading();
			output_ctrl.output(function() {
				output_ctrl.outputCategorized(function() {
					closeLoading();
				})
			});
		});

		$("#output-raw").bind("click", function() {
			openLoading();
			output_ctrl.outputRawData(function () {
				closeLoading();
			});
		});

		$("#output-typical").bind("click", function() {
			openLoading();
			output_ctrl.outputTypical(function() {
				//output_ctrl.outputClusterResult(function() {
				closeLoading();	
				//});	
			});
		});

	}
	ctrl.init();
	ctrl.filterViewEvt();
	var req = new requestController();
	var rowPerPage = 100;
}
