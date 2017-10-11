function evtManage (element) {
	var elem = element;
	var ctrl = this;
	var container = new Object();
	this.bind = function(evt, name, obj){
		if ( typeof ( container[evt]) == 'undefined' ){
			container[evt] = new Object();
		}
		container[evt][name] = obj;
		ctrl.update();
	}

	this.unbind= function(evt, name){
		if ( typeof( container[evt] ) != 'undefined' ){
			if ( typeof( container[evt][name]) != 'undefined' ){
				delete container[evt][name];
				ctrl.update();
			}
		}
	}

	this.update = function(){
		for ( evt in container ){
			elem.unbind( evt );
			var con = container[evt];
			for ( fun in con ){
				elem.bind( evt, con[fun] );
			}
		}
	}
}