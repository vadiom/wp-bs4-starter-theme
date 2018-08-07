<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package _s
 */

$before_closing_body_code = get_theme_mod('_s_before_closing_body');
?>

	</div><?php // #content ?>

	<footer id="colophon" class="site-footer">
		<div class="site-info container">
			<a href="<?php echo esc_url( __( 'https://wordpress.org/', '_s' ) ); ?>">
				<?php
				/* translators: %s: CMS name, i.e. WordPress. */
				printf( esc_html__( 'Proudly powered by %s', '_s' ), 'WordPress' );
				?>
			</a>
			<span class="sep"> | </span>
				<?php
				/* translators: 1: Theme name, 2: Theme author. */
				printf( esc_html__( 'Theme: %1$s by %2$s.', '_s' ), '_s', '<a href="https://automattic.com/">Automattic</a>' );
				?>
		</div>
	</footer>
</div><?php // #page ?>

<?php wp_footer(); ?>

<?php if ($before_closing_body_code) {
	echo $before_closing_body_code;
} ?>
</body>
</html>
