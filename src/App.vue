<script lang="ts" setup>
import { ref, onMounted, defineModel,  } from 'vue'
import { HttpStore } from './stores/http'
import { useVuelidate } from '@vuelidate/core'
import { helpers ,required, minLength, maxLength } from '@vuelidate/validators'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import ModalDados from './components/ModalDados.vue'



let cnpj: string = ref('')
const searchTitle = defineModel()
const searchDescription = ref()
const formSearch = ref()
const modalInfo = ref(null)
const modalDados = ref()

onMounted(() => {
	setTimeout(() => {
		searchTitle.value.classList.remove('opacity-0')
		searchTitle.value.classList.add('animate__bounceInLeft')
	}, 500);
	setTimeout(() => {
		searchDescription.value.classList.remove('opacity-0')
		searchDescription.value.classList.add('animate__bounceInRight')
	}, 1000);

	setTimeout(() => {
		formSearch.value.classList.remove('opacity-0')
		formSearch.value.classList.add('animate__fadeInUp')
	}, 1500);
})

let validations = {
	cnpj: {
		required: helpers.withMessage('CNPJ obrigatório', required),
		minLength: helpers.withMessage('CNPJ inválido', minLength(18)),
		maxLength: helpers.withMessage('CNPJ inválido', maxLength(18))
	}
}

const v$ = useVuelidate(validations, { cnpj })


const closeModal = () => {
	modalInfo.value = null
	cnpj.value = ''
}

const BuscarEmpresa = async () => {
	const result = await v$.value.$validate()
	if(!result) {
		Swal.fire({
			title: "Campo invalido",
			text: v$.value.$errors[0].$message,
			icon: "warning",
			iconHtml: `
				<svg class="!w-20 !h-20 !text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
					<path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0V8Zm-1 7a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z" clip-rule="evenodd"/>
				</svg>
			`,
			customClass: {
				popup: "!bg-yellow-500 !text-white",
				icon: "!text-white",
				confirmButton: "!text-yellow-500 !bg-white focus:!shadow-none"
			}
		});
		return
	}
	let url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj.value.replaceAll(".", "").replace( /[^0-9\\.]+/g,'')}`
	
	const http = new HttpStore()
	http.HttpRequest(url)
	.then(response => {
		console.log(response);
		modalInfo.value = response
		console.log(modalDados.value.openModal());
		
	}).catch(error => {
		console.log(error);
		
		if(error?.response?.status == 400 || error?.response?.status == 404) {
			Swal.fire({
				title: "Ops!",
				text: "Este CNPJ não foi encontrado!",
				icon: "error",
				iconHtml: `
					<svg class="w-20 h-20 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
						<path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clip-rule="evenodd"/>
					</svg>
				`,
				customClass: {
					confirmButton: "bg-white text-teal-500 outline-none border-none",
					popup: "bg-red-500 text-white",
					icon: "text-white",
				}
			});
		}else {
			Swal.fire({
				title: "Ops!",
				text: "Erro ao realizar a consulta. Tente novamente!",
				icon: "error",
				iconHtml: `
					<svg class="w-20 h-20 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
						<path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clip-rule="evenodd"/>
					</svg>
				`,
				customClass: {
					confirmButton: "bg-white text-teal-500 outline-none border-none",
					popup: "bg-red-500 text-white",
					icon: "text-white",
				}
			});
		}
	})
}

</script>

<template>

	<div id="app" class="min-h-screen">
		<div class="container mx-auto">
			<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-xl w-11/12">
				<div class="text-center mb-10">
					<h1 ref="searchTitle" class="text-3xl font-bold text-white animate__animated opacity-0">Quer procurar um CNPJ?</h1>
					<p ref="searchDescription" class="text-white animate__animated opacity-0 text-lg">Faça sua busca!</p>
				</div>
				<form ref="formSearch" class="animate__animated opacity-0" @submit.stop.prevent="BuscarEmpresa">
					<div class="relative">
						<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
							<svg class="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
								<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
							</svg>
						</div>
						<input type="search" data-cy="input-search" id="search" class="block w-full p-4 ps-10 text-sm rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" v-mask="'##.###.###/####-##'" placeholder="CNPJ" v-model="cnpj" />
						<button type="submit" data-cy="button-search" class="text-white absolute end-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">Buscar</button>
					</div>
				</form>
			</div>
			
		</div>
	</div>

	<ModalDados :dados="modalInfo" ref="modalDados" @closeModal="closeModal" />
</template>

<style scoped>
#app{
	background-image: linear-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)),  url(./assets/business-bg.jpg);
	background-repeat: no-repeat;
	background-size: cover;
}
</style>
