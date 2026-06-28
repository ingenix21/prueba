/**
 * utils.js 1.0 1999/07/17
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

var
 sii_name        = 'Sinfonix 2000 for WEB',
 wd              = document,
 myForm          = wd,

 saveItemFocus   = 0,
 NameItemFocus   = '',

 DBF_null_key    = null,
 DBF_query_key   ='key',
 DBF_connect_key = null,
 DBF_insert_key  = true,
 DBF_name_key    ='Documento',
 DBF_action      = myForm.action || document.location.href.split('%20')[0] +'%20'+ document.location.href.split('%20')[1],

 WScreen_W       =(window.innerWidth  > 1024) ? 1024 : window.innerWidth,
 WScreen_H       =(window.innerHeight >  768) ?  768 : window.innerHeight,
 WScreen_C       = window.screen.colorDepth,
 saveKeydown     = '',
 MenuItem        = 0,
 Menu_PREFIX     = 'LN_',
 Menu_PROCESO    = '',
 OSTOut          = 0,
 trash           = null,

 COLS            = 0,
 Old_Obj         = '',

 pgms_count      = null,             // Eliminar!!! 31/12/2019
 docment_itemMenuSelect = null,
 e_pageX         = 0,
 e_pageY         = 0,
 jQframeObj      = new Array(),
 ItemBlurIsTrue  = true,
 EVENT           = '',//(document.all) ? event : window.event,
 CTRLKEY         = '',
 iKEYS           = '',
 KEYS            = new Array(),
 INPUT           = null,
 sii_search_cache= {},
 originalForm    = false,
 UpdateForm      = false,
 disable_pagecontainerbeforechange = false,
 historyButton   = false,
 $main           = '',
 CurrentPage     = [{}],
 windowFocus     = new Array(),
 windowFocus_backup = '',
 set_lockScreen  = '',
 frame_name      = '',
 tableRow        = '',
 tableRow_Light  = '',
 lineNum         = 26,
 CheckLeaseTimer = 0,
 iconGeneric     = '/images/file-user.png',
 ESCAPE2         = 0,
 CLOSED          = true,
 ONBEFOREUNLOAD  = true,
 STDIO_UpdateForm= 0,
 window_parent   = window,
 top_window      = window,
 KD              = 0,
 initHref        = location.href
 sii_appMode     = Cookies('Read', 'appMode');

 try { if ( window.parent.document.body ) window_parent = window.parent; } catch(err){};
 try { if (    top.window.document.body ) top_window    =    top.window; } catch(err){};

if ( window == window.parent && history.length < 3 ) {
  history.pushState({'sii_firstState':true},'','');
}

$( window ).on({
  beforeunload: function() {
    if ( ONBEFOREUNLOAD && ! document.body.dataset.popstate ) {
      Cookies('Write', 'appMode', sii_appMode);
      window.pageHide = true;
      setTimeout(function(){
        delete window.pageHide;
      },500)
      if ( IfExistButton() && ! verifidForm('',1) )
        return true;
    }
  },
  pagehide: function() {
    if (window.pageHide != true )
      return

    if ( myForm && (myForm.name||'').indexOf('lock') > -1 )
      submit_true('Nuevo', 'OFF');

    try {
      var wo = window;
      while ( !wo.START && wo.top.opener )
        wo = wo.top.opener;

      try {
        if ( sii_fid0 != 'IO' && ( wo == top.window || !wo.START ) )
          throw('');

      } catch(err) {
        try {
          CallSQL('^LOGIN.www','out!');
          Cookies('Remove', 'sii_leaseTime_'    + sii_fid0);
          Cookies('Remove', 'sii_leaseTime_CRC_'+ sii_fid0);
        } catch(err) {}
      }

    } catch(err){}
  },
  mousedown: function() {
    select_activeElement();
  },
  keydown: function() {
    select_activeElement();
  },
  message: function(e) {
    var e = e || event;
    if ( e.origin ) {
      var x = e,
          y = e.origin;
    } else {
      var x = e.originalEvent,
          y = location.origin;
    }
    if ( y.startsWith( location.origin ) ) {
      const data = x.data;
      if ( typeof data != 'object' ) {
        console.info('%c%s', 'color:red; font-size:24px', 'event.origin: '+ y +', message: '+data );
      } else {
        switch ( data.action ) {

          case 'eval':
            eval( data.value );
            break;

          case 'message':
            navigator.serviceWorker.controller.postMessage({ action: 'message', value: data.value });
            break;

          default:
            console.info( data );
        }
      }
    }
  },
});
addEventListener('popstate', function(e) {
  if ( document.body.dataset.popstate2 == 10 || document.body.dataset.popstate3 ) {
    delete document.body.dataset.popstate2;
    return setTimeout(function() {
      ONBEFOREUNLOAD = true;
      disable_pagecontainerbeforechange = false;
    },500);
  };
  if ( window != window.parent || ( e.state != null && verifidForm('',1) ) )
    return

  document.body.dataset.popstate3 = true;
  history.forward();
  setTimeout(function() {
    delete document.body.dataset.popstate3;
    if ( e.state != null && app_UI == 'JQM' ) {
      var hash  = location.href.split('#')[1] || ( document.querySelector('.ui-popup-container.ui-popup-active') )
                ? '&ui-state=dialog' : ''; if ( hash ) hash = '#'+ hash;
      var role  = (hash.startsWith('#')) ? 'dialog' : '';
      var state = {
          hash: hash||'#'+ location.href.split('#')[0],
          role: role,
         title: document.title,
           url: location.href.split('#')[0] + hash
      }
      history.pushState( state, state.title, state.url );
      if ( navigator.userAgent.toUpperCase().indexOf('ANDROID')+1 )
        tooltip_exit('',0);
    }
    fn_KEYS2([27]);
  },0);
});

function onLoad() {
 window_title = (document.querySelector('title')||{}).text||document.title||sii_name;

 if ( window != window_parent && window_parent.window_title )
   window_title = window_parent.window_title +' / '+ window_title;

 top_window.document.title = window_title;

 UpdateForm      = true,
 submit          = submit_ext,
 onkeydown       =
 onkeyup         = keystroke,
 onfocus         = function () { KEYS = new Array() };

 if ( $main == '' ) {
   $main = document.querySelector('html').innerHTML
   if ( app_UI == 'JQM' )
     setTimeout( function() {$main = document.querySelector('html').innerHTML}, 1000);
 };
 if ( navigator.serviceWorker ) {
  navigator.serviceWorker.onmessage = (evt) => {
   const data = evt.data;
   switch ( data.action ) {

   case 'eval':
    try { eval( data.value ) } catch(err) {};
    break;

   default: // data.action = 'message'
    if (!data.value) return;
    navigator.serviceWorker.controller.postMessage({
     action: 'message',
      value: data.value,
    });
   }
  }
  if ( navigator.serviceWorker.register ) {
   navigator.serviceWorker.register('../SW.js')
   .then(function(registration) {

    // Si hay un Service Worker esperando desde antes, avisa al usuario
    if (registration.waiting) {
     notificarActualizacion(registration.waiting);
    }

    // Detecta nuevas actualizaciones mientras la app está abierta
    registration.addEventListener('updatefound', () => {
     const newWorker = registration.installing;
     newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
       notificarActualizacion(newWorker);
      }
     });
    });

    return registration.pushManager.getSubscription()
    .then(async function(subscription) {

     if (subscription) {
      return subscription;
     }
     const response  = await fetch('/cgi-bin/sinfonix_sql.pl?^SW.www GetPublicKey');
     const publicKey = await response.text();
     const arrayKey  = urlBase64ToUint8Array(publicKey);

     return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: arrayKey
     });
    });

   }).then(function(subscription) {
    var subscription = JSON.stringify(subscription);
    var bak_subscrip = Cookies('Read','pushMsg')||'';

    Cookies('Write', 'pushMsg', subscription, 365*10);

    var form  = setForm('subscription',subscription);
        form += setForm('bak_subscrip',bak_subscrip);

    fetch('/cgi-bin/sinfonix_sql.pl?^SW.www Register', {
      method: 'post',
      headers: {
       'Content-type': 'application/x-www-form-urlencode',
       'Content-length': form.length
      },
      body: form
    }).then(function() {
     try { GeoLocation(); } catch (err) {console.error(err)};
    });

   }).catch(function(e) {
     console.error(e);
   });

   // Escucha cuando el nuevo Service Worker toma el control y recarga la página
   navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
   });
  };
 };
 if ( window != window_parent && window_parent.focusWhenReady )
  try { window_parent.focusWhenReady(); } catch (err) {console.error(err)};

 if (!window.name.indexOf("PRINT") && typeof sii_printer == "undefined" ) {
  sii_printer = "";
  window.print();
 }
 if ( navigator.userAgent.toUpperCase().indexOf('ANDROID')+1 ) {
  document.querySelectorAll('input[onchange], [data-F2]')
  .forEach(function(e) {
    e.addEventListener('dblclick', function(e) {
      KEYS_113();
    });
  });
 }
 myForm_readOnly();
 onLoad_CONTINUE();
}

// Función que muestra la alerta al usuario
function notificarActualizacion(e) {
  worker = e;
  document.getElementById('actualiza').style.display = '';
  const usuarioAcepta = confirm("¡Nueva versión disponible! ¿Deseas actualizar ahora para ver los cambios?");debugger
  if (usuarioAcepta) {
    // Envía la orden al Service Worker para que deje de esperar
    worker.postMessage({ action: 'eval', value: 'self.skipWaiting()' });
  }
}

function keystroke(e) {
 EVENT = e || event;
 saveKeydown = ( document.all ) ? EVENT.keyCode : EVENT.which;
 iKEYS = KEYS.indexOf( saveKeydown );
 if ( EVENT.type == 'keydown' ) {
  if ( iKEYS == -1 ) { KEYS.push( saveKeydown ) };
  try {
   if ( KEYS == '13' || CheckLeaseTime_EXPIRATION() ) {
    if ( KEYS.length ) {
     // if ( [16,17,18].indexOf(saveKeydown) == -1 )
      return fn_KEYS2(KEYS);
    } else {
     EVENT = '';
    }
   } else {
    if ( EVENT.altKey || EVENT.ctrlKey || ( KEYS > 111 && KEYS < 144 ) ) {
     // EVENT.stopPropagation();
     // EVENT.preventDefault();
    }
   }
  } catch (err) {console.error(err)};
 } else {
  if ( iKEYS + 1 ) {
   while ( iKEYS = KEYS.indexOf( saveKeydown ) + 1 ) {
    KEYS.splice( iKEYS -1, 1 );
   }
  } else {
   KEYS = new Array();
  }
 }
}

function fn_KEYS2(KEYS) {
  if (KD)
    console.info(KEYS,[].concat(KEYS).sort().join('_'), EVENT.keyCode, EVENT.which, EVENT.charCode, EVENT.key, EVENT.code);

  var fn = 'KEYS_'+ [].concat(KEYS).sort().join('_'),
   My_fn = 'My_'  + fn, x, y, z;
  if ( app_UI == 'JQM' ) My_fn = CurrentPage[0].id.split('.').join('_').split('^').join('') +'_'+ My_fn;
  if ( saveKeydown == 27 ) KEYS.splice( iKEYS, 1 );
  z = fn_KEYS(My_fn); if ( ! z ) return z;
  return fn_KEYS(fn);
}

function fn_KEYS(fn) {
  try {
    if ( typeof( window[fn] ) === 'function' ) {
      if ( KEYS.length > 1 ) {
        EVENT.stopPropagation();
        EVENT.preventDefault();
      }
      return window[fn]();
      // return eval( fn+'()' )
    }
  } catch(err){if ( !((err+'').indexOf(': '+ fn)+1)) console.error(err, fn)}
  return true;
}

function KEYS_13(e) { //             <ENTER>  Key : Skip To Next <input> or Car Return on <textarea>
 e = e || 1;
 INPUT = inputList();
 // var elm = ( ( typeof ( window.event ) == undefined ) ? EVENT.srcElement : EVENT.target )|| document.activeElement || [];
 var elm = document.activeElement || [], x, y, z;

 if ( ( ! elm.name && ! INPUT.closest('form').find('[name]').length ) || ( elm.getAttribute && elm.getAttribute( 'contenteditable' ) ) )
  return true;

 try { EVENT.stopPropagation() } catch(err){};
 if ( elm.tagName == 'A' )
  try { EVENT.preventDefault() } catch(err){};

 if ( ! elm.name && elm.id ) {
  if ( ! elm.id.indexOf('select') ) {
   z = elm.nextElementSibling;

  } else {
   z = elm.id.split( '-' )
   if ( z.length > 1 ) {
    z = document.getElementById( z[0] );

   } else {
    z = '';
   }
  }
  if ( ! z )
   z = INPUT[saveItemFocus -1]||INPUT[INPUT.length -1];

  elm = z;
 }
 if ( elm.tagName == 'TEXTAREA' || ( elm.getAttribute && elm.getAttribute( 'contenteditable' ) ) ) {
  var ss = elm.selectionStart, es = elm.selectionEnd, esv = elm.value.length;
 } else {
  var ss =                     es =                   esv = 0;
 };
 if ( ss == 0 && es == esv ) { // Skip To Next Input
  var i = 0;
  while ( i < INPUT.length && elm != INPUT[i] ) i++;
  if ( i == INPUT.length )
   i = ( saveItemFocus ) ? saveItemFocus : ( e < 0 ) ? 0 : i--;

  ItemFocus( ItemBlur( i, e ) );
  return false;
 }
}

function KEYS_13_16() { // <Shift> + <ENTER>  Key : Back To Next <input>
 return KEYS_13(-1)
}

function KEYS_13_17() { // <Ctrl>  + <ENTER>  Key : Back To Next <input>
 return KEYS_13(-1)
}

function KEYS_13_18() { // <Alt>   + <ENTER>  Key : Back To Next <input>
 return KEYS_13(-1)
}

function KEYS_18_78() { //   <Alt> + <N>      Key : Nuevo Documento
// if ( typeof(My_KEYS_18_78) != 'function' || My_KEYS_18_78() )
  return writeDocument('Nuevo','OFF');

 return false;
}

function KEYS_18_71() { //   <Alt> + <G>      Key : Grabar Documento
// if ( typeof(My_KEYS_18_71) != 'function' || My_KEYS_18_71() )
  return writeDocument('Acepta','OFF');

 return false;
}

function KEYS_18_69() { //   <Alt> + <E>      Key : Eliminar Documento
// if ( typeof(My_KEYS_18_69) != 'function' || My_KEYS_18_69() )
  return writeDocument('Elimina','OFF');

 return false;
}

function KEYS_18_68() { //   <Alt> + <D>      Key : Deshacer Cambios
// if ( typeof(My_KEYS_18_68) != 'function' || My_KEYS_18_68() )
  return verifidForm('myForm.reset()');

 return false;
}

function KEYS_18_80() { //   <Alt> + <P>      Key : Visualizar Documento
// if ( typeof(My_KEYS_18_80) != 'function' || My_KEYS_18_80() )
  return writeDocument('Acepta','ON');

 return false;
}

function KEYS_17_80() { //  <Ctrl> + <P>      Key : Imprimir Documento
// if ( typeof(My_KEYS_17_80) != 'function' || My_KEYS_17_80() )
  return writeDocument('Acepta','PRINT');

 return false;
}

function KEYS_18_77() { //   <Alt> + <M>      Key : Enviar por Correo
  send_eMail();
  return false;
}

function KEYS_18_37() { //   <Alt> + <ArrowLeft>  Key : Prev Sub Page
  var i = CurrentPage[0].id;
  if ( typeof subPag == 'object' && subPag[i] && subPag[i].active > 0 ) {
    EVENT.preventDefault()
    subPag_Next(-1);
  } else {
    history_back();
  }
}

function KEYS_18_39() { //   <Alt> + <ArrowRight> Key : Next Sub Page
  var i = CurrentPage[0].id;
  if ( typeof subPag == 'object' && subPag[i] && subPag[i].src && subPag[i].active < subPag[i].src.length ) {
    EVENT.preventDefault()
    subPag_Next(+1);
  } else {
    history_forward();
  }
}

function KEYS_27(e) {   //           <Esc>    Key : Close Window
 if ( e == 'close' || ( !closeWindow( window, e ) && !closeWindow( window_parent, e ) ) ) {
  if ( e == 'close' || document.body.dataset.popstate ) {
   // if ( ( e == 'close' || !closeWindow( window_parent, e ) )  && top_window.CLOSED ) {
   // if ( e == 'close' || ! closeWindow( window_parent, e ) ) {
    // ONBEFOREUNLOAD = false;
    // disable_pagecontainerbeforechange = true;
    try { top_window.close() } catch(err) {console.error(err)};
   // };
   // ONBEFOREUNLOAD = true;
   // disable_pagecontainerbeforechange = false;
   tooltip('init', '', "toque la [X] en la parte superior para salir", 3000);

  } else {
   if ( UpdateForm ) {
    if ( KEYS_18_78() ) {
      tooltip_exit();
    };
   };
  };
 };
 return false;
}

function KEYS_32() { //            <Space>    Key : for Display <select> Box
 // var se = ( ! typeof( window.event ) ) ? EVENT.srcElement : EVENT.target|| event.target;
 var se = ( event ) ? event.target : EVENT.target || EVENT.srcElement;
 if (se.tagName=='A' || se.tagName=='BUTTON') {
  event.stopPropagation();
  event.preventDefault();
  se.click();
  KEYS = new Array();
 } else if (se.tagName=='SELECT') {
  KEYS = new Array();
 }
}

function KEYS_113() { //             <F2>     Key : Query Database
 var se = ( event ) ? event.target : EVENT.target || EVENT.srcElement,
    cmd = se.getAttribute( 'data-F2' ) || se.onchange || se.href;

 if ( cmd ) {
  cmd = cmd + '';
  z = cmd.indexOf( '{\n' );
  if ( z+1 )
   cmd = cmd.substr( z+2 );

  z = cmd.indexOf( '\n}' );
  if ( z+1 )
   cmd = cmd.substr( 0, z );

  z = cmd.toLowerCase().indexOf( 'javascript:' );
  if ( z+1 )
   cmd = cmd.substr( z+11 );

  y = '\'record\'', z = cmd.toLowerCase().indexOf( y );
  if ( ! (z+1) )
   y = '\'lock\'', z = cmd.toLowerCase().indexOf( y );

  if ( z+1 )
   cmd = cmd.split( cmd.substr( z, y.length ) ).join( '\'list\'' );

  try { eval ( cmd ); } catch (err) { console.error(err, cmd) };
 }
}

function KEYS_116() { //             <F5>       Key : Refress Page
 EVENT.preventDefault();
 // ONBEFOREUNLOAD=false;
 if ( app_UI == 'JQM' && ( ( $.mobile.navigate.history.activeIndex && $.mobile.navigate.history.stack_activeIndex != $.mobile.navigate.history.stack[$.mobile.navigate.history.activeIndex] ) || location.href.split('#').length > 1 ) ) {
   $.mobile.navigate.history.stack_activeIndex = $.mobile.navigate.history.stack[$.mobile.navigate.history.activeIndex];
   KEYS_27();
   ESCAPE2 = 0;
 } else {
   location.reload(true);
 }
}

function KEYS_116_16() { //  Shift + <F5>       Key : Refress Page
  KEYS_116();
}

function KEYS_17_82() { //    Ctrl + <R>        Key : Refress Page
  KEYS_116();
}

function KEYS_16_17_82() {// Shift + Ctrl + <R> Key : Refress Page
  KEYS_116();
}

function InitInput(forName) {
 var i = 0; INPUT = inputList();

 if ( forName )
  while (i < INPUT.length && INPUT[i].name != forName ) i++;

 if (i == INPUT.length)
  i = 0;

 return ItemFocus( ItemSelect(i, 1) );
}

function ItemSelect(i, e, recursive) {
 while  (i > -1 && i < INPUT.length && ( INPUT[i].disabled || !isVisible(INPUT[i]) ) ) i+=e;
 return ( recursive ) ? i : ( i > -1 ) ? ( ( i < INPUT.length ) ? i : ItemSelect( 0, 1, true ) ) : ItemSelect( INPUT.length-1, -1, true );
}

function ItemFocus(i) {
 INPUT = INPUT || inputList();
 if ( i < 0 || i >= INPUT.length ) return -1;
 try {
  if ( ! INPUT[i].tagName.indexOf('H') )
   INPUT[i].querySelector('a').focus();
  else
   if (! (navigator.userAgent.toUpperCase().indexOf('ANDROID')+1) )
     INPUT[i].focus();

  saveItemFocus = i;
 } catch (err) {
  try {
   if (! (navigator.userAgent.toUpperCase().indexOf('ANDROID')+1) )
    INPUT[saveItemFocus].focus();
  } catch (err) {
   try {
    if (! (navigator.userAgent.toUpperCase().indexOf('ANDROID')+1) )
     INPUT[0].focus();

    saveItemFocus = 0;
   } catch (err) {
    console.error(err,INPUT[i]);
    return -1
   };
  };
 };
 var x = INPUT[saveItemFocus], z = x.type;
 if (z != 'button' && z != 'submit' && z != 'reset' && x.select) x.select();
 return saveItemFocus;
}

function ItemBlur(i,e) {
 INPUT = INPUT || inputList();
 try {
  INPUT[i].value = INPUT[i].value;
 } catch(err){};
 try {
   if (! (navigator.userAgent.toUpperCase().indexOf('ANDROID')+1) )
     INPUT[i].blur();
 } catch(err){};

 return ItemSelect(i+e,e);
}

function isVisible(e) {
 var z = $(e)
 try {return z.is(':visible') && z.css('visibility')=='visible' } catch (err) { return false };
}

function inputList(e) {
 var Form, x = $( document.querySelector('.ui-popup-active') || document.querySelector('.ui-dialog') );
 if ( x.is(':visible') ) {
   Form = x.find('form[name^=myForm]')[0] || x.find('form')[0] || x[0];
 } else {
   Form = (windowFocus.length) ? jQframeObj[ windowFocus[ windowFocus.length-1]] : document;
   if ( windowFocus.length && Form.parent )
     Form = Form.parent();
 }
 INPUT = $( Form ).find('[name]').not('form, img');

 if ( INPUT.length == 0 )
  INPUT = $( Form ).find('*');
 return INPUT;
}

function CallPGM(Url, Target, Opts, Title, Frame) {

 Cookies('Write', 'appMode', sii_appMode);

 var z = (Opts || '').toUpperCase().split('WIDTH=' ), WIDTH  = (z.length>1) ? z[1].split(',')[0] : '';
 var z = (Opts || '').toUpperCase().split('HEIGHT='), HEIGHT = (z.length>1) ? z[1].split(',')[0] : '';
 var margin = ( screen.height - window.innerHeight > 86 ) ? 0 : 0;

 if ( app_UI == 'JQM' || sii_appMode == 'Mobile' ) {
  DWScreen_W =  512, DWScreen_H =  911;
  // DWScreen_W = 1080, DWScreen_H = 1920;
 } else {
  DWScreen_W = 1024, DWScreen_H =  768;
 }
 WScreen_W = ( window.innerWidth  > DWScreen_W ) ? DWScreen_W : window.innerWidth;
 WScreen_H = ( window.innerHeight > DWScreen_H ) ? DWScreen_H : window.innerHeight;
 Target = Target || (Frame||'window') + new Date().getTime();

 if ( app_UI == 'JQM' || sii_appMode == 'Mobile' || Frame == 'window' || !Target.indexOf('PRINT') || ( EVENT && ( EVENT.shiftKey || EVENT.ctrlKey ) ) ) {
  if ( !WIDTH ) {
    WIDTH  = WScreen_W-margin;
    if ( WIDTH  < DWScreen_W-margin ) WIDTH  = DWScreen_W-margin;
  }
  if ( !HEIGHT ) {
    HEIGHT = WScreen_H-margin;
    if ( HEIGHT <  DWScreen_H-margin ) HEIGHT =  DWScreen_H-margin;
  }
  // Opts = 'resizable, scrollbars, top='+ (screen.width-WIDTH)/2 +', left='+ (screen.height-HEIGHT)/2 +', width='+ WIDTH +', height='+ HEIGHT;
  Opts = 'resizable, scrollbars, top='+ 0 +', left='+ 0 +', width='+ WIDTH +', height='+ HEIGHT;
  Title = Title  || 'Sinfonix 2000 for WEB';

  wl = window.open( '/cgi-bin/sinfonix'+ ((Target.indexOf('**NGZ**')+1) ? '_ngz' : '') +'.pl?' + sii_system + '%20' + Url, Target, Opts );

  wl.focus();
  return
 }

 if (WIDTH  == '' || WIDTH  > WScreen_W) WIDTH  = WScreen_W;
 if (HEIGHT == '' || HEIGHT > WScreen_H) HEIGHT = WScreen_H;

 var w = document.createElement( 'iFrame' ),
    id = 'iFrame' + HTA(Url);

 w.style.visibility='hidden';/* Hidden by default */
 w.style.position='fixed';   /* Stay in place */
 w.style.overflow='hidden';  /* hidden scroll if needed */
 w.style.zIndex='1000';      /* Sit on top */
 w.style.left=(window.innerWidth-WIDTH )/2+'px';
 w.style.top=(window.innerHeight-HEIGHT)/2+'px';
 w.style.width  = WIDTH +'px'; /* Full width */
 w.style.height = HEIGHT+'px'; /* Full height */
 w.id   =
 w.name = id;
 w.src  = '/cgi-bin/sinfonix_ngz.pl?' + sii_system + ' ' + Url;
 w.dialog = function(f) {
  win = window.frames[this.id];
  if (win.IfExistButton && win.IfExistButton())
   win.submit_true('Nuevo', 'OFF');

  windowFocus.splice(windowFocus.indexOf(id));
  jQframeObj[id]='';
  w.parentNode.removeChild(w);
  top_window.document.title = window.window_title;
//  UpdateForm = true;
  lockScreen('unlock');
  InitInput(NameItemFocus)
 };
 w = document.body.appendChild(w);
 lockScreen('lock', 1);

 jQframeObj[ id ] = w;
 windowFocus.push(id);

 focusWhenReady = function() {
  var iframe = document.getElementById(id);
  if ( iframe ) {
    iframe.style.animationName = 'openWin';
    iframe.style.animationDuration = '1s';
    iframe.style.overflow='auto';/* Enable scroll if needed */
    iframe.style.visibility='';
    iframe.contentWindow.focus();
  }
 }
}

