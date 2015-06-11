var categories 
= 	['0-4', '5-9', '10-14', '15-19',
	'20-24', '25-29', '30-34', '35-39', '40-44',
	'45-49', '50-54', '55-59', '60-64', '65-69',
	'70-74', '75-79', '80-84', '85-89', '90-94',
	'95-99', '100 +'];

var noticias
=	[
		{
			descripcion: 'Acá va una noticia en tiempo real '
		,	horario: '14:38:05'
		}
	,	{
			descripcion: 'Acá va una noticia en tiempo real '
		,	horario: '14:40:05'
		}
	,	{
			descripcion: 'Acá va una noticia en tiempo real '
		,	horario: '14:44:01' 
		}
	,	{
			descripcion: 'Acá va una noticia en tiempo real '
		,	horario: '14:48:45'
		}
	,	{
			descripcion: 'Acá va una noticia en tiempo real '
		,	horario: '14:50:45'
		}
	,	{
			descripcion: 'Acá va una noticia en tiempo real '
		,	horario: '14:52:45'
		}
	,	{
			descripcion: 'Acá va una noticia en tiempo real '
		,	horario: '14:54:45'
		}
	,	{
			descripcion: 'Acá va una noticia en tiempo real '
		,	horario: '14:55:45'
		}
	,	{
			descripcion: 'Acá va una noticia en tiempo real '
		,	horario: '14:56:45'
		}
	,	{
			descripcion: 'Acá va una noticia en tiempo real '
		,	horario: '14:57:45'
		}
	,	{
			descripcion: 'Acá va una noticia en tiempo real '
		,	horario: '14:58:45'
		}
	]



var	gec
=	function(ev)
	{
		$('.body.active')
			.find("#chart")
				.addClass('col-md-10')
					.removeClass('col-md-12')

		$('.body:not(.active)')
			.find("#chart.col-md-10")
				.addClass('col-md-12')
					.removeClass('col-md-10')
	}

var optmenu
=	{
		element_toggle: ".body"
	,	class: "col-md-11 col-10-resp"
	,	options:
		[
			{
				name: "Tablero 360"
			,	link: "#"
			,	icon: "align-justify"
			,	suboptions:
				[
					{
						name: "Tiempo real"
					,	link: "#"
					,	icon: "link"
					}
				]
			}
		,	{
				name: "Tablero Ambar"
			,	link: "#"
			,	icon: "align-justify"
			,	suboptions:
				[
					{
						name: "Actividad"
					,	link: "#"
					,	icon: "link"
					}
				,	{
						name: "Experiencia del Paciente"
					,	link: "#"
					,	icon: "link"
					}
				,	{
						name: "Experiencia de Gestión"
					,	link: "#"
					,	icon: "link"
					}
				]
			}
		]
	,	slideMenu:
		{
			class: 'col-md-1 col-1-resp'
		,	icon: 'list'
		}
	}

var opt1
=	{
		graphic:
		{
			chart:
			{
				events:
				{
					click: gec
				}
			}
		,	title: 
			{
				text: 'Temperatura promedio mensual',
			}
		,	subtitle: 
			{
				text: 'Source: WorldClimate.com',
			}
		,	xAxis: 
			{
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
				'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
			}
		,	yAxis:
			{
				title: 
				{
					text: 'Temperatura (°C)'
				}
			,	plotLines: 
				[
					{
						value: 0,
						width: 1,
						color: '#808080'
					}
				]
			}
		,	tooltip: 
			{
				valueSuffix: '°C'
			}
		,	legend: 
			{
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
				borderWidth: 0
			}
		,	series: 
			[
				{
					name: 'Tokyo',
					data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
				} 
			,	{
					name: 'New York',
					data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
				}
			, 	{
					name: 'Berlin',
					data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
				}
			, 	{
					name: 'London',
					data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
				}
			]
		}
	,	plugin_options:
		{
			minimal_chart:
			{
				view_details_enabled: true
			,	container_to: "#chart"
			/*,	click: 	function()
				{
					$('#chart_container').toggleClass('hidden')
				}*/
			,	button_close_enabled: true
			,	footer_data: '#info1'
			}
		,	container_chart_resize: $("#sidebar")
		}
	}

