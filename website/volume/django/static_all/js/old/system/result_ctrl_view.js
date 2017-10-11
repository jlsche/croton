function resultCtrlView (main) {
	var ctrl = this;
	var main = main;
	var con = main.getView().children(".right-column").children(".controller");
	var btn = {
		back : function(){
			return con.children(".button.back")
		},
		next : function(){
			return con.children(".button.continue")
		},
		output : function(){
			return con.children(".button.output")
		},
		all : function(){
			return con.children(".button")
		}
	};

	this.initial = function(){		
		ctrl.backEvent( btn.back() );
		ctrl.nextEvent( btn.next() );
		ctrl.outputEvent( btn.output() );
	}
	this.outputEvent = function( e ){
		e.unbind("click");
		e.bind("click", function(){
			var entry = $(this);
			
			if ( !entry.hasClass("disabled") ){
				main.output();
			}
		});
		
	}



	this.backEvent = function( e ){
		e.unbind("click");
		e.bind("click", function(){
			var entry = $(this);
			
			if ( !entry.hasClass("disabled") ){
				main.back();
				ctrl.lock();
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
		//btn.all().removeClass("disabled");
		if ( num > 0 ){
			btn.next().removeClass("disabled")
		}else{
			btn.next().addClass("disabled")
		}
	}

	this.lock = function(){
		btn.all().addClass("disabled");
		btn.output().removeClass("disabled");
	}

	this.show = function(){
		btn.all().removeClass("disabled");
	}
	
	ctrl.initial();
}