$.fn.popImg = function() {

  var icon_delete = new Image();
  icon_delete.src = "../images/delete_cancel.png";

  var icon_upload = new Image();
  icon_upload.src = "../images/cloud_upload.png";

  var icon_camera = new Image();
  icon_camera.src = "../images/snapshot_camera.png";

  var $layer = $("<div/>").css({
    position: "fixed",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: "100%",
    width: "100%",
    zIndex: 9998,
    background: "#000",
    opacity: "0.6",
    display: "none"
  }).attr("data-id", "b_layer");

  var cloneImg = function($node) {
    var left = $node.offset().left;
    var top = $node.offset().top;
    var nodeW = $node.width();
    var nodeH = $node.height();
    return $node.clone().css({
      position: "fixed",
      width: nodeW,
      height: nodeH,
      left: left,
      top: top,
      zIndex: 9999
    });
  };
  var closeImg = function() {
    $layer.fadeOut(300);
    $("img[data-b-img]").remove();
    $("#popImg_Edit").remove();
    if ( windowFocus.indexOf('popImg') +1 )
      windowFocus.splice(windowFocus.indexOf('popImg'));
  }
  var timer_Edit = null;
  var justifyImg = function($c) {
    var dW = $(window).width();
    var dH = $(window).height();
    $c.css("cursor", "zoom-out").attr("data-b-img", 1);
    var img = new Image();
    img.onload = function(){
      var W = dW/this.width,
          H = dH/this.height,
          p = ( W < H ) ? W : H,
          p = ( p > 1 ) ? 1 : p,
          W = this.width  * p,
          H = this.height * p;

      $c.stop().animate({
         width: W,
        height: H,
          left: (dW - W) / 2,
           top: (dH - H) / 2
      }, 300, "", function() {
           $("#popImg_Edit").css({
             left: (($c.position().left - 85)>0) ? $c.position().left - 85 : 0,
              top: (($c.position().top  - 30)>0) ? $c.position().top  - 30 : 0
           }).fadeIn(400);
      });
    };
    img.src = $c.attr("src");

  };

  this.each(function(){
    $(this).css("cursor", "zoom-in").on("click", function(){
      var $body = $("body"),
         $image = cloneImg($(this)),
          input = $image.data("file");

         $div = $('<div id="popImg_Edit" />').css({
           position: "absolute",
           left: 0,
           top: 0,
           zIndex: 9999,
           display: "none"
         });

         if ($(input).length && !($(input).is(":disabled"))) {
           $div.on("click",function(){
               closeImg();
           });
           var icon = icon_delete;
           icon.height = 24;
           icon.width  = 24;
           $('<a />', {
             onclick:'$("'+input+'_delete").val("TRUE").trigger("change")',
             title:'Elimina la Imagen'
           }).css({
             opacity: "0.8",
           }).html(icon).appendTo($div);

           $('<span />').html("&nbsp;").appendTo($div);

           var icon = icon_upload;
           icon.height = 24;
           icon.width  = 24;
           $('<a />', {
             onclick:'$("'+input+'").click();',
             title:'Selecciona la imagen del Disco Duro'
           }).css({
             opacity: "0.8",
           }).html(icon).appendTo($div);

           $('<span />').html("&nbsp;").appendTo($div);

           var icon = icon_camera;
           icon.height = 24;
           icon.width  = 24;
           $('<a />', {
             onclick: 'photoCamera("'+ $image.attr("id") +'","'+ input +'");',
             title:'Selecciona la imagen de la camara web'
           }).css({
             opacity: "0.8",
           }).html(icon).appendTo($div);
         }
           
      $layer.appendTo($body);
      $image.appendTo($body);
        $div.appendTo($body);

      $layer.fadeIn(300);
      justifyImg($image);
      windowFocus.push("popImg");
      return false;
    });
  });

  var timer = null;
  $(window).on("resize", function(){
    $("img[data-b-img]").each(function(){
      var $this = $(this);
      timer && clearTimeout(timer);
      timer = setTimeout(function(){
        justifyImg($this);
      }, 10);
    });
  });

  $(window).on("click keydown", function(evt){
    var $this = $(evt.target);
    if ( (evt.type == "keydown" && evt.keyCode === 27) 
      || ($this.attr("data-id") == "b_layer" 
      || $this.attr("data-b-img") == 1) ) {
      closeImg();
    }
  });
};
