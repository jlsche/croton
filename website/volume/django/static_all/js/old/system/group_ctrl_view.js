function groupCtrlView (main) {
	var ctrl = this;
	var main = main;
	var con = main.getView().children(".right-column").children(".controller");
	var btn = {
		combine : function(){
			return con.children(".button.combine")
		},
		next : function(){
			return con.children(".button.next")
		},
		all : function(){
			return con.children(".button")
		}
	};

	this.initial = function(){
		//console.log( " init the class ")
		//main.testCall("controller");
		ctrl.combineEvent( btn.combine() );
		ctrl.nextEvent( btn.next() );
	}

	this.combineEvent = function( e ){
		e.unbind("click");
		e.bind("click", function(){
			var entry = $(this);
			if ( !entry.hasClass("disabled") ){
				main.combineGroup();
			}
			
		});
	}

	this.nextEvent = function( e ){
		e.unbind("click");
		e.bind("click", function(){
			var entry = $(this);
			if ( !entry.hasClass("disabled") ){
				main.nextPage();
				ctrl.lock();
			}
			
		});
	}

	this.filter = function( num ){
		btn.all().addClass("disabled");
		if ( num == 1 ){
			btn.next().removeClass("disabled");
		}else if ( num > 1 ){
			btn.combine().removeClass("disabled");
		}
	}

	this.lock = function(){
		btn.all().addClass("disabled");
	}

	this.show = function(){
		btn.all().removeClass("disabled");
		main.groupSelect()
	}
	
	ctrl.initial();
}