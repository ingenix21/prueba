/* Main */
function get_eMailParser(message) {zzz=message;
  var eMailParser, x, y, z;
  eMailParser = new parseEmail(message);
  eMailParser.parseMail(eMailParser.message);
  x = eMailParser.message;

  if ( x.mimeFragments.length ) {
    for (var i = 0; i < x.mimeFragments.length; i++) {
      message = x.mimeFragments[i];
      x.mimeFragments[i] = {};
      x.mimeFragments[i].eMailParser = get_eMailParser(message);
      y = x.mimeFragments[i].eMailParser.message;

      if ( y.content_TEXT && y.contentType_TEXT )
        if ( y.contentType_TEXT.toLowerCase().indexOf("text/plain") + 1 ) {
          if ( ! x.content_TEXT ) {
            x.content_TEXT = y.content_TEXT;
            x.contentType_TEXT = y.contentType_TEXT;
          };
        }

      if ( y.content_HTML && y.contentType_HTML )
        if ( y.contentType_HTML.toLowerCase().indexOf("text/html") + 1 ) {
          if ( ! x.content_HTML ) {
            x.content_HTML = y.content_HTML;
            x.contentType_HTML = y.contentType_HTML;
          };
        }
    };
  };
  return eMailParser;
}

/* Parser class */
function parseEmail(emailFile) {
    var parser = this;

    parser.message = new emailDocument();
    parser.message.loadFile(emailFile);
}

parseEmail.prototype.splitDoc = function(data) {
    var parser = this;
    var doc = [];
    var bodyStart;

    /* find start of body */
    bodyStart = data.search(utility.regexes.doubleNewLine);
    /* Grab Header Block */
    doc[0] = data.substring(0, bodyStart);
    /* unfold long header fields */
    doc[0] = doc[0].replace(utility.regexes.fold, ' ').trim();
    /* Grab Body block */
    doc[1] = data.substring(bodyStart);

    doc[1] = doc[1].split("\n");
    doc[1].shift();
    doc[1].shift();
    doc[1] = doc[1].join("\n");

    return {
    	header: doc[0],
    	body: doc[1]
    };
}

parseEmail.prototype.parseHeader = function(headerBlock) {
    var parser = this;
    var result = {};

    if (headerBlock === '') {
        return result;
    }

    /* Split Header Block into Key/Value pairs */
    headerBlock.split(utility.regexes.newLine).forEach(function(line) {
        var arr = line.split(utility.regexes.headerAttribute);

        if (arr[0] === '' || typeof arr[0] === 'undefined') {
            return true
        }
        /* handle empty attributes */
        arr[0] = arr[0] || '';
        arr[1] = arr[1] || '';

        /* build header object */
        result[arr[0].trim().toLowerCase()] = arr[1].trim();
    });
    parser.storeHeader(result);
}

