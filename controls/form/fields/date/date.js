steal(
	'controls/form/fields'
).then(
	'controls/form/fields/date/date.css'
).then(
	function()
	{
		if (Sigma.Form.Fields)
		Sigma.Form.Fields(
			'Sigma.Fields.Date'
		,	{
				defaults:
				{
					name: 'default_name'
				,	label: 'default_label'
				,	'field-col': 'col-md-7'
				,	'label-col': 'col-md-3'
				,	id: undefined
				,	'class': undefined
				,	disabled: false
				,	value: undefined
				,	meses: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
				,	dias: ['Do','Lu','Ma','Mi','Ju','Vi','Sa']
				,	view_hours: 'views/date/hh_mm.mustache'
				,	view_years: 'views/date/yyyy.mustache'
				,	view_months: 'views/date/mm.mustache'
				,	view_days: 'views/date/dd.mustache'
				,	format: 'hh:mm'
				,	min_jumps: 1
				,	hour_jumps: 1
					/*
						yyyy
						mm
						dd
						dd-mm-yyyy			dd/mm/yyyy
						mm-yyyy				mm/yyyy
						hh:mm
						dd-mm-yyyy hh:mm	dd/mm/yyyy hh:mm
					*/
				}
			}
		,	{
				setupContent: function()
				{
					this.done
					=	new can.Observe({label: false, field: false})

					this.$label
					=	can.$()

					this.$field
					=	can.$()

					this.$validations
					=	can.$()

					this.formats
					=	[
							'yyyy','mm','dd','hh:mm'
						,	'dd-mm-yyyy','mm-yyyy','dd-mm-yyyy hh:mm'
						,	'dd/mm/yyyy','mm/yyyy','dd/mm/yyyy hh:mm'
						,	'dd-mm','dd/mm'
						]

					this.$menu
					=	can.$('<div>')
							.addClass('date dropdown-menu')
							.appendTo('body')
							.hide()
				}

			,	_render_content: function()
				{
					this._render_label()
					
					this.setupDatetimepicker()

					this._render_field()
				}

			,	_render_field: function()
				{
					var	self
					=	this
					,	attrs
					=	new can.Observe(
							_.pick(
								this.options
							,	['name','id','class','disabled','value']
							)
						)
					,	$input
					=	can.$('<input>')
							.attr(
								'type'
							,	'text'
							)

					attrs
						.each(
							function(val,attr)
							{
								if(attr=='value')
									val = self._default_value(val)
								$input
									.attr(
										attr
									,	val
									)
							}
						)

					if	(this.options.value instanceof Date)
						$input
							.data('value',this.options.value)

					var valDate
					= 	new Date(this.options.value)

					if(!(_.isDate(valDate) && _.isEqual(valDate.toString(),'Invalid Date')))
						$input
							.data('value',valDate)
					
					$input
						.appendTo(
							this.$element
						)

					if($input.data('value') instanceof Date)
					{
						this.active
						=	$input.data('value')
					}

					this.$field
					=	$input

					can.trigger(
						this.element
					,	'field.sigma.field'
					)
				}

			,	_default_value: function(value)
				{
					var val 
					= 	new Date(value)
					,	return_value
					=	''

					if(!(_.isDate(val) && _.isEqual(val.toString(),'Invalid Date')) && !_.isNumber(value))
					{
							switch(this.toRender)	{
							case	'dd':
								return_value = val.getDate()
								break;
							case	'dd_mm_yyyy':
								return_value = val.getDate()+'-'+(val.getMonth()+1)+'-'+val.getFullYear()
								break;
							case	'dd_mm_yyyy_hh_mm':
								return_value = val.getDate()+'-'+(val.getMonth()+1)+'-'+val.getFullYear() + ' ' + val.getFullHours() + ':' + val.getFullMinutes()
								break;
							case	'mm':
								return_value = val.getMonth()+1
								break;
							case	'mm_yyyy':
								return_value = (val.getMonth()+1)+'-'+val.getFullYear()
								break;
							case	'yyyy':
								return_value = val.getFullYear()
								break;
							case	'hh_mm':
								return_value = val.getFullHours() + ':' + val.getFullMinutes()
								break;
							case	'dd_mm':
								return_value = val.getDate() + '-' + (val.getMonth()+1)
								break;
						}
					}
					else
						if(_.isNumber(value) && _.isEqual(this.toRender,'hh_mm'))
						{
							var naux
							= 	value  % 60
							, 	second_value 
							= 	(naux+'').length == 1
								? 	naux == 0
									? 	'00'
									: 	'0'+naux
								: 	naux

							return_value = parseInt(value  / 60) + ':' + second_value
						}

					return	return_value
				}

			,	setupDatetimepicker: function()
				{
					var	self
					=	this

					if	(_.contains(this.formats,this.options.format))	{
						this.active
						=	this.getInputDate()

						var	splited
						=	this.options.format.split(' ')

						var	date
						=	(splited.length == 2) ? splited[0] : splited[0] == 'hh:mm' ? undefined : splited[0]
						,	hours
						=	(splited.length == 2) ? splited[1] : splited[0] == 'hh:mm' ? splited[0] : undefined

						this.divisor = date && (date.split('-').length > 1) ? '-' : '/'

						this.date = date && date.split(this.divisor)

						this.hours = hours && hours.split(':')

						this.formated = date && date.split(this.divisor)

						_.each(
							this.formated
						,	function(format,i)
							{
								can.bind.call(
									self.element
								,	format+'.sigma.date'
								,	function(ev,val)
									{
										self.formated[i] = (format == 'mm') ? (val+1) : val
									}
								)
							}
						)

						this.toRender = this.getFormat()
					}	else
						steal.dev.log('Sigma.Date - Formato no permitido')

				}

			,	_render_date: function(year,month)
				{
					this
						.$menu
							.empty()

					switch(this.toRender)	{
						case	'dd':
						case	'dd_mm':
						case	'dd_mm_yyyy':
						case	'dd_mm_yyyy_hh_mm':
							this._render_dd(year,month)
							break;
						case	'mm':
						case	'mm_yyyy':
							this._render_mm(year,month)
							break;
						case	'yyyy':
							this._render_yyyy(year,month)
							break;
						case	'hh_mm':
							this._render_hh_mm()
							break;
					}

					this
						.$menu
							.find('td')
								.on(
									'click'
								,	can.proxy(this.click,this)
								)

					this
						.$menu
							.find('th.prev')
								.on(
									'click'
								,	can.proxy(this.jumpPrev,this)
								)

					this
						.$menu
							.find('th.next')
								.on(
									'click'
								,	can.proxy(this.jumpNext,this)
								)

					this
						.$menu
							.find('th.switch')
								.on(
									'click'
								,	can.proxy(this.switchHead,this)
								)
				}

			,	_render_yyyy: function(year)
				{
					var yearToRender
					=	year || this.active.getFullYear()

					can.append(
						this.$menu
					,	can.view(
							steal.idToUri(this.options.view_years).path
						,	this
								.getYears(
									yearToRender
								,	9
								)
						)
					)
					
					if	(
							_.contains(
								_.range(
									yearToRender-4
								,	yearToRender+5
								)
							,	this.active.getFullYear()
							)
						)
							this.getActive()

					switch(this.getFormat()) {
						case 'yyyy':
							this.disableLinks()
							break;
						case 'mm_yyyy':
							this.toSwitch = 'mm'
							break;
						default:
							this.toSwitch = 'dd'
							break;
					}
				}

			,	_render_mm: function(year)
				{
					var yearToDisplay
					=	year || this.active.getFullYear()

					can.append(
						this.$menu
					,	can.view(
							steal.idToUri(this.options.view_months).path
						,	this.getMonths(yearToDisplay)
						)
					)

					if	(_.isEqual(yearToDisplay,this.active.getFullYear()))
						this.getActive()

					switch(this.getFormat()) {
						case 'mm':
							this.disableLinks()
							break;
						default:
							this.toSwitch = 'yyyy'
							break;
					}
				}

			,	_render_dd: function(year,month)
				{
					can.append(
						this.$menu
					,	can.view(
							steal.idToUri(this.options.view_days).path
						,	this
								.getCalendar(
									_.isUndefined(year)		?	this.active.getFullYear()	:	year
								,	_.isUndefined(month)	?	this.active.getMonth()		:	month
								)
						)
					)

					if	(this.sameCalendar(year || this.active.getFullYear(), month || this.active.getMonth()))
						this.getActive()

					switch(this.getFormat()) {
						case 'dd':
							this.disableLinks()
							break;
						default:
							this.toSwitch = 'mm'
							break;
					}
				}

			,	_render_hh_mm: function()
				{
					this._set_hh_mm_default()

					can.append(
						this.$menu
					,	can.view(
							steal.idToUri(this.options.view_hours).path
						,	this.getHour()
						)
					)

					this
						.$menu
							.find('input')
								.on(
									'change'
								,	can.proxy(this.setHourAndMinutes,this)
								)

					this
						.$menu
							.find('div.next-hour')
								.on(
									'click'
								,	can.proxy(this.nextHour,this)
								)

					this
						.$menu
							.find('div.next-minute')
								.on(
									'click'
								,	can.proxy(this.nextMinute,this)
								)

					this
						.$menu
							.find('div.prev-hour')
								.on(
									'click'
								,	can.proxy(this.prevHour,this)
								)

					this
						.$menu
							.find('div.prev-minute')
								.on(
									'click'
								,	can.proxy(this.prevMinute,this)
								)
				}

			,	_set_hh_mm_default: function()
				{
					if(_.isNumber(this.options.value))
					{
						var hh_mm
						=	this._default_value(this.options.value)

						this.minutes
						=	hh_mm.split(':')[1]

						this.hour 
						=	hh_mm.split(':')[0]
					}
					else
						if(!this.minutes || !this.hour)
						{
							var hh_mm
							=	new Date(this.options.value)

							this.minutes
							=	hh_mm.getFullMinutes()

							this.hour 
							=	hh_mm.getFullHours()
						}
				}

			,	getFormat: function()
				{
					return	_.isUndefined(this.date)
							?	this.hours.join('_')
							:	_.isUndefined(this.hours)
								?	this.date.join('_')
								:	this.date.join('_') + '_' + this.hours.join('_')
				}

			,	sameCalendar: function(year,month)
				{
					return	(year == this.active.getFullYear() && month == this.active.getMonth())
				}

			,	disableLinks: function()
				{
					this
						.$menu
							.find('th.prev')
								.unbind()
								.removeClass('prev')
								.empty()

					this
						.$menu
							.find('th.next')
								.unbind()
								.removeClass('next')
								.empty()

					this
						.$menu
							.find('th.switch')
								.unbind()
								.removeClass('switch')
				}

			,	switchHead: function()
				{
					this.toRender = this.toSwitch

					this._render_date()
				}

			,	getActive: function()
				{
					this.year
					=	this.active.getFullYear()

					this.month
					=	this.active.getMonth()

					this.day
					=	this.active.getDate()

					var toActive
					=	_.isEqual(this.toRender,'yyyy')
						?	this.year
						:	_.isEqual(this.toRender,'mm') || _.isEqual(this.toRender,'mm_yyyy')
							?	this.month
							:	this.day
				
					this
						.$menu
							.find('td[date-value="'+toActive+'"]:not(".old, .new")')
								.addClass('active')
				}

			,	show: function()
				{
					if	(this.$menu && this.$menu.is(':hidden'))	{
						var	pos
						=	can.extend(
								{}
							,	this.$field.offset()
							,	{
									height: this.$field[0].offsetHeight
								}
							)

						this.$menu
							.css(
								{
									top: pos.top + pos.height
								,	left: pos.left
								,	'z-index':'1050'
								}
							)

						this
							.$menu
								.show()

						this.shown = true
					}
				}

			,	hide: function()
				{
					this.$menu
							.hide()

					this.element.find('input').focusout()

					this.shown = false

					this.toRender = this.getFormat()
				}

			,	click: function(el,ev)
				{
					if 	(!ev)
						ev = el
					
					ev.preventDefault()
					ev.stopPropagation()

					var	$target
					=	can.$(ev.target)

					if	($target.is('td') && $target.not('.active'))	{

						this.unset()

						this.setActive($target)

						this.select($target)

						this.hide()
					}
				}

			,	setHourAndMinutes: function(ev)
				{
					var value
					= 	$(ev.currentTarget).val()

					if($(ev.currentTarget).hasClass('minutes'))
					{
						if(parseInt(value) > 59)
						{
							this.minutes 
							= 	'59'

							$(ev.currentTarget)
								.val('59')
						}
						else
						{
							this.minutes
							=	value
						}
					}
					else
						if($(ev.currentTarget).hasClass('hour'))
						{
							this.hour 
							= 	value
						}

					this.select()
				}

			,	unset: function()
				{
					this.$menu.find('td.active').removeClass('active')

					this.element.find('input').data('value',undefined)

					this.element.find('input').val("")

					//this.element.find('input').change()
				}

			,	getDisplayedMonth: function($target)
				{
					var	displayedMonth
					=	this.month

					switch(this.toRender)
					{
						case 'dd_mm_yyyy':
							displayedMonth
							=	this
									.options
										.meses
											.indexOf(
												can.trim(
													this
														.$menu
															.find('th.switch')
																.text()
												).split(' ')[0]
											)
							break;
						case 'mm':
							displayedMonth
							=	parseInt(
									$target.attr('date-value')
								)
							break;
						case 'mm_yyyy':
							displayedMonth
							=	parseInt(
									$target.attr('date-value')
								)
							break;
					}

					return	displayedMonth
						
				}

			,	getDisplayedYear: function($target)
				{
					var	displayedYear
					=	this.year

					switch(this.toRender)
					{
						case 'dd_mm_yyyy':
							displayedYear
							=	parseInt(
									can.trim(
										this
											.$menu
												.find('th.switch')
													.text()
									).split(' ')[1]
								)
							break;
						case 'yyyy':
							displayedYear
							=	parseInt(
									$target.attr('date-value')
								)
							break;
					}

					return	displayedYear
				}

			,	getDisplayedDay: function($target)
				{
					var	displayedDay
					=	this.day

					switch(this.toRender)
					{
						case 'dd':
						case 'dd_mm':
						case 'dd_mm_yyyy':
							displayedDay
							=	parseInt(
									$target.attr('date-value')
								)
							break;
					}

					return	displayedDay
				}

			,	nextMinute: function()
				{
					var	$minutes
					=	this.$menu.find('input.minutes')
					,	newVal
					=	parseInt($minutes.val()) + this.options.min_jumps

					if (newVal > 59)	{
						$minutes.val(0)
						this.nextHour()
					}	else	
						$minutes.val(newVal)

					this.select()
				}

			,	prevMinute: function()
				{
					var	$minutes
					=	this.$menu.find('input.minutes')
					,	newVal
					=	parseInt($minutes.val()) - this.options.min_jumps

					if (newVal < 0)	{
						$minutes.val(60 - this.options.min_jumps)
						this.prevHour()
					}	else	
						$minutes.val(newVal)

					this.select()
				}

			,	nextHour: function()
				{
					var	$hour
					=	this.$menu.find('input.hour')
					,	newVal
					=	parseInt($hour.val()) + this.options.hour_jumps
	
					$hour
						.val(
							(newVal > 23)
							?	0
							:	parseInt(newVal)
						)

					this.select()
				}

			,	prevHour: function()
				{
					var	$hour
					=	this.$menu.find('input.hour')
					,	newVal
					=	parseInt($hour.val()) - this.options.hour_jumps

					$hour
						.val(
							(newVal < 0)
							?	24 - this.options.hour_jumps
							:	parseInt(newVal)
						)

					this.select()
				}

			,	setActive: function($target,to)
				{
					var sum
					=	to || 0
					,	displayedMonth
					=	this.getDisplayedMonth($target)
					,	displayedYear
					=	this.getDisplayedYear($target)
					,	activeDay
					=	this.getDisplayedDay($target)
					,	activeMonth
					=	displayedMonth
					,	activeYear
					=	displayedYear

					if	($target.hasClass('old') || sum < 0)
						activeMonth = displayedMonth - 1
					else
						if	($target.hasClass('new') || sum > 0)
							activeMonth = displayedMonth + 1
						else
							activeMonth = displayedMonth

					if	(activeMonth < 0)	{
						activeMonth = 11
						activeYear = activeYear - 1
					}

					if	(activeMonth > 11)	{
						activeMonth = 0
						activeYear = activeYear + 1
					}

					if	(sum != 0 && (!$target.hasClass('old') || !$target.hasClass('new')))
						activeDay
						=	sum > 0
							?	1
							:	this
									.getDaysInMonth(
										activeYear
									,	activeMonth
									) 

					$target
						.addClass('active')

					this.active
					=	new Date(activeYear,activeMonth,activeDay)

					if	($target.hasClass('old') || $target.hasClass('new') || sum != 0)
						this._render_date()
				}

			,	jumpPrev: function(ev)
				{
					ev.preventDefault()
					ev.stopPropagation()

					switch (this.toRender)
					{
						case 'dd_mm':
						case 'dd_mm_yyyy':
							this.year
							=	(this.month == 0)
								?	(this.year - 1)
								:	this.year
							
							this.month
							=	(this.month == 0)
								?	11
								:	(this.month - 1)
							break;
						case 'yyyy':
							this.year = this.year - 9
							break;
						case 'mm_yyyy':
						case 'mm':
							this.year = this.year - 1
							break;
					}

					this._render_date(this.year,this.month)
				}

			,	jumpNext: function(ev)
				{
					ev.preventDefault()
					ev.stopPropagation()

					switch (this.toRender)
					{
						case 'dd_mm':
						case 'dd_mm_yyyy':
							this.year
							=	(this.month == 11)
								?	(this.year + 1)
								:	this.year
							
							this.month
							=	(this.month == 11)
								?	0
								:	(this.month + 1)
							break;
						case 'yyyy':
							this.year = this.year + 9
							break;
						case 'mm_yyyy':
						case 'mm':
							this.year = this.year + 1
							break;
					}							

					this._render_date(this.year,this.month)
				}

			,	select: function(ev)
				{
					if	(this.toRender == 'hh_mm')	{

						this.hour
						=	this.$menu.find('input.hour').val()

						this.minutes
						=	this.$menu.find('input.minutes').val()

						this
							.element
								.find('input')
									.data(
										'value'
									,	this.getSettedDate()
									)

						this
							.element
								.find('input')
									.val(
										this.getHourAndMinutes()
									)

					}	else {
						var	renderCalendar
						=	(this.month != this.active.getMonth()) || (this.year != this.active.getFullYear())

						this.day
						=	this.active.getDate()

						this.month
						=	this.active.getMonth()

						this.year
						=	this.active.getFullYear()

						can.trigger(
							this.element
						,	'mm.sigma.date'
						,	this.month
						)

						can.trigger(
							this.element
						,	'dd.sigma.date'
						,	this.day
						)

						can.trigger(
							this.element
						,	'yyyy.sigma.date'
						,	this.year
						)

						this
							.element
								.find('input')
									.data(
										'value'
									,	this.getSettedDate()
									)

						this
							.element
								.find('input')
									.val(
										this.getFormatedDate()
									)

						if	(renderCalendar)
							this._render_date()
					}

					this.element.find('input').change()
				}

			,	goLeft: function()
				{
					var	$current
					=	this
							.$menu
								.find('td.active')

					if	($current.length > 0)	{
						var	$prev
						=	$current
								.prev()

						$current
							.removeClass('active')

						if	($prev.length > 0)
							this
								.setActive(
									$prev
								)
						else
						{
							if	($current.is('td:first')) {
								this
									.setActive(
										$current
									,	-1
									)
							}	else	{
								var	$prevTr
								=	$current
										.parent('tr')
											.prev()

								if	($prevTr.length > 0)
									this
										.setActive(
											$prevTr
												.find('td:last')
										)
								else
									this
										.setActive(
											$current
												.parent('tr')
													.parent()
														.find('tr:last td:last')
											)
							}
						}
					}
				}

			,	goUp: function()
				{
					var	$active
					=	this.$menu.find('td.active')

					if	($active.length > 0)	{
						var	activePos
						=	$active.parent('tr').find('td').index($active)
						,	$prevTr
						=	$active
								.parent('tr')
									.prev()

						$active
							.removeClass('active')

						if	($prevTr.length > 0)
							this
								.setActive(
									$prevTr
										.find('td:nth-child('+(activePos+1)+')')
								)	
						else
							this
								.setActive(
									$active
										.parent('tr')
											.parent()
												.find('tr:last td:nth-child('+(activePos+1)+')')
								)
					}	else
						this
							.setActive(
								this
									.$menu
										.find('td:last')
							)
				}

			,	goRight: function()
				{
					var	$current
					=	this
							.$menu
								.find('td.active')
					
					if	($current.length > 0)	{	

						var	$next
						=	$current
								.next()
						
						$current
							.removeClass('active')

						if	($next.length > 0)
							this
								.setActive(
									$next
								)
						else
						{
							if	($current.is('td:last')) {
								this
									.setActive(
										$current
									,	1
									)
							}	else	{
								var	$nextTr
								=	$current
										.parent('tr')
											.next()

								if	($nextTr.length > 0)
									this
										.setActive(
											$nextTr
												.find('td:first')
										)
								else
									this
										.setActive(
											$current
												.parent('tr')
													.parent()
														.find('tr:first td:first')
										)
							}
						}
					}
				}

			,	goDown: function()
				{
					var	$active
					=	this.$menu.find('td.active')
						
					if	($active.length > 0)	{

						var	activePos
						=	$active.parent('tr').find('td').index($active)
						,	$nextTr
						=	$active
								.parent('tr')
									.next()
						$active
							.removeClass('active')

						if	($nextTr.length > 0)
							this
								.setActive(
									$nextTr
										.find('td:nth-child('+(activePos+1)+')')
								)
						else
							this
								.setActive(
									$active
										.parent('tr')
											.parent()
												.find('tr:first td:nth-child('+(activePos+1)+')')
								)
					}	else
						this
							.setActive(
								this
									.$menu
										.find('td:first')
							)
				}

			,	getInputDate: function()
				{
					var $input
					=	this.element.find('input') 
					,	date
					=	$input.data('value') || new Date()

					return	date
				}

			,	getHourAndMinutes: function()
				{
					return	(this.hour.length == 1 ? '0'+this.hour : this.hour)
						+	':'
						+	(this.minutes.length == 1 ? '0'+this.minutes : this.minutes)
				}

			,	getSettedDate: function()
				{
					return	new Date(
								this.year	||	new Date().getFullYear()
							,	_.isNumber(this.month)
								?	this.month
								:	new Date().getMonth()
							,	this.day	||	new Date().getDate()
							,	this.hour	||	new Date().getHours()
							,	this.minutes||	new Date().getMinutes()
							)
				}

			,	getFormatedDate: function()
				{
					return	this.formated.join(this.divisor)
				}

			,	getValue: function()
				{
					return	this.element.find('input').val()
				}

			,	getData: function()
				{
					return	this.element.find('input').data('value')
				}

			,	'label.sigma.field': function()
				{
					this.done.attr('label',true)
					this._render_position()
				}

			,	'field.sigma.field': function()
				{
					this.done.attr('field',true)
					this._render_position()
				}

			,	'{window} click': function(el,ev)
				{
					if	((can.$(ev.target).closest('.date').length == 0) && this.shown)
						this.hide()
				}

			,	'{window} keydown': function(el,ev)
				{
					if	(this.shown && _.contains([13,27,37,38,39,40],ev.keyCode))	{

						ev.preventDefault()
						ev.stopPropagation()

						switch(ev.keyCode)
						{
							case 13:
								this.select()
								break;
							case 37:
								this.goLeft()
								break;
							case 38:
								this.goUp()
								break;
							case 39:
								this.goRight()
								break; 
							case 40:
								this.goDown()
								break; 
							case 27:
								this.hide()
								break;
						}
					}

				}

			,	' keydown': function(el,ev)
				{	
					if	(this.shown && ev.keyCode == 9)	{
						this.hide()
					}
				}

			,	'input focusin': function(el,ev)
				{
					ev.preventDefault()
					ev.stopPropagation()

					this._render_date()

					this.show()

					can.trigger(
						this.element
					,	'shown.sigma.date'
					,	this.$menu
					)
				}

			,	isLeapYear: function (year) {
					return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
				}
			,	getDaysInMonth: function (year, month) {
					return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
				}

			,	getHour: function()
				{
					return	new can.Observe(
								{
									hour:		this.hour || 00
								,	minutes:	this.minutes || 00
								}
							)
				}

			,	getMonths: function(year)
				{
					var	i
					=	-1
					,	meses
					=	this.options.meses
					,	today
					=	new Date()

					return 	new can.Observe(
								{
									year:	year
								,	cols:	_.map(
												_.range(4)
											,	function()
												{
													return	{
																months:	_.map(
																			_.range(3)
																		,	function()
																			{
																				i++
																				return	{
																							name: meses[i]
																						,	month: i
																						,	monthClass: ((year == today.getFullYear()) && (i == today.getMonth())) ? 'today' : ''
																						}
																			}
																		)
															}
												}
											)
								}
							)
				}

			,	getYears: function(year,range)
				{
					var	i
					=	(year - 5)
					,	today
					=	new Date().getFullYear()

					return	new can.Observe(
									{
										range:	(year - 4)+' - '+(year + 4)
									,	cols:	_.map(
													_.range(3)
												,	function(col)
													{
														return	{
																	years:	_.map(
																				_.range(3)
																			,	function(offset)
																				{
																					i++
																					return	{
																								year:	i
																							,	yearClass:	i == today ? 'today' : ''
																							}
																				}
																			)
																}
													}
												)
									}
								)
				}

			,	getCalendar: function(year,month)
				{
					var	firstDay
					=	new Date(year,month,1).getDay()
					,	today
					=	new Date()
					,	currentDays
					=	this
							.getDaysInMonth(
								year
							,	month
							)
					,	prevDays
					=	this
							.getDaysInMonth(
								(month == 0)
								?	year - 1
								:	year
							,	(month == 0)
								?	11
								:	month - 1
							)
					,	i
					=	0

					//	DOM LUN MAR MIE JUE VIE SAB
					var	calendar
					=	{
							year:	year
						,	month:	this.options.meses[month]
						,	days:	this.options.dias
						,	weeks:	_.map(
										_.range(Math.ceil((currentDays+firstDay)/7))
									,	function(week)
										{
											return	{
														days:	_.map(
																	_.range(7)
																,	function(day)
																	{
																		i++
								
																		return	(i < (firstDay + 1))
																				?	{
																						day: (1 + prevDays - (firstDay + 1) + i)
																					,	dayClass: 'old'
																					}
																				:	((i - firstDay) <= currentDays)
																					?	{
																							day: (i - firstDay)
																						,	dayClass: ((year == today.getFullYear()) && (month == today.getMonth()) && (i - firstDay) == today.getDate()) ? 'today' : ''
																						}
																					:	{
																							day: ((i - firstDay) - currentDays)
																						,	dayClass: 'new'
																						}
																	}
																)
													}
										}
									)

						}

					return	new can.Observe(calendar)
				}
				
			,	destroy: function()
				{
					steal.dev.log("Destroying "+this.constructor.fullName)
					var	$element
					=	this.element
					this.$menu.remove()
					can.Control.prototype.destroy.call( this )
					$element.remove()
				}

			,	' change': function(el,ev)
				{
					this._super(el,ev)

					if(	this.toRender == 'hh_mm' 
						&& !this.minutes 
						&& !this.hour
					)
					{
						var horario
						= 	$(el)
								.find('input')
									.val()
										.split(':')

						this.minutes
						=	horario[1]

						this.hour
						=	horario[0]

						this
							.element
								.find('input')
									.data(
										'value'
									,	this.getSettedDate()
									)
					}
				}
			}
		)
	}
)