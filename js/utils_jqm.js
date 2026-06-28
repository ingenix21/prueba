/**
 * utils_jqm.js 1.0 1999/07/17
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

var app_UI = 'JQM',
      YPOS =  0,
    subPag = {}
CurrentPageLoad = '';

$( 'body' ).on({
  pagecontainerchange: onLoad_JQM
});

$( window ).on({
  pagebeforechange: function(event, data) {
    if ( document.body.dataset.popstate3 ) {
      throw new Error("Cancel: data.options.direction");
    }
    if ( typeof data.toPage == 'string' && ( data.options.direction || (data.options.hash||'#').split('#').length <2 ) ) {
     // if ( !document.body.dataset.popstate3 && CurrentPageLoad.split('#').length>1 && sii_pagecontainerbeforechange(event, data) ) {
        if ( $.mobile.navigate.history.stack[$.mobile.navigate.history.activeIndex].remove ) {
          if ( data.options.direction == 'forward' ) {
            history_forward();
          } else {
            history_back();
          };
        };
      // } else {
      //   if ( data.options.fromPage.context ) {
      //     data.toPage='#&ui-state=dialog';
      //     data.state = {
      //         hash: data.toPage,
      //         role: 'dialog',
      //        title: document.title,
      //          url: CurrentPageLoad.split('#')[0] + data.toPage
      //     }
      //   } else {
      //     data.toPage = CurrentPageLoad.split('#')[1]||''; if ( data.toPage ) data.toPage = '#'+ data.toPage;
      //     data.state  = {
      //         hash: data.toPage||'#'+ CurrentPageLoad,
      //         role: '',
      //        title: document.title,
      //          url: CurrentPageLoad.split('#')[0] + data.toPage
      //     }
      //   }
      //   history.pushState( data.state, data.state.title, data.state.url );
      //   throw new Error("Cancel: data.options.direction");
      // };
    // } else if ( typeof data.toPage == 'object' ) {//&& data.options.direction ) {
    //   var i = (CurrentPage[0].id||'').split('^').join('').split('.').join('_'),
    //     src = $( '#'+ i ).find( '.subPag' ), z;
    //
    //   if ( src.length > 1 ) {
    //     if ( typeof subPag[i] == 'undefined' ) subPag[i] = { active: 0 };
    //     subPag[i].src = src;
    //     if ( data.options.direction != 'back' ) subPag[i].active = 0;
    //     z = ( subPag[i].pages ) ? subPag[i].pages[ subPag[i].active ] : subPag[i].active;
    //     subPag[i].src.not( subPag[i].src.eq( z ) ).hide();
    //     subPag[i].src.eq( z ).show();
    //   };
    };
  },
  pagecontainerbeforechange: function(event, data) {
  }
});

document.addEventListener('scroll', function(event) {
  setTimeout(function() {
    if ( CurrentPage[0].id == $('body').pagecontainer('getActivePage')[0].id && YPOS == 0 ) {
      CurrentPage.data( 'YPOS', window.scrollY );
    } else {
      clearTimeout(YPOS);
      YPOS = setTimeout(function() { YPOS = 0; }, 1000);
    }
  }, 500);
});

function onLoad_CONTINUE() {
}

function onLoad_JQM() {
  CheckLeaseTime_OK();

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

  back_CurrentPage = CurrentPage, CurrentPage = $('body');
  try {CurrentPage = CurrentPage.pagecontainer('getActivePage')} catch(err){};

  $.mobile.silentScroll( CurrentPage.data( 'YPOS' ) );

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

  if ( typeof My_onLoad == 'function' ) {
    My_onLoad();
  }
  try { page_My_onLoad  = CurrentPage[0].id.split('^').join('').split('.').join('_')+'_My_onLoad';
  } catch (err) {console.error(err)};
  try {
    if ( typeof(eval(page_My_onLoad)) == 'function')
      onLoad_JQM_CONTINUE();

  } catch (err) {
    var path = sii_path_htm_name.split('/'); path[path.length-1]=''; path = path.join('/');
        path = '..' + path + CurrentPage.attr( 'id' ) +'.js?'+ sii_version;

    $.ajax({
      url: path,
      dataType: 'script',
      cache: true,

    }).always(function( data, textStatus, jqxhr ) {
      if ( textStatus == 'error' )
        page_My_onLoad = 'void(0)//';

      onLoad_JQM_CONTINUE();
    });
  }
}

function onLoad_JQM_CONTINUE() {
  if ( typeof(eval(page_My_onLoad)) == 'function') {
    eval( page_My_onLoad+'()' )
  }
  var i = CurrentPage[0].id.split('^').join('').split('.').join('_'),
    src = $( '#'+ i ).find( '.subPag' ), x, y, z;

  if ( src.length ) {
    if ( !subPag[i] ) {
      subPag[i] = {};
    }
    subPag[i].src    = src;
    subPag[i].active = 0;
    if ( typeof subPag[i].pages == 'undefined' ) {
      for ( subPag[i].pages = [], z = 0; z < src.length; z++ ) { subPag[i].pages.push(z) };
    }
    for ( z = 0; z < src.length; z++ ) {
      if ( src[ z ].style.display != 'none') {
        subPag[i].active = ( subPag[i].pages ) ? subPag[i].pages.indexOf(z) : z;
        break
      }
    }
    z = ( subPag[i].pages ) ? subPag[i].pages[ subPag[i].active ] : subPag[i].active;
    if ( subPag[i].src.eq ( z ).data('title') ) {
      CurrentPage.find( '[data-role=header] h1' ).text( subPag[i].src.eq ( z ).data('title') );
    }
    subPag[i].src.not( subPag[i].src.eq( z ) ).hide();
    subPag[i].src.eq ( z ).show();
    try {
      eval( subPag[i].src.eq( z ).attr( 'id' ).split('^').join('').split('.').join('_')+'_My_onLoad()' )
    } catch (err) {};
  };
  $('[data-type=search]').not('[readonly], [data-ext=false]').each(function(i,e) {
    e.addEventListener( 'focus', function( event ) {
      $( this ).trigger( 'keypress' )
    });
  });
  $('[data-type=search][data-F2]').not('[readonly], [data-ext=false]').each(function(i,e) {
    var x = e.closest('div'), y = document.createElement('a');
    y.style.position = 'absolute';
    y.style.top    = '00px';
    y.style.width  = '20px';
    y.style.height = '31px';
    y.style.zIndex = 1;
    y.style.cursor = 'pointer';
    y.title = e.dataset.f2_title||"haz clic para realizar busquedas avanzadas";
    y.addEventListener( 'click', function( event ) { eval( e.dataset.f2 ) } );
    x.append(y);
  });
  try { CurrentPage.find( '[data-role=navbar]' ).navbar('refresh'); } catch (err) {};
  try {
    CurrentPage.find( '[data-role=header],[data-role=footer]').toolbar({
      tapToggle: false,
      hideDuringFocus: '',
      refresh: true
    });
  } catch (err) {};

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

  if (! (navigator.userAgent.toUpperCase().indexOf('ANDROID')+1) )
    if (NameItemFocus)
      InitInput(NameItemFocus);

  serializeForm();

  setTimeout(function() { UpdateForm = true; }, 500);

  input_list();

  try {
    $('input[type=checkbox][data-disabled]').prop('disabled', true).checkboxradio('refresh');
  } catch (err) {};

  if ( sii_leaseTimer != '0' )
   $('[data-role=header] h1').css('cursor', 'pointer').click(
    function() {
      jQuery_confirm(sii_cia_name,'\
       <table>\
        <tr>\
         <td>Compa&#241;ia</td><td>'+ sii_cia_code +'</td></tr>\
        <tr>\
         <td>Operador</td><td>'+ sii_login +'</td></tr>\
        <tr>\
         <td>Usuario</td><td>'+ sii_fid0 +'</td></tr>\
        <tr>\
         <td>Perfil</td><td>'+ sii_oper +'</td></tr>\
       </table>\
         '
      );
    }
  )
  if ( location.href != CurrentPageLoad ) {
    CurrentPageLoad = location.href;

    $( '[data-role=navbar] [type=button]' ).on({
      focus: function(event, data){
        this.classList.add('ui-btn-active')
      },
       blur: function(event, data){
        this.classList.remove('ui-btn-active')
      }
    });
  }
/*
 * Las rutinas a partir de esta linea se ejecutan solo una vez
 * Cuando se inicializa la pagina por primera vez
 */
  if ( CurrentPage[0].dataset.toggleMenu ) return
    CurrentPage[0].dataset.toggleMenu = true;

  CurrentPage.find('*[class^=toggle-]').hide();
  var toggle = CurrentPage.find('[data-toggle]');
  toggle.find('a')
  .addClass   ('ui-icon-plus')
  .removeClass('ui-icon-carat-r')
  .css('backgroundColor','#ededed');

  toggle.on('click', function() {
    var isPlus = this.querySelectorAll('a')[0]
      .classList.contains('ui-icon-plus')

    CurrentPage.find('*[class^=toggle-]').hide();
    CurrentPage.find('[data-toggle]').find('a')
    .addClass   ('ui-icon-plus')
    .removeClass('ui-icon-minus');

    if( isPlus ) {
      CurrentPage.find('.toggle-'+ this.dataset.toggle).show();
      CurrentPage.find('[data-toggle='+ this.dataset.toggle +']')
      .find('a')
      .addClass   ('ui-icon-minus')
      .removeClass('ui-icon-plus');
    }
    $(this).closest('div[data-role=panel]').trigger('create');
  });
  toggle = CurrentPage.find('[data-toggle].defaultToggle');
  if (!toggle.length) toggle = CurrentPage.find('[data-toggle]:first');
  toggle.click();
  toggle.closest('div[data-role=panel]').trigger('create');

  try {  $('.image').popImg(); } catch (err) {};
}

