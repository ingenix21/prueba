  /**
 * utils_jqu.js 1.0 1999/07/17
 * by (por): Carlos E. Mendoza S., Julio 2002
 * Copyright (c) 2003-&up INGENIX Consulting-VE.  All rights reserved.
 *
 * INGENIX 21 grants you a royalty free license to use or modify this
 * software provided that this copyright notice appears on all copies.
 * This software is provided 'AS IS,' without a warranty of any kind.
 *
 * INGENIX 21 le otorga una licencia gratuita para usar y/o modificar
 * este software mientras mantenga este COPYRIGHT en todas las copias.
 * Este software es entregado 'COMO ESTA' sin ningun tipo de garantia.
 */

var app_UI  = 'JQU',
 tabsActive =  0;



function onLoad_CONTINUE() {

  try { $( '*[class^=onLD]' ).on({
      focus: function(){ JS(this,'focus','onLD'); },
      blur:  function(){ blurElement=this; setTimeout('JS(\'\',\'focus\',\'onLD\')',100); }
  }); } catch (err) {};

  try {
    var body = document.body;
    body.style.overflow = '';
    if ( body.style.visibility != '' ) {
      // body.style.display='none';
      body.style.visibility='';
      // $(body).fadeIn();
    }
  } catch(err){};

  try { $('#menu').menu({
    select: function( event, ui) {
      eval( ui.item[0].dataset.event );
    }
  }); } catch (err) {};

  try { $('.accordion').accordion({
    collapsible: false,
    heightStyle: 'content'
  }); } catch (err) {};

  try { $('.tabs-resizer').resizable({
    minHeight: 140,
    minWidth: 200,
    resize: function() {
      $('#tabs').tabs('refresh');
    }
  }); } catch (err) {};

  tabs_resizer();

  FixHeader('.FixHeader');


  $( document ).bind( 'click' ,function(e) {
      e_pageX=e.pageX;
      e_pageY=e.pageY;
    });//.tooltip();

  onLoad_JQU();

  lockScreen('unlock');

  load_images();

  onLoadPage = false;
}

function onLoad_JQU() {
  CheckLeaseTime_OK();

  back_CurrentPage = CurrentPage;
  CurrentPage = $('body'); //.pagecontainer('getActivePage');

  var backgound = localStorage.getItem('tile-area-scheme-'+sii_cia_code) || 'tile-area-scheme-dark';
  if ( ! CurrentPage.find('div.HidenOnPrint').length )
    CurrentPage.addClass(backgound);

//  $('div.headHidenOnPrint').addClass(backgound);

  wd = CurrentPage.find('form[name^=myForm]')[0] ||
       CurrentPage.find('form')[0] ||
       CurrentPage[0];

  myForm          = wd;

  if ( (back_CurrentPage[0].id+CurrentPage[0].id+'').indexOf('-dialog') == -1 ) {
    saveItemFocus   = 0;
  }
  NameItemFocus   = '',

  DBF_null_key    = null,
  DBF_query_key   ='key',
  DBF_connect_key = null,
  DBF_insert_key  = true,
  DBF_name_key    ='Documento',
  DBF_action      = myForm.action || document.location.href.split('%20')[0] +'%20'+ document.location.href.split('%20')[1];

  if ( typeof My_onLoad == 'function' )
    My_onLoad();

  if ( !DBF_connect_key && wd ) {
    if ( wd.codigo ) {
      DBF_connect_key=wd.codigo;
    } else if ( wd.elements ) {
      DBF_connect_key=wd.elements[0];
    }
  }
  if ( DBF_connect_key && !DBF_connect_key.initValue )
    DBF_connect_key.initValue = DBF_connect_key.value;

  if ( ! NameItemFocus )
    try {
      INPUT = inputList();
      NameItemFocus = INPUT[saveItemFocus].name;
    } catch (err) {
      try {
        NameItemFocus = INPUT[0].name;
      } catch (err) {
      }
    }

  if (NameItemFocus)
    InitInput(NameItemFocus);

  serializeForm();

  try {  $('.image').popImg(); } catch (err) {};

  setTimeout(function() { UpdateForm = true; }, 500);

  input_list();
}

function tabs_resizer() {
 var Inner_W = window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth,
     Inner_H = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
     $tabs   = $('#tabs-content'),
     width   = $tabs.width(),
     height  = $tabs.height();

// alert($('#Lineas').width ()+' '+width+' '+Inner_W+' '+$('#Lineas').height()+' '+height+' '+Inner_H)

 width  = width  + (Inner_W -1024);
 height = height + (Inner_H - 744);

// if (width >$('#Lineas').width ()) width  = $('#Lineas').width ();
// if (height>$('#Lineas').height()) height = $('#Lineas').height();

// if (width>Inner_W-20) width = Inner_W-20;
// if (Inner_H<696) height = height + (Inner_H-696);

 $tabs.width(width);
 $tabs.height(height);

 try {
  $('#tabs').tabs({
   active: tabsActive,
   heightStyle: 'fill'
  });
 } catch(err){};
}

