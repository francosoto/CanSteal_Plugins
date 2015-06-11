steal(
	'controls/control'
).then(
	function()
	{
		can.Control(
			'Sigma.Autocomplete'
		,	{
				defaults:
				{
					min_length:	3
				,	display:	'name'
				,	timer:		undefined
				,	view_item:	undefined
				,	ajax:		undefined
				,	source:		undefined
				,	model: 		undefined
				,	aditional_query: {}
				}
			}
		,	{
				init: function(element,options)
				{
					this.$input
					=	this.element.is('input')
						?	this.element
						:	this.element.find('input')

					this.$menu
					=	can.$('<ul>')
							.addClass('typeahead dropdown-menu')
							.appendTo('body')
							.hide()						

					this.$input
							.bind(
								{
									keyup:	can.proxy(this._keyup,this)
								,	blur: can.proxy(this.blur,this)	
								,	focusin: can.proxy(this.show,this)	
								}
							)

					this.shown
					=	false

					this.$input.data('value',false)

					if	(options.value)
						this._set_default_value()
				}

			,	_set_default_value: function()
				{
					this.$input
							.val(
								this.options.value.attr(this.options.display)
							)
							.data(
								'value'
							,	this.options.value
							)
				}

			,	update: function(data)
				{
					if	(
							can.isArray(data)
						||	data instanceof can.Observe.List
						)
							this.options.source
							=	data
					else
						this.options.ajax
						=	data
				}

			,	_render_items: function(list)
				{
					this.$menu.empty()

					if	(list.length)
					{
						list
							.each(
								can.proxy(
									this._render_item
								,	this
								)
							)

						this.list = list

						this._update_data_input()

						this.show()
					}
				}

			,	_render_item: function(item)
				{
					var itemA
					=	this._get_item_model(item)
					,	$li
					=	(this.options.view_item)
						?	can.append(
								can.$('<li>')
							,	can.view(
									steal.idToUri(this.options.view_item).path
								,	item
								)
							)
						:	can.append(
								can.$('<li>')
							,	can.$('<a>')
									.text(
										itemA[this.options.display]
									)
							)
					
					$li
						.find('a')
							.data('item',item)
					
					$li
						.appendTo(
							this.$menu
						)

					this._highlight_result($li.find('a'),item)
				}

			,	_highlight_result: function($a,item)
				{
					var	value
					=	this.$input.val()
					,	itemA 
					=	this._get_item_model(item)
					,	init
					=	itemA[this.options.display]
							.substring(
								0
							,	itemA[this.options.display].toLowerCase()
									.indexOf(
										value.toLowerCase()
									)
							)
					,	toReplace
					=	itemA[this.options.display]
							.substring(
								itemA[this.options.display].toLowerCase()
									.indexOf(
										value.toLowerCase()
									)
							,	itemA[this.options.display].toLowerCase()
									.indexOf(
										value.toLowerCase()
									)
								+	value.length
							)
					,	rest
					=	itemA[this.options.display]
							.substring(
								itemA[this.options.display].toLowerCase()
									.indexOf(
										value.toLowerCase()
									)
								+	value.length
							)

					$a
						.html(
							$a
								.html()
									.replace(
										itemA[this.options.display]
									,	init+'<strong>'+toReplace+'</strong>'+rest
									)
						)
				}

			,	_keyup: function(ev)
				{
					ev.preventDefault()
					ev.stopPropagation()
					switch(ev.keyCode)
					{
						case 13:
							if	(this.shown)
								this.select()
							break;
						case 38:
							if	(this.shown)
								this.prev()
							break;
						case 40:
							if	(this.shown)
								this.next()
							break;
						case 27:
							if	(this.shown)
								can.trigger(
									this.$input
								,	'blur'
								)
							break;
						default:
							if	(this.$input.val().length >= this.options.min_length)
								this.search(this.$input.val())
							else
								this.hide()
							break;
					}
				}

			,	show: function()
				{
					if	(this.$menu.find('li').length && this.$menu.is(':hidden') && this.element.parent('div').find('input:focus').length)
					{
						var	pos
						=	can.extend(
								{}
							,	this.$input.offset()
							,	{
									height: this.$input[0].offsetHeight
								}
							)

						this.$menu
							.css(
								{
									top: pos.top + pos.height
								,	left: pos.left
								,	width:	this.$input.innerWidth()
								,	'z-index':'1050'
								}
							)

						this.$menu.show()

						this.$menu
								.find('li:first')
									.addClass('active')
						
						this.$menu
								.find('li')
									.bind(
										{
											mouseover: function(ev)
											{
												var	$el
												=	can.$(ev.currentTarget)
												
												if	(!$el.hasClass('active'))
												{
													$el
														.parent()
															.find('li.active')
															.removeClass('active')
													$el
														.addClass('active')
												}
											}
										,	mouseout: function(ev)
											{
												can.$(ev.currentTarget)
													.parent()
														.find('li.active')
														.removeClass('active')
											}
										,	click: can.proxy(this.select,this)
										}
									)

						this.shown = true
					}
				}

			,	hide: function()
				{
					this.$menu
							.find('*')
							.unbind()

					this.$menu
							.hide()

					this.shown = false
				}

			,	next: function()
				{
					var	$current
					=	this.$menu.find('li.active')

					$next
					=	$current[0]
						?	$current
								.removeClass('active')
								.next()
						:	this.$menu.find('li:first')

					$next
						.addClass('active')					
				}

			,	prev: function()
				{
					var	$current
					=	this.$menu.find('li.active')

					$prev
					=	$current[0]
						?	$current
								.removeClass('active')
								.prev()
						:	this.$menu.find('li:last')

					$prev
						.addClass('active')					
				}

			,	select: function()
				{
					var	$current
					=	this.$menu.find('li.active')
					,	val_input
					=	this.options.model
						?	$current.find('a').data('item').attr(this.options.model).attr(this.options.display)
						: 	$current.find('a').data('item')
							?	$current.find('a').data('item').attr(this.options.display)
							:	undefined
					,	input_data
					=	this.$input.data('value') 
						?	this.$input.data('value').attr(this.options.display)
						: 	''
					
					$current
					=	$current[0]
						?	$current
						:	this.$menu.find('li:last')

					if(	val_input && input_data != val_input)
					{
						this.setItem(val_input,$current.find('a').data('item'))
					}
				}

			,	setItem: function(value,item)
				{
					this
						.$input
							.val(
								value
							)
							.data(
								'value'
							,	item
							)

					this.$menu
						.find('li:not(.active)')
							.remove()

					this.hide()

					can.trigger(
						this.$input
					,	'selected.sigma.typeahead'
					,	item
					)
				}

			,	blur: function (el,ev)
				{
					var	self
					=	this
					,	event
					=	ev || el

					event.preventDefault()
					event.stopPropagation()

					setTimeout(
						function()
						{
							if (!self.$menu.is(':focus'))	{
								self.hide()
							}
						}
					,	150
					)

				}

			,	' change': function(el,ev,enable)
				{
					this._update_data_input()
					// if	(_.isBoolean(enable) && !enable)	{
					// 	ev.preventDefault()
					// 	ev.stopPropagation()
					// }
				}

			,	create_query: function(value)
				{
					return	_.extend(
								this.options.aditional_query
							,	{
									key:	this.options.display
								,	value:	value
								,	model: 	this.options.model
								}
							)
				}

			,	search: function(value)
				{
					var	self
					=	this

					if	(this.timer)
						clearTimeout(this.timer)

					this.timer
					=	setTimeout(
							function()
							{
								var	query
								=	self.create_query(value)
								if	(self.options.source)
									self.search_source(query)
								else
									if	(self.options.ajax)
										self.search_ajax(query)
							}
						,	500
						)
				}

			,	search_source: function(query)
				{
					this._render_items(
						new can.Observe.List(
							can.grep(
								this.options.source
							,	function(data)
								{
									return	data[query.key].toLowerCase().indexOf(query.value.toLowerCase()) != -1
								}
							)
						)
					)
				}

			,	search_ajax: function(query)
				{
					var	ajaxRequest
					=	can.isFunction(this.options.ajax)
						?	this.options.ajax(query)
						:	can.ajax(
								can.extend(
									{
										method: 'POST'
									,	data:	query
									}
								,	this.options.ajax	||	{}
								)
							)
					,	self
					=	this

					ajaxRequest
						.pipe(
							function(result)
							{
								return	new	can.Observe.List(result)
							}
						).then(
							can.proxy(this._render_items,this)
						,	function(result)
							{
								steal.dev.log("Ajax Request Fail",result)
							}
						)
				}

			,	_update_data_input: function()
				{
					var self
					=	this

					this.$input.data('value',false)

					if(this.list)
					{
						this
							.list
								.each(
									function(item,index,list)
									{
										var itemA
										=	self._get_item_model(item)

										if(_.isEqual(self.$input.val().toLowerCase(),itemA[self.options.display].toLowerCase()))	{
											self.setItem(itemA[self.options.display],item)
											return false
										}
									}
								)
					}
					else
						self.$input.data('value',false)
				}

			,	_get_item_model: function(item)
				{
					return this.options.model
						?	item.attr(this.options.model)
						: 	item
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
			}
		)
	}
)