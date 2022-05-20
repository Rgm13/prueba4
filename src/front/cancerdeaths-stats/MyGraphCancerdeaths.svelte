<script>

    import { onMount } from 'svelte';
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';
    const delay = ms => new Promise(res => setTimeout(res, ms));
	import auth from "../../authService";
	import { isAuthenticated, user, user_tasks, tasks } from "../../store";
	import TaskItem from "../../components/TaskItem.svelte";
    let year = [];
    let country = [];
    let ages_zero_fifty = [];
    let ages_fifty_seventy = [];
    let ages_seventy = [];
    let datos = []; 
    let datosOrdenados = [];   
    //creo 2 let datos para poder ordenado los datos por año

    async function getData(){
        console.log("Fetching cancerdeaths....");
        const res = await fetch("/api/v1/cancerdeaths-stats");
        if(res.ok){
            const data = await res.json();          
            datos = data;
            //si no tenemos ningun dato cargado, cargamos los datos iniciales, si tiene datos los obtiene sin cargar los iniciales
            if (datos.length == 0) {
                const res = await fetch("/api/v1/cancerdeaths-stats/loadInitialData");
                console.log("Entradas recibidas: "+datos.length);
            //con la siguiente funcion ordeno los datos por años de menor a mayor
            datosOrdenados = datos.sort(function (a, b){
            return (a.year - b.year)
            });
            console.log("Ordenadas correctamente");
            datosOrdenados.forEach(dato => {
                year.push(dato.year);
                country.push(dato.country+"-"+dato.year);
                ages_zero_fifty.push(dato.ages_zero_fifty);
                ages_fifty_seventy.push(dato.ages_fifty_seventy);
                ages_seventy.push(dato.ages_seventy);          
            });
            location.reload();
            }
            else{
               console.log("Entradas recibidas: "+datos.length);
            //con la siguiente funcion ordeno los datos por años de menor a mayor
            datosOrdenados = datos.sort(function (a, b){
            return (a.year - b.year)
            });
            console.log("Ordenadas correctamente");
            datosOrdenados.forEach(dato => {
                year.push(dato.year);
                country.push(dato.country+"-"+dato.year);
                ages_zero_fifty.push(dato.ages_zero_fifty);
                ages_fifty_seventy.push(dato.ages_fifty_seventy);
                ages_seventy.push(dato.ages_seventy);            
            }); 
            }
            
        }else{
            console.log("Error, can`t charge data");
		}
    }

    async function loadGraph(){
        Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            title: {
                text: 'Grafica de muertes producidad por cancer'
            },
            subtitle: {
                text: 'Source: https://ourworldindata.org/cancer#deaths-from-cancer'
            },
            xAxis: {
                categories: country,
                tickmarkPlacement: 'on',
                title: {
                    enabled: false
                }
            },
            yAxis: {
                
                title: {
                    text: 'Muertes'
                },
                
            },
            tooltip: {
                split: true,
                valueSuffix: 'muertes'
            },
            plotOptions: {
                
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                }
            },
            
            series: [
                {
                name: 'Mayores de 70 años',
                data: ages_seventy
                },
                {
                name: 'Entre 50 y 70 años',
                data: ages_fifty_seventy
                },
                {
                name: 'Menores de 50 años',
                data: ages_zero_fifty
                }
            ]
        });
    }   

    onMount(getData);

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

<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js"on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"on:load="{loadGraph}"></script>


</svelte:head>

<main>
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
      <br>
      <figure class="highcharts-figure">
          <div id="container"></div>
          <p class="highcharts-description">
              <!--A demo showing a stacked area chart, also sometimes referred to as a
              mountain chart. In a stacked chart, the data series values are added
              together to make up a total.-->
          </p>
      </figure>
	{/if}
    <!--barra de navegacion-->
	
	<!---->
    

</main>