function input_search(code, event) {
  var title = "Busqueda en la Base de Datos",
        key = ' ',
 frame_name = 'searchInput'.toUpperCase();

  if(event.key.length<2)
    key = event.key;

  else if(!event.currentTarget.getAttribute('data-KEYS_'+event.key))
    return;

  if (jQframeObj[ frame_name ]) {
    jQframeObj[ frame_name ].dialog('open');
  } else {
    WIDTH  = 500,
    HEIGHT = 50,
    jQframeObj[ frame_name ] = $(
      '<div id=\"'+ frame_name +'\" title=\"'+ title +'\" style=\"border: 0px; width:'+ WIDTH +'px; height:'+ HEIGHT +'px; overflow: hidden;\">'+
       "Dato a Buscar:"+ '<br>'+
       '<input name=\"searchInput\" onchange=\"eval('+code+');KEYS_27(event)\" style=\"width:100%\">'+
      '</div>'
    ).dialog({
      modal: true,
      width: WIDTH-1, //'auto',
      height: HEIGHT+55, //'auto',
      show: { effect: 'fade', duration: 400 },
    });
  }
  z = document.getElementsByName('searchInput')[0],
  z.focus();
  if (key!=' ') { z.value=key; } else { z.select(); }
  windowFocus.push(frame_name);
  return false;
}

function jQuery_confirm(title, message, buttons, icon, dialog_name, dismissible, f_CLOSE) {
       title = title       || "Alerta!";
 dialog_name = dialog_name || 'jQuery_confirm_Frame' + new Date().getTime();
     buttons = buttons     || [{ text: "Continua", click: function() { jQframeObj[ dialog_name ].dialog('close')}}];
        icon = icon        || 'delete';
 dismissible = dismissible || true;
     f_CLOSE = f_CLOSE     || '';

  if (buttons == 'none')
    buttons = '';

  if ( dismissible == true ) {
    data_icon ='data-icon=\"'+icon+'\"', data_ancor='';
  } else {
    data_icon ='data-icon=\"false\"'   , data_ancor='_not';
  }

  html  ='<div id=\"'+dialog_name+'\" title=\"' + title +'\">'
  html += message + '<br></div>'
























  jQframeObj[dialog_name] = $(html).dialog({
    close: function(e) {
      if ( f_CLOSE ) try { f_CLOSE(e); } catch (err) { console.error(err) };
/**
 Analizar esta rutina tanto  en JQM como en JQU ya que la funcion asociada al
 boton  debe  ejecutarse  solo cuando se pulsa el boton y no cuando se cierra
 la ventana con  ESC  si se requiere ejecutar en todo momento bien sea porque
 se pulse el boton o cuando se cierre el dialogo (en la X o con ESC) entonces
 dicha  funcion  debe  colocarse en la variable f_CLOSE la cual se ejecuta al
 cerrar la ventana

      if (buttons.length == 1 && buttons[0].click) {
        try {
          buttons[0].click();
        } catch(err){};
      };

Fin de la Revision **/

      e.stopPropagation();
      UpdateForm = true;
      windowFocus.splice(windowFocus.indexOf(frame_name));
//      KEYS = new Array();
      try { $( this ).dialog('destroy'); } catch (err) {};
    },
    resizable: false,
    modal: true,
    show: { effect: 'fade', duration: 400 },
    beforeClose: function () { return dismissible },
    buttons: buttons
  });






  UpdateForm = false;
  windowFocus.push(dialog_name);
  return jQframeObj[dialog_name];
}