function callSQL_Date(elm, format) {
 format = format || 'gre';
 var date, cmd;
 if (!elm.indexOf('.head.document') ) { elm = elm.substr(15) };
 if ( elm.indexOf('(')+1 ) {
  date = ( format != 'gre' ) ? format : '{value:\'\'}';
  cmd  = elm;
 } else {
  date = elm;
  cmd  = date + '.value=' + format;
 }
 sqln = 'callSQL_Date_Frame_' + HTA( cmd + date ) + elm.indexOf('(')+1;
 cmd = 'date=\"' + eval( date ).value + '\" window.parent.' + cmd;
 CallSQL('^DATE.www', 'list', '', cmd, '', '', 170, 235, 'Calendario', '', sqln);
}

function LoadRecord(key, method, action) {
 if ( ! UpdateForm ) return false;
 UpdateForm = false;
 lockScreen();
 method = method || 'get';
 action = action || DBF_action;
 var z = verifidForm('LoadRecord_OK(\''+eval(DBF_query_key)+'\',\''+method+'\',\''+action+'\')');
 if ( ! z ) {
  UpdateForm = true;
  lockScreen('unlock');
 }
 return z;
}

function LoadRecord_OK(key, method, action) {

 if ( app_UI == 'JQU' ) {

  if ( method == 'post' ) {
    var On = $.post(action, key);

  } else { // get
    var On = $.get(action+encodeURIComponent(' '+key));   // Modificado 05/40/2020
  }
  On.done( LoadRecord_done );

 } else { // JQM
  history_back( 1, true );
  location.replace(action+encodeURIComponent(' '+key));     // Modificado 05/40/2020

 }
}

