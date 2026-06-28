/*
 * Implementation to calculate the CRC value for a given string / string of bytes.
 * Sunshine, May 2k15
 * www.sunshine2k.de || www.bastian-molkenthin.de
 */

//"use strict";

/*
 * String utility functions
 */
var StringUtil = function() {
  if (StringUtil.prototype._singletonInstance) {
    return StringUtil.prototype._singletonInstance;
  }
  StringUtil.prototype._singletonInstance = this;

/*
 * Converts a string into an array of bytes.
 * This is not really correct as an character (unicode!) does not always fit into
 * a byte, so the character value might be cut!
 */
  this.getCharacterByteArrayFromString = function(str) {
    var i, charVal;
    var bytes = [];
    for (i = 0; i < str.length; i++) {
      charVal = str.charCodeAt(i);
      if (charVal < 256) {
        bytes[i] = str.charCodeAt(i);
      }
    }
    return bytes;
  }
  ;

/*
 * Get the given number as hexadecimal string
 */
  this.getNumberAsHexStr = function(num) {
    var tempStr = num.toString(16).toUpperCase();
    return ("0x" + tempStr);
  }

  this.getNumberAsHexStr = function(num, widthInBits) {
    var tempStr = num.toString(16).toUpperCase();
    while (tempStr.length < (widthInBits >> 2)) {
      tempStr = '0' + tempStr;
    }
    return ("0x" + tempStr);
  }

/*
 * Get the given 32bit number as hexadecimal string
 */
  this.getNumberAsHexStr32 = function(num) {
    var valueHigh = num >>> 16;
    var valueLow = num & 0x0000FFFF;
    return ("0x" + valueHigh.toString(16).toUpperCase() + valueLow.toString(16).toUpperCase());
  }
  this.getNumberAsHexStr32FixedWidth = function(num) {
    var valueHigh = num >>> 16;
    valueHigh = valueHigh.toString(16).toUpperCase()
    while (valueHigh.length < 4) {
      valueHigh = '0' + valueHigh;
    }
    var valueLow = num & 0x0000FFFF;
    valueLow = valueLow.toString(16).toUpperCase()
    while (valueLow.length < 4) {
      valueLow = '0' + valueLow;
    }
    return ("0x" + valueHigh + valueLow);
  }
  var lastErrToken;
/*
 * Get value of token where a call to getCharacterByteArrayFromByteString might
 * have failed.
 */
  this.getLastErrorToken = function() {
    return lastErrToken;
  }
/*
 * Converts a string of byte values into an array of bytes.
 * Returns undefined if an errors occurs. The erroneous token can be retrieved
 * by getLastErrorToken().
 */
  this.getCharacterByteArrayFromByteString = function(str) {
    var bytes = [];
    var bytePos = 0;
    var splitStr = str.split(/\s+/);
    for (var i = 0; i < splitStr.length; i++) {
      var byteStr = splitStr[i];
      if (byteStr.substr(0, 2) === "0x") {
        byteStr = byteStr.substr(2, byteStr.length - 2);
      }
      if (byteStr === " " || byteStr === "")
        continue;

      var b = parseInt(byteStr, 16);
      if (b === NaN || b === undefined) {
        lastErrToken = byteStr;
        return undefined;
      } else {
        if (b < 256) {
          bytes[bytePos] = b;
          bytePos++;
        } else {
          lastErrToken = byteStr;
          return undefined;
        }
      }
    }
    return bytes;
  }
  this.isBinaryString = function(s) {
    for (var i = 0; i < s.length; i++) {
      if (!(s[i] == '0' || s[i] == '1'))
        return false;
    }
    return true;
  }
  ;
/*
 * Converts a binary string, consisting of 0 and 1, to a numerical byte array.
 * Each eight binary digits (forming a byte) must be separated by a space.
 * Example: 10000100 11110001 represents byte array 0x84 0xF1
 */
  this.getCharacterByteArrayFromBinaryString = function(str) {
    var bytes = [];
    var parts = str.split(/\s+/);
    for (var strIdx = 0; strIdx < parts.length; strIdx++) {
      var strPart = parts[strIdx];
      while (strPart.length < 8) {
        strPart = '0' + strPart;
      }
      if (!(new StringUtil().isBinaryString(strPart))) {
        lastErrToken = strPart;
        return undefined;
      }
      var num = 0;
      for (var i = 0; i < 8; i++) {
        if (strPart[i] == '1') {
          num = num + (1 << (7 - i));
        }
      }
      bytes.push(num);
    }
    return bytes;
  }
};

