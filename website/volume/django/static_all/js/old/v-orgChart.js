var v_orgchart_global = new Object({
    click_delay : 200,
    timer : new Object()
})

function vOrgChart (con, main) {
    var oriData;
    var main = main;
	var ctrl = this;
	var space = con;
    var nodes;
    var param = {
        sp_x :100,
        sp_y : 50,
        rect_x : 200,
        rect_y : 80,
        margin_X : 120

    }
    

	var svgEl = function (tagName) {
        return document.createElementNS("http://www.w3.org/2000/svg", tagName);
    }


    var nodeEvent = function(e){

        var clickEvt = function(){
            var entry = $(this);
            var time = parseInt( new Date().getTime() );
            var pre_t = parseInt( entry.attr("lastClick") );
            if ( time - pre_t < v_orgchart_global.click_delay ){
                entry.attr("lastClick", time);
                if ( typeof( v_orgchart_global.timer["nodeClick"]) != 'undefined' ){
                    clearTimeout(v_orgchart_global.timer["nodeClick"]);    //prevent single-click action
                }
                //doubleClick(entry);

            }else{
                entry.attr("lastClick", time);
                v_orgchart_global.timer["nodeClick"] = setTimeout(function() {
                    //console.log(entry.attr("class"))
                    singleClick(entry);

                }, v_orgchart_global.click_delay );                
            }
            //console.log(entry.attr("id"))
        }

        e.unbind("click", clickEvt);
        //e.unbind("dblclick");

        e.bind("click", clickEvt);
    }

    var singleClick = function(entry){
        var id = parseInt(entry.attr("id"));
        console.log(id)
        console.log(main)
        unActiveRects();
        if ( !entry.hasClass("active")){
            entry.addClass("active");
            main.showRecord( id );
        }else{
            unActiveRects();
            main.hideRecord();
        }
    }



   
    var renderNode = function( node , d, level){
        var child = node.children;
       
        var point = computeRectPosition( d, level);
        var rect = rectGen(node, point.x, point.y);
        $(rect).attr("tx", point.x);
        $(rect).attr("ty", point.y);
        $(rect).attr("sh", level);

        space.find("svg > .view").append(rect);

        return $(rect);
    }

    var computeRectPosition = function( d, level){
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
        

        $(rect).attr("onselectstart","return false");
        $(rect).html('<path class="box" d="M0 0 L'+param.rect_x+' 0 L'+param.rect_x+' '+param.rect_y+' L0 '+param.rect_y+' Z"></path><text x="'+param.rect_x/2+'" y="'+param.rect_y*3/4+'" font-size="20" text-anchor="middle" fill="white" >'+data.name+'</text>');
        rect.setAttribute("transform", "translate(" + x + ", " + y + ")");
        rect.setAttribute("lastClick", 0);
        
        return rect;

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

    var computeParentLine = function ( source, target, scale ){
        var s = $("g.rect.group[id='"+source+"']");
        var t = $("g.rect.parent[id='"+target+"']");

        var d = "";
        if (( s.length > 0 ) && (t.length>0)){
            var sb = s[0].getBoundingClientRect();
            var tb = t[0].getBoundingClientRect();
            var sx = getTranform(s).translate.split(",");
            var tx = getTranform(t).translate.split(",");
            
           
            d += "M"+parseInt(parseInt(sx[0])) + " " + parseInt(parseInt(sx[1]) + parseInt(sb.height/scale/2)) + " ";
            d += "L"+parseInt(parseInt(sx[0])-50) + " " + parseInt(parseInt(sx[1]) + parseInt(sb.height/scale/2)) + " ";
            d += "L"+parseInt(parseInt(tx[0])+(tb.width/scale)) + " " + parseInt(parseInt(tx[1])+(tb.height/scale/2))
        }
        
        return d;
    }

    var addLink = function (source, target, view, str){
        var scale = parseFloat( view.parent().attr("currentScale") );
        var text = svgEl("text");
        var d;
        var path = svgEl("path");
        path.setAttribute("class", "line");
        path.setAttribute("stroke","black");
    
    	d = computeParentLine(source, target, scale);
        $(path).addClass("parent");
        path.setAttribute("marker-end", "url(#parent-arrow)");
      
      
        path.setAttribute("d", d);
        path.setAttribute("source", source);
        path.setAttribute("target", target);
        //path.setAttribute("marker-end", "url(#arrow01)");
        path.setAttribute("stroke-width",2);
        
        path.setAttribute("fill", "none");
        

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




    var unActiveRects = function(){
        space.find("svg > .view > g.rect").removeClass("active");
        main.hideRecord();
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
                //clearSiblingLine();
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

    var drawClass = function ( c ){
        var h = 0 ;
        for ( var ind = 0 ; ind < c.length ;ind++ ){
            var e = c[ind];
            var d = 1;
            if ( e.children.length > d ){
                d = e.children.length;
            }
            e.d = d;
            var node = renderNode( e , 0, parseInt(e.d/2)+h )
            node.addClass("parent");
            drawChild( e.children, h, e.id)
            h += e.d;
        }
    }

    var drawChild = function ( set, d, p_id ){
        for ( var ind = 0 ; ind < set.length ;ind++ ){
            var e = set[ind];            
            var node = renderNode( e , 1, d+ind );
            node.addClass("group");
            addLink( e.id, p_id, space.find("svg > .view"))
            nodeEvent(node);
        }
    }
    var drawNc = function( set ){
        for ( var ind = 0 ; ind < set.length ;ind++ ){
            var h = 0;
            var e = set[ind];            
            var node = renderNode( e , 2, h );
            node.addClass("group");
            nodeEvent(node);
            h++;
        }
    }

    this.draw = function(data){
        ctrl.reset();
        drawClass(data.classes)
        drawNc(data.nc)
    }
    initial();
}