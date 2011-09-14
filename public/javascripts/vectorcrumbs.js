/** 
 * VectorCrumbs plugin 0.9.1
 * Copyright (c) 2011 Abel Martin
 *
 * licensed under the MIT license 
**/

(function(){

  function VectorCrumbs(passedRaphObj, passedOptions) {
    //This process was greatly helped by these StackOverflow posts:
    //http://stackoverflow.com/questions/4224359/making-paths-and-images-dragable-in-raphael-js
    //http://stackoverflow.com/questions/3675519/raphaeljs-drag-n-drop
    var that, logEvent, benchEvent, debug_mode,
        dragArray, vcrumbs, addToDragArray,
        startMovement, duringMovement, stopMovement, 
        helperStart, helper_move, 
        raphObj, paper, vc_attrs, leave_crumbs;

    debug_mode = false;

    //Initialize some of the vars
    leave_crumbs = true;
    raphObj = passedRaphObj;
    vc_attrs = {stroke:"#F00", "stroke-linecap": "butt", "stroke-width": 3};
    paper = (raphObj.type === "set") ? raphObj[0].paper : raphObj.paper;

    //The passed in overrides, in any
    if(passedOptions){
      vc_attrs.stroke = passedOptions.stroke || vc_attrs.stroke;
      vc_attrs["stroke-linecap"] = passedOptions["stroke-linecap"] || vc_attrs["stroke-linecap"];
      vc_attrs["stroke-width"] = passedOptions["stroke-width"] || vc_attrs["stroke-width"];

      //If the dev wants to see some debug data, let 'em have it.
      leave_crumbs = passedOptions.leave_crumbs || true;

      //This will either be a boolean OR undefined which will be false anyway.
      debug_mode = passedOptions.debug_mode; 
    }

    logEvent = function(ev){
      if( !debug_mode || typeof console === 'undefined'){ return;}

      switch(typeof ev){
        case "string":
          console.log( (new Date()).toTimeString() + ": " + ev);
        break;
        default:
          console.log(ev);
        break;
      }
    };

    benchEvent = function(ev, opp){
      if( !debug_mode || typeof console.time === 'undefined' ){ return; }
      //This will give us a rough estimate of how long things take
      //IE8 & IE7 have console, but they don't have console.time functions

      //The 'opp' let's us know which time action to take
      switch(opp){
        case '+':
          logEvent("Benchmark Started");
          console.time(ev);
        break;
        case '-':
          console.timeEnd(ev);
          logEvent("Benchmark Ended");
        break;
        default:
          var msg = "The event you tried to log '";
          msg += ev;
          msg += "' with opperation '";
          msg += opp + "' failed";
          logEvent(msg);
        break;
      }
    };

    if(debug_mode){logEvent("DEBUGGING ENABLED");}

    helperStart = function(adjObj, coreObj){
      adjObj.ox = ( coreObj.type === "circle" ) ? coreObj.attr('cx') : coreObj.attr('x');
      adjObj.oy = ( coreObj.type === "circle" ) ? coreObj.attr('cy') : coreObj.attr('y');
    };

    addToDragArray = function(dragObj, initialize){
      var mod;
      //AEM we'll use this to center the drag line in the middle of rectangles
      if(dragObj.type === "rect"){
        mod = {x:(dragObj.attrs.width/2),y:(dragObj.attrs.height/2)};
      }
      else{
        mod = {x:0,y:0};
      }


      if( initialize ){
        dragArray = [{x:dragObj.ox + mod.x, y:dragObj.oy + mod.y}];
      }
      else if(dragObj.type === "circle"){
        dragArray.push({x:dragObj.attr('cx'), y:dragObj.attr('cy')});
      }
      else{
        dragArray.push({x:dragObj.attr('x') + mod.x, y:dragObj.attr('y') + mod.y});
      }
    };

    startMovement = function(){
      var inner_that = this;
      benchEvent("drag_event_span", '+');
      /*var fill_color = (defObj.hasBall) ? defObj.colorWithBallCircleAlt : defObj.colorWithoutBallCircleAlt;*/
      /*var strok_color = (defObj.hasBall) ? defObj.colorWithBallStrokeAlt : defObj.colorWithoutBallStrokeAlt;*/
      /*this.attr({*/
      /*fill: fill_color,*/
      /*stoke: strok_color*/
      /*});*/

      logEvent(raphObj);

      if(raphObj.type === "set"){
        raphObj.items.forEach(function(itm,idx,arr){
          helperStart(itm, inner_that);
        });
      }
      else{
        helperStart(this, this);
      }

      switch(this.type){
        case "circle":
          logEvent("Grabbed the CIRCLE, the companion is TEXT");
        break;
        case "text":
          logEvent("Grabbed the TEXT, the companion is CIRCLE");
        break;
      }
      
      addToDragArray(this, true);
      vcrumbs = paper.set(); 
      logEvent(dragArray.length);
      return null;
    };

    helper_move = function(adjObj, coreObj, dx, dy){
      switch(adjObj.type){
        case "circle":
          adjObj.attr({
            cx: coreObj.ox + dx,
            cy: coreObj.oy + dy
          });
        break;
        default:
          adjObj.attr({
            x: coreObj.ox + dx,
            y: coreObj.oy + dy
          });
        break;
      }
    };

    duringMovement = function(dx, dy){
      //Here we grab the delta between our drag actions
      var svgpath, inner_that;
      inner_that = this;
      logEvent("WE'RE IN THE MOVE FUNCTION NOW");
      
      if(raphObj.type === "set"){
        raphObj.items.forEach(function(itm,idx,arr){
          helper_move(itm, inner_that, dx, dy);
        });
      }
      else{
        helper_move(this, this, dx, dy);
      }

      addToDragArray(this);
      logEvent("DX: " + dx);
      logEvent("DY: " + dy);

      if(leave_crumbs){
        svgpath = "M".concat(
          dragArray[dragArray.length-2].x, 
          " ",
          dragArray[dragArray.length-2].y, 
          " L ",
          dragArray[dragArray.length-1].x, 
          " ",
          dragArray[dragArray.length-1].y 
        ); 

        vcrumbs.push( paper.path(svgpath).attr( vc_attrs ) );
        vcrumbs.toBack();
      }
      logEvent("There are now ".concat(dragArray.length, " segments in the crumb wake"));
      return null;
    };

    stopMovement = function(){
      //Return the colors to their rightful states
      var inner_that = this;
      /*var fill_color = (defObj.hasBall) ? defObj.colorWithBallCircle : defObj.colorWithoutBallCircle;*/
      /*var strok_color = (defObj.hasBall) ? defObj.colorWithBallStroke : defObj.colorWithoutBallStroke;*/

      /*raphObj.items.forEach(function(itm,idx,arr){*/
      /*itm.attr({*/
      /*fill: fill_color,*/
      /*stoke: strok_color*/
      /*});*/
      /*});*/

      benchEvent("drag_event_span", '-');
      return null;
    };

    //Finall, we apply the functions that we just defined 
    //as params in the drag function
    raphObj.drag(duringMovement, startMovement, stopMovement);
    return this;
  };

  // We need to ensure sets AND elements have access to VC
  Raphael.el.vectorCrumbs = function(options){
    return new VectorCrumbs(this, options);
  };

  Raphael.st.vectorCrumbs = function(options){
    return new VectorCrumbs(this, options);
  };
}());
