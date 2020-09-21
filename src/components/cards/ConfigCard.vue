<template>
	<a class='card is-shadowless card--is-clickable' @click='$emit("click")'>
		<header class='card-header is-shadowless' :id='id'>
			<span class='card-header-title'>{{title}}</span>
			<a class='card-header-icon button is-danger is-colored-button-only requires-card-hover' @click='$emit("delete")'>
				<span class='icon'>
					<i class='fas fa-trash' aria-hidden='true'></i>
				</span>
				<span class='card-header-icon-label'>Delete</span>
			</a>
		</header>
	</a>
</template>

<script lang='ts'>
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class ConfigCard extends Vue {

    @Prop()
	id: string | undefined;
	
	@Prop()
	title: string | undefined;
}
</script>