function KEYS_115() {
  console.log(window.name);
  if ( window_parent.name && window_parent.name != window.name )
    return window_parent.KEYS_115();

  var  title = 'Ayuda de Escritorio',
       WIDTH = 210,
      HEIGHT = 200,
 dialog_name = 'SK_div';
//localStorage.setItem('SK','null');//eliminar
  SK = JSON.parse(localStorage.getItem('SK'))||{option:[
        {program:'^CALC' , width:400, height:200, title:"Calculadora"},
        {program:'^NOTE' , width:400, height:200, title:"Agenda Calendario"},
        {program:'^WP'   , width:400, height:200, title:"Editor de Texto"},
        {program:'^XCHAN', width:314, height:300, title:"Tasas de Cambio"},
        {program:'^XINTT', width:314, height:276, title:"Tasas de Interes"},
        {program:'^CIA'  , width:400, height:200, title:"Cambio de Compañía"},
        {program:'^LOGIN', width:400, height:200, title:"Cambio de Operador"},
        {program:'^ASCII', width:400, height:200, title:"Tabla ASCII"},
        {program:'^SCALL', width:400, height:200, title:"Comandos del Sistema"},
        {program:'^CONFI', width:400, height:200, title:"Configuracion"},
        {program:'^PROTP', width:400, height:200, title:"Protector de Pantalla"},
    ],
    selectedIndex:0
  };
  localStorage.setItem('SK', JSON.stringify(SK));
  html  ='<div id=\"'+ dialog_name +'\" title=\"'+ title +'\" style=\"border: 0px; width:'+ WIDTH +'px; height:'+ HEIGHT +'px; overflow: hidden;\"><center>';

  html +='<select id=\"SK\" size=11 class=\"MENU\">'
  for(var i=0;i<SK.option.length; i++){
    html +='<option onclick=\"SideKick(this)\">&nbsp;'+ SK.option[i].title +'&nbsp;</option>'
  }
  html +='</center></div>';

  html +='</div>';

  if ( document.getElementById('sii_CallPGM') ) {
//    width  = ( $(window).width() -20 > 810 ) ? 810 : $(window).width() -20,
//    height = ( $(window).height()-90 > 510 ) ? 510 : $(window).height()-90,
    jQframeObj[dialog_name] = $('<div>').window({
      size:{ 'width': WIDTH+'px', 'height': HEIGHT+'px'},
      icon:'<span class=\"mif-windows\"></span>',
      title:'<span>'+title+'</span>',
      content:html,
      captionStyle:{'background': 'bg-blue', 'color': 'fg-white'},
      buttons:{'btnClose': 'true'},
      onBtnCloseClick:'btnCloseClick',
      onBtnMaxClick:'',//btnCloseClick',
      onBtnMinClick:''//btnCloseClick'
    });
    $('#sii_CallPGM').html('');
    jQframeObj[dialog_name].appendTo('#sii_CallPGM');
    metroDialog.open('#sii_CallPGM');
      
  } else {
    jQframeObj[dialog_name] = $(html).dialog({
      close: function(e) {
        e.stopPropagation();
        windowFocus.splice(windowFocus.indexOf(dialog_name));
        try { $( this ).dialog('destroy'); } catch (err) {};
      },
      resizable: false,
      modal: true,
      width: WIDTH-24, //'auto',
      height: HEIGHT+39, //'auto',
      show: { effect: 'fade', duration: 400 },
    });
  }
  setTimeout(function() {
    var z = document.getElementById('SK');
    z.options[SK.selectedIndex].selected = true;
    z.focus();
    z.onchange = function(e) {
      SK.selectedIndex=e.target.selectedIndex;
      localStorage.setItem('SK', JSON.stringify(SK));
    };
    z.onkeydown= function(e) {
      var saveKeydown = ( document.all ) ? e.keyCode : e.which;
      if ( saveKeydown == 13 )
      SideKick(e.target[e.target.selectedIndex]);
    }
  }, 200);
  windowFocus.push(dialog_name);
  return jQframeObj[dialog_name];
}

function SideKick(e) {
  var option = SK.option[e.index],
   scrollbar = option.scrollbar||0,
   resizable = option.resizable||0,
   top = option.top||0,
   left = option.left||0,
   width = option.width||787,
   height = option.height||614;

  var x = windowFocus.length;
  try {jQframeObj[ windowFocus[ x-1 ] ].dialog( 'close' );
  } catch (err) {
    try { metroDialog.close(jQframeObj[ windowFocus[ x-1 ] ][0].closest('[data-role=dialog]'));
    } catch (err) {
    };
  };
  windowFocus.splice(windowFocus.indexOf(frame_name));
  CallPGM(option.program, option.target, 'scrollbar='+scrollbar+',resizable='+resizable+',top='+top+',left='+left+',width='+width+',height='+height, option.title, option.frame);
//  CallSQL(option.program, 'list', '', '', '', '', option.width, option.height, option.title, '', '')
}

function photoCamera(image, file) {
  CallSQL('/sinfonix/html/camera.htm', 'list', '', image, file, ' ^HTML.www ', 320, 240, 'WebCam',       function(){ jQframeObj[ this.id ].dialog('destroy'); jQframeObj[ this.id ]=''; });
}