var opt2
=	{
		graphic:
		{
			chart: 
			{
				type: 'bar'
			,	events: 
				{
					click: gec
				}
			}
		,	title: 
			{
				text: 'Población alemana, mediados 2010'
			}
		,	subtitle: 
			{
				text: 'Fuente: www.census.gov'
			}
		,	xAxis: 
			[
				{
					categories: categories,
					reversed: false,
					labels: 
					{
						step: 1
					}
            	}
			, 	{ // mirror axis on right side
					opposite: true,
					reversed: false,
					categories: categories,
					linkedTo: 0,
					labels: 
					{
						step: 1
					}
				}
			]
		,	yAxis: 
			{
				title: 
				{
					text: null
				}
			,	labels: 
				{
					formatter: function()
					{
						return (Math.abs(this.value) / 1000000) + 'M';
					}
				}
			,	min: -4000000
			,	max: 4000000
			}
		,	plotOptions: 
			{
				series: 
				{
					stacking: 'normal'
				}
			}
		,	tooltip: 
			{
				formatter: function()
				{
					return '<b>'+ this.series.name +', años '+ this.point.category +'</b><br/>'+
					'Población: '+ Highcharts.numberFormat(Math.abs(this.point.y), 0);
				}
			}
		,	series: 
			[
				{
					name: 'Masculino'
				,	data: [-1746181, -1884428, -2089758, -2222362, -2537431, -2507081, -2443179,
						-2664537, -3556505, -3680231, -3143062, -2721122, -2229181, -2227768,
						-2176300, -1329968, -836804, -354784, -90569, -28367, -3878]
				}
			, 	{
					name: 'Femenino'
				,	data: [1656154, 1787564, 1981671, 2108575, 2403438, 2366003, 2301402, 2519874,
						3360596, 3493473, 3050775, 2759560, 2304444, 2426504, 2568938, 1785638,
						1447162, 1005011, 330870, 130632, 21208]
				}
			]
		}
	,	plugin_options:
		{
			minimal_chart:
			{
				view_details_enabled: true
			,	container_to: "#chart"
			,	button_close_enabled: true
			,	footer_data: '#info2'
			}
		,	container_chart_resize: $("#sidebar")
		}
	}

var opt3
=	{
		graphic:
		{
			chart: 
			{
				plotBackgroundColor: null
			,	plotBorderWidth: null
			,	plotShadow: false
			,	events: 
				{
					click: gec
				}
			}
		,	title: 
			{
				text: 'Uso de browsers, año 2010'
			}
		,	tooltip: 
			{
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			}
		,	plotOptions: 
			{
				pie: 
				{
					allowPointSelect: true
				,	cursor: 'pointer'
				,	dataLabels: 
					{
						enabled: true
					,	color: '#000000'
					,	connectorColor: '#000000'
					,	format: '<b>{point.name}</b>: {point.percentage:.1f} %'
					}
				}
			}
		,	series: 
			[
				{
					type: 'pie'
				,	name: 'Browser share'
				,	data: [
						['Firefox',   45.0]
					,	['IE',       26.8]
					,	{
							name: 'Chrome'
						,	y: 12.8
						,	sliced: true
						,	selected: true
						}
					,	['Safari',    8.5]
					,	['Opera',     6.2]
					,	['Others',   0.7]
					]
				}
			]
		}
	,	plugin_options:
		{
			minimal_chart:
			{
				view_details_enabled: true
			,	container_to: "#chart"
			,	button_close_enabled: true
			,	footer_data: '#info3'
			}
		,	container_chart_resize: $("#sidebar")
		}
	}

var opt4
=	{
		graphic:
		{
			name: "Indicador 1"
		,	rang_values: 
			[
				{
					to: 0
				,	until:  250
				,	type:   'success'
				}
			,	{
					until:  400
				,	type:   'warning'
				}
			,	{
					type:   'danger'
				}
			]
		,	data: 	function()
					{
						return (Math.random()*1000).toFixed(0)
					}
		}
	,	plugin_options:
		{
			tooltip:
			{
				enabled: true
			,	title: 	'indicador 1'
			}
		,	real_time:
			{
				time: 5000
			}
		}
	}

var opt5
=	{
		graphic:
		{
			name: "Indicador 2"
		,	rang_values: 
			[
				{
					to: 0
				,	until:  400
				,	type:   'success'
				}
			,	{
					until:  700
				,	type:   'warning'
				}
			,	{
					type:   'danger'
				}
			]
		,	data: 	function()
					{
						return (Math.random()*1000).toFixed(0)
					}
		}
	,	plugin_options:
		{
			tooltip:
			{
				enabled: true
			,	title: 	'indicador 2'
			}
		,	real_time:
			{
				time: 5000
			}
		}
	}

