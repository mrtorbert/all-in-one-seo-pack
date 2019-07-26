/**
 * Handles the Preview Snippet on the Edit screen.
 *
 * @since 3.2.0
 */

var snippetTitle = '';
var snippetDescription ='';
var aioseopTitle = '';
var aioseopDescription = '';
var docTitle = '';
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
	snippetTitle = $('#aiosp_snippet_title');
	snippetDescription = $('#aioseop_snippet_description');
	aioseopTitle = $('input[name="aiosp_title"]');
	aioseopDescription = $('textarea[name="aiosp_description"]');

	if ( 'false' === isGutenberg ) {
		aioseopUpdateMetaboxClassicEditor();
	}
	else {
		aioseopUpdateMetaboxGutenbergEditor();
	}

	aioseopTitle.on("input", function() {
		aioseopChangeSnippet( snippetTitle, aioseopTitle );
		if( '' === aioseopTitle.val() ) {
			aioseopChangeSnippet( snippetTitle, docTitle );
		}
	});
}

/**
 * The aioseopUpdateMetaboxClassicEditor() function.
 * 
 * Updates the meta box if the Classic Editor is active.
 * 
 * @since 3.2.0
 */
function aioseopUpdateMetaboxClassicEditor() {
	docTitle = $('#title');
	var postExcerpt = $('#excerpt');

	docTitle.on("input", function() {
		aioseopChangePlaceholder( aioseopTitle, docTitle );
		if ( '' === aioseopTitle.val() ) {
			aioseopChangeSnippet( snippetTitle, docTitle );
		}
	});

	aioseopDescription.on("input", function() {
		aioseopChangeSnippet( snippetDescription, aioseopDescription );
		aioseopHandleDescriptionClassicEditor();
	});

	postExcerpt.on("input", function() {
		aioseopHandleDescriptionClassicEditor();
	});

	setTimeout(function () {
		tinymce.editors[0].on('KeyUp', function () { // jshint ignore:line
			aioseopHandleDescriptionClassicEditor();
		});
	}, 1000);

	/**
	 * The aioseopHandleDescriptionClassicEditor() function.
	 * 
	 * Handles the description in the Classic Editor.
	 * 
	 * @since 3.2.0
	 */
	function aioseopHandleDescriptionClassicEditor() {
		if ( '' !== aioseopDescription.val() ) {
			return;
		}
		if ( 'on' === autogenerateDescriptions ) {
			if ( 'on' !== skipExcerpt && '' !== postExcerpt.val() ) {
				aioseopChangeSnippet( snippetDescription, postExcerpt );
				aioseopChangePlaceholder( aioseopDescription, postExcerpt );
				return;
			}
			var description = aioseopGetDescription();
			snippetDescription.text( description );
			aioseopDescription.attr( 'placeholder', description );
		}
	}
}

/**
 * The aioseopUpdateMetaboxGutenbergEditor() function.
 * 
 * Updates the meta box if the Gutenberg Editor is active.
 * 
 * @since 3.2.0
 */
function aioseopUpdateMetaboxGutenbergEditor() {
	window._wpLoadBlockEditor.then( function() {
		setTimeout( function() {
			docTitle = $('#post-title-0');
			
			docTitle.on("input", function() {
				aioseopChangePlaceholder( aioseopTitle, docTitle );
				if ( '' !== aioseopTitle.val() ) {
					return;
				}
				aioseopChangeSnippet( snippetTitle, docTitle );
			});

			aioseopDescription.on("input", function() {
				aioseopChangeSnippet( snippetDescription, aioseopDescription );
				aioseopHandleDescriptionGutenbergEditor();
			});

			wp.data.subscribe( function() {
				aioseopHandleDescriptionGutenbergEditor();
			});
			
		});
	});

	/**
	 * The aioseopHandleDescriptionGutenbergEditor() function.
	 * 
	 * Handles the description in the Gutenberg Editor.
	 * 
	 * @since 3.2.0
	 */
	function aioseopHandleDescriptionGutenbergEditor() {
		if ( '' !== aioseopDescription.val() ) {
			return;
		}
		if ( 'on' === autogenerateDescriptions ) {
			var postExcerpt = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'excerpt' );
			if ( 'on' !== skipExcerpt && '' !== postExcerpt ) {
				snippetDescription.text( postExcerpt.replace( /<(?:.|\n)*?>/gm, "" ) );
				snippetDescription.attr( 'placeholder', postExcerpt );
				return;
			}

			var description = aioseopGetDescription();
			snippetDescription.text( description );
			aioseopDescription.attr( 'placeholder', description );
		}
	}
}

/**
 * The aioseopChangeSnippet() function.
 * 
 * Changes the value of a field in the preview snippet.
 * 
 * @since 3.2.0
 * 
 * @param jQuery_Object snippetField 
 * @param jQuery_Object inputField 
 */
function aioseopChangeSnippet( snippetField, inputField ) {
	snippetField.text( inputField.val().replace( /<(?:.|\n)*?>/gm, "" ) );
}

/**
 * The aioseopChangePlaceholder() function.
 * 
 * Changes the placeholder value of a field.
 * 
 * @since 3.2.0
 * 
 * @param jQuery_Object inputField
 * @param string placeholder
 */
function aioseopChangePlaceholder( inputField, placeholder ) {
	inputField.attr( 'placeholder', placeholder.val() );
}

/**
 * The aioseopGetDescription() function.
 * 
 * Gets the description (formatted) for the post.
 * 
 * @since 3.2.0
 * 
 * @return string
 */
function aioseopGetDescription() {
	var postContent = '';
	if ( 'false' === isGutenberg ) {
		postContent = $('#content_ifr').contents().find('body')[0].innerHTML;
	} 
	else {
		postContent = wp.data.select('core/editor').getEditedPostAttribute('content');
	}
	var description = aioseopStripEditorMarkup(postContent).replace(/^(.{165}[^\s]*).*/, "$1");
	return aioseopDecodeHtmlEntities( description );
}

/**
 * The aioseopStripEditorMarkup() function.
 * 
 * Strips all editor markup from the content.
 * 
 * @since 3.2.0
 * 
 * @param string editorContent
 * @return string 
 */
function aioseopStripEditorMarkup( editorContent ) {
	return editorContent.replace(/<[^>]*>?/gm, '').replace(/\s\s+/g, ' ').trim();
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
