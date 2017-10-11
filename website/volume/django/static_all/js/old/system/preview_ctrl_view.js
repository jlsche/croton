function previewCtrlView (main) {
	var ctrl = this;
	var main = main;
	var con = main.getView().children(".right-column").children(".controller");
	var btn = {
		back : function(){
			return con.children(".button.back")
		},
		next : function(){
			return con.children(".button.next")
		},
		all : function(){
			return con.children(".button")
		}
	};

	this.initial = function(){
		
		ctrl.backEvent( btn.back() );
		ctrl.nextEvent( btn.next() );
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
		btn.all().removeClass("disabled");
		/*btn.all().addClass("disabled");
		if ( num == 1 ){
			btn.next().removeClass("disabled");
		}else if ( num > 1 ){
			btn.combine().removeClass("disabled");
		}*/
	}

	this.lock = function(){
		btn.all().addClass("disabled");
	}

	this.show = function(){
		btn.all().removeClass("disabled");
	}
	
	ctrl.initial();
}