function previewPreviewView (main) {
	var ctrl = this;
	var main = main;
	var con = main.getView().children(".left-column").children(".preview");
	var graph;
	this.initial = function(){
		var panel = con.children(".term-view");
		var apply = panel.find(".ctrl > .btn-entry.apply");
		var cancel = panel.find(".ctrl > .btn-entry.cancel");
		var remove = panel.find(".ctrl > .btn-entry.remove");
		apply.unbind("click", ctrl.termPanelApply)
		apply.bind("click", ctrl.termPanelApply)
		cancel.unbind("click", ctrl.termPanelCancel)
		cancel.bind("click", ctrl.termPanelCancel)
		remove.unbind("click", ctrl.termPanelRemove)
		remove.bind("click", ctrl.termPanelRemove)
		//ctrl.clear();
		if ( typeof(graph) == "undefined" ){
			graph = new orgChart(con, ctrl);
		}else{
			graph.reset();
		}
		
	}



	this.clear = function(){
		graph.reset();
	}

	this.convertList = function( list ){
		// this input param list is a pure string list array
		//console.log(list )
		var set = new Array();
		var source = main.getTextData().data;
		for ( var ind = 0 ; ind < list.length ; ind++ ){
			var k = list[ind];
			var entry = source[k]
			if ( typeof(entry) != "undefined" ){
				var object = new Object({
					id: entry.id,
					name : k,
					parent :[],
					sibling:[],
					children:[]
				});
				for ( var n = 0 ; n < entry.parent.length ; n++ ){
					var key = entry.parent[n];
					var target = source[key];
					if ( typeof(target) != "undefined" ){
						object.parent.push( target.id );
					}
				}
				for ( var n = 0 ; n < entry.sibling.length ; n++ ){
					var key = entry.sibling[n].name;
					var target = source[key];
					if ( typeof(target) != "undefined" ){
						object.sibling.push( new Object({
							id: target.id,
							type : entry.sibling[n].rel
						}) );
					}
				}
				for ( var n = 0 ; n < entry.children.length ; n++ ){
					var key = entry.children[n];
					var target = source[key];
					if ( typeof(target) != "undefined" ){
						object.children.push( target.id );
					}
				}
				set.push(object);
			}
		}
		return set;
	}

	this.drawChart = function( data ){
		var chartData = ctrl.convertList( data );
		//console.log(chartData)
		graph.draw(chartData);
		
	}

	this.termPanelRemove = function(){
		var e = $(this);
		console.log(e)
		var key = e.parent().siblings(".title").html()
		main.termPanelRemove(key, function(){
			ctrl.termPanelCancel();
			main.keywordListRefresh();
			main.draw()
		});
		
	}
	this.termPanelCancel = function(){
		var panel = con.children(".term-view");
		panel.removeClass("active");
	}
	this.termPanelApply = function(){
		var panel = con.children(".term-view");
		var allList = panel.find(".container > .term-con > .container");
		var entries = allList.children(".entry");
		var actives = allList.children(".entry.active");
		var labels = main.getTextData().label;
		var set = new Array();
		panel.removeClass("active");
		for ( var ind = 0 ; ind < entries.length ; ind++ ){
			var key = entries.eq(ind).html();
			if ( labels.indexOf(key) != -1 ){
				for ( var n = 0 ; n < labels.length ; n++ ){
					if ( labels[n] == key ){
						labels.splice(n, 1);
						break;
					}
				}
			}
		}

		for ( var ind = 0 ; ind < actives.length ; ind++ ){
			var key = actives.eq(ind).html();
			if ( labels.indexOf(key) == -1 ){
				labels.push(key);
			}
		}
		main.keywordListRefresh();
		main.draw()
	}

	this.termPanel = function( term ){
		var entry = main.getTextData().data[term];
		if ( typeof(entry) != "undefined" ){
			var container = new Object({
				name : term,
				top : new Array(),
				mid : new Array(),
				bot : new Array(),
				total : new Array()
			});

			for ( var ind = 0 ; ind < entry.parent.length ; ind++ ){
				var key = entry.parent[ind];
				if ( container.top.indexOf(key) == -1 ){
					container.top.push(key);
				}
				if ( container.total.indexOf(key) == -1 ){
					container.total.push(key);
				}
			}
			for ( var ind = 0 ; ind < entry.children.length ; ind++ ){
				var key = entry.children[ind];
				if ( container.bot.indexOf(key) == -1 ){
					container.bot.push(key);
				}
				if ( container.total.indexOf(key) == -1 ){
					container.total.push(key);
				}
			}
			for ( var ind = 0 ; ind < entry.sibling.length ; ind++ ){
				var key = entry.sibling[ind].name;
				if ( container.mid.indexOf(key) == -1 ){
					container.mid.push(key);
				}
				if ( container.total.indexOf(key) == -1 ){
					container.total.push(key);
				}
			}

			ctrl.renderTermPanel( container );

		}

	}


	this.renderTermPanel = function( data ){
		var evt = function(){
			var e = $(this)
			if ( e.hasClass("active")){
				e.removeClass("active");
			}else{
				e.addClass("active");
			}
		}
		var panel = con.children(".term-view");
		panel.addClass("active");
		var topList = panel.find(".container > .term-con.top > .container");
		var midList = panel.find(".container > .term-con.mid > .container");
		var botList = panel.find(".container > .term-con.bot > .container");
		var allList = panel.find(".container > .term-con > .container");
		allList.empty();
		panel.children(".title").html( data.name );
		for ( var ind = 0 ; ind < data.top.length ; ind++ ){
			topList.append( jqDOM.div("entry", data.top[ind]));
		}
		for ( var ind = 0 ; ind < data.mid.length ; ind++ ){
			midList.append( jqDOM.div("entry", data.mid[ind]));
		}
		for ( var ind = 0 ; ind < data.bot.length ; ind++ ){
			botList.append( jqDOM.div("entry", data.bot[ind]));
		}


		var entries = allList.children(".entry");
		for ( var ind = 0 ; ind < entries.length ; ind++ ){
			var key = entries.eq(ind).html();
			if ( main.getTextData().label.indexOf(key) != -1 ){
				entries.eq(ind).addClass("active");
			}
		}
		entries.unbind("click", evt);
		entries.bind("click", evt);
		panel.addClass("active");
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