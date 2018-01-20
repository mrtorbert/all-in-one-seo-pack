<?php
/**
 * Class Test_Sitemap
 *
 * @package 
 */

/**
 * Sitemap test case.
 */

require_once dirname( __FILE__ ) . '/aioseop-test-base.php';

class Test_Sitemap extends AIOSEOP_Unit_Test_Base {

	public function setUp(){
		parent::init();
		parent::setUp();
	}

	public function tearDown(){
		parent::init();
		parent::tearDown();
	}

	public function test_only_pages() {
		$posts = $this->setup_posts( 2 );
		$pages = $this->setup_posts( 2, 0, 'page' );

		$custom_options = array();
		$custom_options['aiosp_sitemap_indexes'] = '';
		$custom_options['aiosp_sitemap_images'] = '';
		$custom_options['aiosp_sitemap_gzipped'] = '';
		$custom_options['aiosp_sitemap_posttypes'] = array( 'page' );

		$this->_setup_options( 'sitemap', $custom_options );

		$this->validate_sitemap(
			array(
					$pages['without'][0] => true,
					$pages['without'][1] => true,
					$posts['without'][0] => false,
					$posts['without'][1] => false,					
			)
		);
	}

	public function test_featured_image() {
		$posts = $this->setup_posts( 2, 2 );

		$custom_options = array();
		$custom_options['aiosp_sitemap_indexes'] = '';
		$custom_options['aiosp_sitemap_images'] = '';
		$custom_options['aiosp_sitemap_gzipped'] = '';
		$custom_options['aiosp_sitemap_posttypes'] = array( 'post' );

		$this->_setup_options( 'sitemap', $custom_options );

		$with = $posts['with'];
		$without = $posts['without'];
		$this->validate_sitemap(
			array(
					$with[0] => array(
						'image'	=> true,
					),
					$with[1] => array(
						'image'	=> true,
					),
					$without[0] => array(
						'image'	=> false,
					),
					$without[1] => array(
						'image'	=> false,
					),
			)
		);
	}

	public function test_exclude_images() {
		$posts = $this->setup_posts( 2, 2 );

		$custom_options = array();
		$custom_options['aiosp_sitemap_indexes'] = '';
		$custom_options['aiosp_sitemap_images'] = 'on';
		$custom_options['aiosp_sitemap_gzipped'] = '';
		$custom_options['aiosp_sitemap_posttypes'] = array( 'post' );

		$this->_setup_options( 'sitemap', $custom_options );

		$with = $posts['with'];
		$without = $posts['without'];
		$this->validate_sitemap(
			array(
					$with[0] => array(
						'image'	=> false,
					),
					$with[1] => array(
						'image'	=> false,
					),
					$without[0] => array(
						'image'	=> false,
					),
					$without[1] => array(
						'image'	=> false,
					),
			)
		);
	}

	public function test_jetpack_gallery() {
		$this->markTestSkipped( 'Skipping this till actual use case is determined.' );

		
		$jetpack = 'jetpack/jetpack.php';
		$file = dirname(dirname( dirname( __FILE__ ) )) . '/';
		
		if ( ! file_exists( $file . $jetpack ) ) {
			$this->markTestSkipped( 'JetPack not installed. Skipping.' );
		}

		tests_add_filter( 'muplugins_loaded', function(){
			require $file . $jetpack;
		} );

		activate_plugin( $jetpack );

		if ( ! is_plugin_active( $jetpack ) ) {
			$this->markTestSkipped( 'JetPack not activated. Skipping.' );
		}

		$posts = $this->setup_posts( 1, 1 );

		// create 4 attachments.
		$attachments = array();
		for ( $x = 0; $x < 4; $x++ ) {
			$attachments[] = $this->upload_image_and_maybe_attach( str_replace( '\\', '/', trailingslashit( __DIR__ ) . 'resources/images/footer-logo.png' ) );
		}

		$id = $this->factory->post->create( array( 'post_type' => 'post', 'post_content' => '[gallery size="medium" link="file" columns="5" type="slideshow" ids="' . implode( ',', $attachments ) . '"]', 'post_title' => 'jetpack' ) );
		$posts['with'][] = get_permalink( $id );

		$custom_options = array();
		$custom_options['aiosp_sitemap_indexes'] = '';
		$custom_options['aiosp_sitemap_images'] = '';
		$custom_options['aiosp_sitemap_gzipped'] = '';
		$custom_options['aiosp_sitemap_posttypes'] = array( 'post' );

		$this->_setup_options( 'sitemap', $custom_options );

		$with = $posts['with'];
		$without = $posts['without'];
		$this->validate_sitemap(
			array(
					$with[0] => array(
						'image'	=> true,
					),
					$with[1] => array(
						'image'	=> true,
					),
					$without[0] => array(
						'image'	=> false,
					),
			)
		);
	}

	public function test_nextgen_gallery() {
		$nextgen = 'nextgen-gallery/nggallery.php';
		$file = dirname(dirname( dirname( __FILE__ ) )) . '/';
		
		if ( ! file_exists( $file . $nextgen ) ) {
			$this->markTestSkipped( 'NextGen Gallery not installed. Skipping.' );
		}

		tests_add_filter( 'muplugins_loaded', function(){
			require $file . $nextgen;
		} );

		activate_plugin( $nextgen );

		if ( ! is_plugin_active( $nextgen ) ) {
			$this->markTestSkipped( 'NextGen Gallery not activated. Skipping.' );
		}

		$posts = $this->setup_posts( 1, 1 );

		// create 4 attachments.
		$attachments = array();
		for ( $x = 0; $x < 4; $x++ ) {
			$attachments[] = $this->upload_image_and_maybe_attach( str_replace( '\\', '/', trailingslashit( __DIR__ ) . 'resources/images/footer-logo.png' ) );
		}

		$shortcode = '[ngg_images image_ids="' . implode( ',', $attachments ) . '"]';
		$content = do_shortcode( $shortcode );

		if ( 'We cannot display this gallery' === $content ) {
			$this->markTestSkipped( 'NextGen Gallery not working properly. Skipping.' );
		}

		$id = $this->factory->post->create( array( 'post_type' => 'post', 'post_content' => '[ngg_images image_ids="' . implode( ',', $attachments ) . '"]', 'post_title' => 'nextgen' ) );
		$posts['with'][] = get_permalink( $id );

		$custom_options = array();
		$custom_options['aiosp_sitemap_indexes'] = '';
		$custom_options['aiosp_sitemap_images'] = '';
		$custom_options['aiosp_sitemap_gzipped'] = '';
		$custom_options['aiosp_sitemap_posttypes'] = array( 'post' );

		$this->_setup_options( 'sitemap', $custom_options );

		$with = $posts['with'];
		$without = $posts['without'];
		$this->validate_sitemap(
			array(
					$with[0] => array(
						'image'	=> true,
					),
					$with[1] => array(
						'image'	=> true,
					),
					$without[0] => array(
						'image'	=> false,
					),
			),true
		);
	}

}


