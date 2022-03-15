<template lang="pug">
.employee-card
	v-container.pb-0
		v-row
			v-col(cols="8")
				v-row: v-col: h1.employee-card__title {{ title }}
				v-row: v-col
					card-info.employee-card__info(v-bind="employee")
						card-chips(v-bind="chips")
							v-col.mt-4(v-if="isUser"): v-btn(@click="$emit('reset-password')") Сбросить пароль
							v-col.mt-4(v-if="isUser && $isMobile()"): v-btn: router-link(:to="{ name: 'profile:logout' }") Выйти
			v-col(cols="4"): avatar(:size="$isMobile() ? [100, 138] : [216, 254]" :person="employee")
		v-row.mb-4(v-if="vacancies.length")
			v-col(cols="auto")
				v-row: v-col: h3 Вакансии
				v-row(v-for="vacancy in vacancies" :key="vacancy.id")
					v-col.fz-17.mb-3: router-link(:to="{ name: 'vacancies:base:preview', params: { id: vacancy.id } }") {{ vacancy.name }}
</template>

<script>
import { createNamespacedHelpers } from "vuex"
import pick from "lodash.pick"
import merge from "lodash.merge"

import CardInfo from "@/components/employee/CardInfo"
import CardChips from "@/components/employee/CardChips"
import Avatar from "@/components/global/Avatar"
import Chip from "@/components/global/Chip"

let { mapState: mapStateUser } = createNamespacedHelpers("user")
let { mapActions } = createNamespacedHelpers("vacancy")

export default {
	name: "EmployeeCard",

	provide () {
		let self = this
		return {
			handleEdit: (...rest) => self.$emit("edit", ...rest),
		}
	},

	components: {
		CardInfo,
		CardChips,
		Avatar,
		Chip,
	},

	props: {
		employee: {
			type: Object,
			required: true,
		},
	},

	data () {
		return {
			chipsPaths: ["phones", "emails", "id"],
			vacancies: [],
		}
	},

	async created () {
		let { vacancies } = await this.vacancySearch({ employee_id_or_responsible_id: this.employee.id })
		this.vacancies = vacancies
	},

	computed: {
		...mapStateUser(["user"]),

		title () {
			let { first_name, last_name, patronymic } = this.employee
			return `${last_name || ""} ${first_name || ""} ${patronymic || ""}`
		},

		chips () {
			let chips = pick(this.employee, this.chipsPaths)

			chips.emails = []
			if (this.employee.email) chips.emails.push(this.employee.email)

			return merge({ isUser: this.isUser }, chips)
		},

		isUser () {
			return this.employee.id === this.user.id
		},
	},

	methods: {
		...mapActions(["vacancySearch"]),
	},
}
</script>

<style lang="sass" scoped>
.employee-card
	&__title
		margin-bottom: 24px

	&__info
		+fz17()
		margin-bottom: 31px
		line-height: 2.5em
</style>