var UInt64 = (function() {
  function UInt64(numOrUint64, lowVal) {
    if (typeof numOrUint64 === 'number') {
      this.highVal = numOrUint64 & 0xFFFFFFFF;
      this.lowVal = lowVal & 0xFFFFFFFF;
    } else {
      this.highVal = numOrUint64.highVal;
      this.lowVal = numOrUint64.lowVal;
    }
  }
  UInt64.prototype.clone = function() {
    return new UInt64(this);
  }
  ;
  UInt64.FromString = function(strHigh, strLow) {
    var numHigh = 0
      , numLow = 0;
    if (strLow == undefined) {

      /* the first parameter string contains the whole number */
      /* remove preceeding '0x' prefix */
      if (strHigh.substr(0, 2) === "0x") {
        strHigh = strHigh.substr(2, strHigh.length - 2);
      }

      /* pad to full 16 digits */
      while (strHigh.length < 16) {
        strHigh = '0' + strHigh;
      }
      numHigh = parseInt(strHigh.substr(0, 8), 16);
      numLow = parseInt(strHigh.substr(8, 15), 16);
    } else {
      /* two 32bit numbers are provided */
      /* handle high part */
      /* remove preceeding '0x' prefix */
      if (strHigh.substr(0, 2) === "0x") {
        strHigh = strHigh.substr(2, strHigh.length - 2);
      }
      /* pad to full 8 digits */
      while (strHigh.length < 8) {
        strHigh = '0' + strHigh;
      }
      numHigh = parseInt(strHigh, 16);
      /* handle low part */
      /* remove preceeding '0x' prefix */
      if (strLow.substr(0, 2) === "0x") {
        strLow = strLow.substr(2, strLow.length - 2);
      }
      /* pad to full 8 digits */
      while (strLow.length < 8) {
        strLow = '0' + strLow;
      }
      numLow = parseInt(strLow, 16);
    }
    return new UInt64(numHigh,numLow);
  }
  ;
  UInt64.prototype.and = function(otherUInt64OrNumber) {
    if (typeof otherUInt64OrNumber === 'number') {
      this.highVal = 0;
      this.lowVal = this.lowVal & otherUInt64OrNumber;
    } else {
      this.highVal = this.highVal & otherUInt64OrNumber.highVal;
      this.lowVal = this.lowVal & otherUInt64OrNumber.lowVal;
    }
    return this;
  }
  ;
  UInt64.prototype.shl = function(dist) {
    for (var i = 0; i < dist; i++) {
      this.highVal = this.highVal << 1;
      if ((this.lowVal & 0x80000000) != 0) {
        this.highVal |= 0x01;
      }
      this.lowVal = this.lowVal << 1;
    }
    return this;
  }
  ;
  UInt64.prototype.shr = function(dist) {
    for (var i = 0; i < dist; i++) {
      this.lowVal = this.lowVal >>> 1;
      if ((this.highVal & 0x00000001) != 0) {
        this.lowVal |= 0x80000000;
      }
      this.highVal = this.highVal >>> 1;
    }
    return this;
  }
  ;
  UInt64.prototype.isZero = function() {
    return ((this.highVal == 0) && (this.lowVal == 0));
  }
  ;
  UInt64.prototype.xor = function(otherUInt64) {
    this.highVal = this.highVal ^ otherUInt64.highVal;
    this.lowVal = this.lowVal ^ otherUInt64.lowVal;
    return this;
  }
  ;
  UInt64.prototype.reflect = function() {
    var newHighVal = 0
      , newLowVal = 0;
    for (var i = 0; i < 32; i++) {
      if ((this.highVal & (1 << (31 - i))) != 0) {
        newLowVal |= (1 << i);
      }
      if ((this.lowVal & (1 << i)) != 0) {
        newHighVal |= (1 << (31 - i));
      }
    }
    this.lowVal = newLowVal;
    this.highVal = newHighVal;
    return this;
  }
  ;
  UInt64.prototype.toHexString = function() {
    var str = "";
    var stringUtil = new StringUtil();
    str += stringUtil.getNumberAsHexStr32FixedWidth(this.highVal);
    str += (stringUtil.getNumberAsHexStr32FixedWidth(this.lowVal).substring(2, 10));
    return str;
  }
  ;
  UInt64.prototype.asNumber = function() {
    return ((this.highVal << 32) | this.lowVal);
  }
  ;
  return UInt64;
}
)();

