(function(window, exports) {

    // Public API 
    exports.unserialize = unserialize;
    exports.unserializeSession = unserializeSession;

    function unserialize(data) {

        var that = this,
            utf8Overhead = function(chr) {
                var code = chr.charCodeAt(0);
                if (code < 0x0080) {
                    return 0;
                }
                if (code < 0x0800) {
                    return 1;
                }
                return 2;
            },
            error = function(type, msg, filename, line) {
                throw new window[type](msg, filename, line);
            },
            read_until = function(data, offset, stopchr) {
                var i = 2,
                    buf = [],
                    chr = data.slice(offset, offset + 1);

                while (chr != stopchr) {
                    if ((i + offset) > data.length) {
                        error('Error', 'Invalid');
                    }
                    buf.push(chr);
                    chr = data.slice(offset + (i - 1), offset + i);
                    i += 1;
                }
                return [buf.length, buf.join('')];
            },
            read_chrs = function(data, offset, length) {
                var i, chr, buf;

                buf = [];
                for (i = 0; i < length; i++) {
                    chr = data.slice(offset + (i - 1), offset + i);
                    buf.push(chr);
                    length -= utf8Overhead(chr);
                }
                return [buf.length, buf.join('')];
            },
            _unserialize = function(data, offset) {
                var dtype, dataoffset, keyandchrs, keys,
                    readdata, readData, ccount, stringlength,
                    i, key, kprops, kchrs, vprops, vchrs, value,
                    chrs = 0,
                    typeconvert = function(x) {
                        return x;
                    },
                    readArray = function() {
                        readdata = {};

                        keyandchrs = read_until(data, dataoffset, ':');
                        chrs = keyandchrs[0];
                        keys = keyandchrs[1];
                        dataoffset += chrs + 2;

                        for (i = 0; i < parseInt(keys, 10); i++) {
                            kprops = _unserialize(data, dataoffset);
                            kchrs = kprops[1];
                            key = kprops[2];
                            dataoffset += kchrs;

                            vprops = _unserialize(data, dataoffset);
                            vchrs = vprops[1];
                            value = vprops[2];
                            dataoffset += vchrs;

                            readdata[key] = value;
                        }
                    };

                if (!offset) {
                    offset = 0;
                }
                dtype = (data.slice(offset, offset + 1)).toLowerCase();

                dataoffset = offset + 2;

                switch (dtype) {
                    case 'i':
                        typeconvert = function(x) {
                            return parseInt(x, 10);
                        };
                        readData = read_until(data, dataoffset, ';');
                        chrs = readData[0];
                        readdata = readData[1];
                        dataoffset += chrs + 1;
                        break;
                    case 'b':
                        typeconvert = function(x) {
                            return parseInt(x, 10) !== 0;
                        };
                        readData = read_until(data, dataoffset, ';');
                        chrs = readData[0];
                        readdata = readData[1];
                        dataoffset += chrs + 1;
                        break;
                    case 'd':
                        typeconvert = function(x) {
                            return parseFloat(x);
                        };
                        readData = read_until(data, dataoffset, ';');
                        chrs = readData[0];
                        readdata = readData[1];
                        dataoffset += chrs + 1;
                        break;
                    case 'n':
                        readdata = null;
                        break;
                    case 's':
                        ccount = read_until(data, dataoffset, ':');
                        chrs = ccount[0];
                        stringlength = ccount[1];
                        dataoffset += chrs + 2;

                        readData = read_chrs(data, dataoffset + 1, parseInt(stringlength, 10));
                        chrs = readData[0];
                        readdata = readData[1];
                        dataoffset += chrs + 2;
                        if (chrs != parseInt(stringlength, 10) && chrs != readdata.length) {
                            error('SyntaxError', 'String length mismatch');
                        }
                        break;
                    case 'a':
                        readArray();
                        dataoffset += 1;
                        break;
                    case 'o':
                        ccount = read_until(data, dataoffset, ':');
                        dataoffset += ccount[0] + 2;

                        ccount = read_until(data, dataoffset, '"');
                        dataoffset += ccount[0] + 2;

                        readArray();
                        dataoffset += 1;
                        break;
                    default:
                        error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype);
                        break;
                }
                return [dtype, dataoffset - offset, typeconvert(readdata)];
            };

        return _unserialize((data + ''), 0)[2];
    }

    function unserializeSession(input) {
        return input.split(/\|/).reduce(function(output, part, index, parts) {
            if (index === 0) {
                output._currKey = part;
            } else if (index === parts.length - 1) {
                output[output._currKey] = unserialize(part);
                delete output._currKey;
            } else {
                var repper = part.replace(/(\n|\r)/g, " ");
                var match = repper.match(/^((?:.*?[;\}])+)([^;\}]+?)$/);
                if (match) {
                    output[output._currKey] = unserialize(match[1]);
                    output._currKey = match[2];
                } else {
                    throw new Error('Parse error on part "' + part + '"');
                }
            }
            return output;
        }, {});
    }

})((typeof window === 'undefined') ? global : window, (typeof exports === 'undefined') ? (window.PHPUnserialize = {}) : exports);