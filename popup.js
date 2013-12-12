var AppSpace = AppSpace || {}; // namespace object



AppSpace.printArray = function(array, paragraphBreak) { 
	
	// prints contents of an array
	
	var sentenceCounter = 1, // counts "sentences"
		lastCharacter;
	
	// capitalize first letter to be printed
	array[0] = array[0].substr(0,1).toUpperCase() + array[0].substr(1,array[0].length - 1);
	
	document.write('<p style="margin-right:800px">'); // setup paragraph style
	
	for (i in array) {
		lastCharacter = array[i].substr(array[i].length - 1, 1);
		if (sentenceCounter % paragraphBreak === 0 ) { // paragraph breaks every paragraphBreak elements to help with readability
			document.write("<br><br><br>");
			sentenceCounter++;
		}
		if (lastCharacter === "." || lastCharacter === "?" || lastCharacter === "!") {
			sentenceCounter++; // if last element ended with ., ?, or !, we're up another sentence
		}
		if(array[i] === "i") { 
			array[i] = array[i].toUpperCase(); // capitalize standalone "i"s 
		}
		
		document.write(array[i] + " ");
	}
	
	document.write(". </p>");
};

AppSpace.collapseArray = function(array) { 
	
	// turns an array of arrays into a single array
	
	var newArray = [];
	var newArrayCounter = 0;
	var currentSubArray = [];
	
	for (i in array) {
		currentSubArray = array[i];
		for (j in currentSubArray) {
			newArray[newArrayCounter] = currentSubArray[j];
			newArrayCounter++;
		}
	}

	return newArray;
};

AppSpace.randomInt = function(lowerBound, upperBound) {
	
	var integer = Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
	return integer;
};

AppSpace.scrambleArray = function(array) {
	
	// scrambles the original array / destructive using a sort function
	// assigns a random number to each pair of elements (a,b),
	// deciding their indices' relationship to each other (higher, lower, equal)
	
	return array.sort(function() {return 0.5 - Math.random();}); 
};

AppSpace.nodeToSentenceArray = function(textNode) { // this function takes text nodes and returns arrays of "sentences"
	
	var paragraph = textNode; // the "paragraph", which is really just any grouping of words...
	// paragraph = paragraph.replace( /(<([^>]+)>)/ig , ""); // removes stray HTML tags; regexp definition is not perfect..
	
	var sentenceArray = paragraph.match( /[^\.!\?]+[\.!\?]+/g );
	// a "sentence" is defined by the regular expression above (not perfect, ie. causes problems with in-sentence italics)
	
	if (sentenceArray === null) { // if the "paragraph" doesn't contain any "sentences", returns a one-"fragment" array
		sentenceArray = [];
		sentenceArray[0] = paragraph;
		return sentenceArray;
	}
	else {
		return sentenceArray;
	}		
};

AppSpace.nodeToWordArray = function(textNode) {
	
	var wordArray = textNode.split(" "); 
	
	if (wordArray === null) {
		wordArray = [];
		wordArray[0] = textNode;
		return wordArray;
	}
	else {
		return wordArray;
	}
};

AppSpace.runFunctionFromPrompt = function(inputData) {
	
	var desiredFunctionNumber,
		anotherPrompt;
	
	desiredFunctionNumber = prompt("Run which function? (see documentation) " +
				"0 = reprint text, " +
				"1 = scramble nodes, " +
				"2 = scramble 'sentences', " +
				"3 = scramble words, " +
				"4 = meta words (see documentation before using)");
	
	switch (desiredFunctionNumber) {
		case "0":
			AppSpace.printArray(inputData);
			break;
		case "1":
			AppSpace.printScrambledArray(inputData);
			break;
		case "2":
			AppSpace.printScrambledSentences(inputData);
			break;
		case "3":
			AppSpace.printScrambledWords(inputData);
			break;
		case "4":
			AppSpace.makeWordObjects(inputData);
			break;
	}
	
};



AppSpace.printScrambledArray = function(array) { // scrambles text nodes
	AppSpace.scrambledArray = AppSpace.scrambleArray(array);
	AppSpace.printArray(AppSpace.scrambledArray, 20); // print using
};

