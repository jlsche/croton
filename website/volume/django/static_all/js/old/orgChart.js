var orgchart_global = new Object({
    click_delay : 200,
    timer : new Object()
})

function orgChart (con, main) {
    var main = main;
    var oriData;
	var ctrl = this;
	var space = con;
    var nodes;
    var param = {
        sp_x :100,
        sp_y : 50,
        rect_x : 200,
        rect_y : 40,
        margin_X : 80

    }
	var svgEl = function (tagName) {
        return document.createElementNS("http://www.w3.org/2000/svg", tagName);
    }



    var testData = [{"id":1,"name":"test01","parent":[],"sibling":[{"id":7,"type":"lik"}]},{"id":2,"name":"test02","parent":[],"sibling":[]},{"id":3,"name":"test03","parent":[2,1],"sibling":[{"id":4,"type":"hate"},{"id":6,"type":"hate"}]},{"id":4,"name":"test04","parent":[2],"sibling":[{"id":6,"type":"like"},{"id":3,"type":"bitch"}]},{"id":6,"name":"test06","parent":[2],"sibling":[{"id":4,"type":"like"}]},{"id":5,"name":"test05","parent":[],"sibling":[]},{"id":7,"name":"test07","parent":[8],"sibling":[{"id":1,"type":"hate"}]},{"id":8,"name":"test08","parent":[5],"sibling":[{"id":1,"type":"lik2"}]}];

    var buildTree = function( data ){
        var tree = new Array();
        nodes = new Array();
        for ( var ind = 0 ; ind < data.length ; ind++ ){
            var n = nodeGen (data[ind].id, data[ind].name);
            nodes.push ( n );
        }

        for ( var ind = 0 ; ind < data.length ; ind++ ){
            var node = data[ind];
            setRelation(node);
            if ( node.parent.length == 0 ){
                tree.push( getNode(node.id));

            }
        }

        for ( var ind = 0 ; ind < tree.length ; ind++ ){
            var t = tree[ind];
            countDegrees(t, 0);
        }

        nodes.sort( function( a, b ){
           return b.degree - a.degree;
        }); 

        var leaf = getLeaf(nodes);

        leaf.sort( function( a, b){
            return b.degree - a.degree;
        })

        for ( var ind = 0 ; ind < leaf.length ; ind++ ){
            var entry = leaf[ind];
            adjustDegrees(entry, entry.degree)
        }
        nodes.sort( function( a, b ){
           return b.degree - a.degree;
        }); 
        renderTree(nodes)
    }

    var getLeaf = function ( set ){
        var result = new Array();
        for ( var ind = 0 ; ind < set.length ; ind++ ){
            var node = set[ind];
            console.log(node)
            if ( node.children.length == 0 ){
                result.push(node)
            }
        }
        return result;
    }

    var adjustDegrees = function(node, level){
        node.degree = level;
        for ( var ind = 0 ; ind < node.parent.length ; ind++ ){
            adjustDegrees( node.parent[ind], level-1 );
        }
    }

    var countDegrees = function(node, level){
        
        if ( node.degree < level ){
            node.degree = level;
        }else{
            level = node.degree
        }
        for ( var ind = 0 ; ind < node.children.length ;ind++ ){
            //console.log(node.children[ind])
            countDegrees(node.children[ind], level+1);
        }
    }
    var renderTree = function( nodes ){
        var currentDegree = 0;
        var list = new Array();
        var max = -1
        for ( var ind = 0 ; ind < nodes.length ; ind++){
            if ( max < nodes[ind].degree ){
                max = nodes[ind].degree;
            }
        }
        for ( var ind = 0 ; ind <= max ; ind++ ){
            list.push( new Array() );
        }

        for ( var ind = 0 ; ind < nodes.length ; ind++){
            var y = nodes[ind].degree;
            list [ y ].push( nodes[ind]);
            renderNode(nodes[ind], list[y].length, y)
        }

        console.log(list)

    }

    var nodeEvent = function(e){

        var clickEvt = function(){
            var entry = $(this);
            var time = parseInt( new Date().getTime() );
            var pre_t = parseInt( entry.attr("lastClick") );
            if ( time - pre_t < orgchart_global.click_delay ){
                entry.attr("lastClick", time);
                if ( typeof( orgchart_global.timer["nodeClick"]) != 'undefined' ){
                    clearTimeout(orgchart_global.timer["nodeClick"]);    //prevent single-click action
                }
                doubleClick(entry);

            }else{
                entry.attr("lastClick", time);
                orgchart_global.timer["nodeClick"] = setTimeout(function() {
                    console.log(entry.attr("class"))
                    singleClick(entry);

                }, orgchart_global.click_delay );                
            }
            //console.log(entry.attr("id"))
        }

        e.unbind("click", clickEvt);
        //e.unbind("dblclick");

        e.bind("click", clickEvt);
    }

    var doubleClick = function(entry){
        console.log(entry.attr("id"));
        var id = entry.attr("id");
        var node = getNode(id);
        var target = getOriDataById(id); 
        main.termPanel( target.name );
    }

    var singleClick = function(entry){
        clearSiblingLine();

        if ( !entry.hasClass("active")){
            unActiveRects();
            entry.addClass("active");
            entry.siblings(".rect").addClass("opacity");
            entry.removeClass("opacity")
            var id = entry.attr("id");
            var node = getNode(id);
            var target = getOriDataById(id);         
            console.log(target)   
            for ( var ind = 0 ; ind < target.sibling.length ; ind++ ){
                var pair = target.sibling[ind];
                
                entry.siblings(".rect[id='"+pair.id+"']").removeClass("opacity")
                addLink(id, pair.id, space.find("svg > .view"), pair.type);
            }
        }else{
            entry.removeClass("active");
        }
    }



    var getSibling = function(id){
        var node = getOriDataById(id);
        return node.sibling;
    }
    var renderNode = function( node , d, level){
        var child = node.children;
      
        var point = computRectPostion( d, level);
        var rect = rectGen(node, point.x, point.y);
        $(rect).attr("tx", point.x);
        $(rect).attr("ty", point.y);

        space.find("svg > .view").append(rect);

        for ( var ind = 0 ; ind < child.length ; ind++ ){
            var c = child[ind];
            addLink( c.id, node.id, space.find("svg > .view"))
        }

    }

    var computRectPostion = function( d, level){
        var point = new Object({
            y : (param.sp_y + (param.rect_y)*4*level),
            x : (param.sp_x + (param.rect_x+param.margin_X) * d )
        }) 
        
        return point;
    }

    var rectGen = function( data , x, y ){
        var rect = svgEl("g");
        $(rect).addClass("rect");
        $(rect).attr("id", data.id);
        /*
            <g class="rect active" text-anchor="middle" rx="5" ry="5" id="2" transform="translate(30,30)">
                <path class="box" d="M0 0 L200 0 L200 40 L0 40 Z"></path>
                <text x="100" y="30" font-size="20" text-anchor="middle" fill="white" >I love SVG!</text>
            </g>
        */

        $(rect).attr("onselectstart","return false");
        $(rect).html('<path class="box" d="M0 0 L'+param.rect_x+' 0 L'+param.rect_x+' '+param.rect_y+' L0 '+param.rect_y+' Z"></path><text x="'+param.rect_x/2+'" y="'+param.rect_y*3/4+'" font-size="20" text-anchor="middle" fill="white" >'+data.name+'</text>');
        rect.setAttribute("transform", "translate(" + x + ", " + y + ")");
        rect.setAttribute("lastClick", 0);
        nodeEvent($(rect));
        return rect;

    }

    var setRelation = function( data ){
        var id = data.id;
        var parent = data.parent;
        var sibling = data.sibling;
        var node = getNode(id);

        if ( typeof(node) != "undefined" ){
            for ( var ind = 0 ; ind < parent.length ; ind++ ){
                var p = getNode(parent[ind]);
                if ( typeof(p) != "undefined" ){
                    p.children.push(node);
                    node.parent.push(p);
                }
            }
        }

        var sib = getSibling(data.id);
        for ( var ind = 0 ; ind < sib.length ; ind++ ){
            var s = getNode(sib[ind].id);
            if ( typeof(s) != "undefined" ){
                node.sibling.push( s );
            }
        }

    }
    var getNode = function(id){
        for ( var ind = 0 ; ind < nodes.length ; ind++ ){
            if ( id == nodes[ind].id ){
                return nodes[ind];
            }
        }
    }
    var nodeGen = function(id, name){
        var node = new Object({
            id : id,
            name : name,
            parent : new Array(),
            children : new Array(),
            sibling : new Array(),
            degree : 0
        })
        return node;
    }

    var initial = function(){
        space.children("svg").remove();
    	space.prepend('<svg currentScale="1"><defs></defs><rect width="100%" height="100%" class="back" fill="transparent"></rect><g class="view"  ty="0" tx="0"></g></svg>');
    	var def = $("svg > defs", space);
        backgroundDrag( space.find("svg > rect.back") );
    	zoom(space.children("svg"))
    	var def_cont = "";
    	def_cont += '<marker id="parent-arrow" orient="auto"markerWidth="10" markerHeight="10" markerUnits="strokeWidth"refX="7" refY="5"><path d="M2 2, L7 5 , L2 8Z"  stroke-width="1" stroke="black" fill="white"/><path d="M0 1, L0 9Z"  stroke-width="1" stroke="black" /></marker>'
    	def_cont += '<marker id="sibling-arrow" orient="auto"markerWidth="10" markerHeight="10" markerUnits="strokeWidth"refX="5" refY="5"><path d="M0 2, L5 5 , L0 8Z"  stroke-width="1" stroke="black" fill="black"/></marker>'
    	def.html(def_cont);
    	//buildTree( dataConvert(oriData) )
    }

   
    var zoom = function(e){
        $(e).mousewheel(function(event) {
            var e = $(this);
            var target = e.children("g.view");
            var type = event.deltaY;
            var currentScale = e.attr("currentScale");
            //console.log(currentScale)
            if ( type == 1 ){
                currentScale = parseFloat(currentScale) + 0.05;                  
            }else{
                if ( parseFloat(currentScale)-0.0001 > 0.05 ){
                    currentScale = parseFloat(currentScale)-0.05;
                }
            }
            e.attr("currentScale", currentScale);
            updateView( e );
        });
    }
    
    var getTranform = function ( e ){
        var attr = e.attr("transform");
        var arr = new Object();
        while ( attr.indexOf(")") != -1 ){
            var entry = attr.substring(0, attr.indexOf(")")+1 );
            var term = entry.substring(0, attr.indexOf("(")).replace(/ /g,"");
            var val = entry.substring( attr.indexOf("(") +1, attr.indexOf(")"));
            attr = attr.substring(attr.indexOf(")")+1, attr.length);
            //console.log(attr)

            arr[term] = val;
        }
        return arr;
    }

    var setTranform =function ( e, term, val){
        var arr = getTranform(e);
        if ( typeof(arr[e]) != 'undefined'){
            arr[e] = val;
            var cont = "";
            for ( str in arr ){
                cont += str+"("+arr[str]+") ";
            }
            e.attr(cont);
        }
    }

    var computeLine = function ( source, target, scale ){
        var s = $("g.rect[id='"+source+"']");
        var t = $("g.rect[id='"+target+"']");

        var direct = new Object();
        direct.d = ""
        if (( s.length > 0 ) && (t.length>0)){
            var sb = s[0].getBoundingClientRect();
            var tb = t[0].getBoundingClientRect();
            var sx = getTranform(s).translate.split(",");
            var tx = getTranform(t).translate.split(",");
            
            if ( sb.left < tb.left ){
                direct.type = "left";
                direct.d += "M"+parseInt(parseInt(sx[0])+(sb.width/scale)) +" "+parseInt((sb.height/2)/scale+parseInt(sx[1])) + " ";
                direct.d += "C"+parseInt(parseInt(sx[0])+(sb.width/scale)+50)+" "+parseInt(parseInt(sx[1])+2*(sb.height/scale))+" ";
                direct.d += parseInt(parseInt(tx[0])+((tb.width-50)/2/scale))+" "+parseInt(parseInt(tx[1])+(3*tb.height/scale))+" ";
                direct.d += parseInt(parseInt(tx[0])+(tb.width/2/scale))+ " "+parseInt(parseInt(tx[1])+(tb.height/scale));
            }else{
                direct.type = "right";
                direct.d += "M"+parseInt(sx[0])+" "+parseInt((sb.height/2)/scale+parseInt(sx[1])) + " ";
                direct.d += "C"+parseInt(parseInt(sx[0])-50)+" "+parseInt(parseInt(sx[1])-(sb.height/scale))+" ";
                direct.d += parseInt(parseInt(tx[0])+((tb.width+50)/2/scale))+" "+parseInt(parseInt(tx[1])-(2*tb.height/scale))+" ";
                direct.d += parseInt(parseInt(tx[0])+(tb.width/2/scale))+ " "+parseInt(parseInt(tx[1]));

            }
        }
        
        return direct;
    }

    var computeParentLine = function ( source, target, scale ){
        var s = $("g.rect[id='"+source+"']");
        var t = $("g.rect[id='"+target+"']");

        var d = "";
        if (( s.length > 0 ) && (t.length>0)){
            var sb = s[0].getBoundingClientRect();
            var tb = t[0].getBoundingClientRect();
            var sx = getTranform(s).translate.split(",");
            var tx = getTranform(t).translate.split(",");
            
            /*
            d += "M"+parseInt(parseInt(sx[0])+(sb.width/scale/2)) + " " + parseInt(sx[1]) + " ";
            d += "L"+parseInt(parseInt(sx[0])+(sb.width/scale/2)) + " " + parseInt(sx[1]-40) + " ";
            d += "L"+parseInt(parseInt(tx[0])+(tb.width/scale/2)) + " " + parseInt(sx[1]-40) + " ";
            d += "L"+parseInt(parseInt(tx[0])+(tb.width/scale/2)) + " " + parseInt(parseInt(tx[1])+(tb.height/scale))
            */
            d += "M"+parseInt(parseInt(sx[0])+(sb.width/scale/2)) + " " + parseInt(sx[1]) + " ";
            d += "L"+parseInt(parseInt(tx[0])+(tb.width/scale/2)) + " " + parseInt(parseInt(tx[1])+(tb.height/scale)+20);
            d += "L"+parseInt(parseInt(tx[0])+(tb.width/scale/2)) + " " + parseInt(parseInt(tx[1])+(tb.height/scale))
        }
        
        return d;
    }

    var addLink = function (source, target, view, str){
        var scale = parseFloat( view.parent().attr("currentScale") );
        var text = svgEl("text");
        var d;
        var rel = getRelationship ( source, target);
        var path = svgEl("path");
        path.setAttribute("class", "line");
        path.setAttribute("stroke","black");
        if ( rel == "sibling" ){
            var direct = computeLine(source, target, scale);
        	d = direct.d;
            if ( direct.type == "right"){
                path.setAttribute("stroke", "rgba(50,50,255,0.7)");
                text.setAttribute("stroke", "rgba(50,50,255,0.7)");
            }else if (direct.type=="left"){
                path.setAttribute("stroke", "rgba(50,255,50,0.7)");
                text.setAttribute("stroke", "rgba(50,255,50,0.7)");
            }
            $(path).addClass("sibling");
            path.setAttribute("marker-end", "url(#sibling-arrow)");
        }else if ( rel == "parent" ){
        	d = computeParentLine(source, target, scale);
            $(path).addClass("parent");
            path.setAttribute("marker-end", "url(#parent-arrow)");
        }
        //var path = $('<path/>');
      
        path.setAttribute("d", d);
        path.setAttribute("source", source);
        path.setAttribute("target", target);
        //path.setAttribute("marker-end", "url(#arrow01)");
        path.setAttribute("stroke-width",2);
        
        path.setAttribute("fill", "none");
        
        //path.setAttribute("stroke-dasharray", "20,10,5,5,5,10");

        view.append(path);

        //console.log(view)
        if ( typeof(str) != 'undefined'){
            
            $(text).addClass("line-text");
            var b = path.getBBox();
            text.setAttribute("transform", "translate(" + (b.x + b.width/2) + " " + ((b.y + b.height/2)-20/scale) + ")");
            text.textContent = str;
            text.setAttribute("source", source);
            text.setAttribute("target", target);
            text.setAttribute("fill", "#888");
            text.setAttribute("font-size", "14");
            view.append(text);
        }


        return path;
    }




    var lineUpdate = function ( e ){
        var source = e.attr("source");
        var target = e.attr("target");
        var text = $("text[source='"+source+"'][target='"+target+"']")[0];
        if (( getNode(source) != 'undefined' )&&( getNode(target) != 'undefined' )){
            clearSiblingLine();
            var scale = parseFloat(e.parent().parent().attr("currentScale"))
            var d;
            var rel = getRelationship ( source, target);
            if ( rel == "sibling" ){
                d = computeLine(source, target, scale);
            }else if ( rel == "parent" ){
                d = computeParentLine(source, target, scale);
            }
            console.log(d)
            console.log(e[0])
            e[0].setAttribute("d", d);
            
            var b = e[0].getBBox();
            if ( typeof(text) != 'undefined' ){
                text.setAttribute("transform", "translate(" + (b.x + b.width/2) + " " + (b.y + b.height/2) + ")");
            }
            
        }else{
            e.remove();
            text.remove()
        }

        
    }

    var getRelationship = function ( source, target ){
        var s_id = parseInt(source);
        var t_id = parseInt(target);
        var s_node = getOriDataById(s_id);
        var t_node = getOriDataById(t_id);

        var rel = "sibling"
        console.log(t_node)


        if ( s_node.parent.indexOf(t_node.id) != -1 ){
            rel = "parent"
        }

    	

    	return rel;
    }

    var unActiveRects = function(){
        space.find("svg > .view > g.rect").removeClass("active");
    }

    var clearSiblingLine = function(){
        space.find("svg > .view").children(".line.sibling").remove();
        space.find("svg > .view").children(".line-text").remove();
    }

    var getOriDataById = function(id){

        for ( var ind = 0 ; ind < oriData.length ; ind++ ){
            if ( oriData[ind].id == id ){
                return oriData[ind]
            }
        }
    }

    var svgDraggable = function (e){
        $(e).draggable().bind('mousedown', function(event, ui){
            // bring target to front
            //(event.target.parentElement).append( event.target );
        }).bind('drag', function(event, ui){
            var e = $(this)
            var scale = parseFloat(e.parent().parent().attr("currentScale"));
            var position = {
                x : parseInt((parseInt(ui.position.left) - parseInt(space.children("svg").offset().left))/scale) - parseInt(e.parent().attr("tx")),
                y : parseInt((parseInt(ui.position.top) - parseInt(space.children("svg").offset().top))/scale) - parseInt(e.parent().attr("ty"))
            }

            e.attr("tx", position.x );
            e.attr("ty", position.y );
            e.attr("transform","translate("+ position.x +","+position.y +")" );

            var lines = $(".line");
            lines.each(function(ind){
                var l = lines.eq(ind);
                if ( (parseInt(l.attr("source")) == e.attr("id")) || (parseInt(l.attr("target")) == e.attr("id")) ){
                    lineUpdate(l);
                }
            })
        });
    }

    var updateView = function (e){
        var tx = e.children("g.view").attr("tx");
        var ty = e.children("g.view").attr("ty");
        var scale = e.attr("currentScale");
        //console.log(e)
        e.children(".view").attr("transform", "scale("+scale+") "+ 
            "translate("+tx+","+ty+")") ;

    }

    var backgroundDrag = function ( en ){
        en.bind("mousedown", function(event, ui){
            var e = $(this);
            e.attr("pageX", event.pageX);
            e.attr("pageY", event.pageY);
            e.attr("mousedown","true");
        })

        en.bind("mousemove", function(event, ui){
            var e = $(this);
            var scale = parseFloat(e.parent().attr("currentscale"));
            if ( e.attr("mousedown") == "true" ){
                e.attr("drag", true);
                var s = e.siblings("g.view");
                var offset = {
                    x : (event.pageX - parseInt( e.attr("pageX")))/scale,
                    y : (event.pageY - parseInt( e.attr("pageY")))/scale
                }

                s.each(function(ind){
                    var sib = s.eq(ind);
                    var position = {
                        x : parseInt(sib.attr("tx")) || 0,
                        y : parseInt(sib.attr("ty")) || 0
                    }
                    sib.attr("tx", position.x + offset.x);
                    sib.attr("ty", position.y + offset.y);
                    updateView( e.parent() );
                })
                // updata
                e.attr("pageX", event.pageX);
                e.attr("pageY", event.pageY);                    
            }
        })


        en.bind("mouseup", function(event, ui){
            en.attr("mousedown","false");
            if (en.attr("drag") == "true"){
                en.attr("drag", false);                
            }else{
                unActiveRects();
                clearSiblingLine();
                space.find("svg > .view > .rect").removeClass("opacity")
            }
        })

        en.bind("mouseleave", function(event, ui){
            en.attr("mousedown","false");
            if (en.attr("drag") == "true"){
                en.attr("drag", false);                
            }
        })
    }
    this.reset = function(){
        ctrl.clear();
    }

    this.clear = function(){
        space.find("svg > .view").children(".rect").remove();
        space.find("svg > .view").children(".line").remove();
    }

    this.draw = function(data){
        oriData = data;
        ctrl.clear();
        console.log(data)

        buildTree( data)
    }
    initial();
}