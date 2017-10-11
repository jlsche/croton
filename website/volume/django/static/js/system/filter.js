function filterSystem() {
	var ctrl = this;

	this.filterView = function(global, lang){
		var temp = new Array();
		temp.push( {
			label_id: 0,
			nid: 0,
			name: lang.getString("no-label")
		});
		for ( var ind = 0 ; ind < global.class.length ; ind++ ){
			temp.push( global.class[ind]);
		}

		var evt = function(){
			var entry = $(this);		
			if  ( entry.hasClass("active") ) {
				entry.removeClass("active");
				entry.parent().parent().attr("sel",0);
			}else{
				entry.addClass("active");
				entry.parent().parent().attr("sel",1);
			}
		}

		var target = $("body > .overlay-view.label");
		var template = target.find(".hidden > .entry");
		var con = target.find(".cont > .cont > .list");
		if ( temp.length > 0 ) {
			con.empty();
			for ( var ind = 0 ; ind < temp.length ; ind++ ){
				var curData = temp[ind];
				var clone = template.clone();
				var box = clone.find(".ctrl > .checkbox");

				box.bind("click", evt);
				//clone.attr("cid", curData.id );
				clone.attr("cid", curData.label_id );
				clone.attr("sel", 0);
				clone.children(".text").html ( curData.nid + " - "+ curData.name);

				if ( global.filterList.length > 0 ){
					//if ( global.filterList.indexOf(curData.id) != -1 ){
					if ( global.filterList.indexOf(curData.label_id) != -1 ){
						clone.attr("sel", 1);
						box.addClass("active");
					}
				}
				con.append( clone );
			}
		}
		target.addClass("active");	
	}
}
