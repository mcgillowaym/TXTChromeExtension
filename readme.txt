T/X/T documentation (1.0)
by Michael McGilloway


Thanks for trying out the Chrome extension I'm working on, T/X/T.

It's meant to be a tool for writers and poets to play around with online text.

It can't do that much yet, but I've tried to document what it can do.

Feel free to use the code you find from me for anything you want..

I hope you have fun!


If you want to have the most fun as quickly as possible, I reccomend:

I. Install the extension
II. Select some text
III. Click the TXT icon in the upper-right corner of Chrome
IV. Enter 0 for selected text
V. Enter 3 for scrambled words
VI. Enjoy your nonsensical cutup short story!



1. Installation

Either double click the .crx file or load the unpacked extension into Chrome in developer mode.


2. Source Text

The basic idea behind this extension is to find source text online and play with it by printing it out in weird ways.
First you'll want to find a source text to mess around with. Simple pages in plain language work best.

You might want to try this: http://xroads.virginia.edu/~drbr/heming.html


3. Reading/Playing With the Text

Once you load/enable the extension, a button pops up in the upper-right that says TXT.

The extension can either read the text you have selected or it can try to read all the text off the page.
Selected text works better; reading text off the page often catches difficult-to-parse code.

After finding/selecting your selection, press the TXT box.

Once you've chosen your input method, it's time to pick what you want to do with the text.


3.0. Reprint Text - Enter 0 to reprint a plain-text version of your selection. This isn't that fun and it's mostly for debugging.

3.1. Scramble Nodes - Scrambles DOM text nodes. This might not be that fun, depending on the page. See http://www.w3schools.com/dom/dom_nodes.asp

3.2. Scramble Sentences - Scrambles "sentences". "Sentences" are defined by regular expressions here, 
so you might get anything from sentence fragments to code. The idea is to hopefully implement some kind of
third-party sentence-parser which can do things like tag parts of speech and create technically-correct
English sentences out of a source text, but for now, this is all it does.

3.3. Scramble Words - Scrambles "words". Attempts to produce capitalization and punctuation for proper random sentences

3.4. Meta Words - Gets the Wikipedia page for every "word" found using the MediaWIKI API. The idea behind
getting this info isn't just to print it out like it does now, but to use the text gotten from the Wiki page
for some other purpose that I haven't worked out yet.



4. Some technical stuff

The way this works is by injecting a content script into the source text page, which reads text, sends it to the
background page, which opens a popup and sends it to a script in the popup page.