function CallSQL(sql, cmd, argv_cmd, lfn, argv_lfn, xframe, WIDTH, HEIGHT, title,                    ONCLOSE, frame_name) {
  if (jQframeObj['checkCredentials'] && jQframeObj['checkCredentials'] != '' && sql != '^LOGIN.www') return

  Cookies('Write', 'appMode', sii_appMode);
  if ( cmd == 'json' ) { var ext = 'sql'; cmd = 'record';
  } else               { var ext = 'ngz' }

       lfn =      (lfn) ?      lfn.split('undefined').join('') : '';
  argv_lfn = (argv_lfn) ? argv_lfn.split('undefined').join('') : '';
  argv_cmd = (argv_cmd) ? argv_cmd.split('undefined').join('') : '';
  argv_cmd = (argv_cmd) ? cmd +'=\"'+ argv_cmd +'\"' : cmd;
      qstr = escape(sql.split(' ')[0] +' '+ argv_cmd +' '+ lfn +' '+ argv_lfn);

  frame_name = frame_name  || (sql + cmd + lfn).toUpperCase();
      xframe = xframe      || ' ';
       title = title       || '('+ sql + lfn +')';


     ONCLOSE = ONCLOSE     || '';







  if (cmd == 'list') {
    if (jQframeObj[ frame_name ]) {
      jQframeObj[ frame_name ].dialog('open');

    } else {
      WIDTH  = WIDTH  || 4096;//635;
      WIDTH  = ( $(window).width() -45 > WIDTH  ) ? WIDTH  : $(window).width()-45;

      HEIGHT = HEIGHT || 4096;//405;
      HEIGHT = ( $(window).height()-90 > HEIGHT ) ? HEIGHT : $(window).height()-90;

      html  ='<div id=\"'+ frame_name +'\" title=\"'+ title +'\" style=\"border: 0px; width:'+ WIDTH +'px; height:'+ HEIGHT +'px; overflow: hidden;\">';

      
      
      
      html +='<iframe name=\"'+ frame_name +'\" style=\"border: 0px; width:'+ WIDTH +'px; height:'+ HEIGHT +'px; overflow: hidden; position:relative; top: -5px; left:-14px;';
      html +='\" src=\"/cgi-bin/sinfonix_'+ ext +'.pl?'+ sii_system + xframe + qstr +'\"></div>'
      
      jQframeObj[ frame_name ] = $( html ).dialog({
        modal: true,
        width: WIDTH-1, //'auto',
        height: HEIGHT+39, //'auto',
        show: { effect: 'fade', duration: 400 },
        focus: function(event) {
          try {
            if ( ! window.frames[this.id].set_tableRow )
              return;

            top_window.document.title=window.frames[this.id].window_title;
            var x = window.frames[this.id].document.querySelector('.FixHeader table.PADDING tbody'), y = '';
            if (x) {
              if (x.tableRow && $(x.tableRow).visible(true)) {
                y = x.tableRow;
              } else
              if (x.tableRow_Light && $(x.tableRow_Light).visible(true)) {
                y = x.tableRow_Light;
              } else {
                var tr = x.children;
                for ( i = 0; i < tr.length; i++ ) {
                  if ( $(tr[i]).visible(true) ) {
                    y = tr[i+1];
                    break;
                  };
                };
              };
              if (y)
                window.frames[this.id].set_tableRow(y, event);
            };
          } catch(err){console.error(err)};
        },
        beforeClose: function(event) {
          event.stopPropagation();
          windowFocus.splice(windowFocus.indexOf(frame_name));
          if (typeof ONCLOSE == 'function')
            try { ONCLOSE(); } catch (err) { console.error(ONCLOSE,err) };
        }
      });
    }
    windowFocus.push(frame_name);

  } else {
    $.get('/cgi-bin/sinfonix_'+ ext +'.pl?'+ sii_system + xframe + qstr).always(function(data) {
      var html = document.createElement('html');
      html.innerHTML = data;
      var JS = html.querySelectorAll('script');
      if(JS) {
        Object.keys(JS).forEach(function (i) {
          if ( JS[i].innerHTML )
            eval(JS[i].innerHTML);
        });
      } else {
        alert(data);
      }
    });
  }
}

