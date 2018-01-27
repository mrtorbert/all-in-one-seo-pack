<?php
/**
 * Class Test_Canonical_Urls
 *
 * @package 
 */

/**
 * Canonnical URLs test cases.
 */

require_once AIOSEOP_UNIT_TESTING_DIR . '/base/class-aioseop-test-base.php';

class Test_Canonical_Urls extends AIOSEOP_Test_Base {

	/**
	 * Checks if the canonical URL settings are set correctly and then can be toggled with the filter.
	 *
	 * @ticket 374 Remove Canonical URLs setting.
	 */
	public function test_settings() {
		global $aioseop_options;

		$this->assertArrayNotHasKey( 'aiosp_can', $aioseop_options );

		do_action( 'admin_init' );
		$this->assertEquals( 1, $aioseop_options['aiosp_can'] );
		$this->assertEquals( 0, $aioseop_options['aiosp_no_paged_canonical_links'] );
		$this->assertEquals( 1, $aioseop_options['aiosp_customize_canonical_links'] );

		// now let's check if the filter works.
		add_filter( 'aiosp_canonical_urls', function( $behavior, $default ) {
			$behavior['aiosp_can'] = 0;
			$behavior['aiosp_no_paged_canonical_links'] = 1;
			$behavior['aiosp_customize_canonical_links'] = 0;
			return $behavior;
		}, 10, 2 );

		do_action( 'admin_init' );
		$this->assertEquals( 0, $aioseop_options['aiosp_can'] );
		$this->assertEquals( 1, $aioseop_options['aiosp_no_paged_canonical_links'] );
		$this->assertEquals( 0, $aioseop_options['aiosp_customize_canonical_links'] );

	}
}