/**
 * Handles the Preview Snippet on the Edit screen.
 *
 * @since 3.2.0
 */

var snippetTitle 		= '';
var snippetDescription  = '';
var aioseopTitle 		= '';
var aioseopDescription  = '';
var docTitle 			= '';
var isGutenberg = aioseop_preview_snippet.isGutenberg; // jshint ignore:line
var autogenerateDescriptions = aioseop_preview_snippet.autogenerateDescriptions; // jshint ignore:line
var skipExcerpt = aioseop_preview_snippet.skipExcerpt; // jshint ignore:line

$(document).ready( function() {
	aioseopUpdateMetabox();
});

/**
 * The aioseopUpdateMetabox() function.
 * 
 * Updates the preview snippet and input field placeholders in the meta box when a change happens.
 * 
 * @since 3.2.0
 */
function aioseopUpdateMetabox() {
	snippetTitle 		= $('#aiosp_snippet_title');
	snippetDescription  = $('#aioseop_snippet_description');
	aioseopTitle 		= $('input[name="aiosp_title"]');
	aioseopDescription  = $('textarea[name="aiosp_description"]');

	var inputFields = [aioseopTitle, aioseopDescription];

	if ('false' === isGutenberg) {
		docTitle = $('#title');
		var postExcerpt = $('#excerpt');

		inputFields.push(docTitle, postExcerpt);
		inputFields.forEach(addEvent);

		function addEvent(item) {
			item.on('input', function() {
				aioseopUpdatePreviewSnippet();
			});
		}

		setTimeout(function () {
			tinymce.editors[0].on('KeyUp', function () { // jshint ignore:line
				aioseopUpdatePreviewSnippet();
			});
		}, 1000);
		
	}
	else {
		window._wpLoadBlockEditor.then( function() {
			setTimeout( function() {
				wp.data.subscribe( function() {
			aioseopUpdatePreviewSnippet();
		});
	})});
	}

	//TODO Remove this once server no longer sends description when autogenerate descriptions is disabled (or could be left as fallback).
	if( 'on' !== autogenerateDescriptions ) {
		snippetDescription.text( '' );
		aioseopDescription.attr( 'placeholder', '' );
	}
}

function aioseopUpdatePreviewSnippet() {
	var postTitle 	 = '';
	var postContent  = '';
	var postExcerpt  = '';

	var metaboxTitle 	   = aioseopStripMarkup($.trim($('input[name="aiosp_title').val()));
	var metaboxDescription = aioseopStripMarkup($.trim($('textarea[name="aiosp_description"]').val()));
		
	if ('false' === isGutenberg) {
		postTitle   = aioseopStripMarkup($.trim($('#title').val()));
		postContent = aioseopShortenDescription($('#content_ifr').contents().find('body')[0].innerHTML);
		postExcerpt = aioseopShortenDescription($.trim($('#excerpt').val()));
	}
	else {
		postTitle   = aioseopStripMarkup($.trim($('#post-title-0').val()));
		postContent = aioseopStripMarkup(wp.data.select('core/editor').getEditedPostAttribute('content'));
		postExcerpt = aioseopShortenDescription(wp.data.select('core/editor').getEditedPostAttribute('excerpt'));
	}
		
	snippetTitle.text(postTitle);
	aioseopTitle.attr('placeholder', postTitle);
	
	if('' !== metaboxTitle) {
		snippetTitle.text(metaboxTitle);
	}

	if('on' !== autogenerateDescriptions) {
		return;
	}
	
	snippetDescription.text(postContent);
	aioseopDescription.attr('placeholder', postContent);

	if('on' !== skipExcerpt & '' !== postExcerpt) {
		snippetDescription.text(postExcerpt);
		aioseopDescription.attr('placeholder', postExcerpt);
	}

	if('' !== metaboxDescription) {
		snippetDescription.text(metaboxDescription);
		aioseopDescription.attr('placeholder', metaboxDescription);
	}
}

/**
 * The aioseopShortenDescription() function.
 * 
 * Shortens the description to max. 160 characters without truncation.
 * 
 * @since 3.2.0
 * 
 * @param string description 
 */
function aioseopShortenDescription( description ) {
	description = aioseopStripMarkup(description);
	description.replace(/^(.{160}[^\s]*).*/, "$1");
	if (160 < description.length) {
		description = description.trim().replace(/\w+[.!?]?$/, '');
	}
	return description;
}


/**
 * The aioseopStripMarkup() function.
 * 
 * Strips all markup from a string.
 * 
 * @since 3.2.0
 * 
 * @param string editorContent
 * @return string 
  */
function aioseopStripMarkup( editorContent ) {
	//remove all HTML tags
	editorContent = editorContent.replace(/(<[^ >][^>]*>)?/gm, '');
	//remove all line breaks
	editorContent = editorContent.replace(/\s\s+/g, ' ');
	return aioseopDecodeHtmlEntities (editorContent.trim() );
}

/**
 * The aioseopDecodeHtmlEntities() function.
 * 
 * Decodes HTML entities to characters.
 * 
 * @since 3.2.0
 * 
 * @param string encodedString
 * @return string
 */
function aioseopDecodeHtmlEntities( encodedString ) {
	var textArea = document.createElement('textarea');
	textArea.innerHTML = encodedString;
	return textArea.value;
}