function load_images() {
     over = new Array();
      out = new Array();
    click = new Array();
  click_L = new Array();

  for (n=00; n<=16; n++) {
       over[n] = new Image();
        out[n] = new Image();
      click[n] = new Image();
    click_L[n] = new Image();
  }
   over[00].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABcSURBVCiRtdCxDsAgCARQXAgJU+//P9Yq6YLHYI3n+EBBkV8BiYWQ6mviX1Z5ME+SURuALEBxm8/tnEzgMLNCTnqa6DJ1jPWK8t8ZorXofk/5jnDJ++yLsZDqo3T1Wwk0xg7O5QAAAABJRU5ErkJggiwvc2luZm9uaXgvaW1hZ2VzL2J1dHRvbl93b3JrZmxvd191cC5wbmc='
    out[00].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABMSURBVCiR1c6hDgAgCARQLIzNJP//sSJoEbCYOOLbAQCV00+8DNbpvmDAtzAn20Qk/sQSIkrkp9MA3df2lggG1S0xqYT07qR3YqiSCWpmBOAlOQaSAAAAAElFTkSuQmCCLC9zaW5mb25peC9pbWFnZXMvYnV0dG9uX3dvcmtmbG93LnBuZw=='
  click[00].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABcSURBVCiRtdCxDsAgCARQupAmTN7/f6xY4oLHoKbn+EBBkaO8LCGkGn+JzazS8J0kozYAWYDiNhePkQkMvnUhNz2P6DJ1jOWi/HeGaC2631O+I1zyPgcCElJ9lQ4QJAk0aL2nJAAAAABJRU5ErkJggiwvc2luZm9uaXgvaW1hZ2VzL2J1dHRvbl93b3JrZmxvd19kb3duLnBuZw=='

   over[01].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABzSURBVCiRrdGxDoAgDEXRdqg06QL+/8faggo1HUC9cTv4BgB41R7ETYLTn0VyllBE2ySUrP/c1AURKwlaTojI9sjywsx05URKKW3psaZgW+fVSBeDlFIg7GAUYJ1iveH6OQEZn2Be1tdcP7zpknBUcHqiA5XkDiEdOwfPAAAAAElFTkSuQmCCLC9zaW5mb25peC9pbWFnZXMvYnV0dG9uX3NlbGVjdF91cC5wbmc='
    out[01].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABjSURBVCiR1dCxCsAgDEXRZEgNZIn+/8c2qbT0SSh09OJ29A0S7ZC5Ww3RUVI88YqY+SLjDEREck8yFFWVOxDrvc+lZS0gt8bMEFprhSjAW0hjSseYB4Se++ubb/m/Bq2/ulEnEl0Js7aTVlkAAAAASUVORK5CYIIsL3NpbmZvbml4L2ltYWdlcy9idXR0b25fc2VsZWN0LnBuZw=='
  click[01].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABzSURBVCiRrdHRCoAgDIXhebEUdqN7/4dta6RNRmT1092nB0KAV5Uok+A0fxWqlUIhaaNQqtzpNCSldBAlzQki6h5qXuTn8MwJtdZsaVoT0C22aIhCzjmQ4uAqUGSqMNvnBPr5+c69rK+5fnjTNeGg4PSDdpuGDiGVRtizAAAAAElFTkSuQmCCLC9zaW5mb25peC9pbWFnZXMvYnV0dG9uX3NlbGVjdF9kb3duLnBuZw=='

   over[02].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABkSURBVCiRzdG9DsAgCARgRhImeP+HbYXSHMjQdPLcPD9/ItGv2JRohtV8TiNvtsY0hnBvtCkwTaFRQ1YNMrzbbda0G2iI04hSbfxFbtbOpSHmMFLPoWSynfOwzDk/x0OG1R9yAdtJDE5Vwj3gAAAAAElFTkSuQmCCLC9zaW5mb25peC9pbWFnZXMvYnV0dG9uX3JlbWFya191cC5wbmc='
    out[02].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABTSURBVCiR5c8xDgAgCANARpJO8P/HChiNIn5A62Y9IkR/BTNHo9IPODdyU9CbMiNasjAls3dm/DrMOpCHgdDexEZhfPL+CeZuUC01kxtjI7l5IQ06TgfMarVXiwAAAABJRU5ErkJggiwvc2luZm9uaXgvaW1hZ2VzL2J1dHRvbl9yZW1hcmsucG5n'
  click[02].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABkSURBVCiRzZExDgAhCAQpSajg/489hdMsSHG5yrVzGMFA9CvcJUhTbfcQ2TmIaRzhSrRY4BQLHTXUsoMazjacee0OEOLliFIm/iN35suJjC2FI7kPLU2OPq+2N3rN5qxJU/0hD8N3DDqHUZDyAAAAAElFTkSuQmCCLC9zaW5mb25peC9pbWFnZXMvYnV0dG9uX3JlbWFya19kb3duLnBuZw=='

   over[03].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAAB2SURBVCiRtdHbCsMwDANQrxAqoqf4/z92dtNbWg12YfLjsQjEZl/FRdBFbP9N5gyFzM1jDtqlQ9CSQbwZQPQFDh2DF19pEE8olaKDhELdqbrjSFDvBJGo03TvLPMoSdfOQWcxbkmi/uugFxL13y/3oUBFbL+RJ4ZDDPl3Aop1AAAAAElFTkSuQmCCLC9zaW5mb25peC9pbWFnZXMvYnV0dG9uX3NlYXJjaF91cC5wbmc='
    out[03].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABlSURBVCiR1dBBCsAgDETRVAgNmZW5/2GbaEtJGw/guHx+BIl23hlDBd38FDTBaSyJdRKBzAtIDYmx3ZTEAlhRNBLAqButG5OA6h0nQLS1fzPOwUHf5qX0E3gWVH2fz2khni9gi10CvAiLBQ5fowAAAABJRU5ErkJggiwvc2luZm9uaXgvaW1hZ2VzL2J1dHRvbl9zZWFyY2gucG5n'
  click[03].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAAB1SURBVCiRtdFLCsAgDARQK0iDszL3P2wT7c92Cv3QyfJlEDWEVxGWJmRb/5LRAyJjUZuNVmlgVNOJFrsWpC2g6wTRpDN1og4pg3TEIYF3Mu+oOLBzjADJMZ47dYbkdOxstJeAJU7gb210IVb//nNPRUnI9o1Mi+UM+bvEc+IAAAAASUVORK5CYIIsL3NpbmZvbml4L2ltYWdlcy9idXR0b25fc2VhcmNoX2Rvd24ucG5n'

   over[04].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAAB9SURBVCiRrdDdCsAgCAbQrlL47nr/h50aNisH+5OxoKNllvIqWhLcJcn+JgDsh01Y9gAiNxcw244aYRI/J5XmRZYTe1NChdnStVDVBmmtKcVAlu2lAs2fM98jFScF6UcNCtPpdwyK0/E2eLtnjlVsrPo9kOvT/hDOIsm+EQcjTQkK2cy6mwAAAABJRU5ErkJggiwvc2luZm9uaXgvaW1hZ2VzL2J1dHRvbl90b29sc191cC5wbmc='
    out[04].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABgSURBVCiR1dCxDsAgCARQJiG5zf//2AqVob2Lc8ugyb0gBrPPF4A6QBIrA9zfhohK0vxB6HekzG6iWUkYKGMa+UECs4J1KZic7g5J91OC9gxB0QFCjTpUrdXEwg/ym7oAn7cEnC4S+C8AAAAASUVORK5CYIIsL3NpbmZvbml4L2ltYWdlcy9idXR0b25fdG9vbHMucG5n'
  click[04].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAAB9SURBVCiRrdDbCsAgCAbgrlL473z/h50atg4OdpKxoE/LLOVVcBZNkmz5JAD8h01Y9wCisBAw+44ZYZI4JxWJIs8ZezNChdvStVK1BmmtKcVBl+2lChLPme/RipMGaUd1GqbT7ug0Tifa4O2eOVbxsdr3QK5P+0UkiST7Rhwo7wkKr6qLTgAAAABJRU5ErkJggiwvc2luZm9uaXgvaW1hZ2VzL2J1dHRvbl90b29sc19kb3duLnBuZw=='

   over[05].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABbSURBVCiRY2AgCwhhARwQGSyq6S8jIAAXBDORZWByEBrJNJgUVAGKPWApmKGoLhBAGInuNoQEsXog9ghgyuB0G8I/OGUY0H3KgAgeLK5G0jRY4pQDG8CimggAALl0B7/0N8IyAAAAAElFTkSuQmCCLC9zaW5mb25peC9pbWFnZXMvYnV0dG9uX2RlbGV0ZV91cC5wbmc='
    out[05].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAM1BMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD366gkAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAAA7SURBVCiRY2AYlkBAABsTwoUJoEkgpDAkIHJAAoddAth0wHWRpAdiDy4HYJNC+Ae37ZhS2J1FspohCAA17QNRhEw3DwAAAABJRU5ErkJggiwvc2luZm9uaXgvaW1hZ2VzL2J1dHRvbl9kZWxldGUucG5n'
  click[05].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABdSURBVCiRY2AgC3BgAxAZLKqF6C4jIAAXBDORZWByEBrJNJgUVAGKPWApmKGoLhBAGInuNoQEsXog9ghgyuB0G8I/OGUY0H3KgAgeLK5G0kT/mMMhI4QFYFFNBAAAvxYHv0No9j4AAAAASUVORK5CYIIsL3NpbmZvbml4L2ltYWdlcy9idXR0b25fZGVsZXRlX2Rvd24ucG5n'

   over[06].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABiSURBVCiRvZBBDsAgCATlRsKN/z+2KKZRWI310Dk6LAKlXKEAdgOqfzdiLIzqrAbDswpGoLF2Ck0Fmp7yitp2NO1B/J6SN7VJjGio98wZIpQh51Nm/887e9gncG8YAaoPeACTRAqY/AH+zQAAAABJRU5ErkJggiwvc2luZm9uaXgvaW1hZ2VzL2J1dHRvbl9pbnNlcnRfdXAucG5n'
    out[06].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABRSURBVCiR3ZAxDgAgCANlM2Hr/x8riHHQYuJmvNGjlVDKj6iRGCBRipqoMExZGxTUONSMVEwstfHgvo+wTYzVyOjcMyIsI8FV5vzP3D29+zs0D70GKjDbMW8AAAAASUVORK5CYIIsL3NpbmZvbml4L2ltYWdlcy9idXR0b25faW5zZXJ0LnBuZw=='
  click[06].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABiSURBVCiRvY9BDsAgCATlZuJt///YgphGcW3amjhHZxchpV9khhuSxmlTlIUBRtWZPKpgCjU6DtQY1LSWJ2xsb+qD+RqZLtVNlGikzZw7IqwjzqfO8z/37uGewIYBgaRfcAGY5gqYgSmoxAAAAABJRU5ErkJggiwvc2luZm9uaXgvaW1hZ2VzL2J1dHRvbl9pbnNlcnRfZG93bi5wbmc='

   over[15].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABiSURBVCiRvZBBDsAgCATlRsKN/z+2KKZRWI310Dk6LAKlXKEAdgOqfzdiLIzqrAbDswpGoLF2Ck0Fmp7yitp2NO1B/J6SN7VJjGio98wZIpQh51Nm/887e9gncG8YAaoPeACTRAqY/AH+zQAAAABJRU5ErkJggiwvc2luZm9uaXgvaW1hZ2VzL2J1dHRvbl9pbnNlcnRfdXAucG5n'
    out[15].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABcSURBVCiR3ZAxDsAwDAIZmfn/Y+sgt1IbvHYIW3wC4wAniqWBSAOiiIyKKAdSWEy5AZGIXXAivz09qDzrbe5RimU32Ty+Z/fci4NnPTnukYY90JOaTlYrfcbvugCitAddq1E9ZQAAAABJRU5ErkJggiwvc2luZm9uaXgvaW1hZ2VzL2J1dHRvbl9pbnNlcnRfYncucG5n'
  click[15].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABiSURBVCiRvY9BDsAgCATlZuJt///YgphGcW3amjhHZxchpV9khhuSxmlTlIUBRtWZPKpgCjU6DtQY1LSWJ2xsb+qD+RqZLtVNlGikzZw7IqwjzqfO8z/37uGewIYBgaRfcAGY5gqYgSmoxAAAAABJRU5ErkJggiwvc2luZm9uaXgvaW1hZ2VzL2J1dHRvbl9pbnNlcnRfZG93bi5wbmc='
click_L[15].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABRSURBVCiR3ZAxDgAgCANlM2Hr/x8riHHQYuJmvNGjlVDKj6iRGCBRipqoMExZGxTUONSMVEwstfHgvo+wTYzVyOjcMyIsI8FV5vzP3D29+zs0D70GKjDbMW8AAAAASUVORK5CYIIsL3NpbmZvbml4L2ltYWdlcy9idXR0b25faW5zZXJ0LnBuZw=='

   over[16].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABbSURBVCiRY2AgCwhhARwQGSyq6S8jIAAXBDORZWByEBrJNJgUVAGKPWApmKGoLhBAGInuNoQEsXog9ghgyuB0G8I/OGUY0H3KgAgeLK5G0jRY4pQDG8CimggAALl0B7/0N8IyAAAAAElFTkSuQmCCLC9zaW5mb25peC9pbWFnZXMvYnV0dG9uX2RlbGV0ZV91cC5wbmc='
    out[16].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABLSURBVCiR3Y4xDgAgCAM7dub/jzURxKHlAcokvRwW+HJI98z1BGSERQKA2IgQUBpNnsgZ5YyGQ3VKUf8hHW4tlbqW1OvA9hukh2YB3gADR4vRsyQAAAAASUVORK5CYIIsL3NpbmZvbml4L2ltYWdlcy9idXR0b25fZGVsZXRlX2J3LnBuZw=='
  click[16].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAOVBMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD//wD////yQ9vqAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAABdSURBVCiRY2AgC3BgAxAZLKqF6C4jIAAXBDORZWByEBrJNJgUVAGKPWApmKGoLhBAGInuNoQEsXog9ghgyuB0G8I/OGUY0H3KgAgeLK5G0kT/mMMhI4QFYFFNBAAAvxYHv0No9j4AAAAASUVORK5CYIIsL3NpbmZvbml4L2ltYWdlcy9idXR0b25fZGVsZXRlX2Rvd24ucG5n'
click_L[16].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAMAAABopjdHAAAAM1BMVEX///8AAHsAAP8AewAAe3sA//97AAB7ewB7e3ucnJy1tbUAAADW1tbe3t7n5+f39/f/AAD366gkAAAAAXRSTlMAQObYZgAAABZ0RVh0U29mdHdhcmUAZ2lmMnBuZyAyLjUuOEJJxCcAAAA7SURBVCiRY2AYlkBAABsTwoUJoEkgpDAkIHJAAoddAth0wHWRpAdiDy4HYJNC+Ae37ZhS2J1FspohCAA17QNRhEw3DwAAAABJRU5ErkJggiwvc2luZm9uaXgvaW1hZ2VzL2J1dHRvbl9kZWxldGUucG5n'
}
function show_images(imgName, i, status, f, evt) {
  if ( typeof(status) == 'object' ) { f   = status, status = '' };
  if ( typeof(f     ) == 'object' ) { evt = f     , f      = '' };
  evt = evt || event || {type:'mouseover'};
  if ( ! wd[imgName] )
    return;

  if ( wd[imgName].src_backup == undefined )
    wd[imgName].src_backup = wd[imgName].src;
        
  var x = eval('wd.'+Menu_PROCESO+'proceso_status'  + imgName.substring(3)) ||
          eval('wd.'+Menu_PROCESO+'proceso_status_' + imgName.substring(3)) || {};
  if ( evt.type == 'mouseout' || evt.type == 'blur' ) {
    if ( status != x.value ) {
      var y = wd[imgName].src_backup;
    } else {
      var y = out[parseInt(imgName.substring(1,3))].src;
    }
  } else {
    if ( status != x.value ) {
      var y = over[parseInt(imgName.substring(1,3))].src;
    } else {
      var y = click[parseInt(imgName.substring(1,3))].src;
    }
  }
  wd[imgName].src = y;
}
function change_images(imgName, i, status, evt) {
  if ( typeof(status) == 'object' ) { evt = status, status = '' };
  evt = evt || event || {type:'click'};
  if (imgName.length<4)
    imgName = imgName+MenuItem;

  if (status) {
    var z = document.getElementById(Menu_PREFIX + 'count_' + imgName.substring(3));
    if (z)
      z.style.backgroundColor = '';

    var z = eval('wd.'+Menu_PROCESO+'proceso_status'  + imgName.substring(3)) ||
            eval('wd.'+Menu_PROCESO+'proceso_status_' + imgName.substring(3));
    if (z.value == status) {
      z.value = '';
      if (typeof DisplayMenu_callback == 'function')
        DisplayMenu_callback();
    } else {
      if (status == 'DEL') {
        jQuery_confirm("Atencion!",
          "al grabar el documento se eliminará la linea",
          [{ text: "Acepta", click: function()
            { $( this ).dialog('close');
              z.value = status; show_images(imgName, out, z.value, 'out', evt);
              z=document.getElementById(Menu_PREFIX + 'count_' + imgName.substring(3));
              if (z) { z.style.backgroundColor = '#ff0000'};
              if (typeof DisplayMenu_callback == 'function')
                DisplayMenu_callback();
            }
           },
           { text: "Cancela", click: function()
            { $( this ).dialog('close');
            }
           }]
        );
        return false;
      } else {
        z.value = status;
        if (typeof DisplayMenu_callback == 'function')
          DisplayMenu_callback();
      }
    }
    show_images(imgName, over, status, '', evt);
    refresh_images(imgName, status, evt);
  }
}