function LoadRecord_done(data) {
 lockScreen('unlock');
 const el = document.createElement('html'),
     main = document.getElementById('main');

 var x, y, z;

 el.innerHTML = data;
 z = el.querySelector('#main');
 if (z) {
  main.innerHTML = z.innerHTML;
 };
 const JS = el.querySelectorAll('script');
 if(JS.length) {
  Object.keys(JS).forEach(function (i) {
   if ( JS[i].innerHTML )
    eval( JS[i].innerHTML );
  });
 }
 if (z) {
  try { onLoad() } catch(err){};
 } else {
  try {
   if (message)
    alert(message.split('<BR>').join('\n')+'\n\n'+error.split('<BR>').join('\n'))
  } catch(err) {};
 }
 UpdateForm = true;
}

function VerifidLoadRecord(KEY, method, action, key) {
 key = key || KEY;
 if (DBF_null_key != null) {
  null_key = DBF_null_key;

 } else {
  null_key = '';
  try {
   if (!(key.length%2) && '200'.indexOf(key.substr(0,2))+1)
    for (var i = 0; i < key.length; i+=2) { null_key+= key.substr(0,2) };
  } catch(err){ console.error(err) };
 }
 if (key != '' && key != null_key) {
  try {
   DBF_connect_key.value = DBF_connect_key.initValue;
  } catch (err) { console.error(err) };
  return LoadRecord(KEY);//, method, action);

 } else {
  if (DBF_insert_key == false) {
   jQuery_confirm("Alerta!",
    "El " + DBF_name_key + ':' + DBF_connect_key.value + " NO Existe!!, Debe colocar un codigo valido",'','','','', function(){
      DBF_connect_key.value = DBF_connect_key.initValue;
      DBF_connect_key.focus();
      DBF_connect_key.select();
    }
   );
   return false;
  }
 }
}

function history_back(direction, force) {
  history_go( -(NUM( direction ) || 1), force );
}

function history_forward(direction, force) {
  history_go( +(NUM( direction ) || 1), force );
}

function history_go(direction, force) {
  if ( force ) {
    ONBEFOREUNLOAD = false;
    disable_pagecontainerbeforechange = true;
  }
  document.body.dataset.popstate2 = 10;
  history.go( NUM(direction) );
  // setTimeout(function() {
  //   ONBEFOREUNLOAD = true;
  //   disable_pagecontainerbeforechange = false;
  //   delete document.body.dataset.popstate;
  // },100)
}

async function writeDocument(button, preview) {
 if ( jQframeObj[ frame_name ] && jQframeObj[ frame_name ] != '' && ( frame_name == 'checkCredentials' || frame_name.indexOf('_lock') +1 ) ) return false;

 var fn = 'My_writeDocument';
 if ( app_UI == 'JQM' ) fn = CurrentPage.attr( 'id' ).split('^').join('').split('.').join('_') +'_'+ fn;
 try {
  if ( typeof( window[fn] ) === 'function' )
   if ( ! await window[fn](button, preview)  ) return false
   // if ( ! await eval (fn +'(button, preview)')) return false
 } catch(err){}

 return writeDocument_continue(button, preview);
}

function writeDocument_continue(button, preview) {
 if ( preview != '' && preview !='OFF' && ( ! myForm || ! myForm.preview ) ) {
  return print();
 } else {
  return submit_ext(button, preview);
 }
}

function submit_ext(button, preview) {
/* Esta linea fue eliminada ya que al desplegar ventanas con la         *** 10/05/2020 CEMS
 * funcion jQuery_confirm() y pulsar la X para cerrar la ventana
 * mantiene en el URL el ancor pero si pulsa la tecla ESC entonces
 * si elimina el ancor .
 *
 if ( windowFocus.length ) return false;
 */
 if ( ! UpdateForm ) return false;
 if ( window.My_submit && My_submit( button, preview ) != true ) return false;

  if ( IfExistButton() ) {
   switch ( button ) {
    case 'Elimina':
     var CLOSE = ( app_UI == 'JQU' ) ? '$( this ).dialog(\'close\')' : 'history_back()';
     jQuery_confirm("Alerta!",
      "Desea Eliminar el registro?",
      [{ text: "Eliminar", click: function() { eval(CLOSE); submit_true(button, preview); }},
       { text: "Cancelar", click: function() { eval(CLOSE); }}], '','DELETE_SUBMIT_BUTTON'
     );
     return false;

    case 'Nuevo':
     return verifidForm( 'submit_true(\''+button+'\', \''+preview+'\');' );

    default:
     submit_true(button, preview);
   }

  } else {
   submit_local();
  }
  return true;
}

function submit_true(button, preview) {
/*
 if ( ! UpdateForm ) return false;
 *
 * La linea anterior fue eliminada porque esta rutina debe ser invocada desde
 * submit_ext(button, preview), la cual ya incorpora la validacion anterior
 *
 * de otro modo se entiende que no se requiere validar si el submit(..) ya
 * fue enviado a la pagina.
 *
*/
 var x = $( document.querySelector('.ui-popup-active') || document.querySelector('.ui-page-active') );
 if ( x.length) {
  y = x.find('form[name^=myForm]')[0] ||
      x.find('form')[0] ||
      x[0];
 } else {
  y = myForm;
 }
 if ( IfExistButton() && ( button != 'Nuevo' || (y.name||'').indexOf('lock') > -1 ) ) {
  myForm.button.value =
  myForm.button.defaultValue = button;

  if ( myForm.preview ) {
   myForm.preview.value =
   myForm.preview.defaultValue = preview;
  }
  UpdateForm = false;
  lockScreen();
  myForm.submit();
  return true;

 } else {
  submit_local();
  return true;
 }
}

function submit_local() {
 try {
  if ( app_UI == 'JQU' ) {
   // if (myForm && myForm.tagName == 'FORM') {
 var el = document.createElement('html'),
   main = document.getElementById('main'), x, y, z;

 el.innerHTML = $main;
 var z = el.querySelector('#main');
 if (z) {
  main.innerHTML = z.innerHTML;
 };
 var JS = el.querySelectorAll('script');
 if(JS.length) {
  Object.keys(JS).forEach(function (i) {
   if ( JS[i].innerHTML )
    eval(JS[i].innerHTML);
  });
 }
 if (z) {
  try { onLoad() } catch(err){};
 } else {
  try {
   if (message)
    alert(message.split('<BR>').join('\n')+'\n\n'+error.split('<BR>').join('\n'))
  } catch(err) {};
 }
 UpdateForm = true;

    // document.getElementById('main').innerHTML = $main;
    // var JS = document.body.querySelectorAll('script');
    // if(JS) {
    //  Object.keys(JS).forEach(function (i) {
    //   eval(JS[i].innerHTML);
    //  });
    // }
    // document.title = document.oldTitle;
   //  onLoad();
   // }

  } else { // 'JQM'
   if ( ! historyButton ) {
/*
 * Esta rutina siempre debe ir hacia la pagina anterior (ver FA100_11.2.wwm)
 */
     var i = CurrentPage[0].id;

     if ( location.href.indexOf('#&ui-state=dialog') == -1 && typeof subPag == 'object' && subPag[i] && subPag[i].pages && subPag[i].active > 0 ) {
      subPag_Next(-1);

     } else {
      i = $(myForm).serialize();
      if ( myForm.reset ) { myForm.reset() };
      if ( i != $(myForm).serialize() ) {
      //  KEYS_27('close');
      // } else {
       // if (myForm && myForm.tagName == 'FORM') {
        document.getElementById('body_main').innerHTML = '';
        sii_loadPage( location.href, { 'refreshPage': true } );
        // document.getElementById('main').innerHTML = $main;
        // myForm.reset();
        // sii_loadPage ( '#'+ $('[data-role=page]').first()[0].id, {'options':'refreshPage'} );
        // var JS = document.body.querySelectorAll('script');
        // if(JS) {
        //  Object.keys(JS).forEach(function (i) {
        //   eval(JS[i].innerHTML);
        //  });
        // }
        // document.title = document.oldTitle;
        // onLoad();
       // }
      }
     }

   } else {
    historyButton = false;
   }
   disable_pagecontainerbeforechange = false;
  }
 } catch(err) {
  console.error(err);
  // return true;
 }
 return true;
}

function verifidForm(js, silent) {
 var x = $( document.querySelector('.ui-popup-active') || document.querySelector('.ui-page-active') );
 if ( x.length) {
  y = x.find('form[name^=myForm]')[0] ||
      x.find('form')[0] ||
      x[0];
 } else {
  y = myForm;
 }
 if (y == myForm && IfExistForm())//} && myForm.button.value != "Acepta")
  for (var i = 0; i < myForm.length; i++)
   if ( myForm[i].name && ! myForm[i].disabled && verifidElement( myForm[i] ) ) {
    ESCAPE2 = 0;
    console.dir(myForm[i]);
    if ( ! silent && confirm( "Los datos han sido modificados. Es posible que los cambios que implementaste no se puedan guardar." ) )
        break;

    // throw 'funcion Cancelada, no actualiza los datos, se mantienen inalterables';
    return false;
   }

 if ( ! silent ) {
  ESCAPE2 = 1;
  setTimeout( function() { ESCAPE2 = 0 }, 500 );
  try { eval( js ); } catch (err) { console.error(err,js); }
 }
 return true;
}

function verifidElement(e) {
 switch (e.type) {
  case 'radio':
  case 'checkbox':
   return (e.checked != e.defaultChecked);

  case 'select-one':
   return (e && e[e.selectedIndex] && e[e.selectedIndex].value.trim() &&
           e[e.selectedIndex].selected != e[e.selectedIndex].defaultSelected);

  case 'select-multiple':
   for (var z = 0; z<e.length; z++) {
    if (e[z] && e[z].value && e[z].value.trim() && e[z].selected != e[z].defaultSelected)
     return true;
   }
   return false;

  case 'submit':
   return false;

  default:
   return ( e.value != e.defaultValue );
 }
}

function closeWindow(elm, e) {//alert(elm.app_UI)
 var x = elm.windowFocus.length, y, z;
 if ( elm.windowFocus[ x-1 ] == 'popImg' )
  return true;

 if ( elm.app_UI == 'JQU' ) {
  if (x) {
   z = elm.jQframeObj[ elm.windowFocus[ x-1 ] ];
   try { z.dialog( 'close' ) } catch (err) {
    try { z[0].dialog( 'close' ) } catch (err) {
     try { z.close() } catch (err) {
      try { metroDialog.close(z[0].closest('[data-role=dialog]')) } catch (err) {
       console.error(err);
       return false;
   }}}};
   return true;
  };

 } else { // JQM
  z = CurrentPage[0];
  if ( z.querySelector('div[data-role=header]').classList.contains('ui-panel-page-content-open') )
   return true;

  z = CurrentPage[0].id.split('^').join('').split('.').join('_');
  if ( location.href.indexOf('#&ui-state=dialog') == -1 && typeof subPag == 'object' && subPag[z] ) {
   if ( subPag[z].pages && subPag[z].active > 0 ) {
    subPag_Next(-1);
    return true;
   }
  };
  if ( initHref != location.href ) {
   if ( verifidForm('') == true ) {
    history_back(0,1);
   }
   return true
  }
 };
 return false;
}

function fixedElement(e) {
 switch (e.type) {
  case 'radio':
  case 'checkbox':
   return e.defaultChecked = e.checked;

  case 'select-one':
   return e[e.selectedIndex].defaultSelected = e[e.selectedIndex].selected;

  case 'select-multiple':
   for (var z = 0; z<e.length; z++) {
    e[z].defaultSelected = e[z].selected;
   }
   return false;

  case 'submit':
   return false;

  default:
   return e.defaultValue = e.value;
 }
}

// function IfExistButton() { return ( myForm.button && ! myForm.button.disabled && IfExistForm() ) }
function IfExistButton() { return ( myForm.button && ! myForm.button.disabled ) }

// El nombre del formato es el siguiente:
//  name='myFormView'   Formatos de Consulta
//  name='myForm'       Carga de Datos sin bloquear Registros
//  name='lock_myForm'  Carga de Datos bloqueando Registros
function IfExistForm()   { return ( myForm.name   &&   myForm.name.length-myForm.name.toLowerCase().indexOf( 'myform' ) == 6 ) }

function LoadInvent(key, codigo, nombre, update) {
 if ( ! CheckLeaseTime_EXPIRATION() )
  return false;

 if ( codigo == '' ) {
  jQuery_confirm( "Alerta!", "El Inventario NO Existe!" +'<br>'+ "Debe seleccionar un codigo Valido");
 } else {
  $main = '';
  if ( ! update ) { update = 1 };
  lockScreen();
  CallSQL('^INV.www', update, '', key);
 }
}

function LoadCompany(key, codigo, nombre) {
 if ( ! CheckLeaseTime_EXPIRATION() )
  return false;

 if (codigo == '') {
  jQuery_confirm( "Alerta!", "La Compañia NO Existe" +'<br>'+ "Debe colocar un codigo valido");
 } else {
  try { historyMenu.forEach(function(){history_back()});
  } catch (err) { console.error(err) };
  setTimeout(function(){
   lockScreen();
   CallSQL('^CIA.www', 'UpDate', '', key, window.location.href);
  }, 500);
 }
}

function CheckLeaseTime_OK() {
 if (! CheckLeaseTimer ) {
  CheckLeaseTimer = setInterval( 'CheckLeaseTime_OK()', 1000 );
 }
 if ( CheckLeaseTime_EXPIRATION() ) {
  CheckLeaseTime_UNLOCK();
 } else {
  CheckLeaseTime_LOCK();
 }
}

