'use strict';

export class DictUtil {
    
    // Glyphs that are Unicode extended chars, but are missing in some fonts. (Needs to be replaced by KanjiVG)
    public extendedGlyphs = ['𣍐', '𩩍', '𠲥', '𢵣', '𥻵', '𥮕'];
    private getSymbols(str: string): string[]{
        var index = 0;
        var length = str.length;
        var output = [];
        for (; index < length - 1; ++index) {
            var charCode = str.charCodeAt(index);
            if (charCode >= 0xD800 && charCode <= 0xDBFF) {
                charCode = str.charCodeAt(index + 1);
                if (charCode >= 0xDC00 && charCode <= 0xDFFF) {
                    output.push(str.slice(index, index + 2));
                    ++index;
                    continue;
                }
            }
            output.push(str.charAt(index));
        }
        output.push(str.charAt(index));
        return output;
    }

    
    /**
     * Get chars in a string. Treat IDS as a char.
     */
    getChars(str) : string[] {
        var unicodeStr = this.getSymbols(str);
        var outputStr = [], tmp="";
        var i, idsMode = false;
        for (i = 0; i < unicodeStr.length; ++i) {
            if (idsMode) {
                if (unicodeStr[i] == "}") {
                    tmp += "}";
                    idsMode=false;
                    outputStr.push(tmp);
                    tmp = "";
                } else {
                    tmp += unicodeStr[i];
                }
            } else {
                if (unicodeStr[i] == "{") {
                    idsMode = true;
                    tmp += "{";
                } else {
                    outputStr.push(unicodeStr[i]);
                }
            }
        }
        return outputStr;
    }

    /**
     * Whether or not a glyph should be rendered using canvas.
     *
     * @param c 
     */
    charIsCanvasChar(c: string): boolean {
        if ((c[0] == '{' && c[c.length - 1] == '}') || (this.extendedGlyphs.indexOf(c) != -1))
            return true
        else
            return false;
    }
}

export const defaultDictUtil = new DictUtil();