function refresh_images(imgName, status, evt) {
  if ( typeof(status) == 'object' ) { evt = status, status = '' };
  evt = evt || event || {type:'mouseout'};
  for (x = 00; x<=16; x++) {
    if (parseInt(imgName.substring(1,3)) != x ) {
      y = x; if ( y<10 ) y='0'+x
      show_images('m'+y+imgName.substring(3), out, status, '', evt);
    }
  }
}

function DisplayMenu(Item,e, callback) {
  DisplayMenu_callback = callback;

  Menu_PREFIX  = e || 'LN_';
  Menu_PROCESO = ( eval('wd.'+ e           +'proceso_status' + Item) || eval('wd.'+ e           +'proceso_status_' + Item) ) ? e
               : ( eval('wd.'+ Menu_PREFIX +'proceso_status' + Item) || eval('wd.'+ Menu_PREFIX +'proceso_status_' + Item) ) ? Menu_PREFIX : '';

  if ( MenuItem != Item ) {
    var o = document.getElementById(Menu_PREFIX + 'Menu_'+Item).getBoundingClientRect();
    var e = document.getElementById('MenuLine');
    e.style.position='absolute';
    e.style.top     = (o.top  + 05) + 'px';
    e.style.left    = (o.left + 15) + 'px';
    e.style.display ='inline';
    MenuItem = Item;
    clearTimeout(OSTOut);
    OSTOut=setTimeout('HiddeMenu()',2000);
    try {
      document.getElementById('menu').focus();
    } catch(err) { console.error(err); }
  } else {
    HiddeMenu();
  }
}
function HiddeMenu() {
  var e = document.getElementById('MenuLine');
  e.style.display = 'none';
  try {
    document.getElementById(Menu_PREFIX + 'Menu_'+MenuItem).focus();
  } catch(err) { console.error(err); }
  MenuItem = 0;
  clearTimeout(OSTOut);
}