AppSpace.printScrambledSentences = function(array) { // scrambles "sentences"..
	
	var newArray = [];
	
	for (i in array) {
		newArray[i] = AppSpace.nodeToSentenceArray(array[i]); // note problems with regex sentence definition above
	}
	
	newArray = AppSpace.collapseArray(newArray);
	
	newArray = AppSpace.scrambleArray(newArray);
	
	AppSpace.printArray(newArray, 20);
	
	
};

AppSpace.nodeArrayToWordArray = function(array) {
	
	// changes an array of text nodes to an array of "words"
	
	var newArray = [];
	var newArray2 = [];
	var lastCharacter,
		nextFirstCharacter;
	
	for (i in array) {
		newArray[i] = AppSpace.nodeToWordArray(array[i]); // each text node becomes an array of words
	}	
	
	newArray = AppSpace.collapseArray(newArray); // collapses array of word arrays
	
	for (j in newArray) {
		currentWord = newArray[j].match(/[a-zA-Z.?!0-9';-]+/); // problem: apostrophes; paragraph breaks
		if (currentWord !== null && currentWord !== undefined) {
			newArray2[j] = currentWord.toString().toLowerCase(); // this changes ' to , so:
			newArray2[j] = newArray2[j].replace(",", "'");
		}
		else {
			newArray2[j] = "";
		}
	}
	
	return newArray2;
};

AppSpace.printScrambledWords = function(array) {
	
	var newArray;
	
	newArray = AppSpace.nodeArrayToWordArray(array); // converts array of text nodes to array of words
	
	newArray = AppSpace.scrambleArray(newArray); // scrambles array of words
	
	for (var k = 0; k <= newArray.length - 1; k++) { // makes arrays more "sentency", ie. capitalizes letters after periods
		lastCharacter = newArray[k].substr(newArray[k].length - 1, 1);
		if (lastCharacter === "." || lastCharacter === "?" || lastCharacter === "!") {
			nextFirstCharacter = newArray[k+1].substr(0,1);
			newArray[k+1] = nextFirstCharacter.toUpperCase() + newArray[k+1].substr(1, newArray[k+1].length - 1);
		}
	}
	
	AppSpace.printArray(newArray, 5);
};

AppSpace.word = function(name) { 
	
	// constructs a 'word' object for each selected/read word
	// used in the "meta" function
	
	var textRequest = new XMLHttpRequest(); // used to request raw text from Wikipedia API
	var parseRequest = new XMLHttpRequest(); // used to parse raw text via Wikipedia API parse function; doesn't work well, not yet fully implemented in this code
	
	this.name = name.match(/[A-za-z0-9]+/) !== null ? name.match(/[A-za-z0-9]+/)[0] : ""; // name is alphanumeric characters in each "word"
	this.length = name.length;
	
	this.queryUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&titles=" 
		+ this.name + "&redirects&prop=revisions&rvprop=content&rvparse"; // see http://www.mediawiki.org/wiki/API:Main_page
	
	textRequest.open("GET", this.queryUrl, false);
	textRequest.send();
	this.info = textRequest.responseText;
	
	this.parseUrl = "https://en.wikipedia.org/w/api.php?" +
			"action=parse" +
			"&page=" + this.name +
			"&format=json" +
			"&prop=text" +
			"&section=0";  // this is meant to parse the response text into plain text, but it doesn't yet, so it isn't used
	
	parseRequest.open("GET", this.parseUrl, false);
	parseRequest.send();
	this.parsedInfo = parseRequest.responseText;
	this.logInfo = function() { // for debugging
		console.log(this.name);
		console.log(this.length);
		console.log(this.queryUrl);
		console.log(this.info);
	};
	this.printInfo = function() { // prints UNPARSED info
		document.write("<b>" + this.name + "</b><br><br>" + this.info + "<br><br>");
	};
	
};

AppSpace.makeWordObjects = function (array) { 
	
	// makes word objects based on selection
	
	var wordObjectArray = [];
	var wordArray = AppSpace.nodeArrayToWordArray(array);
	
	for (i in wordArray) {

		wordObjectArray[i] = new AppSpace.word(wordArray[i]);
		
	}
	for (i in wordObjectArray) {
		wordObjectArray[i].logInfo();
		wordObjectArray[i].printInfo();
	}
};


chrome.runtime.onMessage.addListener(function(passedData) { 
	
	// listens for message from background page
	
	AppSpace.passedData = passedData; // receives data
	AppSpace.runFunctionFromPrompt(AppSpace.passedData); // what do you want to do with it?
});

