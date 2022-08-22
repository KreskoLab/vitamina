export default {
	variants: {
		scrollbar: ['rounded']
	},
	plugins: [
		require('@windicss/plugin-scrollbar'),
		require('windicss/plugin/scroll-snap'),
		require('@windicss/plugin-animations')({
			settings: {
				animatedSpeed: 1000,
				heartBeatSpeed: 1000,
				hingeSpeed: 2000,
				bounceInSpeed: 750,
				bounceOutSpeed: 750,
				animationDelaySpeed: 1000,
				fadeInDownBig: 2000
			},
		}),
	],
}
