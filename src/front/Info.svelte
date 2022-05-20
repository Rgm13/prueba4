<script>  
	import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';
	import { onMount } from "svelte";
	import auth from "../authService";
	import { isAuthenticated, user, user_tasks, tasks } from "../store";
	import TaskItem from "../components/TaskItem.svelte";
	//export let name;
	let auth0Client;
	let newTask;

	onMount(async () => {
		auth0Client = await auth.createClient();

		isAuthenticated.set(await auth0Client.isAuthenticated());
		user.set(await auth0Client.getUser());
	});

	function login() {
		auth.loginWithPopup(auth0Client);
	}

	function logout() {
		auth.logout(auth0Client);
	}

	function addItem() {
		let newTaskObject = {
			id: genRandom(),
			description: newTask,
			completed: false,
			user: $user.email,
		};

		console.log(newTaskObject);

		let updatedTasks = [...$tasks, newTaskObject];

		tasks.set(updatedTasks);

		newTask = "";
	}

	function genRandom(length = 7) {
		var chars =
			"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var result = "";
		for (var i = length; i > 0; --i)
			result += chars[Math.round(Math.random() * (chars.length - 1))];
		return result;
	}
</script>



<main>
	<!-- Application -->
	{#if !$isAuthenticated}
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		
		<NavbarBrand href="#/info">INICIO</NavbarBrand>
		<Nav navbar>
			
		</Nav>
		<div class="collapse navbar-collapse" id="navbarText">
			<div class="navbar-nav mr-auto user-details">
			  {#if $isAuthenticated}
			  <span class="text-white">&nbsp;&nbsp;{$user.name} ({$user.email})</span>
			  {:else}<span>&nbsp;</span>{/if}
			</div>
			<span class="navbar-text">
			  <ul class="navbar-nav float-right">
				{#if $isAuthenticated}
				<li class="nav-item">
				  <a class="nav-link" href="/#/info" on:click="{logout}">Log Out</a>
				</li>
				{:else}
				<li class="nav-item">
				  <a class="nav-link" href="/#/info" on:click="{login}">Log In</a>
				</li>
				{/if}
			  </ul>
			</span>
		  </div>
	  </nav>
	{:else}
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		
		<NavbarBrand href="#/info">INICIO</NavbarBrand>
		<Nav navbar>
			<Dropdown >
				<DropdownToggle nav caret> API </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./api/v1/cancerdeaths-stats">Cancerdeaths-Stats</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./api/v1/pneumonia-stats">Pneumonia-Stats</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./api/v1/air-pollution-stats">Airpollution-Stats</DropdownItem>
				</DropdownMenu>
            </Dropdown>
              
            <Dropdown>
				<DropdownToggle nav caret> FRONT-END </DropdownToggle>
				<DropdownMenu end>
				  <DropdownItem href="./#/Cancerdeaths-stats">Cancerdeaths FRONT-END</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./#/Pneumonia-stats">Pneumonia FRONT-END</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="#/air-pollution-stats">AirPollution FRONT-END</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
			  
		  <Dropdown >
			<DropdownToggle nav caret> Gráficas </DropdownToggle>
			<DropdownMenu end>
			  <DropdownItem href="./#/cancerdeaths-graph">Cancerdeaths-Stats</DropdownItem>
			  <DropdownItem divider/>
			  <DropdownItem href="./#/graphpneumonia">Pneumonia-Stats</DropdownItem>
			  <DropdownItem divider/>
			  <DropdownItem href="#/graphAirPollution">AirPollution-Stats</DropdownItem>
			  <DropdownItem divider/>
            	<DropdownItem href="./#/graph">Grafica comun</DropdownItem>
			</DropdownMenu>
		  </Dropdown>
		</Nav>
		<div class="collapse navbar-collapse" id="navbarText">
			<div class="navbar-nav mr-auto user-details">
			  {#if $isAuthenticated}
			  <span class="text-white">&nbsp;&nbsp;{$user.name} ({$user.email})</span>
			  {:else}<span>&nbsp;</span>{/if}
			</div>
			<span class="navbar-text">
			  <ul class="navbar-nav float-right">
				{#if $isAuthenticated}
				<li class="nav-item">
				  <a class="nav-link" href="/#/info" on:click="{logout}">Log Out</a>
				</li>
				{:else}
				<li class="nav-item">
				  <a class="nav-link" href="/#/info" on:click="{login}">Log In</a>
				</li>
				{/if}
			  </ul>
			</span>
		  </div>
	  </nav>
	<h1>SOS2122-24</h1>

    <h3>Team</h3>
    <p>- <a href="https://github.com/Rgm13">Raúl Gómez Morales</a>(fuente de datos: <a href="https://ourworldindata.org/cancer#deaths-from-cancer">Cancerdeaths-stats</a>)</p>
    <p>- <a href="https://github.com/Lauramartinezsanchez">Laura Martínez Sánchez </a> (fuente de datos: <a href="https://ourworldindata.org/pneumonia">Pneumonia-stats</a>)</p>
    <p>- <a href="https://github.com/AliciaCamposCastello">Alicia Campos Castelló</a>(fuente de datos: AirPollution-stats)</p>
    <br>
    <h3>Project description:</h3> Nuestras fuentes de información esta orientadas a analizar la relación que existe entre la tasa de muertes por neumonia, la tasa de muertes por cancer y la contaminacion del aire en interiores. 
    <br><br>
    <h3>Repository:</h3><a href="https://github.com/gti-sos/SOS2122-24.git">gti-sos/SOS2122-24</a>
    <br><br>
    <h3>URL:</h3><a href="http://sos2122-24.herokuapp.com">http://sos2122-24.herokuapp.com</a>
    <br><br>
    <h3>Documentos POSTMAN:</h3>
    <p>- <a href="https://sos2122-24.herokuapp.com/api/v1/cancerdeaths-stats/docs">https://sos2122-24.herokuapp.com/api/v1/cancerdeaths-stats/docs </a>(developed by <a href="https://github.com/Rgm13">Raúl Gómez Morales</a>)</p>
    <p>- <a href="https://sos2122-24.herokuapp.com/api/v1/pneumonia-stats/docs">https://sos2122-24.herokuapp.com/api/v1/pneumonia-stats/docs </a>(developed by <a href="https://github.com/Lauramartinezsanchez">Laura Martínez Sánchez</a>)</p>
	<p>- <a href="https://sos2122-24.herokuapp.com/api/v2/pneumonia-stats/docs">https://sos2122-24.herokuapp.com/api/v2/pneumonia-stats/docs </a>(developed by <a href="https://github.com/Lauramartinezsanchez">Laura Martínez Sánchez</a>)</p>
    <p>- <a href="https://sos2122-24.herokuapp.com/api/v1/air-pollution-stats/docs">https://sos2122-24.herokuapp.com/api/v1/air-pollution-stats/docs </a>(developed by <a href="https://github.com/AliciaCamposCastello">Alicia Campos Castelló</a>)</p>
    <br>
	<h3>APIS:</h3>
	<p>- <a href="https://sos2122-24.herokuapp.com/api/v1/cancerdeaths-stats">https://sos2122-24.herokuapp.com/api/v1/cancerdeaths-stats </a>(developed by <a href="https://github.com/Rgm13">Raúl Gómez Morales</a>)</p>
	<p>- <a href="https://sos2122-24.herokuapp.com/api/v1/pneumonia-stats">https://sos2122-24.herokuapp.com/api/v1/pneumonia-stats </a>(developed by <a href="https://github.com/Lauramartinezsanchez">Laura Martínez Sánchez</a>)</p>
	<p>- <a href="https://sos2122-24.herokuapp.com/api/v2/pneumonia-stats">https://sos2122-24.herokuapp.com/api/v2/pneumonia-stats </a>(developed by <a href="https://github.com/Lauramartinezsanchez">Laura Martínez Sánchez</a>)</p>
	<p>- <a href="https://sos2122-24.herokuapp.com/api/v1/air-pollution-stats">https://sos2122-24.herokuapp.com/api/v1/air-pollution-stats </a>(developed by <a href="https://github.com/AliciaCamposCastello">Alicia Campos Castello</a>)</p>
    <br>
    <h3>FRONT-END:</h3>
	<p>- <a href="#/Cancerdeaths-stats">https://sos2122-24.herokuapp.com/#/Cancerdeaths-stats </a>(developed by <a href="https://github.com/Rgm13">Raúl Gómez Morales</a>)</p>
	<p>- <a href="#/Pneumonia-stats">https://sos2122-24.herokuapp.com/#/Pneumonia-stats </a>(developed by <a href="https://github.com/Lauramartinezsanchez">Laura Martínez Sánchez</a>)</p>
	<p>- <a href="#/air-pollution-stats">https://sos2122-24.herokuapp.com/#/air-pollution-stats </a>(developed by <a href="https://github.com/AliciaCamposCastello">Alicia Campos Castello</a>)</p>
    <br>
    <h3>GÁFRICAS:</h3>
    <p>- <a href="./#/cancerdeaths-graph">https://sos2122-24.herokuapp.com/#/cancerdeaths-graph </a>(developed by <a href="https://github.com/Rgm13">Raúl Gómez Morales</a>)</p>
    <p>- <a href="./#/graphpneumonia">https://sos2122-24.herokuapp.com/#/graphpneumonia </a>(developed by <a href="https://github.com/Lauramartinezsanchez">Laura Martínez Sánchez</a>)</p>
    <p>- <a href="#/air-pollution-stats">https://sos2122-24.herokuapp.com/#/air-pollution-stats </a>(developed by <a href="https://github.com/AliciaCamposCastello">Alicia Campos Castello</a>)</p>
	<p>- <a href="./#/graph">https://sos2122-24.herokuapp.com/#/graph </a></p>
	{/if}
	
    
</main>
<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
    h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
	#main-application {
	  margin-top: 50px;
	}
</style>