/*
 * Struct to contain one instance of a CRC algorithm model
 */
function CrcModel(width, name, polynomial, initial, finalXor, inputReflected, resultReflected) {
  this.width = width
  this.name = name;
  if (width == 64) {
    this.polynomial = UInt64.FromString(polynomial);
    this.initial = UInt64.FromString(initial);
    this.finalXor = UInt64.FromString(finalXor);
  } else {
    this.polynomial = polynomial;
    this.initial = initial;
    this.finalXor = finalXor;
  }
  this.inputReflected = inputReflected;
  this.resultReflected = resultReflected;
}

/* Known CRC algorihtms */
var CrcDatabase = [
new CrcModel(8,"CRC8",0x07,0x00,0x00,false,false), 
new CrcModel(8,"CRC8_SAE_J1850",0x1D,0xFF,0xFF,false,false), 
new CrcModel(8,"CRC8_SAE_J1850_ZERO",0x1D,0x00,0x00,false,false), 
new CrcModel(8,"CRC8_8H2F",0x2F,0xFF,0xFF,false,false), 
new CrcModel(8,"CRC8_CDMA2000",0x9B,0xFF,0x00,false,false), 
new CrcModel(8,"CRC8_DARC",0x39,0x00,0x00,true,true), 
new CrcModel(8,"CRC8_DVB_S2",0xD5,0x00,0x00,false,false), 
new CrcModel(8,"CRC8_EBU",0x1D,0xFF,0x00,true,true), 
new CrcModel(8,"CRC8_ICODE",0x1D,0xFD,0x00,false,false), 
new CrcModel(8,"CRC8_ITU",0x07,0x00,0x55,false,false), 
new CrcModel(8,"CRC8_MAXIM",0x31,0x00,0x00,true,true), 
new CrcModel(8,"CRC8_ROHC",0x07,0xFF,0x00,true,true), 
new CrcModel(8,"CRC8_WCDMA",0x9B,0x00,0x00,true,true),

new CrcModel(16,"CRC16_CCIT_ZERO",0x1021,0x0000,0x0000,false,false), 
new CrcModel(16,"CRC16_ARC",0x8005,0x0000,0x0000,true,true), 
new CrcModel(16,"CRC16_AUG_CCITT",0x1021,0x1D0F,0x0000,false,false), 
new CrcModel(16,"CRC16_BUYPASS",0x8005,0x0000,0x0000,false,false), 
new CrcModel(16,"CRC16_CCITT_FALSE",0x1021,0xFFFF,0x0000,false,false), 
new CrcModel(16,"CRC16_CDMA2000",0xC867,0xFFFF,0x0000,false,false), 
new CrcModel(16,"CRC16_DDS_110",0x8005,0x800D,0x0000,false,false), 
new CrcModel(16,"CRC16_DECT_R",0x0589,0x0000,0x0001,false,false), 
new CrcModel(16,"CRC16_DECT_X",0x0589,0x0000,0x0000,false,false), 
new CrcModel(16,"CRC16_DNP",0x3D65,0x0000,0xFFFF,true,true), 
new CrcModel(16,"CRC16_EN_13757",0x3D65,0x0000,0xFFFF,false,false), 
new CrcModel(16,"CRC16_GENIBUS",0x1021,0xFFFF,0xFFFF,false,false), 
new CrcModel(16,"CRC16_MAXIM",0x8005,0x0000,0xFFFF,true,true), 
new CrcModel(16,"CRC16_MCRF4XX",0x1021,0xFFFF,0x0000,true,true), 
new CrcModel(16,"CRC16_RIELLO",0x1021,0xB2AA,0x0000,true,true), 
new CrcModel(16,"CRC16_T10_DIF",0x8BB7,0x0000,0x0000,false,false), 
new CrcModel(16,"CRC16_TELEDISK",0xA097,0x0000,0x0000,false,false), 
new CrcModel(16,"CRC16_TMS37157",0x1021,0x89EC,0x0000,true,true), 

new CrcModel(16,"CRC16_USB",0x8005,0xFFFF,0xFFFF,true,true), 
new CrcModel(16,"CRC16_A",0x1021,0xC6C6,0x0000,true,true), 
new CrcModel(16,"CRC16_KERMIT",0x1021,0x0000,0x0000,true,true), 
new CrcModel(16,"CRC16_MODBUS",0x8005,0xFFFF,0x0000,true,true), 
new CrcModel(16,"CRC16_X_25",0x1021,0xFFFF,0xFFFF,true,true), 
new CrcModel(16,"CRC16_XMODEM",0x1021,0x0000,0x0000,false,false),
new CrcModel(32,"CRC32",0x04C11DB7,0xFFFFFFFF,0xFFFFFFFF,true,true), 
new CrcModel(32,"CRC32_BZIP2",0x04C11DB7,0xFFFFFFFF,0xFFFFFFFF,false,false),
new CrcModel(32,"CRC32_C",0x1EDC6F41,0xFFFFFFFF,0xFFFFFFFF,true,true), 
new CrcModel(32,"CRC32_D",0xA833982B,0xFFFFFFFF,0xFFFFFFFF,true,true), 
new CrcModel(32,"CRC32_MPEG2",0x04C11DB7,0xFFFFFFFF,0x00000000,false,false), 
new CrcModel(32,"CRC32_POSIX",0x04C11DB7,0x00000000,0xFFFFFFFF,false,false), 
new CrcModel(32,"CRC32_Q",0x814141AB,0x00000000,0x00000000,false,false), 
new CrcModel(32,"CRC32_JAMCRC",0x04C11DB7,0xFFFFFFFF,0x00000000,true,true), 
new CrcModel(32,"CRC32_XFER",0x000000AF,0x00000000,0x00000000,false,false),
new CrcModel(64,"CRC64_ECMA_182","0x42f0e1eba9ea3693","0x0000000000000000","0x0000000000000000",false,false), 
new CrcModel(64,"CRC64_GO_ISO","0x000000000000001B","0xFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFF",true,true), 
new CrcModel(64,"CRC64_WE","0x42f0e1eba9ea3693","0xFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFF",false,false), 
new CrcModel(64,"CRC64_XZ","0x42f0e1eba9ea3693","0xFFFFFFFFFFFFFFFF","0xFFFFFFFFFFFFFFFF",true,true)];

