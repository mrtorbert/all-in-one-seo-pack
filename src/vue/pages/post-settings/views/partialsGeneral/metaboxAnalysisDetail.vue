<template>
	<ul class="aioseo-analysis-detail">
		<li
			v-for="(keyphrase, index) in analysisItems"
			:key="index"
		>
			<p class="title">
				<svg-circle-check width="12" v-if="0 === keyphrase.error" />
				<svg-circle-close width="12" v-if="1 === keyphrase.error" />
				{{ keyphrase.title }}
				<svg-caret
					v-if="1 === keyphrase.error"
					width="16"
					@click="toggleDescriptionEv"
				/>
			</p>
			<p class="description" v-if="1 === keyphrase.error">{{ keyphrase.description }}</p>
		</li>
	</ul>
</template>

<script>
export default {
	props : {
		analysisItems : {
			type : Object
		}
	},
	data () {
		return {
			strings : {
				delete : this.$t.__('Delete', this.$td)
			}
		}
	},
	methods : {
		toggleDescriptionEv (ev) {
			ev.target.parentElement.classList.toggle('toggled')
		}
	}
}
</script>

<style lang="scss">
.aioseo-analysis-detail {
	margin: 0 0 35px;
	li {
		padding-left: 24px;
		position: relative;
		margin-bottom: 24px;
		&:last-of-type {
			margin-bottom: 0;
		}
		svg {
			position: relative;
			left: 0;
			top: 3px;
			&.aioseo-circle-check {
				color: $green;
			}
			&.aioseo-circle-close {
				color: $red;
			}
			&.aioseo-circle-check,
			&.aioseo-circle-close {
				position: absolute;
				left: 0;
				top: 5px;
			}
			&.aioseo-caret {
				cursor: pointer;
				transform: rotate(-180deg);
				transition: transform 0.3s;
			}
		}
		.title {
			margin-bottom: 6px !important;
			&.toggled {
				svg {
					transform: rotate(-90deg)
				}
				&+ .description {
					opacity: 0;
					height: 0;
					margin: 0;
				}
			}
		}
		.description {
			font-size: 14px;
			font-style: normal;
			opacity: 1;
			height: auto;
			transition: all 0.3s;
		}
	}
}

.edit-post-sidebar {
	.aioseo-analysis-detail {
		.title {
			font-size: 14px;
		}
		.description {
			font-size: 13px;
		}
	}
}
</style>