function CheckLeaseTime_EXPIRATION() {
 const date = new Date(),
 lt = ( sii_leaseTimer != '0' ) ? NUM( Cookies('Read', 'sii_leaseTime_' + sii_fid0 ) ) - ( date.getTime() - date.getTimezoneOffset()*60000 ) : 1;

  return ( lt > 0 ) ? lt : false;
}

function CheckLeaseTime_CONTINUE(passwd) {
 Cookies('Write', 'passwd', HTA(CRC(passwd)) );
 CallSQL('^LOGIN.www', 'RefreshLeaseTime');
}

function CheckLeaseTime_LOCK() {
 if ( ! jQframeObj[ frame_name ] || jQframeObj[ frame_name ] == '' ) {
  frame_name = 'checkCredentials';
  AE = document.activeElement;
  if ( app_UI == 'JQU' ) {
   try { $( '#main' )[0].style.display = 'none'; } catch (err) { console.error(err) };
   jQframeObj[ frame_name ] = $('<div id=\"'+frame_name+'\" title=\"Atencion!\" style=\"text-align:center\"><br><br>'+ "el tiempo de conexion a expirado, debe revalidar sus credenciales" +'<p><input style=\"position:absolute;width:0;height:0;border:0;\"><input type=\"password\" name=\"passwd\" size=\"30\" placeholder=\"'+ "Ingrese clave de " + sii_login +'\" style=\"text-align:center\" readonly><input style=\"position:absolute;width:0;height:0;border:0;\"></div>'
   ).dialog({
    resizable: true, modal: true, width: 600, height: 200, show: { effect: 'fade', duration: 400 },
    beforeClose: function() { return false; },
    position: { my: 'center top+200', at: 'center top'},
   });
   document.getElementsByName( 'passwd' )[0].focus();
  } else {
   $( ':mobile-pagecontainer' ).pagecontainer( 'getActivePage' )[0].style.display = 'none';
   jQframeObj[ frame_name ] = $('<div data-role=\"popup\" id=\"'+frame_name+'\" data-theme=\"a\" data-overlay-theme=\"b\" data-dismissible=\"false\"><center><div class=\"ui-btn ui-icon-lock ui-btn-icon-right ui-btn-b\" style=\"text-align:left;margin: -1px -1px -1px -1px;\">login</div><div data-role=\"main\" class=\"ui-content\"><h3>'+ "el tiempo de conexion a expirado, debe revalidar sus credenciales" +'<p><input style=\"position:absolute;width:0;height:0;border:0;\" data-role=\"none\"><input type=\"password\" name=\"passwd\" placeholder=\"'+ "Ingrese clave de " + sii_login +'\" style=\"text-align:center\" class=\"ui-corner-all ui-shadow\" readonly><input style=\"position:absolute;width:0;height:0;border:0;\" data-role=\"none\"></h3></center></div></div>'
   ).popup({
     history: false

   }).trigger( 'create' ).popup( 'open' );
  }
  var z = jQframeObj[ frame_name ].find( '[name=passwd]' );
  windowFocus.push(frame_name);
  setTimeout(function() {
   z[0].readOnly=false;
   z[0].focus();
   z[0].select();
   z.on('blur'  , function() { this.focus(); });
   z.on('change', function() { CheckLeaseTime_CONTINUE( this.value ) });
  }, 300);
 }
}

function CheckLeaseTime_UNLOCK() {
 if ( jQframeObj[ frame_name ] && jQframeObj[ frame_name ] != '' && frame_name == 'checkCredentials' ) {
  var e = jQframeObj[ frame_name ];
  e[0].querySelector('input[name=passwd]').onblur='';

  try {
   if ( app_UI == 'JQU' ) {
    $( '#main' )[0].style.display = '';
    e.dialog( 'destroy' );
   } else {
    $( ':mobile-pagecontainer' ).pagecontainer( 'getActivePage' )[0].style.display = '';
    e.popup( 'destroy' );
   }
  } catch (err) { console.error(err) };
  try {
   e.remove();  // for metro style
  } catch (err) { console.error(err) };

  AE.focus();
  jQframeObj[ frame_name ] = '';
  windowFocus.splice( windowFocus.indexOf( frame_name ) );

  if ( sii_fid0 != 'IO' ) {
   try {
    var wo = window;
    while ( !wo.START && wo.top.opener ) {
     wo = wo.top.opener;
    }
    if ( !wo.START ) {
     wo.START = [1];
    };
   } catch(err){};
  };
 };
}

function lockScreen(e, timeOut, argv) {
 if ( set_lockScreen ) {
  clearTimeout( set_lockScreen );
  set_lockScreen = '';
 }
 try {
  if ( e == 'unlock' ) {
   if ( app_UI == 'JQU' ) {
    $( 'body' ).removeClass( 'loading' );
   } else {
    $.mobile.loading( 'hide' );
   };
  } else {
   set_lockScreen = setTimeout( function() {
    set_lockScreen = '';
    if ( app_UI == 'JQU' ) {
     $( 'body' ).addClass( 'loading' );
     if ( argv ) {
       if ( argv.indexOf('<') ) {
         argv = '<h3><br><br><br><br><br><br><br>'+ argv.trim() +'</h3>';
       }
       document.querySelector('.loading_modal').innerHTML = argv;
     };
    } else {
     $.mobile.loading( 'show', argv || {
      // text: '...En proceso',
      // textVisible: true,
      // textonly: false,
      // theme: 'b',
      // html: ''
     })
    };
   }, timeOut || 500 );
  }
 } catch(err){};
}

function serializeForm() {
 originalForm = (myForm && myForm.name == 'myForm') ? $(myForm).serialize() : false;
}

function input_list() {
  var inputlist = $('*[data-role=input-list]').not('.processed'), x, y, z;
  if ( inputlist.length ) {
    inputlist.each(function () {
      var $tbody = $(this);
      $tbody.on({
        mouseover: function (event) { set_tableRow       ('',event);},
            click: function (event) { set_tableRow_click (   event);},
          keydown: function (event) {
            var code = event.currentTarget.getAttribute('data-KEYS_'+event.key) ||
                       event.currentTarget.getAttribute('data-KEYS_Any');
            if (code) {
              try { return eval(code); } catch(err) { console.error(err); }
            }
          }
      }).addClass('processed');
      $tr = $tbody.children();
      if ($tr.length) {
        ($tr[0].parentElement||{}).tableRow = $tr[0];
        delete set_tableRow_input($tr[0]).dataset.focus;
      };
    });
  }
}

function set_tableRow(elm, event) {
  if (event)
    event.preventDefault();

  var e = elm || event.target || event, xtableRow, x, y, z;
  if (e.tagName != 'TR')
    e = e.closest('tr');

  if (elm) {
    xtableRow = (e.parentElement||{}).tableRow;
  } else {
    xtableRow = (e.parentElement||{}).tableRow_Light;
  }
  if (xtableRow)
    set_tableRow_blur(xtableRow, elm, event);

  xtableRow = e;
  if (xtableRow)
    set_tableRow_focus(xtableRow, elm, event);
}
function set_tableRow_blur(e, elm, event) {
  if (elm) {
    e.classList.remove('SELECT');

  } else {
    e.classList.remove('SELECT_Light');
  }
}
function set_tableRow_focus(e, elm, event) {
  var input;
  if (elm) {
    input = set_tableRow_input(e);
    input.focus();

    (e.parentElement||{}).tableRow = e;
    e.classList.add('SELECT');

  } else {
    (e.parentElement||{}).tableRow_Light = e;
    e.classList.add('SELECT_Light');
  }
  return input;
}
function set_tableRow_input(e) {
  var input, x = (e.parentElement||{}).tableRow, y, z;
  if ( x ) {
    input = x.querySelector('input[class=Input_Hidden_For_Focus]');
    if ( input )
      input.style.display = 'none';
  };
  input = e.querySelector('input[class=Input_Hidden_For_Focus]');
  if (!input) {
    input = document.createElement('input');
    input.name = 'inputList' + new Date().getTime();
    input.classList.add('Input_Hidden_For_Focus');
    input.readOnly = true;
    input.addEventListener('keydown', keySelect);
    input.onblur  = function (event) { set_tableRow_blur (input.closest('tr'), 'onFocus', event ) };
    input.onfocus = function (event) { set_tableRow_focus(input.closest('tr'), 'onFocus', event ) };
    x = e.cells[0];
    if ( x ) {
      y = x.querySelector('div');
      if ( y ) x = y;
      x.appendChild(input);
    }
  }
  input.style.left = (((e.closest('div')||{}).scrollLeft||0)+0)+'px';
  input.style.display = 'block';
  input.dataset.focus = true;
  return input;
}
function set_tableRow_click(event) {
  var e = event.target, x, y, z;
  event.preventDefault();
  if (e.tagName != 'TR')
    e = e.closest('tr');

  x = (e.parentElement||{});
  y = x.tableRow;
  z = y.querySelector('input[class=Input_Hidden_For_Focus]')||{'dataset':{}};

  y && z.dataset.focus && y == x.tableRow_Light ? tableRow_Enter(event) : set_tableRow(e, event);
}
function tableRow_Enter(event) {
  var e = event.target;
  if (e.tagName != 'TR')
    e = e.closest('tr');

  set_tableRow(e, event);

  if (e.dataset.onclick != undefined) {
    event.stopPropagation();
    event.preventDefault();
    try {
      eval(e.dataset.onclick);
    } catch(err) {console.error(err,e.dataset.onclick)};
  } else {
    if (event.type != 'click') {
      KEYS_13(1);
    }
  }
  return false;
}
function elementSibling(tableRow, go, lineNum, event) {
  if (event)
    event.preventDefault();

  e = tableRow || event.target;
  if (e.tagName != 'TR')
    e = e.closest('tr');

  tableRow = e;
  while (lineNum-->0 && e != null) {
    if (go == 'next') {
      e = e.nextElementSibling;
    } else if (go == 'previous') {
      e = e.previousElementSibling;
    }
    try {
      if (e.tagName != 'TR' || e.innerText.trim() == '') {
        lineNum++;
      } else {
        tableRow = e;
      }
    } catch(err){}
  };
  try {
    while(go && e.innerText.trim() == '') {
      if (go == 'next') {
        e = e.previousElementSibling;
      } else if (go == 'previous') {
        e = e.nextElementSibling;
      }
    }
  } catch(err){}
  if (e != null && e.innerText.trim() != '')
    tableRow = e;

  set_tableRow(tableRow, event);
}
function keySelect(e) {
  EVENT = e || event;
  e.key = e.key || e.keyIdentifier;
  if (e.key && e.key.indexOf('U+')+1)
    e.key = String.fromCharCode(e.keyCode);

  var code = e.keyCode, tableRow = e.target.closest('tr').parentElement.tableRow;
  if (e.shiftKey) {
    if (code == 38) {
      code = (e.ctrlKey) ? 36 : 33;
    } else if  (code == 40) {
      code = (e.ctrlKey) ? 35 : 34;
    }
  }
  if (typeof window.My_keySelect == 'function' && ! My_keySelect(e))
    return false;

  switch (code) {
    case 33: //'PageUp':
      elementSibling(tableRow,'previous',lineNum, e);
      return false;

    case 34: //'PageDown':
      elementSibling(tableRow,'next',lineNum, e);
      return false;

    case 35: //'End':
      elementSibling(tableRow.parentElement.lastElementChild,'next',0, e);
      return false;

    case 36: //'Home':
      elementSibling(tableRow.parentElement.firstElementChild,'previous',0, e);
      return false;

    case 37: //'ArrowLeft' :
      // tableRow.closest('div').scrollLeft -= (EVENT.shiftKey||e.shiftKey) ? (EVENT.ctrlKey||e.ctrlKey) ? 2 : 9600 : (EVENT.ctrlKey||e.ctrlKey) ? 300 : 100;
      tableRow.closest('div').scrollLeft -= (EVENT.shiftKey||e.shiftKey) ? (EVENT.ctrlKey||e.ctrlKey) ? 9600 : 300 : (EVENT.ctrlKey||e.ctrlKey) ? 100 : 0;
      return false;

    case 38: //'ArrowUp' :
      elementSibling(tableRow,'previous',1, e);
      return false;

    case 39: //'ArrowRight' :
      // tableRow.closest('div').scrollLeft += (EVENT.shiftKey||e.shiftKey) ? (EVENT.ctrlKey||e.ctrlKey) ? 2: 9600 : (EVENT.ctrlKey||e.ctrlKey) ? 300 : 100;
      tableRow.closest('div').scrollLeft += (EVENT.shiftKey||e.shiftKey) ? (EVENT.ctrlKey||e.ctrlKey) ? 9600 : 300 : (EVENT.ctrlKey||e.ctrlKey) ? 100 : 0;
      return false;

    case 40: //'ArrowDown' :
      elementSibling(tableRow,'next',1, e);
      return false;

    case 13: //'Enter':
      var z = tableRow.closest('tbody').dataset.enter;
      if ( e.shiftKey || z>'' && '[OFF|FALSE|0]'.indexOf( z.toUpperCase() )+1 ) return true;
      return tableRow_Enter(e);

    case 32: //'Space Bar':
      return tableRow_Enter(e);


    default:
      return true;

  }
}

/****************************************************************************
                  Funciones de BBx portadas a JavaScript ;))...
*/

/****************************************************************************
Convierte una cadena Hexadecimal a ASCII:

BBx: LET ASCII$ = HTA(string{,ERR=lineref})
JS : var ASCII  = HTA('Hello Word!'); // ASCII = '48656C6C6F20576F726421'
*/
function HTA(s) {
 for ( var s = (s || '') + '', hta = '', z = '', i = 0; i < s.length; i++ )
  z = '0' + s.charCodeAt( i ).toString( 16 ).toUpperCase(),
  hta += z.substr( z.length-2, 2 );
 return hta;
}