parseEmail.prototype.parseBody = function(bodyBlock) {
    var parser = this;
    var result = {};

    if (bodyBlock === '') {
        return result;
    }
    var encoding = ( parser.message.headers['content-transfer-encoding'] || '' ).toLowerCase().trim();

    /* decode base64 */
    if (encoding === 'base64') {
        bodyBlock = utility.decodeBase64(bodyBlock)

    /* decode quoted-printable */
    } else if (encoding === 'quoted-printable') {
        bodyBlock = utility.decodeQuotedPrintable(bodyBlock.replace(/\n\.\./g, "\n."))
    }

    /* get main type */
    var mainType = ( parser.message.headers['content-type'] || "" ).toLowerCase().trim().split(/\//);

    switch (mainType[0]) {
        case 'multipart':
            parser.parseMultiPart(bodyBlock);
            break;

        case "text":
            if ( mainType[1].toLowerCase().split( "charset=" )[1].indexOf("utf-8") + 1 )
              /* decode ansi to UTF-8 */
              bodyBlock = decodeToUTF8( bodyBlock );

            parser.parseTextBody(bodyBlock);
            break;

        default:
            parser.parseTextBody(bodyBlock);
            break;
    }
}
function decodeToUTF8(code) {
  try { return decodeURIComponent(escape( code )); }
  catch (err) {
    var z = code.length;
    if (z > 1) {
      z = parseInt( z / 2 );
      return decodeToUTF8( code.substr(0,z) ) + decodeToUTF8( code.substr(z) );
    } else {
      return code;
    }
  }
}

function decodeBASE64(code) {
  try { return atob( code ); }
  catch (err) {
    var z = code.length;
    if (z > 1) {
      z = parseInt( z / 2 );
      return decodeBASE64( code.substr(0,z) ) + decodeBASE64( code.substr(z) );
    } else {
      return code;
    }
  }
}

parseEmail.prototype.parseTextBody = function(bodyBlock) {
    var parser = this;

    parser.storeBody(bodyBlock);//.trim());
}

parseEmail.prototype.parseMultiPart = function(bodyBlock) {
    var parser = this;

    /* Get MIME container starting points */
    var indices = utility.getIndicesOf(parser.message.boundaries, bodyBlock);

    /* Grab each container from the body block */
    for (i = 0; i < indices.length - 1; i++) {

      var theBlock = bodyBlock.substring(indices[0 + i] + parser.message.boundaries.length, indices[1 + i]);//.trim();
        //var fragHead = 
        //var fragBody = 
        parser.message.mimeFragments.push(theBlock);
    }
}

parseEmail.prototype.storeBody = function(bodyContent) {
    var parser = this;

    if ( parser.message.contentType_HTML )
      parser.message.content_HTML = bodyContent;

    if ( parser.message.contentType_TEXT )
      parser.message.content_TEXT = bodyContent;
}

parseEmail.prototype.storeHeader = function(headerObj) {
    var parser = this;

    parser.message.headers = headerObj;

    var to = parser.message.headers['delivered-to']  || parser.message.headers['to'];
    var from = parser.message.headers['return-path'] || parser.message.headers['from'];
    var subject = parser.message.headers['subject']  || '';
    var oip = parser.message.headers['x-originating-ip'] || '';
    var contentType = parser.message.headers['content-type'] || 'text/plain';

    var bound = contentType.split('boundary=');
    if (bound.length < 2) var bound = contentType.split('BOUNDARY=');

    if (bound.length > 1)
        parser.message.boundaries = '--' + bound[1].replace(/"/g, '').split(';')[0];

    /* Store recipient */
    parser.message.to = utility.extractEmail(to);
    /* Store Sender */
    parser.message.from = utility.extractEmail(from);
    /* Store Subject */
    parser.message.subject = utility.extractEncode_word(subject);
    /* Store originating IP */
    parser.message.originatingIp = utility.extractIP(oip);

    /* Store Content Type */
    if ( contentType.toLowerCase().indexOf( "text/html" ) + 1 )
      parser.message.contentType_HTML = contentType;

    if ( contentType.toLowerCase().indexOf( "text/plain" ) + 1 )
      parser.message.contentType_TEXT = contentType;
}

parseEmail.prototype.parseMimeFragment = function ( fragment ) {

}

parseEmail.prototype.parseMail = function(message) {
    var parser = this;
    var doc;

    doc = parser.splitDoc(message.raw);

    parser.parseHeader(doc.header);
    parser.parseBody(doc.body);
}

var utility = {
    regexes: {
        newLine: /\r?\n/,//|\r|\n/,
        doubleNewLine: /\r?\n\r?\n/,
        headerAttribute: /:(.+)?/,
//        fold: /\r\n|\r|\n(?:[ \t]+)/g,
        fold: /\r?\n(?:[ \t]+)/g,
        email: /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g,
        ipAddr: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
        header: /^(.+): ((.|\r\n\s)+)\r\n/mg,
    },
    extractEmail: function(text) {
        var email = ( text || "" ).match(utility.regexes.email);
        if (email === null) {
            return '';
        }
        if (email.length > 1) {
            return email;
        } else {
            return email[0];
        }
    },
    extractIP: function(text) {
        var ip = ( text || "" ).match(utility.regexes.ipAddr);
        if (ip === null) {
            return '';
        }
        if (ip.length > 1) {
            return ip;
        } else {
            return ip[0];
        }
    },
    extractEncode_word(e) {
        var text=(e||"").split("?"), code = "", charset="", enconding="", decode="", z;
        for ( var x = 0; x < text.length; x++ ) {
          if ((text[x+0]||"").substr((text[x+0]||"").length-1,1) == "=" 
           && (text[x+4]||"").substr(0,1) == "=") {
            text[x+0]=text[x+0].substr(0,text[x+0].length-1);
            text[x+4]=text[x+4].substr(1);
            if ( text[x+4] == " =")
              text[x+4]=text[x+4].substr(1);

            charset  = text[x+1],
            encoding = text[x+2],
            decode   = text[x+3];
            switch ( encoding.toUpperCase() ) {
                case "B":
                    decode = utility.decodeBase64(decode);
                    break;

                case "Q":
                    decode = utility.decodeQuotedPrintable(decode.split("_").join(" "));
                    break;

                default:
                    break;
            }
            code += text[x+0] + decode, x += 3;

          } else {
            code += text[x+0];
            if ( x+1<text.length )
              code += "?";
          }
        };
        if ( charset.toUpperCase() == "UTF-8" )
          code = decodeToUTF8(code);

        return code;
    },
    decodeBase64: function(text) {
        var z = decodeBASE64(text.trim()).toString();
          
        return z;
    },
    /* From PHP.js - http://phpjs.org/functions/quoted_printable_decode/ */
    decodeQuotedPrintable: function(text) {
//        text = text.split("_").join(" "); daña los link de las fotos en los correos
        var RFC2045Decode1 = /=\r?\n/gm,
            // Decodes all equal signs followed by two hex digits
            RFC2045Decode2IN = /=([0-9A-F]{2})/gim,
            // the RFC states against decoding lower case encodings, but following apparent PHP behavior
            // RFC2045Decode2IN = /=([0-9A-F]{2})/gm,
            RFC2045Decode2OUT = function(sMatch, sHex) {
                return String.fromCharCode(parseInt(sHex, 16));
            };
        var z = text.replace(RFC2045Decode1, '').replace(RFC2045Decode2IN, RFC2045Decode2OUT);
//        z = z.split("_").join(" "); // Daña los link fue puesta al principio de la funcion
          
        return z;
    },
    getIndicesOf: function(searchStr, str) {
        var startIndex = 0,
            searchStrLen = (searchStr||"").length;
        var index, indices = [];

        if ( str.indexOf(searchStr+"--") == -1 )
          str += +"\n"+ searchStr+"--";

        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }
//        if ( indices.length == 0 )
//          indices.push(0);

//        if ( indices.length == 1 < 2)
//          indices.push(str.length)
        return indices;
    },
};

function emailDocument() {
    var email = this;
    email.headers = {};
    email.raw;
    email.mimeFragments = [];
    email.headerBlock;
    email.bodyBlock;

    email.originatingIp;
    email.replyTo;
    email.contentType_TEXT;
    email.contentType_HTML;
    email.boundaries;

    email.from;
    email.to;
    email.subject;
    email.content_TEXT;
    email.content_HTML;
    email.html;
    email.attachments;
}

emailDocument.prototype.loadFile = function(filename) {
    var email = this;

//    var fs = require('fs');
//    email.raw = fs.readFileSync(filename).toString();
    email.raw = filename.toString();
}

/* Simple Usage Example */
//var emailParser = new parseEmail('data3');
//emailParser.parseMail(emailParser.message)