var opt6
=	{
		graphic:
		{
			name: "Indicador 3"
		,	rang_values: 
			[
				{
					to: 0
				,	until:  300
				,	type:   'success'
				}
			,	{
					until:  700
				,	type:   'warning'
				}
			,	{
					type:   'danger'
				}
			]
		,	data: 	function()
					{
						return (Math.random()*1000).toFixed(0)
					}
		}
	,	plugin_options:
		{
			
		}
	}

var opt8
=	{
		graphic:
		{
			name: "Indicador 4"
		,	rang_values: 
			[
				{
					to: 0
				,	until:  60
				,	type:   'danger'
				}
			,	{
					until:  80
				,	type:   'warning'
				}
			,	{
					type:   'success'
				}
			]
		,	data: 	function()
					{
						return (Math.random()*100).toFixed(2)
					}
		}
	,	plugin_options:
		{
			format: "<data> %"
		,	range_default: 'info'
		,	tooltip:
			{
				enabled: true
			,	title: 	'indicador 4'
			}
		,	modal:
			{
				element: '#ModalIndicador'
			,	title: 'Información detalla'
			,	body: 'Acá va algo'
			,	buttons:[{type:'default',name:'Cerrar',close:true}]
			}
		}
	}

var opt9
=	{
		graphic:
		{
			name: "Indicador 5"
		,	rang_values: 
			[
				{
					to: 0
				,	until:  30
				,	type:   'danger'
				}
			,	{
					until:  70
				,	type:   'warning'
				}
			,	{
					type:   'success'
				}
			]
		,	data: 	function()
					{
						return (Math.random()*100).toFixed(2)
					}
		}
	,	plugin_options:
		{
			format: "<data> %"
		,	range_default: 'info'
		}
	}

var opt10
=	{
		graphic:
		{
			name: "Indicador 6"
		,	data: 	function()
					{
						return (Math.random()*100).toFixed(2)
					}
		}
	,	plugin_options:
		{
			format: "<data> %"
		,	range_default: 'info'
		,	modal: 	
			{
				element:'#ModalIndicador'
			}
		}
	}

var opt7
=	{
		graphic:
		{
			data: 	function()
					{
						return 	[
									{
										nombre: 'Mengano'
									,	valor:  400
									}
								,	{
										nombre: 'Fulano'
									,	valor:  321
									}
								,	{
										nombre: 'AsdAsd'
									,	valor:  250
									}
								,	{
										nombre: 'QweQwe'
									,	valor:  200
									}
								,	{
										nombre: 'Qwasd'
									,	valor:  140
									}
								]
					}
		}
	,	plugin_options:
		{
			view: "#tmp1" //view
		,	template: "tbody" //lo que se repite (tiene que estar dentro de la view)
		}
	}

var opt11
=	{
		graphic:
		{
			data: 	function()
					{
						return 	[
									{
										nombre: 'Mengano'
									,	valor:  12
									,	descripcion: 'Acá va una descripción'
									,	edad: 25
									}
								,	{
										nombre: 'Fulano'
									,	valor:  8
									,	descripcion: 'Acá va una descripción, que se yo'
									,	edad: 40
									}
								,	{
										nombre: 'AsdAsd'
									,	valor:  3
									,	descripcion: 'Acá va una descripción, bla bla bla'
									,	edad: 34
									}
								,	{
										nombre: 'QweQwe'
									,	valor:  2
									,	descripcion: 'Acá va una descripción, jasndkljf'
									,	edad: 46
									}
								,	{
										nombre: 'Qwasd'
									,	valor:  2
									,	descripcion: 'Acá va una descripción, asdasdasdasd'
									,	edad: 21
									}
								]
					}
		}
	,	plugin_options:
		{
			view: '#tmp2'
		,	template: ".2do-template-gastos"
		}
	}

var opt13
=	{
		graphic:
		{
			data: 	function()
					{
						return 	[
									{
										nombre: 'Mengano'
									,	valor:  400
									}
								,	{
										nombre: 'Fulano'
									,	valor:  321
									}
								,	{
										nombre: 'AsdAsd'
									,	valor:  250
									}
								,	{
										nombre: 'QweQwe'
									,	valor:  200
									}
								,	{
										nombre: 'Qwasdasdasd'
									,	valor:  140
									}
								]
					}
		,	rang_values: 
			[
				{
					to: 0
				,	until:  150
				,	type:   'alert-danger'
				}
			,	{
					until:  320
				,	type:   'alert-warning'
				}
			,	{
					type:   'alert-success'
				}
			]
		}
	,	plugin_options:
		{
			view: "#tmp3" //view
		,	template: ".3er-template" //lo que se repite (tiene que estar dentro de la view)
		,	to_evaluate_range: 'valor'
		}
	}