// ******* REVISAR ESTA FUNCION Y REEMPLAZARLA POR LA FUNCION JQUERY
function CallCOUNT(v,i,t) {
  if (!v.indexOf('.head.document')) { v = v.substr(6,v.length) }
  v = eval(v);
  var z = parseInt(v.value)+i;

  v.value = (!isNaN(t) && z*i > t) ? t : z;
}
function FixHeader(e) {
 var $e=$(e);
 if ($e.length) {
  $e.each(function() {
   $(this).find('table.LN').each(function() {
    $(this).addClass('FixHeader');
   });
  });
 }
}
function FixHeader__ELIMINAR__(e) { // funcion remplazada por el css 'position:sticky' 26/05/2019
 var $e=$(e);
 if ($e.length) {
  $e.each(function() {
   var $e = $(this),
   $table = $e.find('table:first'),
       id = new Date().getTime();
   $table.attr('data-clone', id);
   $clone=$table.clone();
   $clone.attr('id',id);
   $clone.css('position','relative');
   $clone.find('tbody, tfoot').each(function () { $(this).html(''); });
   $table.find('thead').each(function () {
    $(this).find('[name], [id]').each(function () {
     $(this).removeAttr('name').removeAttr('id');
    })
   });
   $e.append($clone);
  });
  $e.bind('scroll', function() {
   var $e = $(this),
   $table = $e.find('table:first'),
   $clone = $e.find('#'+$table.data('clone'));
   $clone.css('width', $table.css('width'));
   $tr = $table.find('thead tr').find('th, td');
   $clone.find('thead tr').find('th, td').each(function (i) {
    $(this).css('width', $tr.eq(i).css('width'));
   });
   $clone.offset({top:$table.offset().top+$e.scrollTop(), left:$table.offset().left});
  });
 }
}