/****************************************************************************
Convierte una cadena ASCII a Hexadecimal:

BBx: LET HEX$ = ATH(string{,ERR=lineref})
JS : var HEX  = ATH('48656C6C6F20576F726421'); // HEX = 'Hello Word!'
*/
function ATH(s) {
 for (var s = (s || '') + '', ath = '', i = 0; i<s.length-1; i+=2)
  ath += String.fromCharCode(parseInt(s.substr(i,2),16));
 return ath;
}

/****************************************************************************
Convierte un Decimal a Entero Binario:

BBx: LET STRING$ = BIN(intA,intB{,ERR=lineref})
JS : var string  = BIN(16777215,3); // string = ATH('FFFFFF')
*/
function BIN(s,n) {
 var s = s || 0, n = n || 1, sign = 0, s = parseInt( s );
 if ( s < 0 ) { sign = 255, s = s + 1 };
 for ( var bin = '', i = 0; i < n; i++ )
  x = parseInt(s / 256), bin = String.fromCharCode(s - x * 256 + sign) + bin, s = x;
 return bin;
}

/****************************************************************************
Convierte un Entero Binario a Decimal:

BBx: LET NUMERIC = DEC(string{,ERR=lineref})
JS : var Numeric = DEC(ATH('FFFFFF')); // Numeric = -1
*/
function DEC(s) {
 for ( var s = (s || '') + '', dec = 0, i = 0; i < s.length; i++ )
  dec = dec * 256 + s.charCodeAt( i );
 return ( dec >= 256**i/2 ) ? dec - 256**i : dec;
}

/****************************************************************************
Convierte una cadena alfanumérica a numérica:

BBx: LET NUMERIC = NUM(string{,ERR=lineref})
JS : var Numeric = NUM('1 2  5 0 . 2 3  '); // Numeric = 1250.23

NOTA: La versión en JavaScript es superior a la de BBx ya que permite
      no solo convertir string a numericos sino tambien Formulas!!.

Ejemplo:
JS : var Numeric = NUM( '2+2*(1024)',2);// Numeric = 2050
     var Numeric = NUM('1/3');          // Numeric = 0.3333333333333333
     var Numeric = NUM('2+2');          // Numeric = 4
     var Numeric = NUM('2*4');          // Numeric = 8
     var Numeric = NUM('(2+2)/30*4',1); // Numeric = 0.5
     var Numeric = NUM('(2+2)/30*4',2); // Numeric = 0.53
     var Numeric = NUM('(2+2)/30*4',3); // Numeric = 0.533
     var Numeric = NUM('(2+2)/30*4',4); // Numeric = 0.5333
     var Numeric = NUM('(2+2)/30*4'  ); // Numeric = 0.5333333333333333

Parametros requeridos por la funcion:
s   = cadena a convertir en numérico (o formula a ser resuelta)
dec = precisión decimal (si no es dado entonces usa punto flotante)
*/
function NUM  (s, dec) {
  for (var s = (s || '') + '', num = '', x = 0, c ; x < s.length ; x++) {
    c = s.charAt( x );
    if ( '%&()*+-./0123456789<>?^|'.indexOf( c ) + 1 ) { num += c; }
  }
  while( num.length && '%&()*+-./<>?^|'.indexOf( num.substr(num.length -1) ) +1 ) { num = num.substr(0,num.length -1) };
  if ( isNaN( num ) ) { try { num = eval( num ); } catch (err) { num = 0 } };
  if ( num == '' )  { num = 0; } else { num = parseFloat( num ); }
  if ( dec != undefined ) {
    var e = Math.pow( 10, ( dec > 0 ) ? dec : 0 );
    return parseInt( num * e + Math.sign( num ) * .5 ) / e;
//     return parseInt( num * e + Math.sign( num ) * .55555555555 ) / e;
  } else {
    return num;
  }
}

/****************************************************************************
Genera una suma de chequeo de 2bit basado en el algoritmo CRC (de BBx)

BBx: LET CRC$ = CRC(stringA{,stringB}{,ERR=lineref})
JS : var Crc  = CRC(text,seed);

Ejemplo:
JS:  var Crc  = CRC('Hello Word',''); // Crc = $AD33$
     var Crc  = CRC('Hello Word',ATH('AD33')); // Crc = $CA63$
*/
function CRC(A,B) {
  var crc = Reflect(DEC(B), 16);
  for (var i = 0, Byte, pos; i < A.length; i++) {
    Byte = Reflect(A.charCodeAt(i) & 0xFF,8);
    crc = crc ^ Byte << 8 & 0xFFFF;
    pos = crc >> 8 & 0xFF;
    crc = crc << 8 & 0xFFFF;
    crc = crc ^ crcTable[pos] & 0xFFFF;
  }
  return BIN(Reflect(crc,16) & 0xFFFF,2);
}
function Reflect(val, width) {
  for (var Byte = 0, i = 0; i < width; i++)
    if ( val & 1 << i )
      Byte |= 1 << width - 1 - i & ( 1 << width ) - 1;
  return Byte;
}
for (var crcTable = new Array(256), i = 0; i < 256; i++) {
  for (var Byte = i << 8, bit = 0; bit < 8; bit++) {
    Byte = (Byte & 32768) ? Byte << 1 ^ 32773 : Byte << 1;
  }
  crcTable[i] = (Byte & 0xFFFF);
}

/***************************************************************************
Formatea un numero según una mascara dada

BBx: M$ = STR(1250.99[:'###,##0.00'])        // M$='  1,250.99'
JS : M  = MASK('',1250.99,'###,##0.00',1,1); // M$='  1,250.99'

Parametros requeridos por la funcion:
form   = elemento html <input> donde colocar el resultado
n      = numero a formatear
mask   = mascara ej: (###,###,##0.00) (00/00/0000) (00B00B00)
format = TRUE  = formateado el numero aun si n es igual a 0
         FALSE = NO formateado el numero  si n es igual a 0
xtrim  = TRUE  = NO Elimina Espacios en los Extremos
         FALSE = Elimina Espacios en los Extremos
*/
function MASK(form, n, mask, format, xtrim) {
  var dec = point = number = x = y = z = x1 = x2 = s = 0, XMASK = '';
  x1 = mask.indexOf( '.' ) + 1;
  if ( x1 ) {
    dec = mask.length - x1;
    for ( x = x1; x < mask.length; x++ ) {
      if ( '#0'.indexOf( mask.charAt( x ) ) == -1 )
        dec--;
    };
  };
  number = NUM( n, dec ), n = number + '';
  if ( number < 0 ) { n = n.substr(1) };
  x2 = n.indexOf( '.' ) + 1;
  if ( x2 ) {
    point = n.length - x2;
  } else if ( dec ) {
     n += '.', x2 = n.length;
  };
  if ( dec > point ) {
    if ( ! x2 ) { n += '.' };
    for ( x = point; x < dec; x++ ) {
      n += '0';
    };
  };
  if ( format == true || number ) {
    x = ( x2 ) ? x2 - 1 : n.length, y = ( x1 ) ? x1 - 1 : mask.length;
    while ( x < n.length || y < mask.length ) {
      while ( y < mask.length && ( ! ( '#0.'.indexOf( z = mask.charAt( y ) ) + 1 ) || x >= n.length ) ) {
        if ( z == 'B' || z == '#' || ( '-()CR'.indexOf( z ) + 1 && number >= 0 ) ) { z = ' ' };
        XMASK = XMASK + z;

        y++;
      }
      if ( x < n.length ) {
        if ( mask.charAt( y ) == '#' && '0000000000000000'.indexOf( n.substr( x ) ) + 1 ) {
          XMASK = XMASK + ' ' } else { XMASK = XMASK + n.charAt( x ) };

        x++;
      };
      y++;
    };
    x = ( x2 ) ? x2 - 2 : n.length - 1, y = ( x1 ) ? x1 - 2 : mask.length - 1;
    while ( x >= 0 || y >= 0 ) {
      while ( y >= 0 && ( ! ( '#0.'.indexOf( z = mask.charAt( y ) ) + 1 ) || x < 0 ) ) {
        if ( z == 'B' || z == '#' || ( '-()CR'.indexOf( z ) + 1 && number >= 0 ) || ( x < 0 && z == ',' ) ) { z = ' ' };
        if ( z == '-' || z == '(' ) { for ( s = 0; XMASK.substr(s,1) == ' '; s++) {} } else { s = 0 };
        XMASK = XMASK.substr( 0 , s ) + z + XMASK.substr( s );

        y--;
      }
      if ( x >= 0 ) {
        if ( mask.charAt( y ) == '#' && '0000000000000000'.indexOf( n.substr( 0 , x + 1 ) ) + 1 ) {
          XMASK = ' ' + XMASK } else { XMASK = n.charAt( x ) + XMASK };

        x--;
      };
      y--;
    };
  };
  if ( xtrim != true )
    XMASK = XMASK.trim();

  if ( form ) {
   form.value = XMASK;
   if ( number < 0 ) {
    if ( form.backup_color == undefined )
     form.backup_color = form.style.color;

    form.style.color = 'red';
   } else {
    if ( form.backup_color != undefined ) {
     form.style.color = form.backup_color;
     form.backup_color = undefined;
    } else {
     form.style.color = '';
    }
   }
  }
  return XMASK;
}

/* Fin de las Funciones BBx
 */

function CallHELP(title, Index, Link) {
 title = title || 'Ayuda de SINFONIX 2000 ' + sii_name;
 Index = Index || '/html/sinfonix_help/' + sii_system2 + 'index.htm';
 Link  = Link  || sii_helpLink || '/html/sinfonix_help/' + sii_system2 + 'logo.hlp.htm';

 var w = window.open( '', 'Help', 'screenX=150, screenY=50, width=650, height=450, resizable' );

 w.document.open();
 w.document.write('<html>');
 w.document.write('<head>');
 w.document.write('<title>'+title+'</title>');
 w.document.write('</head>');
 w.document.write('<frameset rows=\"32,100%\" frameborder=\"YES\" border=\"0\">');
 w.document.write('  <frame name=\"MenuBar\" src=\"/html/menubarHelp.htm\"');
 w.document.write('         marginwidth=\"0\" frameborder=\"0\" scrolling=\"NO\">');
 w.document.write('<frameset cols=\"205,*\">');
 w.document.write('  <frame name=\"Index\" src=\"'+Index+'\"');
 w.document.write('         marginwidth=\"2\" frameborder=\"10\"  scrolling=\"YES\">');
 w.document.write('  <frame name=\"Link\" src=\"'+Link+'\"');
 w.document.write('         marginwidth=\"10\" frameborder=\"10\" scrolling=\"YES\">');
 w.document.write('</frameset>');
 w.document.write('    <noframes>');
 w.document.write('    <body bgcolor=\"#FFFFFF\">');
 w.document.write('    <p>'+ "Lo siento, tu navegador NO tiene la capacidad de visualizar frames." +'</p>');
 w.document.write('    </body>');
 w.document.write('    </noframes>');
 w.document.write('</frameset>');
 w.document.write('</html>');
 w.focus();
}

function Cookies(action, name, value, days, expires) {
 switch (action) {
  case 'Read':
   var myCookies = '; '+document.cookie+'; ',
       myCookie  = '',
       Index     = myCookies.indexOf('; '+name+'=')+name.length+3;

   if (Index >= name.length+3)
    myCookie = myCookies.substring(Index,myCookies.indexOf('; ',Index));

   return decodeURIComponent(myCookie);

  case 'Write':
   var myCookie = name+'='+encodeURIComponent( value );
   if ( days && ! expires ) {
    var expires = new Date();
    expires.setTime( expires.getTime() + ( 1000 * 60 * 60 * 24 * days ) );
   }
   if ( expires )
    myCookie += '; expires=' + expires.toGMTString();

   document.cookie = myCookie + '; SameSite=Lax; path=/;';
   return decodeURIComponent( myCookie );

  case 'Remove':
   var myCookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
   document.cookie = myCookie + '; SameSite=Lax; path=/;';
   return decodeURIComponent( myCookie );

  default:
   var
    massage  ='use: Cookies(action, name[, value[, days[, expires]]])\n';
    massage +='     where: action is \"Read\", \"Write\", \"Remove\"\n';
    massage +='            name is Name of Cookies\n';
    massage +='            value is data to Write\n';
    massage +='            days is number of days to expires a Cookies.\n';
    massage +='          & expires is date to expires a Cookies.\n';
    console.info( massage );
 }
}

function photo(source, description) {
 console.info('Correjir programa para usar photoZoom');
 photoZoom(source, description);
}

function photoZoom(source, description) {
 var   photo  = $( '#'+source )[0],
     jQphoto  = $( '#'+source ).clone(),
   editPhoto  = jQphoto.data('file');
 description += "Haz clic en la imagen para ";

 if ( editPhoto ) {
  description += "Cambiarla";
 } else {
  description += "Cerrarla";
 }
 jQphoto.attr( 'onclick', 'return' );
 jQphoto.dialog({
  title: description,
  height: photo.naturalHeight,
  width:  photo.naturalWidth,
  modal: true,
  show: { effect: 'fade', duration: 400 },
  position: { my: 'center top', at: 'center top' },
 }).on( 'click', function() {
  if ( editPhoto ) {
   $( editPhoto ).click();
  }
  $( this ).dialog( 'destroy' );
 })
}

