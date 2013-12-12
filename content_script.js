var AppSpace = AppSpace || {}; // namespace object

AppSpace.textGroups = []; // this will store arrays of groups of "sentences"
AppSpace.arrayCounter = 0;

AppSpace.getSelectionText = function() { 
	
	// returns highlighted text, selection 0
	
	// Taken from here:
	// 
    
	var text = "";
	
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    
    return text;
};

AppSpace.walk = function(node, counter) { // walks through the document and puts text nodes into an array, selection 1
    
	// Adapted from here:
    // http://is.gd/mwZp7E
        
    var child, next;

    switch ( node.nodeType )  {
            case 1:  // Element
            case 9:  // Document
            case 11: // Document fragment
                    child = node.firstChild;
                    while ( child ) {
                        next = child.nextSibling;
                        AppSpace.walk(child, AppSpace.arrayCounter);
                        child = next;
                    }
                    break;

            case 3: // Text node
                    AppSpace.textGroups[AppSpace.arrayCounter] = node.nodeValue;
                    if (AppSpace.textGroups[AppSpace.arrayCounter] === []) {
                    	console.log("Empty array");
                    }
                    AppSpace.arrayCounter = AppSpace.arrayCounter + 1;
                    break;
        }
};

AppSpace.inputType = function() {
	
	// selection prompt function
	
	var selection = prompt("Select input type; 0 = selected text, 1 = attempt to get text from entire document");
	
	if (selection === "0") {
		AppSpace.textGroups[0] = AppSpace.getSelectionText();
	}
	else if (selection === "1") {
		AppSpace.walk(document.body, AppSpace.arrayCounter);
	}
	else {
		AppSpace.inputType();
	}
};

AppSpace.inputType();
chrome.runtime.sendMessage(AppSpace.textGroups);
