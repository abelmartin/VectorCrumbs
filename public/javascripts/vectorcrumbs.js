(function(){
  var debug_mode = false;

  function logEvent(ev){
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

  function benchEvent(ev, opp){
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


  function vectorCrumbs(passedRaphObj, passedOptions) {
    //This process was greatly helped by these StackOverflow posts:
    //http://stackoverflow.com/questions/4224359/making-paths-and-images-dragable-in-raphael-js
    //http://stackoverflow.com/questions/3675519/raphaeljs-drag-n-drop
    var that, startmovement, moving, 
        stopmovement, dragArray, vcrumbs, 
        raphObj, paper, vc_attrs, leave_crumbs;

    //Initialize some of the vars
    leave_crumbs = true;
    raphObj = passedRaphObj;
    vc_attrs = {stroke:"#F00", "stroke-linecap": "butt", "stroke-width": 3};
    paper = (raphObj.type === "set") ? raphObj[0].paper : raphObj.paper;

    if(passedOptions){
      vc_attrs.stroke = passedOptions.stroke || vc_attrs.stroke;
      vc_attrs["stroke-linecap"] = passedOptions["stroke-linecap"] || vc_attrs["stroke-linecap"];
      vc_attrs["stroke-width"] = passedOptions["stroke-width"] || vc_attrs["stroke-width"];

      //If the dev wants to see some debug data, let 'em have it.
      leave_crumbs = passedOptions.leave_crumbs || true;

      //This will either be a boolean OR undefined which will be false anyway.
      debug_mode = passedOptions.debug_mode; 
    }

    if(debug_mode){logEvent("DEBUGGING ENABLED");}

    startmovent = function(){
      var inner_that = this;
      benchEvent("drag_event_span", '+');
      /*var fill_color = (defObj.hasBall) ? defObj.colorWithBallCircleAlt : defObj.colorWithoutBallCircleAlt;*/
      /*var strok_color = (defObj.hasBall) ? defObj.colorWithBallStrokeAlt : defObj.colorWithoutBallStrokeAlt;*/
      /*this.attr({*/
      /*fill: fill_color,*/
      /*stoke: strok_color*/
      /*});*/

      logEvent(raphObj);

      raphObj.items.forEach(function(itm,idx,arr){
        itm.ox = ( inner_that.type === "circle" ) ? inner_that.attr('cx') : inner_that.attr('x');
        itm.oy = ( inner_that.type === "circle" ) ? inner_that.attr('cy') : inner_that.attr('y');
      });

      switch(this.type){
        case "circle":
          logEvent("Grabbed the CIRCLE, the companion is TEXT");
        break;
        case "text":
          logEvent("Grabbed the TEXT, the companion is CIRCLE");
        break;
      }
      
      dragArray = [{x:this.ox, y:this.oy}];
      vcrumbs = paper.set(); 
      logEvent(dragArray.length);
      return null;
    };

    moving = function(dx, dy){
      //Here we grab the delta between our drag actions
      var svgpath, inner_that;
      inner_that = this;
      logEvent("WE'RE IN THE MOVE FUNCTION NOW");
      
      raphObj.items.forEach(function(itm,idx,arr){
        switch(itm.type){
          case "circle":
            itm.attr({
              cx: inner_that.ox + dx,
              cy: inner_that.oy + dy
            });
          break;
          case "text":
            itm.attr({
              x: inner_that.ox + dx,
              y: inner_that.oy + dy
            });
          break;
        }
      });

      logEvent("DX: " + dx);
      logEvent("DY: " + dy);

      if(this.type === "circle"){
        dragArray.push({x:this.attr('cx'), y:this.attr('cy')});
      }
      else{
        dragArray.push({x:this.attr('x'), y:this.attr('y')});
      }

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

    stopmovement = function(){
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
    raphObj.drag(moving, startmovent, stopmovement);
    return this;
  };

  // We need to ensure sets AND elements have access to VC
  Raphael.el.vectorCrumbs = function(options){
    return vectorCrumbs(this, options);
  };

  Raphael.st.vectorCrumbs = function(options){
    return vectorCrumbs(this, options);
  };
}());