function photoChange(source,event) {
 var file = event.target,
  $source = $(source);

 if ( event == 'DELETE' || file.id.indexOf('_delete')+1 ) {
  $source.fadeIn( 'fast' ).attr( 'src', $source.data( 'defaulticon' ) || iconGeneric );
  $( '#' + file.id.split( '_delete' )[0] ).val( '' );

 } else {

  switch ( file.files[0].type ) {
   case 'application/pdf':
    $source.fadeIn( 'fast' ).attr( 'src', '/images/file-pdf.png' );
    break;

   case 'application/vnd.ms-excel':
   case 'application/vnd.oasis.opendocument.spreadsheet':
   case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    $source.fadeIn( 'fast' ).attr( 'src', '/images/file-xls.png' );
    break;

   case 'application/msword':
    $source.fadeIn( 'fast' ).attr( 'src', '/images/file-doc.png' );
    break;

   case 'application/zip':
   case 'application/x-rar':
    $source.fadeIn( 'fast' ).attr( 'src', '/images/file-zip.png' );
    break;

   case 'text/csv':
   case 'text/plain':
   case 'text/html':
    $source.fadeIn( 'fast' ).attr( 'src', '/images/file-txt.png' );
    break;

   case 'audio/mp3':
    $source.fadeIn( 'fast' ).attr( 'src', '/images/file-mp3.png' );
    break;

   default:
    if ( file.files[0].type.indexOf( 'image' ) + 1 ) {
     var reader = new FileReader();
     reader.onload = function( event ) {
      if ( $source[0].saveSrc == undefined )
       $source[0].saveSrc = $source[0].src;

      if ( event.target.result )
        $source.fadeIn( 'fast' ).attr( 'src', event.target.result );

      $('#'+file.id+'_delete').val('');
     };
     try {
      reader.readAsDataURL( file.files[0] );
     } catch (err) {
      console.error(err);
      $source.fadeIn( 'fast' ).attr( 'src', $source[0].saveSrc );
     };
    } else {
     $source.fadeIn( 'fast' ).attr( 'src', '/images/file-unknown.png' );
    }
  }
 }
}

function selectList(select, value, opts, DEFAULT, db) {
 if ( typeof db == 'object' && select && select.db == undefined ) optionAdd(select, db)
 if ( select == undefined ) return
 var SELECT = {}, OPTS = {}, flag = count = v = o = 0, i, x, y, z;
 for (i in value) {
  x=''+ value[i]; if (x) { SELECT[HTA(x.trim())]='ok', v++; }
 }
 for (i in opts) {
  x=''+ opts [i]; if (x) {   OPTS[HTA(x.trim())]='ok', o++; }
 }
 for (i = 0; i < select.length; i++) {
  if ( ! o || select.options[i].value in OPTS || HTA(select.options[i].value) in OPTS ) {
   select.options[i].disabled = '';
   select.options[i].style.display = '';
   count++;
   if ( select.options[i].value in SELECT || HTA(select.options[i].value) in SELECT ) {
    select.options[i].selected = true, flag = i;
   } else {
    if ( ! flag && ! v && select.options[i].selected == true && db != true) {
     flag = i;
    } else {
     select.options[i].selected = false;
    }
   }
  } else {
   select.options[i].disabled = 'true';
   select.options[i].style.display = 'none';
   select.options[i].selected = false;
  }
 }
 if ( select.selectedIndex == -1 )
   select.selectedIndex = 0;

 if ( DEFAULT == true ) {
  select.options[flag].defaultSelected = select.options[flag].selected;
  select.initValue = select.selectedIndex;
 }

 if ( app_UI == 'JQM' )
  try { $( select ).selectmenu( 'refresh', true ) } catch (err) {};

 return flag;
}

function optionAdd(select, db) {
 select.db = 'ok';

 var html = select.innerHTML, i, x, y, z;

 for (i in db) {
  var key = db[i].key || i;
  if ( ! ( html.indexOf( 'value=\"' + key + '\"' ) + 1 ) ) {
   var option = document.createElement( 'option' );
   option.value     = key;
   option.innerHTML = db[i].label;
   select.add(option);
  }
 }
}

function PressEnter(e, ShiftKey) {
  var evt = EVENT || event,
isANDROID = navigator.userAgent.toUpperCase().indexOf('ANDROID')+1;

 // if ( e.initValue ) {
 //  if (e.type.toLowerCase().indexOf('select')+1) {
 //   var z = e.selectedIndex;
 //  } else {
 //   var z = e.value;
 //  }
 //  if ( z != e.initValue ) {
 //   return true;
 //  }
 // }
  if ( evt.type == 'keydown' || ( isANDROID && evt.type == 'keyup' ) ) {
    var se = ( ! typeof( window.event ) ) ? evt.srcElement : evt.target || event.target,
   saveKey = ( document.all ) ? evt.keyCode : evt.which,
  ShiftKey = ShiftKey || ! evt.shiftKey;

    // if ( ShiftKey && ( saveKey == 13 || ( isANDROID && saveKey == 229 ) ) && se.name == e.name )
    if ( ShiftKey && ( saveKey == 13 || isANDROID ) && e && se.name == e.name )
      return true;
  }
  return false;
}

/**
 *
 * Manejo de Eventos Focus & Blur
 * de Elementos Agrupados por Clase
 *
 */

focusElement = '';
 blurElement = '';

function select_activeElement() {
 focusElement = document.activeElement;
}

function JS(e,evt,CLASS) {
 if ( evt == 'focus' && blurElement )
  if ( ! e || selectClass( blurElement, CLASS ) != selectClass( e, CLASS ) )
   JS( blurElement, 'blur', CLASS );

 blurElement = '';
 if ( ! e ) return;

 if ( evt == 'focus' ) {
  Elm = focusElement;
 } else {
  Elm = document.activeElement;
 }
 if ( selectClass( Elm, CLASS ) != selectClass( e, CLASS ) ) {
  try { js = eval( 'document.getElementById( \'' + selectClass( e, CLASS ) + '\' ).on' + evt ) + ''; }
  catch (err) { console.error(err) };
  z  = js.indexOf( '{\n' );
  if ( z + 1 ) {
   js = js.substr( z + 2 )
   z = js.indexOf( '\n}' );
   if ( z + 1 ) {
    js = js.substr( 0, z )
   }
  }
  z = js.toLowerCase().indexOf( 'javascript:' );
  if ( z + 1 ) {
   js = js.substr( z + 11 );
  }
  try { return eval( js ) } catch (err) { console.error(err); return };
 }
}

function selectClass(e,CLASS) {
 z=e.className+' ';
 x=z.indexOf( CLASS );
 if ( x + 1 ) {
  return z.substr( x, z.indexOf( ' ' ) );
 } else {
  return '';
 }
}

function progressBar(message, escapeClose, clickClose, showClose) {
 message = message || "En proceso...";
 var frame = $( '<div id=\"modalProgressBar\"><div id=\"message\" style=\"color:black\">' + message + '</div><br><br><svg id=\"progressbar\"></svg></div>' );

 frame.modal({
  'escapeClose': escapeClose,
   'clickClose': clickClose,
    'showClose': showClose
 });

 var progress = frame.find( '#progressbar' ).Progress({

  // width & height of the progress bar
  width: frame.width(),
  height: 40,

  // percent value
//  percent: 0,

  // background color of the progress bar
//  backgroundColor: '#555',

  // fill color of the progress bar
  barColor: '#5E9DE6',

  // text color
//  fontColor: '#fff',

  // border radius
//  radius: 4,

  // font size
//  fontSize: 12,

  // animation options
//  increaseTime: 60.00/60.00,
//  increaseSpeed: 1,
  animate: false

 });

 return { 'frame':frame, 'progress':progress };
}

function progressBar_close(win) {
 clearTimeout( win.close_progress_bar );
 window.document.removeEventListener( 'click', win.pbar.close_progress_bar, { once: true } );
 window.document.removeEventListener( 'keydown', win.pbar.close_progress_bar, { once: true } );
 win.close_progress_bar = false,
 $.modal.close();
 win.pbar = '';
}

function CallSQLTBL(evar, Item, CallBack, cmd, system) {
  Cookies('Write', 'appMode', sii_appMode);
  if ( typeof(Item) == 'object' ) {
    Item = (Item.options) ? ATH((Item.options[Item.selectedIndex]||'').value) : Item.value;
  };
  CallBack = CallBack || 'LoadTBL';
       cmd = cmd      || 'record';
    system = system   || evar.substr(0,2);
      EVAR = evar;

  CallSQL('^TBLM.sql ' + EVAR, cmd, Item, system+'?? '+EVAR+' '+CallBack, 'record');
}

function LoadTBL(record) {
  eval(EVAR + ' = ATH(record)');
}

function send_eMail() {
  if (jQframeObj[ frame_name ] && jQframeObj[ frame_name ] != '' && sql != '^LOGIN.www') return
  if (!sii_To      .toUpperCase().indexOf('$PRN_')) sii_To      ='';
  if (!sii_Cc      .toUpperCase().indexOf('$PRN_')) sii_Cc      ='';
  if (!sii_Bcc     .toUpperCase().indexOf('$PRN_')) sii_Bcc     ='';
  if (!sii_Subject .toUpperCase().indexOf('$PRN_')) sii_Subject ='';
  if (!sii_Message .toUpperCase().indexOf('$PRN_')) sii_Message ='';
  if (!sii_Flag    .toUpperCase().indexOf('$PRN_')) sii_Flag    ='';

  var Search = '\n  sii_leaseTimer    = \'',
    sii_Html = document.body.parentNode.innerHTML.split(Search),
   sii_Title = document.title,
        sqln = 'SENDMAIL',
       title = "Envio de Correo Electronico",
     airMode = ( navigator.userAgent.toUpperCase().indexOf('ANDROID')+1 ) ? true : false,
 TdStyleEdit = '',
       WIDTH = 635,
      HEIGHT = 405;

  if ( airMode ) {
    TdStyleEdit = 'border: 1px solid #a0a0a0;';
    WIDTH = 300;
  }
  for (i in sii_Html) { if (i!=0) { sii_Html[i] = '0\'; //' + sii_Html[i]; } }

  sii_Html = sii_Html.join(Search).split('page-break-before:always;').join('');

  if (sii_Flag.toUpperCase().indexOf('CONVERT=')==-1)
    sii_Flag+=' Convert=.PDF ';

  if (jQframeObj[ sqln ]) {
    jQframeObj[ sqln ].dialog('open');
  } else {
    jQframeObj[ sqln ] = $(' \
       <div id=\"'+ sqln +'\" title=\"'+ title +'\" style=\"border: 0px; width:'+ WIDTH +'px; height:'+ HEIGHT +'px; overflow: hidden;\"> \
        <form action=\"/cgi-bin/sinfonix.pl?'+ sii_system +' ^EMAIL\" method=\"POST\" enctype=\"multipart/form-data\" name=\"myForm_Mail\" target=\"connect9\"> \
         <table style=\"width=100%;\"> \
          <tr><td style=\"width:'+ ( WIDTH -27 ) +'px\" \
                 ><input name=\"prn_To\"      style=\"width:100%\" value=\"'+ sii_To      +'\" placeholder=\"Para\"   required></td></tr> \
          <tr><td><input name=\"prn_Cc\"      style=\"width:100%\" value=\"'+ sii_Cc      +'\" placeholder=\"Copia\"          ></td></tr> \
          <tr><td><input name=\"prn_Bcc\"     style=\"width:100%\" value=\"'+ sii_Bcc     +'\" placeholder=\"Copia Oculta\"   ></td></tr> \
          <tr><td><input name=\"prn_Subject\" style=\"width:100%\" value=\"'+ sii_Subject +'\" placeholder=\"Asunto\" required></td></tr> \
          <tr><td style=\"'+ TdStyleEdit +'\"\
                 ><div     id=\"prn_editor\"  style=\"width:100%\">'+ ATH(sii_Message) +'</div><br></td></tr> \
          <tr><td><input name=\"prn_Acepta\"  style=\"width:100%\" value=\"E n v i a r   C o r r e o\" type=\"submit\" onclick=\"return send_eMail_continue(event);\"></td></tr> \
         </table> \
         <div style=\"display:none\"> \
          <input type=\"hidden\" name=\"prn_Message\" required> \
          <input type=\"hidden\" name=\"prn_Attachments\"> \
          <input type=\"hidden\" name=\"prn_Flag\"  value=\"'+     sii_Flag   +'\"> \
          <input type=\"hidden\" name=\"prn_Html\"  value=\"'+ HTA(sii_Html)  +'\"> \
          <input type=\"hidden\" name=\"prn_Title\" value=\"'+     sii_Title  +'\"> \
         </div> \
        </form> \
       </div> \
    ').dialog({
        modal: true,
        width: WIDTH-1, //'auto',
        height: HEIGHT+39, //'auto',
        show: { effect: 'fade', duration: 400 },
        create: function(event) {
          $('#prn_editor').summernote({
            placeholder: "Mensaje...",
            width: 608,
            height: 195,
            minHeight: null,
            maxHeight: null,
            dialogsInBody: true,
            airMode: airMode,
            toolbar: [
              // [groupName, [list of button]]
              ['font',      ['fontname','fontsize','color','bold']],
              ['paragraph', ['paragraph','table']],
              ['Insert',    ['picture','video']],
              ['Misc',      ['fullscreen','codeview','help']]

//              ['font',      ['strikethrough', 'superscript', 'subscript']],
//              ['color',     ['color','forecolor','backcolor']],

//              ['Style',     ['fontname','fontsize','bold','italic','underline',
//                             'strikethrough','superscript','subscript','clear' ]],

//              ['Paragraph', ['ol','ul','paragraph','style','height']],
//              ['Insert',    ['picture','link','video','table','hr']],
//              ['Misc',      ['fullscreen','codeview','undo','redo','help']]
            ],
          });
        },
        beforeClose: function(event) {
          event.stopPropagation();
          win = window.frames[this.id];
          windowFocus.splice(windowFocus.indexOf(win.jQname));
        }
    });
  }
  windowFocus.push(sqln);
}

function send_eMail_continue(evt) {
  var el = evt.target,
    form = el.closest('form'),
    expr = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
     msj = document.createElement('div'),
   error = '',
   error2= '',
       z = '';

  msj.innerHTML = form.querySelector('[name=prn_Message]').value = $('#prn_editor').summernote('code');

  z = form.querySelector('[name=prn_To]' ), z.value = email_trim(z.value);
  error += validated_eMail("Para"          ,z.value);

  z = form.querySelector('[name=prn_Cc]' ), z.value = email_trim(z.value);
  error += validated_eMail("Copia"         ,z.value);

  z = form.querySelector('[name=prn_Bcc]'), z.value = email_trim(z.value);
  error += validated_eMail("Copia (Oculta)",z.value);


  if(!form.querySelector('[name=prn_To]'     ).value.trim())
    error2 +="Debe colocar al menos un Email \"Para\" Valido!\n";

  if(!form.querySelector('[name=prn_Subject]').value.trim())
    error2 +="Debe colocar un \"Asunto\" Valido!\n";

  if(!msj.innerText.trim())
    error  +="Debe colocar un \"Mensaje\" Valido!\n";



  if (error) {
      alert(error);
      return false;
  } else
  if(!error2) {
      lockScreen();
  }
  return true;
}

