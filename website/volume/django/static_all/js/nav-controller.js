function navController (lan, dc){
	var ctrl = this;
	var lang = lan;
	var ajax = dc.getData().ajax;
	var ds_ctrl = dc;



	this.selectInit = function(e){
		e.html("");
		var gen = $("<div></div>");
		gen.addClass("option");
		gen.addClass("active");
		gen.html( lang.getString("none"));
		gen.attr("value", -1);
		e.append(gen);
	}

	this.getNav = function(){
		return $("body > .nav");
	}

	this.getNavItem = function ( term ){
		var e = ctrl.getNav();
		//console.log(term)
		var condtition = "*[label='"+term+"']";
		var target = e.find(condtition);
		return target;
	}



	this.renderTemplate = function () {
		var entry = ctrl.getNavItem("template").children(".entry");
		try{
			ajax.getTemplateList(function(msg){
				console.log(msg)
				if ( msg.type ){
					var temp_ind = 0;
					if ( window.location.href.indexOf("#") != -1 ){
						var param = window.location.href.split('#')[1].split("&");
						for ( var ind = 0 ; ind < param.length ; ind++ ){
						  var item = param[ind];
						  var pair = item.split("=");
						  if ( pair[0] == "template" ){
						    var temp = parseInt( pair[1] );
						    if ( Number.isInteger (temp)){
						    	if ( temp >=0 ){
						    		temp_ind = temp;
						    	}
						    }
						    
						  }
						}
					}
					console.log(temp_ind)
					entry.html("");
					var data = msg.data;
					for ( var ind = 0 ; ind < data.length ; ind++ ){
						var e = data[ind];
						var gen = jqDOM.div();
						gen.addClass("option");
						gen.html ( e.name );
						gen.attr("value", e.id );



						entry.append(gen);
						if ( parseInt(e.id) == temp_ind ){
							console.log(e.id)
							console.log( e.name )
							console.log( gen )
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
					//console.log(val)
					window.location.href="#template="+val
					if ( val != -1 ){

						console.log(" template : "+val);
						openLoading(function(){
							ctrl.renderRecordList( val, function(){
								closeLoading();
							})							
						})
					}
				});
				if ( entry.children(".option[value='"+temp_ind+"']").length > 0 ){
					entry.children(".option[value='"+temp_ind+"']").click();
				}else{
					entry.children(".option").eq(0).click();
				}
				


			})
		}catch(e){}
	}

	this.renderRecordList = function(id, call){
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

		})

	}

	this.loadData = function(call){
		var t_id = ctrl.getNavItem("template").find(".entry > .option.active").attr("value");
		var r_id = ctrl.getNavItem("record").find(".entry > .option.active").attr("value");
		var tag = new Object({
			"template" : ctrl.getNavItem("template").find(".entry > .option.active").html(),
			"record" : ctrl.getNavItem("record").find(".entry > .option.active").html()
		})
		//r_id = 1;

		if ( r_id > 0 ){
			ds_ctrl.getData().version = tag;
			ds_ctrl.setRecord(r_id, ctrl.getNavItem("record").find(".entry > .option.active").html());
			ds_ctrl.setTemplate(t_id, ctrl.getNavItem("template").find(".entry > .option.active").html());
			openLoading(function(){
				ajax.loadGroups(t_id, 1, function(msg){
					if ( msg.type ){
						ds_ctrl.getData().group = msg.data;
						//onsole.log(msg.data)
						ajax.loadRecord( r_id, function( record ){
							if ( record.type ){
								ds_ctrl.getData().record = record.data;
								ajax.getClass ( r_id, function( classes ){
									if ( classes.type ){
										ds_ctrl.getData().class = classes.data;
										ds_ctrl.start();
										closeLoading();
									}
									
								})
								
							}
						});
					}else{
						console.log( "load group error");
					}
				})				
			})
		}
	}

	this.init = function(){
		console.log("nav init");
		ctrl.selectInit(  ctrl.getNavItem("record").children(".entry") );
		ctrl.selectInit(  ctrl.getNavItem("template").children(".entry") );

		ctrl.getNavItem("load").bind("click", function(){
			ctrl.loadData();
		})

	}

	ctrl.init();
}