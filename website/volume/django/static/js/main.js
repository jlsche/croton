
function generatorLoadingStatus(){
    var svg = $('<svg xmlns="http://www.w3.org/2000/svg" width="198px" height="198px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-ring"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"/><circle cx="50" cy="50" r="49" stroke-dasharray="169.33184402848985 138.54423602330985" stroke="#11c1c3" fill="none" stroke-width="2" transform="rotate(124.448 50 50)" class=""><animateTransform attributeName="transform" type="rotate" values="0 50 50;180 50 50;360 50 50;" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" begin="0s"/></circle><text xmlns="http://www.w3.org/2000/svg" x="50%" y="55%" width="198px" style="&#10;    text-anchor: middle;&#10;    width: 100%;&#10;    font-family: 微軟正黑體, sans-serif, &quot;Righteous&quot;,cursive !important;&#10;   &#10;" fill="#9a9a9a">loading</text></svg>');
    /* font-weight: bold;*/
    $("text", svg).html(lang.getString("loading-text"));
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svg[0]);
    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
    
    var style = $("<style></style>");
    var text = "";
    text += ".loading-status{ background-image: url('";
    text += url;
    text += "');background-repeat: no-repeat;background-position: 50% 50%;width: 100%;height: 100%;position: fixed;z-index: 5000;    background-color: rgba(0,0,0,0.2);visibility:hidden;}";

    style.html(text)
    $("head").append(style);
    
}

function openLoading(call){
    $(".overlay.loading-status").addClass("active").eq(0).queue(function(){
        var e = $(this);
        notUndefined(call)
        e.dequeue();
    });
}

function closeLoading(call){
    $(".overlay.loading-status").removeClass("active").eq(0).queue(function(){
        var e = $(this);
        notUndefined(call)
        e.dequeue();
    });
}

function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
 
    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }
 
    return temp;
}
 
var jqDOM = {
	div : function(term, html){
		var e = $("<div></div>");
        if ( typeof(term) != 'undefined'){
            e.addClass(term);
        }

        if ( typeof(html) != 'undefined'){
            e.html(html);
        }
		
		return e;
	},
    option : function(val, html){
        var e = $("<option></option>");
        if ( typeof(val) != 'undefined'){
            e.attr("value", val)
        }

        if ( typeof(html) != 'undefined'){
            e.html(html);
        }
        
        return e;
    }
}

var ctrl = {
	data : undefined
}

var td;

function notUndefined(call, e){
	if ( typeof(call)!='undefined'){
		if ( typeof(e) != 'undefined'){
			call(e);
		}else{
			call();
		}
	}
}




function page_init (argument) {
    
    //lang.setLang("zh-tw");
    

    generatorLoadingStatus();
    ctrl.data = new dataSystem($("body > .main > .book"));
    td = ctrl.data;

    var nc = new navController(lang, ctrl.data);

    lang.rewrite();

    nc.renderTemplate()


}

/*

function ObjectType ( someVar ){
    if ( typeof someVar === 'string'){
        return "string"
    }
    else if( Object.prototype.toString.call( someVar ) === '[object Array]' ) {
        return "Array";
    }else{
        return "Object"
    }
}

*/
