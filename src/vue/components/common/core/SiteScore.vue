<template>
	<div class="aioseo-site-score">
		<svg-seo-site-score-loading
			v-if="loading"
		/>

		<svg-seo-site-score
			v-if="!loading"
			:score="score"
		/>

		<div class="aioseo-score-amount-wrapper">
			<div
				v-if="!loading"
				class="aioseo-score-amount"
			>
				<span class="score">{{ score }}</span>
				<span class="total">/ 100</span>
			</div>
			<div
				v-if="!loading"
				class="score-description"
				v-html="description"
			/>
			<div
				v-if="loading"
				class="score-analyzing"
			>
				{{ strings.analyzing }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props : {
		score       : Number,
		loading     : Boolean,
		description : String
	},
	data () {
		return {
			strings : {
				analyzing : this.$t.__('Analyzing...', this.$td)
			}
		}
	}
}
</script>

<style lang="scss">
.aioseo-score-amount-wrapper {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	color: $black;
	margin: 20px;

	.aioseo-score-amount {
		.score {
			font-size: 64px;
			font-weight: 600;
		}

		.total {
			font-size: 18px;
			color: $placeholder-color;
			padding-left: 3px;
		}
	}

	.score-description {
		max-width: 80%;
		text-align: center;
		font-size: 17px;
		font-weight: 600;
		line-height: 1.1;
	}

	.score-analyzing {
		margin-top: 20px;
		font-size: 30px;
	}
}
</style>