function validated_eMail(to, email) {
  var expr = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
     error = '';

  email = email_trim(email).split(' ');

  email.forEach(function(email) {
    if(email && !expr.test(email))
      error += "Uno de los Email " +'\"'+ to +'\"('+email+')'+ " no es Valido!" +'\n';
  });
  return error;
}

function email_trim(email) {
 return email.split(';').join(' ').split(',').join(' ').replace(/\s\s+/g,' ').trim();
}

function toGraphX(e) {
 toGraphAxis( 'X', e.target, e.target.closest('tr').querySelectorAll('td') );
 return false;
}

function toGraphY(e) {
 toGraphAxis( 'Y', e.target, e.target.closest('table').querySelectorAll('tr > td'+ ( ( e.target.dataset.level ) ? '.level'+ e.target.dataset.level : '' ) +':nth-child('+ ( 1 + e.target.cellIndex ) +')') );
 return false;
};

function toGraphAxis(X_o_Y, e, selector) {
 var tbl = e.closest('table'),
     set = NUM(e.cellIndex) + NUM(e.parentNode.rowIndex) * 1000,
    data = [];

 if ( tbl.dataset.axis != X_o_Y ) toGraphInit(e);

 tbl.dataset.axis = X_o_Y;

 selector.forEach(function(t) {
  if ( t.classList.contains('toGraph') ) {
   t.classList.remove('toGraph');
  } else {
   t.classList.add('toGraph');
   data.push(NUM(t.innerText) || 0);
  }
 });
 if (data.length) {
  toGraphData[set] = {
   label: e.innerText.trim(),
    data: data
  };
  toGraph(e);
 } else {
  delete toGraphData[set];
 }
};

function toGraph(e) {
 clearTimeout(CTRLKEY);
 if (EVENT && EVENT.ctrlKey) {
  CTRLKEY = setTimeout(function() { toGraph(e) },100);
  return false;
 }
 var tbl = e.closest('table'), axis = tbl.dataset.axis;
 if (tbl.querySelectorAll('td.toGraph').length) {
  var Chart = { title:document.querySelectorAll('.toGraphTitle')[0].innerText.trim()+' '+tbl.querySelectorAll('.toGraphTitle.level'+e.dataset.level)[0].innerText.trim(), type:'Bar' };
  var elm = tbl.querySelectorAll('.toGraph'+ ((axis=='X')?'Y':'X') +'.level'+e.dataset.level);
  Chart.labels = []; for (var i=0; i<elm.length; i++) {
   Chart.labels.push(elm[i].innerText.trim())
  };
  Chart.datasets = []; for (var key in toGraphData) {
   Chart.datasets.push(toGraphData[key]);
  };
  CallPGM('^GRAPH.www Chart='+HTA(JSON.stringify(Chart)));
 };
 toGraphInit(e);
}

function toGraphInit(e) {
 e.closest('table').querySelectorAll('td.toGraph').forEach(function(t) {
  t.classList.remove('toGraph');
 });
 toGraphData = {};
}

function DateToString_ES( e, f ) {
  f = f || '';
  var _Date, _Month, _Day, Month_Long, Day_Long,
    day   = [ 'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado' ],
    month = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ];

  _Date = ( e ) ? new Date( e ) : 'Invalid Date';
  if ( _Date != 'Invalid Date' ) {

    Month_Long = f.toUpperCase().split('MONTH_LONG').length>1;
      Day_Long = f.toUpperCase().split('DAY_LONG'  ).length>1;
    Short_Date = f.toUpperCase().split('SHORT_DATE').length>1;
       Numeric = f.toUpperCase().split('NUMERIC'   ).length>1;

    _Month = ( Numeric ) ? MASK('', _Date.getMonth()+1, '00', 1) : month[ _Date.getMonth() ];
    if ( ! Numeric )
      if ( Month_Long ) {
        _Month = 'de ' + _Month + ' del';
      } else {
        _Month = _Month.substr(0,3);
      }

    _Day   = ( Numeric ) ? MASK('', _Date.getDay(), '00', 1) : day[ _Date.getDay() ];
    if ( ! Numeric )
      if ( Day_Long ) {
        _Day = _Day;
      } else {
        _Day = _Day.substr(0,3);
      }
    _Date    = _Date.toString().split(' ');
    _Date[0] = _Day;
    _Date[1] = _Date[2];
    _Date[2] = _Month;

    if ( Short_Date ) {
      var _Time = _Date[4].split(':');
      _Date  = _Date[0]+', '+_Date[1]+' '+_Date[2]+' '+_Date[3]+' a las '+_Time[0]+':'+_Time[1]+':'+_Time[2].split(' ')[0];

    } else {
      _Date  = _Date.join(' ');
    }
  }
  return _Date;
}

/*
 * Rutina para ralentizar la carga de la Pagina ya que en algunos casos como la
 * carga de graficos animados en <canvas> (ver Graphis.js) al momento de
 * convertirlos en formato PDF a traves de chromium, estos quedan a medias, al
 * parecer chromium da por cargada la pagina sin que la animacion del grafico
 * haya terminado ocacionando que el PDF se genere con el grafico a medias.
 *
 * En el caso de la libreria Graphis.js, esto se soluciono colocando
 * options.animation.duration = 0, es decir la animacion dura 0ms.
 *
 * Se deja la rutina para futuros casos que la requieran.
 *
 */

function delayUpLoadPage(ms) {
 if ( location.href.toUpperCase().indexOf('HTTP') != 0) {
  var delay = new Date().getTime() + ms,
   xhttp = new XMLHttpRequest();

  while (new Date().getTime() < delay ) {
   xhttp.open('GET', location.href, true);
   xhttp.send();
  }
 }
}

function sii_required( Function, Script, CallBack ) {
  try {
    if ( Function && typeof( Function ) === 'function' ) {
      sii_required_callBack(CallBack);
    } else {
      throw 'funcion no definida';
    }

  } catch (err) {
    if ( ! './'.includes(Script.substr(0,1)) ) {
      var path = sii_path_htm_name.split('/');
      if ( path.length > 1 )
        path[path.length-1]='', Script = '..' + path.join('/') + Script;
    }
    if ( Script.toUpperCase().indexOf( '.JS' ) != -1 ) {
      var dataType = 'script';
      if ( ! Script.includes( sii_version ) )
        Script += ( ( Script.indexOf( '?' ) != -1 ) ? '%20' : '?' ) + sii_version

    } else {
      var dataType = 'html';
    }
    $.ajax({
      url: Script,
      dataType: dataType,
      cache: true,

    }).always(function( data, textStatus, jqxhr ) {
      switch ( dataType ) {
        case 'html':
          var html = document.createElement('div');
          html.innerHTML = data;
          document.body.appendChild(html.childNodes[1]);
          break;

        default:        // script
          if ( CallBack )
            sii_required_callBack(CallBack);
      }

    });
  }
}

function sii_required_callBack(CallBack) {
  if ( CallBack ) {
    if ( typeof( CallBack ) === 'function' ) {
      CallBack();
    } else {
      eval(CallBack);
    }
  }
}

function STDIO_ready(_STDIO_JavaScript, _STDIO_message, _STDIO_error, _STDIO_Title ) {
  STDIO_JavaScript = _STDIO_JavaScript || '',
  STDIO_message    = _STDIO_message    || '',
  STDIO_error      = _STDIO_error      || '',
  STDIO_Title      = _STDIO_Title      || '';

  STDIO_wp = window_parent;

  var origins = location.ancestorOrigins;
  if ( ! origins ) {
    origins = { 'length': 1 };
    try {
      if ( window.parent[0].top.document )
        // Chrome & Firefox (same domain)
        origins[0] = location.origin;

    } catch(err) {
      // Firefox (different domains CORS policy)
      origins[0] = '*';
    };
  };
  if ( !origins.length || origins[ origins.length -1 ] == location.origin ) {
    STDIO_onLoad();

  } else {
    var message = {
      'action':'eval',
      'value':'STDIO_ready(\''+
        STDIO_JavaScript.split('\'').join('\\\'') +'\', \''+
        STDIO_message   .split('\'').join('\\\'') +'\', \''+
        STDIO_error     .split('\'').join('\\\'') +'\', \''+
        STDIO_Title     .split('\'').join('\\\'') +'\')'
    }
    window.parent.postMessage(message, origins[ origins.length -1 ] );
  }
}

function STDIO_onLoad() {
  console.info('error:',STDIO_error,'\nmessage:',STDIO_message,'\nJavaScript:',STDIO_JavaScript);

  if ( STDIO_wp.DEBUGGER || window.DEBUGGER ) debugger

  try { STDIO_wp.CheckLeaseTime_OK(); } catch (err) {};
  try { STDIO_wp.jQuery.modal.close(); } catch (err) {};
  try { STDIO_wp.lockScreen( 'unlock' ); } catch (err) {};

  if ( window.name == 'connect9' && window.parent.CLOSED == false )
    return

  if (!STDIO_Title)
    if (STDIO_error) { STDIO_Title = "Alerta!" } else { STDIO_Title = "Atención!" };

  if (STDIO_wp.app_UI == 'JQU') { // 'Desktop Version

    if (STDIO_error) {
      UpdateForm_ON();

      alert(STDIO_message.split('<BR>').join('\n')+'\n\n'+STDIO_error.split('<BR>').join('\n'));

      if ( window.name != 'connect9' ) {
        if( $main ) {
          $('#main').html($main);
          onLoad();
          return

        } else if ( window.document.referrer == window_parent.location.href ) {
          setTimeout(function() {
            KEYS_27('close');
          }, 500);
        };

      };
      goBack(-1);

    } else {
      if ( STDIO_message && window.name != 'connect9' )
        alert(STDIO_message.split('<BR>').join('\n'));

      STDIO_execute();

      if ( window.name == 'connect9' )
        setTimeout(function() {
          goBack(-1);
        }, 0)//500);
    }

  } else { // 'JQM Version

    if (STDIO_error) {
      UpdateForm_ON();

//    try {
//      STDIO_wp.jQuery_confirm(STDIO_Title, STDIO_message+'<H6>'+STDIO_error+'</H6>', '', '', '', '', function(){goBack(-2)});
//    } catch (err) {
        alert(STDIO_message.split('<BR>').join('\n')+'\n\n'+STDIO_error.split('<BR>').join('\n'));
//    }

      // if ( window.name == 'connect9' ) {
        goBack(-1);
      // } else {
      //   var state = {
      //       hash: '',
      //       role: '',
      //      title: document.title,
      //        url: location.href
      //   }
      //   history.pushState( state, state.title, state.url );
      //   restore_VALUE(-1)
      //   throw new Error("funcion Cancelada, no actualiza los datos, se mantienen inalterables");
      // }

    } else {
      if ( STDIO_message ) {
        try {
          STDIO_wp.jQuery_confirm(STDIO_Title, STDIO_message, '', '', '', '', function(){STDIO_execute();});
        } catch (err) {
          alert(STDIO_message.split('<BR>').join('\n'));
          STDIO_execute();
        }
      } else {
        STDIO_execute();
      }
    }
  }
}

function STDIO_execute() {
  UpdateForm_ON();
  // try {
  //   STDIO_wp.fixedForm(); /* Eliminado probando el programa FA110m 12/11/2024 */
  // } catch (err) {console.error(err)};
  try {
    eval( STDIO_JavaScript );
  } catch (err) {console.error(err,STDIO_JavaScript)};
}

function goBack(e) {
 e = ( e < 0  ) ? e : ( !e ) ? -2 : e;

/*
 * modificado el 18/10/2023 para ^SMS.wwm, en la pagina SMS_Config se llega desde 2 puntos diferentes
 * por lo que cuando se envia el formulario debe retroceder goBack() 2 paginas (desde el Asistente) y
 * 1 pagina (desde Configuracion)
 */
 if ( e < 0 && window.name != 'connect9' )
   e--;

 if ( e < 0 && STDIO_wp.disable_pagecontainerbeforechange )
   e++;

 try { STDIO_wp.restore_VALUE( e ) }
 catch (err) {  restore_VALUE( e ) };

 if ( window.name == 'connect9' ) {    // modificado el 18/10/2023 ( ver nota arriba )
   history_go(-1);
 }
}

function restore_VALUE(e) {
  setTimeout(function() {
    ONBEFOREUNLOAD = false;
    disable_pagecontainerbeforechange = true;
    setTimeout(function() {
      try { lockScreen( 'unlock' ); } catch (err) {}
      ONBEFOREUNLOAD  = true;
      disable_pagecontainerbeforechange = false;
      UpdateForm = true;
    },500);
    if ((e+1)<0) {
      history_go(e+1);

    } else {
      try {
        if (e !== 0)
          eval(e);

      } catch (err) {console.error(err, e)};
    };
  },100);
}

function UpdateForm_ON() {
  if ( STDIO_wp.STDIO_UpdateForm )
    clearTimeout( STDIO_wp.STDIO_UpdateForm );

  // STDIO_wp.ONBEFOREUNLOAD = false;
  // STDIO_wp.disable_pagecontainerbeforechange = true;

  STDIO_wp.STDIO_UpdateForm = STDIO_wp.setTimeout(function() {
    STDIO_wp.ONBEFOREUNLOAD = true;
    STDIO_wp.disable_pagecontainerbeforechange = false;
    STDIO_wp.UpdateForm = true;
  },500);
}

