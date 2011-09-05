Raphael.el.vectorcrumbs = function(options){
  //This process was greatly helped by these StackOverflow posts:
  //http://stackoverflow.com/questions/4224359/making-paths-and-images-dragable-in-raphael-js
  //http://stackoverflow.com/questions/3675519/raphaeljs-drag-n-drop
  var that, startmovement, moving, stopmovement, dragArray, vcrumbs, raphObj;
  raphObj = this;
  paper = this.paper;

  startmovent = function() {
    var inner_that = this;
    /*var fill_color = (defObj.hasBall) ? defObj.colorWithBallCircleAlt : defObj.colorWithoutBallCircleAlt;*/
    /*var strok_color = (defObj.hasBall) ? defObj.colorWithBallStrokeAlt : defObj.colorWithoutBallStrokeAlt;*/
    /*this.attr({*/
    /*fill: fill_color,*/
    /*stoke: strok_color*/
    /*});*/

    console.log(raphObj);

    raphObj.items.forEach(function(itm,idx,arr){
      itm.ox = ( inner_that.type === "circle" ) ? inner_that.attr('cx') : inner_that.attr('x');
      itm.oy = ( inner_that.type === "circle" ) ? inner_that.attr('cy') : inner_that.attr('y');
    });

    switch(this.type){
      case "circle":
        console.log("Grabbed the CIRCLE, the companion is TEXT");
      break;
      case "text":
        console.log("Grabbed the TEXT, the companion is CIRCLE");
      break;
    }
    
    dragArray = [{x:this.ox, y:this.oy}];
    vcrumbs = paper.set(); 
    console.log(dragArray.length);
    return null;
  };

  moving = function(dx, dy) {
    //Here we grab the delta between our drag actions
    var svgpath, inner_that;
    inner_that = this;
    console.log("WE'RE IN THE MOVE FUNCTION NOW");
    
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

    console.log("DX: " + dx);
    console.log("DY: " + dy);

    if(this.type === "circle"){
      dragArray.push({x:this.attr('cx'), y:this.attr('cy')});
    }
    else{
      dragArray.push({x:this.attr('x'), y:this.attr('y')});
    }

    svgpath = "M".concat(
      dragArray[dragArray.length-2].x, 
      " ",
      dragArray[dragArray.length-2].y, 
      " L ",
      dragArray[dragArray.length-1].x, 
      " ",
      dragArray[dragArray.length-1].y 
    ); 

    vcrumbs.push( paper.path(svgpath).attr({stroke:"#F00", "stroke-linecap":"butt", "stroke-width": 3}) );
    vcrumbs.toBack();
    console.log(dragArray.length);
    return null;
  };

  stopmovement = function() {
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

    console.log("DONE!");
    return null;
  };

  //Finall, we apply the functions that we just defined 
  //as params in the drag function
  raphObj.drag(moving, startmovent, stopmovement);
  return this;
};