function My_submit( button, preview ) {
  var f = CurrentPage[0].id.replace(/(\.)/g,'_') + '_My_submit';
  try { if ( typeof eval( f ) != 'function' ) throw '' } catch(err) { return true };
  return eval( f +'(button, preview)' );
}

function jQuery_confirm(title, message, buttons, icon, dialog_name, dismissible, f_CLOSE) {
       title = title       || "Alerta!";
 dialog_name = dialog_name || 'jQuery_confirm_Frame' + new Date().getTime();
     buttons = buttons     || [{ text: "Continua", click: function() { jQframeObj[ dialog_name ].popup ('close')}}];
        icon = icon        || 'delete-red';
 dismissible = dismissible || true;
     f_CLOSE = f_CLOSE     || '';

  if (buttons == 'none')
    buttons = '';

  if ( dismissible == true ) {
    data_icon ='data-icon=\"'+ icon +'\"', data_ancor='';
  } else {
    data_icon ='data-icon=\"false\"'   , data_ancor='_not';
  }

  html  ='<div data-role=\"popup\" id=\"'+ dialog_name +'\" data-theme=\"a\" data-overlay-theme=\"b\" style=\"max-width:600px;\" data-dismissible=\"'+ dismissible +'\">'
  html +=' <ul data-role=\"listview\"><li '+ data_icon +' data-theme=\"b\" style=\"margin: -1px -1px -1px -1px;\"><a'+ data_ancor +' href=\"#\" data-rel=\"back\">'+ title +'</a></li></ul>'
  html +=' <div data-role=\"main\" class=\"ui-content\">'
  html +='  <h3><center>'+ message +'</center></h3>';

  if (buttons) {
    if (buttons.length>1)
      html +='<fieldset class=\"ui-grid-'+String.fromCharCode(95+buttons.length)+'\">'

    for (i=0; i<buttons.length; i++) {
      if (buttons.length>1)
        html +='<div class=\"ui-block-'+String.fromCharCode(97+i)+'\">'

      html +='<input type=\"button\" data-mini=\"true\" data-theme=\"b\" id=\"'+
      HTA(buttons[i].text)+'\" name=\"'+
      HTA(buttons[i].text)+'\" value=\"'+buttons[i].text+'\">'

      if (buttons.length>1)
        html +='</div>'
    }
    if (buttons.length>1)
      html +='</fieldset>'
  }
  html +=' </div>'
  html +='</div>'

  jQframeObj[dialog_name] = $(html).popup ({
    afterclose: function (e) {
      e.stopPropagation();
      windowFocus.splice(windowFocus.indexOf(frame_name));
      UpdateForm = true;
      if ( f_CLOSE ) try { f_CLOSE(e); } catch (err) { console.error(err) };
      try { $( this ).popup ('destroy'); } catch (err) {};
    },
    history: true,
    positionTo:'window',
    transition:'pop'

  }).trigger('create').popup( 'open' );
  if (buttons) {
    for (i=0; i<buttons.length; i++) {
      jQframeObj[dialog_name].find('#'+HTA(buttons[i].text)).on('click',buttons[i].click);
      if(!i)
        jQframeObj[dialog_name].find('#'+HTA(buttons[i].text))[0].focus();
    }
  }
  UpdateForm = false;
  windowFocus.push(dialog_name);
  return jQframeObj[dialog_name];
}