// function fixedForm(js) {
//   for (var i = 0; i < myForm.length; i++)
//    if ( myForm[i].name && ! myForm[i].disabled ) {
//      fixedElement( myForm[i] );
//    }
// }

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function GeoLocation() {
  sii_GPS_timestamp  =
  sii_GPS_timestamp2 = new Date().getTime();

  var GPS_options = {
        maximumAge: 10000,
           timeout: 600000,
enableHighAccuracy: true,
  };
  watchID = navigator.geolocation.watchPosition(GPS_success, GPS_error, GPS_options);
}

function GPS_success(GPS) {
  zGPS = {
    coords:{
      accuracy: GPS.coords.accuracy,
      altitude: GPS.coords.altitude,
      altitudeA:GPS.coords.altitudeAccuracy,
      heading:  GPS.coords.heading,
      latitude: GPS.coords.latitude,
      longitude:GPS.coords.longitude,
      speed:    GPS.coords.speed
    },
    timestamp:  GPS.timestamp,
    timestampUp:GPS.timestamp,
  };
  localStorage.setItem('GPS',JSON.stringify(zGPS));

  if ( typeof ol == 'undefined' ) return

  console.info('GPS',GPS)
  var sii_GPS = JSON.parse(localStorage.getItem('sii_GPS'))||[];

  if ( ! sii_GPS.length ) {
    sii_GPS.push(zGPS);
    localStorage.setItem('sii_GPS',JSON.stringify(sii_GPS));
    GPS_update( zGPS );
    return
  }

  var LngLat1 = ol.proj.transform([sii_GPS[0].coords.longitude,
    sii_GPS[0].coords.latitude], 'EPSG:4326', 'EPSG:3857');

  var LngLat2 = ol.proj.transform([zGPS.coords.longitude,
    zGPS.coords.latitude], 'EPSG:4326', 'EPSG:3857');

  var line = new ol.geom.LineString( [ LngLat1, LngLat2 ] ),
    Mts = Math.round(line.getLength() * 100) / 100;

  if ( Mts < 25 ) {
    sii_GPS[0].timestampUp = zGPS.timestampUp;
    sii_GPS = [ sii_GPS[0] ];
  } else {
    sii_GPS.push(zGPS);
  }
  localStorage.setItem('sii_GPS',JSON.stringify(sii_GPS));

  console.info(Mts, zGPS.timestamp - sii_GPS_timestamp);

  if ( zGPS.timestamp - sii_GPS_timestamp > 180000 ) {
    var z = sii_GPS[0];
    if ( sii_GPS.length > 1 ) {
      sii_GPS.splice(0,1);
      localStorage.setItem('sii_GPS',JSON.stringify(sii_GPS));
      sii_GPS_timestamp = sii_GPS[0].timestamp;
    } else {
      sii_GPS_timestamp = zGPS.timestamp;
    }
    GPS_update( z );
  }
}

function GPS_error(error) {
     console.error(error);

}

/*
 * Actualiza la Base de Datos Local (temporal) sii_GPS_DB2
 */
function GPS_update( GPS ) {
  var sii_GPS_DB2 = JSON.parse(localStorage.getItem('sii_GPS_DB2'))||[];
  var sii_GPS_DB  = JSON.parse(localStorage.getItem('sii_GPS_DB' ))||[];
  var x, y, z;

  x = sii_GPS_DB2.length - 1;
  if ( x > -1 &&
  sii_GPS_DB2[x].coords.longitude == GPS.coords.longitude &&
  sii_GPS_DB2[x].coords.latitude  == GPS.coords.latitude ) {

    sii_GPS_DB2[x] = GPS;

  } else {
    sii_GPS_DB2.push(GPS);
  }
  localStorage.setItem('sii_GPS_DB2',JSON.stringify(sii_GPS_DB2));

  if ( sii_GPS_DB.length && sii_GPS_DB2[sii_GPS_DB2.length - 1].timestamp - sii_GPS_timestamp2 < 600000 )
    return

  sii_GPS_timestamp2 = sii_GPS_DB2[sii_GPS_DB2.length - 1].timestamp;

  GPS_update_Remote();
}
/*
 * Actualiza la Base de Datos Remota (Servidor)
 */
function GPS_update_Remote() {
  var sii_GPS_DB2 = JSON.parse(localStorage.getItem('sii_GPS_DB2'))||[],
      sii_GPS_DB  = JSON.parse(localStorage.getItem('sii_GPS_DB' ))||[],
     subscription = Cookies('Read','pushMsg')||'', x, y, z;

  var form = setForm('subscription', subscription),
   len = sii_GPS_DB2.length;

//  if ( len > 1 ) { len -= 1; }
  for ( x = 0; x < len; x++ ) {
    form+=setForm(   'accuracy'+x,sii_GPS_DB2[x].coords.accuracy);
    form+=setForm(   'altitude'+x,sii_GPS_DB2[x].coords.altitude);
    form+=setForm(  'altitudeA'+x,sii_GPS_DB2[x].coords.altitudeA);
    form+=setForm(    'heading'+x,sii_GPS_DB2[x].coords.heading);
    form+=setForm(   'latitude'+x,sii_GPS_DB2[x].coords.latitude);
    form+=setForm(  'longitude'+x,sii_GPS_DB2[x].coords.longitude);
    form+=setForm(      'speed'+x,sii_GPS_DB2[x].coords.speed);
    form+=setForm(  'timestamp'+x,sii_GPS_DB2[x].timestamp);
    form+=setForm('timestampUp'+x,sii_GPS_DB2[x].timestampUp);
  };

  fetch('/cgi-bin/sinfonix_sql.pl?^SW.www GeoLocation', {
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencode',
      'Content-length': form.length
    },
    body: form

  }).then(function() {
/*
 * Si todo bien,
 * Actualiza la Base de Datos Local (definitiva) sii_GPS_DB
 */
    x = sii_GPS_DB.length - 1, y = 0;
    if ( x > -1 &&
    sii_GPS_DB[x].coords.longitude == sii_GPS_DB2[0].coords.longitude &&
    sii_GPS_DB[x].coords.latitude  == sii_GPS_DB2[0].coords.latitude ) {

      sii_GPS_DB.splice(x);
//      sii_GPS_DB[x] = sii_GPS_DB2[0], y=1;
//      if ( sii_GPS_DB2.length > 1 )
//        sii_GPS_DB2.splice(0,1);
    }
    while ( ! sii_GPS_DB.length || sii_GPS_DB2.length > 1 ) {
      sii_GPS_DB.push(sii_GPS_DB2[y]);
      if ( sii_GPS_DB2.length > 1 )
        sii_GPS_DB2.splice(0,1);
    };
    localStorage.setItem('sii_GPS_DB2',JSON.stringify(sii_GPS_DB2));

    var upTime = new Date().getTime() - 5184000000; // 61 Dias
    while ( sii_GPS_DB.length > 3000 || sii_GPS_DB[0].timestamp < upTime ) {
      sii_GPS_DB.splice(0,1);
    }
    localStorage.setItem('sii_GPS_DB',JSON.stringify(sii_GPS_DB));
  });
};

function setForm(i,v) {return i+'='+escape(v||'')+'&';};

function Haversine(coord1,coord2){
  const lat1 = coord1[1], lon1 = coord1[0];
  const lat2 = coord2[1], lon2 = coord2[0];

  const R = 6371e3; // metres

  const o1 = lat1 * Math.PI/180; // o, a in radians
  const o2 = lat2 * Math.PI/180;

  const Ao = (lat2-lat1) * Math.PI/180;
  const Aa = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Ao/2) * Math.sin(Ao/2) +
            Math.sin(Aa/2) * Math.sin(Aa/2) *
            Math.cos(o1) * Math.cos(o2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // in metres
}

function coord2tile(coord, zoom) {
  const n   = 2 ** zoom, lat = coord[1] * Math.PI / 180;
  const x   = parseInt((coord[0] + 180) / 360 * n);
//  const y   = parseInt((1 - Math.log(Math.tan((lat/2) +
//                              (Math.PI/4))) / Math.PI) / 2 * n);
  const y   = parseInt((1 - Math.log(Math.tan(lat) +
                     (1 / Math.cos(lat))) / Math.PI) / 2 * n);

  return [x, y];
}

function tile2coord(tile, zoom) {
  const n   = 2 ** zoom;
  const lng = tile[0] / n * 360 - 180;
  const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * tile[1] / n))) /
              Math.PI * 180;

  return [lng, lat];
}
function tooltip_exit(message, time) {
  message = message||"toque de nuevo para salir";
  time = (time == undefined) ? 3000 : NUM(time);
  if ( document.body.dataset.ESCAPE2 )
    clearTimeout( document.body.dataset.ESCAPE2 )

  document.body.dataset.ESCAPE2 = setTimeout(function() {
    tooltip('init', '', message, time);
    delete document.body.dataset.ESCAPE2;
    setTimeout(function(){
      document.body.dataset.popstate = 1;
    },0);
  },200);
}
function tooltip(action, elm, content, time) {
  elm = elm||document.body;

  switch ( action ) {

   case 'init':
    if ( elm.dataset.tooltip ) {
      tooltip('remove', elm);
    }
    elm.dataset.tooltip = 'tooltip'+ new Date().getTime();

    var tip = $( '<div id=\"'+ elm.dataset.tooltip +'\"></div>' ), arrow = '',
     target = $( elm );

    tip.css( 'display', 'none' )
    .addClass( 'tooltip' )
    .html( content ).appendTo( 'body' );

    if ( elm.tagName == 'BODY') {
      tip.css( {'position': 'fixed', 'min-width': $( window ).width() * .75 } );
      var pos_left = ( $( window ).width()  - tip.outerWidth()  ) / 2,
          pos_top  = ( $( window ).height() - tip.outerHeight() - 50), arrow = 'none';

    } else {
      if( $( window ).width() < tip.outerWidth() * 1.5 ) {
        tip.css( 'max-width', $( window ).width() / 2 );
      } else {
        tip.css( 'max-width', 340 );
      }
      var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( tip.outerWidth() / 2 ),
          pos_top  = target.offset().top - tip.outerHeight() - 20;

      if ( pos_left < 0 ) {
        pos_left = target.offset().left + target.outerWidth() / 2 - 20;
        arrow = 'left';
      }
      if ( pos_left + tip.outerWidth() > $( window ).width() ) {
        pos_left = target.offset().left - tip.outerWidth() + target.outerWidth() / 2 + 20;
        arrow = 'right';
      }
      if ( pos_top < 0 ) {
        var pos_top  = target.offset().top + target.outerHeight();
        arrow = 'top';
      }
    }
    tip.addClass( arrow );
    tip.css( { left: pos_left, top: pos_top, display: '', opacity: 0 } ).animate( { top: '+=10', opacity: 1 }, 200 );

    elm.dataset.timeout = ( ! time ) ? -1 : setTimeout(function() {
      tooltip('remove', elm);
    }, time);

    setTimeout(function(){
      elm.addEventListener( 'blur', tooltip_remove, false );
      elm.addEventListener( 'click', tooltip_remove, false );
      elm.addEventListener( 'keydown', tooltip_remove, false );
      elm.addEventListener( 'touchstart', tooltip_remove, false );
    },0)
   break;

   case 'remove':
    if ( ! elm.dataset.timeout ) return
    clearTimeout( elm.dataset.timeout );
    delete elm.dataset.timeout;

    elm.removeEventListener( 'blur', tooltip_remove, false );
    elm.removeEventListener( 'click', tooltip_remove, false );
    elm.removeEventListener( 'keydown', tooltip_remove, false );
    elm.removeEventListener( 'touchstart', tooltip_remove, false );

    tip = $( '#'+ elm.dataset.tooltip );

    tip.animate( { top: '-=10', opacity: 0 }, 50, function() {
      $( this ).remove();
    });
    delete elm.dataset.tooltip;

    if ( elm.dataset.forward ) {
     delete elm.dataset.forward;
     history_forward();
    }
    setTimeout(function() {
     delete elm.dataset.popstate;
    }, 10);
   break;

   default:
  }
};

function tooltip_remove(e) {
  tooltip( 'remove', this );
}

function myForm_readOnly() {
  document.querySelectorAll('select[readonly],input[readonly]').forEach(function(e) {
    e.readOnly = true;
    if ( e.type == 'checkbox' || e.type == 'radio' || e.type.indexOf('select') +1 ) {
      e.addEventListener("keydown", function(e) {
        if ( e.target.readOnly && ! (["Tab","Enter","Escape","F5"].indexOf(e.key) +1) ) {
          e.preventDefault();
        }
      });
      e.addEventListener("click", function(e) {
        if ( e.target.readOnly ) {
          e.preventDefault();
        }
      });
    }
  })
}

function ODef(obj) {
 html = ODef1( obj, '' );
 console.info( html );
 return html;
}

function ODef1(obj,tab) {
 var i = '', html = '';
 for ( i in obj ) {
  if ( obj[ i ] ) {
   if ( typeof( obj[ i ] ) == 'object' ) {
    html += ODef1( obj[ i ], tab + ' ');
   } else {
    html += tab + i + ': ' + obj[i] + '\n';
   }
  }
 }
 return html;
}

function ejemplos_de_cadenas_y_objectos() {

x=[   {code:'01'},  {code:'02'},  {code:'03'} ]; // Arrays
y= {a:{code:'01'},b:{code:'02'},c:{code:'03'}} ; // Object
z=[{a:{code:'01'},b:{code:'02'},c:{code:'03'}},  // Arrays + Object
   {a:{code:'01'},b:{code:'02'},c:{code:'03'}},  // Arrays + Object
   {a:{code:'01'},b:{code:'02'},c:{code:'03'}}]; // Arrays + Object

alert(x[0]     .code+'-'+x[1]     .code+'-'+x[2]     .code); // Arrays
alert(y   ['a'].code+'-'+y   ['b'].code+'-'+y   ['c'].code); // Object
alert(y    .a  .code+'-'+y    .b  .code+'-'+y    .c  .code); // Object
alert(z[0]['a'].code+'-'+z[0]['b'].code+'-'+z[0]['c'].code); // Arrays + Object
alert(z[0] .a  .code+'-'+z[1] .b  .code+'-'+z[2] .c  .code); // Arrays + Object

}
