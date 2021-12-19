/**
 * Code from :
 *    - https://github.com/patrick-steele-idem/morphdom/blob/84f28d0438f432cdef8cd869cd67ab916c029f2e/src/morphdom.js#L26,L36
 *    - https://github.com/patrick-steele-idem/morphdom/blob/84f28d0438f432cdef8cd869cd67ab916c029f2e/src/util.js#L1,L50
 */

var range; // Create a range object for efficently rendering strings to elements.
var NS_XHTML = 'http://www.w3.org/1999/xhtml';

export var doc = typeof document === 'undefined' ? undefined : document;
var HAS_TEMPLATE_SUPPORT = !!doc && 'content' in doc.createElement('template');
var HAS_RANGE_SUPPORT = !!doc && doc.createRange && 'createContextualFragment' in doc.createRange();

function createFragmentFromTemplate(str) {
    var template = doc.createElement('template');
    template.innerHTML = str;
    return template.content.childNodes[0];
}

function createFragmentFromRange(str) {
    if (!range) {
        range = doc.createRange();
        range.selectNode(doc.body);
    }

    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
}

function createFragmentFromWrap(str) {
    var fragment = doc.createElement('body');
    fragment.innerHTML = str;
    return fragment.childNodes[0];
}

/**
 * This is about the same
 * var html = new DOMParser().parseFromString(str, 'text/html');
 * return html.body.firstChild;
 *
 * @method toElement
 * @param {String} str
 */
export function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
        // avoid restrictions on content for things like `<tr><th>Hi</th></tr>` which
        // createContextualFragment doesn't support
        // <template> support not available in IE
        return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
        return createFragmentFromRange(str);
    }

    return createFragmentFromWrap(str);
}

/**
 * Replaces Alpine Morph's default `createElement(html)` function.
 * 
 * @see https://github.com/patrick-steele-idem/morphdom/blob/84f28d0438f432cdef8cd869cd67ab916c029f2e/src/morphdom.js#L26,L36
 *
 * @param {Node|Element} fromNode
 * @param {Node|Element|string} toNode
 * @returns {Node|Element}
 */
export default function createElement(fromNode, toNode) {
    // return document.createRange().createContextualFragment(html).firstElementChild;

    const DOCUMENT_FRAGMENT_NODE = 11;

    if (typeof toNode === 'string') {
        if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML' || fromNode.nodeName === 'BODY') {
            var toNodeHtml = toNode;
            toNode = doc.createElement('html');
            toNode.innerHTML = toNodeHtml;
        } else {
            toNode = toElement(toNode);
        }
    } else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
        toNode = toNode.firstElementChild;
    }

    return toNode;
}
