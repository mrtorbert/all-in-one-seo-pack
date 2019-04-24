<?php

/**
 * Class AIOSEOPAdminMenus
 *
 * @since 2.3.11.5
 */
class AIOSEOPAdminMenus {

	/**
	 * Constructor to add the actions.
	 */
	function __construct() {

		add_action( 'network_admin_menu', array( $this, 'remove_menus' ), 15 );

		if ( is_multisite() ) {
			return;
		}

		if ( current_user_can( 'manage_options' ) || current_user_can( 'aiosp_manage_seo' ) ) {
			add_action( 'admin_menu', array( $this, 'add_pro_submenu' ), 11 );
		} else {
			return;
		}
		
		//enqueued here because All_in_One_SEO_Pack_Module::admin_enqueue_scripts does not work
		add_action( 'admin_enqueue_scripts', array($this, 'upgrade_link_aioseop_menu_new_tab' ) );
		add_action( 'admin_enqueue_scripts', array($this, 'upgrade_link_plugins_menu_new_tab' ) );
	}

	function remove_menus() {
		remove_menu_page( AIOSEOP_PLUGIN_DIRNAME . '/aioseop_class.php' ); // Remove AIOSEOP menu from the network admin.
	}

	/**
	 * Adds Upgrade link to our menu.
	 *
	 * @since 2.3.11.5
	 */
	function add_pro_submenu() {
		global $submenu;
		$url = 'https://semperplugins.com/all-in-one-seo-pack-pro-version/?loc=aio_menu';
		$upgrade_text = __( 'Upgrade to Pro', 'all-in-one-seo-pack' );
		$submenu['all-in-one-seo-pack/aioseop_class.php'][] = array(
			"<span class='upgrade_menu_link'>$upgrade_text</span>",
			'manage_options',
			$url,
		);
	}

	/*
	 * Opens Upgrade link in menu as new tab.
	 *
	 * @since 3.0
	 */
	function upgrade_link_aioseop_menu_new_tab() {
		wp_enqueue_script( 'aioseop_menu_js', AIOSEOP_PLUGIN_URL . 'js/menu.js', array( 'jquery' ), AIOSEOP_VERSION, true );
	}

	/*
	 * Opens Upgrade link in plugins menu as new tab.
	 *
	 * @since 3.0
	 */
	function upgrade_link_plugins_menu_new_tab( $hook ) {
		if ( 'plugins.php' != $hook ) {
			return;
		}
		wp_enqueue_script( 'aioseop_plugins_menu_js', AIOSEOP_PLUGIN_URL . 'js/plugins-menu.js', array( 'jquery' ), AIOSEOP_VERSION, true );
	}
}

	new AIOSEOPAdminMenus();