function photoCamera(image, file) {
  CallSQL('/sinfonix/html/camera.htm', 'list', '', image, file, ' ^HTML.www ', 320, 240, 'WebCam','','', function(){ jQframeObj[ this.id ].popup ('destroy'); jQframeObj[ this.id ]=''; });
}

function CallSQL(sql, cmd, argv_cmd, lfn, argv_lfn, xframe, WIDTH, HEIGHT, title, icon, dismissible, ONCLOSE, frame_name) {
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
        icon = icon        || 'delete';
 dismissible = dismissible || true;
     ONCLOSE = ONCLOSE     || '';

  if ( dismissible == true ) {
    data_icon ='data-icon=\"'+icon+'\"', data_ancor='';
  } else {
    data_icon ='data-icon=\"false\"'   , data_ancor='_not';
  }

  if (cmd == 'list') {
    if (jQframeObj[ frame_name ]) {
      jQframeObj[ frame_name ].popup ('open');

    } else {
      WIDTH  = WIDTH  || 635;
      WIDTH  = ( $(window).width() -20 > WIDTH  ) ? WIDTH  : $(window).width()-20;

      HEIGHT = HEIGHT || 405;
      HEIGHT = ( $(window).height()-90 > HEIGHT ) ? HEIGHT : $(window).height()-90;

      html  ='<div data-role=\"popup\" id=\"'+ frame_name +'\" data-theme=\"a\" data-overlay-theme=\"b\" style=\"border: 0px; width:'+ (4+ WIDTH) +'px; height:'+ (47+ HEIGHT) +'px; overflow: hidden; max-width:600px;\">';
      html +='<ul data-role=\"listview\"><li '+ data_icon +' data-theme=\"b\" style=\"margin: -1px -1px -1px -1px;\"><a'+ data_ancor +' href=\"#\" data-rel=\"back\">'+ title +'</a'+ data_ancor +'></li></ul>';
      html +='<div data-role=\"main\" class=\"ui-content\">';

      html +='<iframe name=\"'+ frame_name +'\" style=\"border: 0px; width:'+ WIDTH +'px; height:'+ HEIGHT +'px; overflow: hidden; position:relative; top:-14px; left:-14px;';
      html +='\" src=\"/cgi-bin/sinfonix_'+ ext +'.pl?'+ sii_system + xframe + qstr +'\"></div>'

      jQframeObj[ frame_name ] = $( html ).popup ({
        history: true,
        afterclose:  function(event) {
          event.stopPropagation();
          windowFocus.splice(windowFocus.indexOf(frame_name));
          if (typeof ONCLOSE == 'function')
            try { ONCLOSE(); } catch (err) { console.error(ONCLOSE,err) };
        }
      }).trigger('create').popup( 'open', { positionTo:'window', transition:'pop' });
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
    // jQframeObj[ frame_name ] = $(
    //   '<iframe id=\"'+ frame_name +'\" name=\"'+ frame_name +'\" title=\"('+ sql + lfn +')\"'+
    //   ' src=\"/cgi-bin/sinfonix.pl?'+ sii_system + xframe + qstr +'\">').css('display','none').appendTo('body');
  }
}

function subPag_Next(next) {
  var i = CurrentPage[0].id, e, x, y, z;

  if ( isNaN( next ) ) {
    for ( var z = 0; z < subPag[i].src.length; z++ ) {
      if ( subPag[i].src[ z ].id == next ) {
        next = ( ( subPag[i].pages ) ? subPag[i].pages.indexOf(z) : z ) - subPag[i].active;
        break
      }
    }
  }
  if ( subPag[i].active + next < 0 ) {
    KEYS_27();
  } else {
    if ( subPag[i].active + next > subPag[i].active ) {
      e = $(subPag[i].src[subPag[i].active]);
      x = e.find('input, select, textarea').not('[disabled]');
      for( y = 0; y < x.length; y++) {
        switch ( x[y].type ) {
          case 'select':
          case 'select-one':
            if ( x[y].required && x[y].value == '' ) {
              return subPag_onError( x[y], "Selecciona un elemento de la lista" );
            }
          break;

          case 'checkbox':
            if ( x[y].required && $( x[y] ).is( ':checked' ) == false ) {
              return subPag_onError( x[y], "Tildea esta casilla" );
            }
          break;

          case 'radio':
            if ( x[y].required && e.find( '[name='+ x[y].name +']' ).is( ':checked' ) == false ) {
              return subPag_onError( x[y], "Selecciona una opcion" );
            }
          break;

        default:
            if ( x[y].required && x[y].value == '' ) {
              return subPag_onError(x[y], "Completa este campo");
            }
        }
      }
    }
    return subPag_Action(next);
  }
}

function subPag_onError(e, msg) {
  var x, y, z;
  if ( ! $( e ).is(':visible') ) {
    z = $( e ).closest('div[data-role=collapsible]').find('a');
    if ( z.length ) { z.click() };
  };
  tooltip('init', e, msg, 3000);
  e.focus();
}

function subPag_Action(next, count) {
  var i = CurrentPage[0].id, x, y, z, count = count||0;

  if ( subPag[i].active + (next+count) < ( subPag[i].pages || subPag[i].src ).length ) {
    z = ( subPag[i].pages ) ? subPag[i].pages.indexOf( subPag[i].active + (next+count) ) : subPag[i].active + (next+count);

    if ( CurrentPage.find( '#'+ subPag[i].src[z].id ).prop('disabled') == true )
      return subPag_Action(next, next+count)

    subPag[i].previous = subPag[i].active;
    subPag[i].active += (next+count);
    subPag_Show( '#'+ subPag[i].src[z].id );
  } else {
    // return false
    if ( myForm.submitButton )
      return writeDocument("Acepta",'');
    else
      return false
  }
}

function subPag_Show(page) {
  var effect = 'slide', reverse = '', i = CurrentPage[0].id, x, y, z,
      curPag = CurrentPage.find('.subPag:visible'),
      newPag = CurrentPage.find( page );

  if ( ! curPag.length ) {
    z = subPag[i].previous||0;
    z = ( subPag[i].pages ) ? subPag[i].pages[z]||0 : z;
    curPag = subPag[i].src.eq(z);
  }
  if ( ! newPag.length ) {
    z = subPag[i].active||0;
    z = ( subPag[i].pages ) ? subPag[i].pages[z]||0 : z;
    newPag = subPag[i].src.eq(z);
  }
  for ( var x, y, z = 0; z < subPag[i].src.length; z++ ) {
    if ( subPag[i].src[ z ].id == curPag[0].id ) {
      subPag[i].previous = ( subPag[i].pages ) ? subPag[i].pages[z] : z;
      if ( subPag[i].previous == undefined ) subPag[i].previous = z;
    };
    if ( subPag[i].src[ z ].id == newPag[0].id ) {
      subPag[i].active   = ( subPag[i].pages ) ? subPag[i].pages[z] : z;
      if ( subPag[i].active   == undefined ) subPag[i].active   = z;
    };
  };
  if( newPag.length && subPag[i].previous != subPag[i].active ) {
    if ( subPag[i].previous > subPag[i].active ) reverse = 'reverse';
    if( curPag.length) {
      curPag.removeClass(effect +' in reverse').addClass(effect +' out '+ reverse);
      setTimeout(function () {
        curPag.removeClass(effect+ ' out ' +reverse).css('display','none');
          subPag_Show_CALLBACK(newPag, effect, reverse)
      },150);
    } else {
      subPag_Show_CALLBACK(newPag, effect, reverse)
    }
  }
}

function subPag_Show_CALLBACK(newPag, effect, reverse) {
 if ( newPag.data('title') )
   CurrentPage.find( '[data-role=header] h1' ).text( newPag.data('title') );

 newPag.addClass(effect+ ' in  '+ reverse).css('display','');
 try { eval( newPag.attr( 'id' ).split('^').join('').split('.').join('_') +'_My_onLoad()') } catch (err) {};
 setTimeout(function () {
  var z = inputList();
  NameItemFocus = z[0].name;
  if (! (navigator.userAgent.toUpperCase().indexOf('ANDROID')+1) )
   InitInput(NameItemFocus);
 },400);
}

function sii_loadPage( page, options ) {
  try {
    page  = ( page && $(page).length ) ? $(page) : page || window.location.href;
  } catch(err){};

  options = ( typeof options == 'object' ) ? options : {};

  if ( options.refreshPage ) {
    this.transition = $.mobile.navigate.history.stack[$.mobile.navigate.history.activeIndex].transition;

    if ( options.allowSamePageTransition == undefined ) options.allowSamePageTransition = true;
    if ( options.transition              == undefined ) options.transition              ='none';
    if ( options.reload                  == undefined ) options.reload                  = true;
    if ( options.showLoadMsg             == undefined ) options.showLoadMsg             = false;

    if ( options.changeHash != false ) {
      $.mobile.navigate.history.stack[$.mobile.navigate.history.activeIndex].remove = true;
    }
  }
//   if ( options.reloadPage == undefined ) options.reloadPage = true;
//   if ( options.changeHash == undefined ) options.changeHash = false;

//   if ( page != window.location.href ) {
//     try {
//       var isInSide = '';
//       if ( page.indexOf( 'http' ) != 0 && page.indexOf( '.' ) != 0 && page.indexOf( '/' ) != 0 )
//         isInSide = $('#'+page+'[data-role]');
//
//       if ( isInSide.length ) {
//         page = isInSide;
//       } else {
//         throw 'pagina no esta en el DOM, intenta cargarla desde la WEB';
//       }
//
//     } catch(err) { console.error(err)
//       if ( options.changeHash == false )
//         return false;             // No genera nuevas Paginas (solo hash ya exisentes)
//
//       if ( page.indexOf( 'http' ) != 0 && page.indexOf( '.' ) != 0 && page.indexOf( '/' ) != 0 )
//         page = unescape(unescape(window.location.href)).split(' ')[0] + ' '+ page;
//     }
//   }

  $.mobile.pageContainer.pagecontainer('change', page, options );
  if ( frame_name == "checkCredentials" ) {
    windowFocus.splice(windowFocus.indexOf(frame_name));
    delete jQframeObj[ frame_name ];
    clearTimeout(CheckLeaseTimer);
    CheckLeaseTimer = 0;
  }
  if ( options.refreshPage ) {
    setTimeout( function(self) {
      if ( self.transition ) {
        $.mobile.navigate.history.stack[$.mobile.navigate.history.activeIndex].transition = this.transition;
      }
    }, 500, this );
  }
  return true;
}

// function sii_pagecontainerbeforechange(event, data) {
//   clearTimeout(YPOS);
//   YPOS = setTimeout(function() { YPOS = 0; }, 1000);
//
//   if ( ! disable_pagecontainerbeforechange ) {
//     // // if ( typeof data.toPage == 'string' ) {
//     //   // if ( data.options.direction ) {
//         if ( UpdateForm ) {
//           historyButton = true;
//           disable_pagecontainerbeforechange = true;
//           bak_originalForm = originalForm;
//           window_parent.setTimeout(function() {
//             historyButton = false;
//             disable_pagecontainerbeforechange = false;
//             originalForm = bak_originalForm;
//           }, 500);
//
//           if ( ! KEYS_18_78() ) {
//             // var state = {
//             //   hash: '#&ui-state=dialog',
//             //   role: 'dialog',
//             //  title: document.title,
//             //    url: location.href +'#&ui-state=dialog'
//             // }
//             // history.pushState( state, state.title, state.url );
//             // throw "funcion Cancelada, no actualiza los datos, se mantienen inalterables";
//             // data.toPage='#&ui-state=dialog';
//
//             tooltip_exit('',0);
//             return false;
//           }
//         } else {
//         setTimeout(function() { UpdateForm = true; }, 500);
//         }
//       // }
//     // }
//   }
//   return true;
// }