/* two constructors supported:
   - new Crc(width, polynomial, initialVal, finalXorVal, inputReflected, resultReflected)
   - new Crc(width, crcModel)
 */
var Crc = function(xwidth, xpolynomial, xinitialVal, xfinalXorVal, xinputReflected, xresultReflected) {
  /* private variables */
  // crc model variables
  width=xwidth;
  polynomial=xpolynomial;
  initialVal=xinitialVal;
  finalXorVal=xfinalXorVal;
  inputReflected=xinputReflected;
  resultReflected=xresultReflected;
  crcTable=""; // lookup table
  castMask="";
  msbMask="";

  /* 'constructor' */
  if (arguments.length == 2 && typeof arguments[1] === "object") {
    width = arguments[0];
    polynomial = arguments[1].polynomial;
    initialVal = arguments[1].initial;
    finalXorVal = arguments[1].finalXor;
    inputReflected = arguments[1].inputReflected;
    resultReflected = arguments[1].resultReflected;
  } else if (arguments.length == 6) {
    width = arguments[0];
    polynomial = arguments[1];
    initialVal = arguments[2];
    finalXorVal = arguments[3];
    inputReflected = arguments[4];
    resultReflected = arguments[5];
  } else {
    new Error("Invalid arguments");
  }
  switch (width) {
  case 8:
    castMask = 0xFF;
    break;
  case 16:
    castMask = 0xFFFF;
    break;
  case 32:
    castMask = 0xFFFFFFFF;
    break;
  case 64:
    castMask = new UInt64(0xFFFFFFFF,0xFFFFFFFF);
    break;
  default:
    throw "Invalid CRC width";
    break;
  }
  if (width == 64) {
    msbMask = new UInt64(0x80000000,0x00000000);
  } else {
    msbMask = 0x01 << (width - 1);
  }
  /* 'constructor' END */

  this.calcCrcTable = function() {
    crcTable = new Array(256);
    if (width == 64) {
      for (var divident = 0; divident < 256; divident++) {
        var currByte = new UInt64(0,divident);
        currByte.shl(56).and(castMask);
        for (var bit = 0; bit < 8; bit++) {
          if (!(new UInt64(currByte).and(msbMask).isZero())) {
            currByte.shl(1);
            currByte.xor(polynomial);
          } else {
            currByte.shl(1);
          }
        }
        crcTable[divident] = currByte.and(castMask);
      }
    } else {
      for (var divident = 0; divident < 256; divident++) {
        var currByte = (divident << (width - 8)) & castMask;
        for (var bit = 0; bit < 8; bit++) {
          if ((currByte & msbMask) != 0) {
            currByte <<= 1;
            currByte ^= polynomial;
          } else {
            currByte <<= 1;
          }
        }
        crcTable[divident] = (currByte & castMask);
      }
    }
  }
  this.calcCrcTableReversed = function() {
    crcTable = new Array(256);
    if (width == 64) {
      for (var divident = 0; divident < 256; divident++) {
        var reflectedDivident = new CrcUtil().Reflect8(divident);
        var currByte = new UInt64(0,reflectedDivident);
        currByte.shl(56).and(castMask);
        for (var bit = 0; bit < 8; bit++) {
          if (!(new UInt64(currByte).and(msbMask).isZero())) {
            currByte.shl(1);
            currByte.xor(polynomial);
          } else {
            currByte.shl(1);
          }
        }
        currByte = currByte.reflect();
        crcTable[divident] = currByte.and(castMask);
      }
    } else {
      for (var divident = 0; divident < 256; divident++) {
        var reflectedDivident = new CrcUtil().Reflect8(divident);
        var currByte = (reflectedDivident << (width - 8)) & castMask;
        for (var bit = 0; bit < 8; bit++) {
          if ((currByte & msbMask) != 0) {
            currByte <<= 1;
            currByte ^= polynomial;
          } else {
            currByte <<= 1;
          }
        }
        currByte = new CrcUtil().ReflectGeneric(currByte, width);
        crcTable[divident] = (currByte & castMask);
      }
    }
  }
  if (!this.crcTable) {
    this.calcCrcTable();
  }
  this.compute = function(bytes) {
    if (width == 64) {
      var crc = initialVal.clone();
      for (var i = 0; i < bytes.length; i++) {
        var curByte = bytes[i] & 0xFF;
        if (inputReflected) {
          curByte = new CrcUtil().Reflect8(curByte);
        }

        /* update the MSB of crc value with next input byte */
        var curByteShifted56 = new UInt64(0,curByte).shl(56);
        crc.xor(curByteShifted56).and(castMask);

        /* this MSB byte value is the index into the lookup table */
        var pos = (crc.clone().shr(56)).and(0xFF).asNumber();
        /* shift out this index */
        crc.shl(8).and(castMask);
        /* XOR-in remainder from lookup table using the calculated index */
        crc.xor(crcTable[pos]).and(castMask);
      }
      if (resultReflected) {
        crc.reflect();
      }
      return crc.xor(finalXorVal).and(castMask);
    } else {
      var crc = initialVal;
      for (var i = 0; i < bytes.length; i++) {
        var curByte = bytes[i] & 0xFF;
        if (inputReflected) {
          curByte = new CrcUtil().Reflect8(curByte);
        }

        /* update the MSB of crc value with next input byte */
        crc = (crc ^ (curByte << (width - 8))) & castMask;
        /* this MSB byte value is the index into the lookup table */
        var pos = (crc >> (width - 8)) & 0xFF;
        /* shift out this index */
        crc = (crc << 8) & castMask;
        /* XOR-in remainder from lookup table using the calculated index */
        crc = (crc ^ crcTable[pos]) & castMask;
      }
      if (resultReflected) {
        crc = new CrcUtil().ReflectGeneric(crc, width);
      }
      return ((crc ^ finalXorVal) & castMask);
    }
  }
  this.getLookupTable = function() {
    return crcTable;
  }
};
/*
 * CRC utility functions to reflect numbers.
 */
