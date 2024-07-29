<script setup lang="ts">
import { onMounted, ref, watch, defineProps, defineExpose, defineModel, defineEmits } from 'vue';
import { Modal } from 'flowbite';
import type { ModalOptions, ModalInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'



const props = defineProps({
	dados: Object
})

const emit = defineEmits(['closeModal'])

let $modalElement: HTMLElement = ref(null);

let modal: ModalInterface = ref(null);

const tab_active = ref('info-tab-empresa');

const nome_fantasia = defineModel('nome_fantasia');
const razao_social = defineModel('razao_social');
const data_abertura = defineModel('data_abertura');
const situacao = defineModel('situacao');
const atividade_principal = defineModel('atividade_principal');
const email = defineModel('email');
const telefone = defineModel('telefone');
const endereco = defineModel('endereco');




watch(tab_active, (newVal, oldVal) => {
	if(newVal === oldVal) return;

	let id_content = document.querySelector(`#${newVal}`).getAttribute('data-target');
	
	console.log(id_content);
	let content = document.querySelector(`#${id_content}`);
	console.log(content);

	content.classList.add('animate__bounce');
})

watch (() => props.dados, (newVal, oldVal) => {

	if(!newVal) return;

	razao_social.value = newVal.razao_social;
	nome_fantasia.value = newVal.nome_fantasia;
	data_abertura.value = new Date(newVal.data_situacao_cadastral).toLocaleDateString()
	situacao.value = newVal.descricao_situacao_cadastral;
	atividade_principal.value = newVal.cnae_fiscal_descricao;
	email.value = newVal.email;
	telefone.value = newVal.ddd_telefone_1;
	endereco.value = `${newVal.logradouro}, ${newVal.numero}, ${newVal.complemento} - ${newVal.bairro} - ${newVal.municipio} - ${newVal.uf}`;
	
})

onMounted(() => {
	
	$modalElement = document.querySelector('#modal-dados');
	const modalOptions: ModalOptions = {
		placement: 'bottom-right',
		closable: false,
		backdrop: 'static',
		backdropClasses:
			'bg-gray-900/50 fixed inset-0 z-40',
		closable: true,
		onHide: () => {
			console.log('modal is hidden');
			
		},
		onShow: () => {
			console.log('modal is shown');
			setModal()
			console.log(props.dados);
			
			$modalElement.classList.remove('animate__bounceOutUp');
			$modalElement.classList.add('animate__bounceInUp');
			$modalElement.classList.remove('opacity-0');
		},
	};

	// instance options object
	const instanceOptions: InstanceOptions = {
		id: 'modalEl',
		override: true
	};

	modal = new Modal($modalElement, modalOptions, instanceOptions);

})

const setModal = () => {

	if(!props.dados) return;
	console.log(props.dados);
	
}

const closeModal = () => {
	modal.hide();
	emit('closeModal')
}

const openModal = () => {
	modal.show();
}

const changeInputMode = (id: string) => {

	const input = document.querySelector(`#${id}`);	

	let isReadonly = input.getAttribute('readonly') === '';
	

	if(isReadonly) {
		input.removeAttribute('readonly');
		document.querySelector(`#${id}Locked`).classList.add('hidden');
		document.querySelector(`#${id}Unlocked`).classList.remove('hidden');
	} else {
		input.setAttribute('readonly', '');
		document.querySelector(`#${id}Unlocked`).classList.add('hidden');
		document.querySelector(`#${id}Locked`).classList.remove('hidden');
	}
	
	
}

const saveData = () => {
	Swal.fire({
			title: "Sucesso!",
			text: "Dados salvos com sucesso!",
			icon: "success",
			iconHtml: `
				<svg class="w-20 h-20 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5"/>
				</svg>
			`,
			customClass: {
				confirmButton: "bg-white text-teal-500 outline-none border-none",
				popup: "bg-green-500 text-white",
				icon: "text-white",
			}
		  })
}

defineExpose({ openModal });

</script>

<template>
	<div data-cy="modal-dados">

		<!-- Main modal -->
		<div id="modal-dados" tabindex="-1" aria-hidden="true"
			class="hidden animate__animated opacity-0 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
			<div class="relative p-4 w-full max-w-4xl max-h-full">
				<!-- Modal content -->
				<div class="relative rounded-lg shadow bg-gray-800">
					<!-- Modal body -->
					 <div class="h-32 bg-blue-700 relative">
						<div class="text-end">
							<button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" @click.stop.prevent="closeModal">
							<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
								<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
							</svg>
							<span class="sr-only">Close modal</span>
						</button>
						</div>
						<div class="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
							<img src="../assets/business-icon.png" class="max-w-32 mx-auto" alt="">
						</div>
					 </div>
					<div class="p-4 mt-14 md:p-5 space-y-4">
						<div class="mb-10">
							<ul id="info-tabs"class="flex space-x-11 justify-center">
								<li id="info-tab-empresa" data-target="tab-content-dados" class="text-white p-4 rounded-md hover:bg-blue-800 hover:cursor-pointer" :class="{'bg-blue-700': tab_active === 'info-tab-empresa'}" @click="tab_active = 'info-tab-empresa'">
									Dados da empresa
								</li>
								<li id="info-tab-qsa" data-target="tab-content-qsa" class="text-white p-4 rounded-md hover:bg-blue-800 hover:cursor-pointer" :class="{'bg-blue-700': tab_active === 'info-tab-qsa'}" @click="tab_active = 'info-tab-qsa'">
									Quadro societário
								</li>
							</ul>
						</div>
						<div id="tab-content-qsa" class="animate__animated animate__fadeInUp" :class="{'hidden': tab_active !== 'info-tab-qsa'}">
							<div v-if="dados?.qsa?.length === 0">
								<h1 class="text-white text-2xl">Não possui socios</h1>
							</div>
							<div v-else>

								<div v-for="(socio, index) in dados?.qsa" :key="socio?.nome_socio" class="grid grid-cols-1 md:grid-cols-2 text-white gap-4">
									<div>
										<label class="font-bold" for="">Nome:</label>
										<p>{{ socio?.nome_socio || 'Sem informação' }}</p>
									</div>
									<div>
										<label class="font-bold" for="">Faixa etaria:</label>
										<p>{{ socio?.faixa_etaria || 'Sem informação' }}</p>
									</div>
									<div>
										<label class="font-bold" for="">Qualificação:</label>
										<p>{{ socio?.qualificacao_socio || 'Sem informação' }}</p>
									</div>
									<div>
										<label class="font-bold" for="">Data de entrada:</label>
										<p>{{ new Date(socio?.data_entrada_sociedade).toLocaleDateString() }}</p>
									</div>
									<div class="col-span-2 my-4">
										<hr>
									</div>
								</div>
							</div>
						</div>
						<form id="tab-content-dados" class="animate__animated animate__fadeInUp" :class="{'hidden': tab_active !== 'info-tab-empresa'}">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
									<div class="relative">
										<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
											<svg class="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
												<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h12M6 4v16M6 4H5m13 0v16m0-16h1m-1 16H6m12 0h1M6 20H5M9 7h1v1H9V7Zm5 0h1v1h-1V7Zm-5 4h1v1H9v-1Zm5 0h1v1h-1v-1Zm-3 4h2a1 1 0 0 1 1 1v4h-4v-4a1 1 0 0 1 1-1Z"/>
											</svg>
										</div>
										<input type="text" id="inputNomeFantasia" readonly class=" block w-full p-4 ps-10 text-sm  border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Noma fantasia" v-model="nome_fantasia" required />
										<button type="button" class="text-white absolute end-2.5 bottom-2.5   focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800" @click.stop.prevent="changeInputMode('inputNomeFantasia')">
											<span id="inputNomeFantasiaLocked">
												<svg class="w-6 h-6text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
													<path fill-rule="evenodd" d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
												</svg>
											</span>
											<span id="inputNomeFantasiaUnlocked" class="hidden">
												<svg class="w-6 h-6text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
													<path fill-rule="evenodd" d="M15 7a2 2 0 1 1 4 0v4a1 1 0 1 0 2 0V7a4 4 0 0 0-8 0v3H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V7Zm-5 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
												</svg>
											</span>
										</button>
									</div>
								</div>
								<div>
									<label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
									<div class="relative">
										<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
											<svg class="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
												<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h12M6 4v16M6 4H5m13 0v16m0-16h1m-1 16H6m12 0h1M6 20H5M9 7h1v1H9V7Zm5 0h1v1h-1V7Zm-5 4h1v1H9v-1Zm5 0h1v1h-1v-1Zm-3 4h2a1 1 0 0 1 1 1v4h-4v-4a1 1 0 0 1 1-1Z"/>
											</svg>
										</div>
										<input type="text" id="inputRazaoSocial" readonly class=" block w-full p-4 ps-10 text-sm  border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Razão social" v-model="razao_social" required />
										<button type="button" class="text-white absolute end-2.5 bottom-2.5   focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800" @click.stop.prevent="changeInputMode('inputRazaoSocial')">
											<span id="inputRazaoSocialLocked">
												<svg class="w-6 h-6text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
													<path fill-rule="evenodd" d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
												</svg>
											</span>
											<span id="inputRazaoSocialUnlocked" class="hidden">
												<svg class="w-6 h-6text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
													<path fill-rule="evenodd" d="M15 7a2 2 0 1 1 4 0v4a1 1 0 1 0 2 0V7a4 4 0 0 0-8 0v3H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V7Zm-5 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
												</svg>
											</span>
										</button>
									</div>
								</div>
								<div>
									<label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
									<div class="relative">
										<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
											<svg class="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
												<path fill-rule="evenodd" d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" clip-rule="evenodd"/>
											</svg>
										</div>
										<input type="text" id="inputDataAbertura" readonly class=" block w-full p-4 ps-10 text-sm  border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Data de abertura" v-mask="'##/##/####'" v-model="data_abertura" required />
										<button type="button" class="text-white absolute end-2.5 bottom-2.5   focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800" @click.stop.prevent="changeInputMode('inputDataAbertura')">
											<span id="inputDataAberturaLocked">
												<svg class="w-6 h-6text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
													<path fill-rule="evenodd" d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
												</svg>
											</span>
											<span id="inputDataAberturaUnlocked" class="hidden">
												<svg class="w-6 h-6text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
													<path fill-rule="evenodd" d="M15 7a2 2 0 1 1 4 0v4a1 1 0 1 0 2 0V7a4 4 0 0 0-8 0v3H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V7Zm-5 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
												</svg>
											</span>
										</button>
									</div>
								</div>
								<div>
									<label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
									<div class="relative">
										<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
											<svg class="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
												<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 20V7m0 13-4-4m4 4 4-4m4-12v13m0-13 4 4m-4-4-4 4"/>
											</svg>

										</div>
										<input type="text" id="inputSituação" readonly class=" block w-full p-4 ps-10 text-sm  border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Situação" v-model="situacao" required />
										<button type="button" class="text-white absolute end-2.5 bottom-2.5   focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800" @click.stop.prevent="changeInputMode('inputSituação')">
											<span id="inputSituaçãoLocked">
												<svg class="w-6 h-6text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
													<path fill-rule="evenodd" d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
												</svg>
											</span>
											<span id="inputSituaçãoUnlocked" class="hidden">
												<svg class="w-6 h-6text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
													<path fill-rule="evenodd" d="M15 7a2 2 0 1 1 4 0v4a1 1 0 1 0 2 0V7a4 4 0 0 0-8 0v3H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V7Zm-5 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
												</svg>
											</span>
										</button>
									</div>
								</div>
								<div>
									<label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
									<div class="relative">
										<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
											<svg class="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
												<path d="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z"/>
											</svg>

										</div>
										<input type="text" id="inputTelefone" readonly class=" block w-full p-4 ps-10 text-sm  border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" v-mask="['(##) ####-####', '(##) #####-####']" placeholder="Telefone" v-model="telefone" required />
										<button type="button" class="text-white absolute end-2.5 bottom-2.5   focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800" @click.stop.prevent="changeInputMode('inputTelefone')">
											<span id="inputTelefoneLocked">
												<svg class="w-6 h-6text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
													<path fill-rule="evenodd" d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
												</svg>
											</span>
											<span id="inputTelefoneUnlocked" class="hidden">
												<svg class="w-6 h-6text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
													<path fill-rule="evenodd" d="M15 7a2 2 0 1 1 4 0v4a1 1 0 1 0 2 0V7a4 4 0 0 0-8 0v3H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V7Zm-5 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
												</svg>
											</span>
										</button>
									</div>
								</div>
								<div>
									<label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
									<div class="relative">
										<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
											<svg class="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
												<path d="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z"/>
												<path d="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z"/>
											</svg>
										</div>
										<input type="text" id="inputEmail" readonly class=" block w-full p-4 ps-10 text-sm  border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="E-mail" v-model="email" required />
										<button type="button" class="text-white absolute end-2.5 bottom-2.5   focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800" @click.stop.prevent="changeInputMode('inputEmail')">
											<span id="inputEmailLocked">
												<svg class="w-6 h-6text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
													<path fill-rule="evenodd" d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
												</svg>
											</span>
											<span id="inputEmailUnlocked" class="hidden">
												<svg class="w-6 h-6text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
													<path fill-rule="evenodd" d="M15 7a2 2 0 1 1 4 0v4a1 1 0 1 0 2 0V7a4 4 0 0 0-8 0v3H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V7Zm-5 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
												</svg>
											</span>
										</button>
									</div>
								</div>
								<div>
									<label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
									<div class="relative">
										<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
											<svg class="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
												<path fill-rule="evenodd" d="M7 2a2 2 0 0 0-2 2v1a1 1 0 0 0 0 2v1a1 1 0 0 0 0 2v1a1 1 0 1 0 0 2v1a1 1 0 1 0 0 2v1a1 1 0 1 0 0 2v1a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H7Zm3 8a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm-1 7a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3 1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
											</svg>


										</div>
										<input type="text" id="inputEndereco" readonly class=" block w-full p-4 ps-10 text-sm  border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Endereco" v-model="endereco" required />
										<button type="button" class="text-white absolute end-2.5 bottom-2.5   focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800" @click.stop.prevent="changeInputMode('inputEndereco')">
											<span id="inputEnderecoLocked">
												<svg class="w-6 h-6text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
													<path fill-rule="evenodd" d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
												</svg>
											</span>
											<span id="inputEnderecoUnlocked" class="hidden">
												<svg class="w-6 h-6text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
													<path fill-rule="evenodd" d="M15 7a2 2 0 1 1 4 0v4a1 1 0 1 0 2 0V7a4 4 0 0 0-8 0v3H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V7Zm-5 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
												</svg>
											</span>
										</button>
									</div>
								</div>
								<div>
									<label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
									<div class="relative">
										<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
											<svg class="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
												<path fill-rule="evenodd" d="M10 2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v2.382l1.447.723.005.003.027.013.12.056c.108.05.272.123.486.212.429.177 1.056.416 1.834.655C7.481 13.524 9.63 14 12 14c2.372 0 4.52-.475 6.08-.956.78-.24 1.406-.478 1.835-.655a14.028 14.028 0 0 0 .606-.268l.027-.013.005-.002L22 11.381V9a3 3 0 0 0-3-3h-2V5a3 3 0 0 0-3-3h-4Zm5 4V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1h6Zm6.447 7.894.553-.276V19a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-5.382l.553.276.002.002.004.002.013.006.041.02.151.07c.13.06.318.144.557.242.478.198 1.163.46 2.01.72C7.019 15.476 9.37 16 12 16c2.628 0 4.98-.525 6.67-1.044a22.95 22.95 0 0 0 2.01-.72 15.994 15.994 0 0 0 .707-.312l.041-.02.013-.006.004-.002.001-.001-.431-.866.432.865ZM12 10a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z" clip-rule="evenodd"/>
											</svg>

										</div>
										<input type="text" id="inputAtividadePrincipal" readonly class=" block w-full p-4 ps-10 text-sm  border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Atividade principal" v-model="atividade_principal" required />
										<button type="button" class="text-white absolute end-2.5 bottom-2.5   focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800" @click.stop.prevent="changeInputMode('inputAtividadePrincipal')">
											<span id="inputAtividadePrincipalLocked">
												<svg class="w-6 h-6text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
													<path fill-rule="evenodd" d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
												</svg>
											</span>
											<span id="inputAtividadePrincipalUnlocked" class="hidden">
												<svg class="w-6 h-6text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
													<path fill-rule="evenodd" d="M15 7a2 2 0 1 1 4 0v4a1 1 0 1 0 2 0V7a4 4 0 0 0-8 0v3H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V7Zm-5 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
												</svg>
											</span>
										</button>
									</div>
								</div>
							</div>
							<div class="flex">
								<div class="mt-10">
									<button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" @click.stop.prevent="saveData()">Salvar dados</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