function openModalWindow(id){
  if( windowFocus.includes(id) )
    return false;

  var modal = document.getElementById( id );
  var span  = modal.getElementsByClassName('sii_close')[0];
  if (!span) {
    span = document.createElement('span');
    span.id = id + '_close';
    span.classList.add('sii_close');
    span.innerHTML = '&times;'
    x = modal.getElementsByClassName('sii_modal-content')[0],
    y = x.innerHTML, x.innerHTML = '';
    x.appendChild(span);
    x.innerHTML += y;
    span = modal.getElementsByClassName('sii_close')[0];
    span.onclick = function(event) {
      modal.dialog('close',event);
    };
  }

  modal.dialog = function(f,event) {
    if( f == 'close' ) {
      win = window.frames[this.id];
      if (win.IfExistButton && win.IfExistButton())
        win.submit_true('Nuevo', 'OFF');

      try { event.stopPropagation(); } catch(err){};
      modal.style.display = 'none';
      windowFocus.splice(windowFocus.indexOf(id));

      var x = modal.closest('tbody'), y = x.tableRow;
      x.tableRow = '';
      if(y)
        set_tableRow(y, event);
    };
  };
  modal.style.display = 'flex';

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.dialog('close',event);
    }
  };
  jQframeObj[ id ] = $(modal);
  windowFocus.push(id);

  return modal;
}