var opt15
=	{
		graphic:
		{
			name: "Indicador 7"
		,	rang_values: 
			[
				{
					to: 0
				,	until:  30
				,	type:   'danger'
				}
			,	{
					until:  70
				,	type:   'warning'
				}
			,	{
					type:   'success'
				}
			]
		,	data: 	function()
					{
						return (Math.random()*100).toFixed(2)
					}
		}
	,	plugin_options:
		{
			format: "<data> %"
		,	range_default: 'info'
		}
	}

var opt16
=	{
		graphic:
		{
			name: "Indicador 8"
		,	rang_values: 
			[
				{
					to: 0
				,	until:  30
				,	type:   'danger'
				}
			,	{
					until:  70
				,	type:   'warning'
				}
			,	{
					type:   'success'
				}
			]
		,	data: 	function()
					{
						return (Math.random()*100).toFixed(2)
					}
		}
	,	plugin_options:
		{
			format: "<data> %"
		,	range_default: 'info'
		}
	}

var opt17
=	{
		graphic:
		{
			name: "Indicador 9"
		,	rang_values: 
			[
				{
					to: 0
				,	until:  30
				,	type:   'danger'
				}
			,	{
					until:  70
				,	type:   'warning'
				}
			,	{
					type:   'success'
				}
			]
		,	data: 	function()
					{
						return (Math.random()*100).toFixed(2)
					}
		}
	,	plugin_options:
		{
			format: "<data> %"
		,	range_default: 'info'
		}
	}

var opt18
=	{
		graphic:
		{
			name: "Indicador 10"
		,	rang_values: 
			[
				{
					to: 0
				,	until:  30
				,	type:   'danger'
				}
			,	{
					until:  70
				,	type:   'warning'
				}
			,	{
					type:   'success'
				}
			]
		,	data: 	function()
					{
						return (Math.random()*100).toFixed(2)
					}
		}
	,	plugin_options:
		{
			format: "<data> %"
		,	range_default: 'info'
		}
	}

var opt14
=	{
		graphic:
		{
			chart:
			{
				events:
				{
					click: gec
				}
			}
		,	title: 
			{
				text: 'Temperatura promedio mensual',
			}
		,	subtitle: 
			{
				text: 'Source: WorldClimate.com',
			}
		,	xAxis: 
			{
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
				'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
			}
		,	yAxis:
			{
				title: 
				{
					text: 'Temperatura (°C)'
				}
			,	plotLines: 
				[
					{
						value: 0,
						width: 1,
						color: '#808080'
					}
				]
			}
		,	tooltip: 
			{
				valueSuffix: '°C'
			}
		,	legend: 
			{
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
				borderWidth: 0
			}
		,	series: 
			[
				{
					name: 'Tokyo',
					data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
				} 
			,	{
					name: 'New York',
					data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
				}
			, 	{
					name: 'Berlin',
					data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
				}
			, 	{
					name: 'London',
					data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
				}
			]
		}
	,	plugin_options:
		{
			minimal_chart:
			{
				view_details_enabled: true
			,	container_to: "#chart"
			/*,	click: 	function()
				{
					$('#chart_container').toggleClass('hidden')
				}*/
			,	button_close_enabled: true
			,	footer_data: '#info1'
			}
		,	container_chart_resize: $("#sidebar")
		}
	}

var opt19
=	{
		graphic:
		{
			rang_values: 
			[
				{
					to: 0
				,	until:  30
				,	type:   'info'
				}
			,	{
					until:  50
				,	type:   'danger'
				}
			,	{
					until:  70
				,	type:   'warning'
				}
			,	{
					type:   'success'
				}
			]
		,	data: 	function()
					{
						return 	_.sortBy(
									_.map(
										_.range((Math.random()*3).toFixed(0))
									,	function()
										{
											return noticias[(Math.random()*(noticias.length - 1)).toFixed(0)]
										}
									)
								,	'horario'
								)
					}
		}
	,	plugin_options:
		{
			template: '#info1_template'
		,	limit: 5
		,	real_time:
			{
				time: 5000
			}
		,	class: 'row 3er-template horizontal-ranking text-center'
		}
	}

var opt20	
=	{
		title:'Acá va un titulo'
	,	slideBody: true
	}