var CrcUtil = function() {
  /* singleton */
  if (CrcUtil.prototype._singletonInstance) {
    return CrcUtil.prototype._singletonInstance;
  }
  CrcUtil.prototype._singletonInstance = this;
  this.Reflect8 = function(val) {
    var resByte = 0;
    for (var i = 0; i < 8; i++) {
      if ((val & (1 << i)) != 0) {
        resByte |= ((1 << (7 - i)) & 0xFF);
      }
    }
    return resByte;
  }
  this.Reflect16 = function(val) {
    var resByte = 0;
    for (var i = 0; i < 16; i++) {
      if ((val & (1 << i)) != 0) {
        resByte |= ((1 << (15 - i)) & 0xFFFF);
      }
    }
    return resByte;
  }
  this.Reflect32 = function(val) {
    var resByte = 0;

    for (var i = 0; i < 32; i++) {
      if ((val & (1 << i)) != 0) {
        resByte |= ((1 << (31 - i)) & 0xFFFFFFFF);
      }
    }
    return resByte;
  }
  this.ReflectGeneric = function(val, width) {
    var resByte = 0;
    for (var i = 0; i < width; i++) {
      if ((val & (1 << i)) != 0) {
        resByte |= (1 << ((width - 1) - i));
      }
    }
    return resByte;
  }
};
/*
 * Get CRC model instance with given CRC width and given index (starting at 0, 
 * only counting entries with matching width
 */
function getDataBaseEntryFromEntry(width, search) {
  var index = parseInt(search, 10), curIndex = 0;
  if ( index+"" == "NaN" )
    index = search.toUpperCase()

  for (var i = 0; i < CrcDatabase.length; i++) {
    if ( width != CrcDatabase[i].width ) continue;
    if ( index == curIndex || index == CrcDatabase[i].name.toUpperCase() ) {
      return CrcDatabase[i];
    } else {
      curIndex++;
    }
  }
  throw "Invalid selected index into CRC database";
}
