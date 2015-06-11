steal(
	'controls/control'
,	'controls/form'
,	'controls/login/login.css'
,	'can/util/string/deparam'
).then(
	function()
	{
		Sigma.Control(
			'Sigma.Login'
		,	{
				defaults:
				{
					view:	'views/login/login.mustache'
				,	view_signup:	undefined
				,	allow_signup:	true
				,	data:
					{
						signin:
						[
							{
								type:		'legend'
							,	label:		'Ingresar'
							,	name:		'ingresar'
							}
						,	{
								type:		'text'
							,	name:		'username'
							,	label:		'Usuario'
							,	required: 	true
							}
						,	{
								type:		'password'
							,	name:		'password'
							,	label:		'Contraseña'
							,	required: 	true
							}
						,	{
								type:		'checkbox'
							,	name:		'remember_me'
							,	label:		'Recordame'
							}
						,	{
								type:		'btn-group'
							,	'class':	'btn-group-justified'
							,	name:		'login_buttons'
							,	buttons:
								[
									{
										type:	'button'
									,	name:	'signup'
									,	label:	'Registrarse'
									,	'class':'login-signup btn-default'
									}
								,	{
										type:	'button'
									,	name:	'signin'
									,	label:	'Entrar'
									,	submit: true
									,	'class':'login-signin btn-primary'
									}
								]
							}
						]
					,	signup:
						[
							{
								type:		'text'
							,	name:		'username'
							,	label:		'Usuario'
							,	required:	true
							,	validate:	'required'
							}
						,	{
								type:		'password'
							,	name:		'password'
							,	label:		'Contraseña'
							,	required:	true
							,	validate:	'required'
							}
						,	{
								type:		'password'
							,	name:		'confirm_password'
							,	label:		'Confirmar contraseña'
							,	required:	true
							,	validate:	['required','equal:confirm_password']
							}
						]
					}
				,	onSignin:	undefined
				,	onSignup:	undefined
				,	onSuccess:	undefined
				,	onFail:		undefined
				,	onLogout: 	undefined
				}
			}
		,	{	

				_render_content: function(data)
				{
					this._super(data)

					var	$content
					=	this.element.find('.login-content')

					this.signinForm
					=	new Sigma.Form(
							$content
						,	{
								data:	data.attr('signin')
							,	'class':	'form-signin'
							,	onSubmit: can.proxy(this.onSignin,this)
							,	onSuccess: can.proxy(this.onSuccess,this)
							,	onFail: can.proxy(this.onFail,this)
							}
						)

					if	(!this.options.show_help)
						this.element.find('.help-block').remove()

					//	PROBLEMAS CON EL STEAL
					// if	(localStorage)
					// 	this._update_form_values()

					this.element.find('input[name=username]').focus()

					var self
					=	this

					this.element
						.find('form')
							.bind(
								'keyup'
							,	function(ev){
									if(ev.keyCode == 13){
										self.options.onSignin(
											_.mapValues(self.signinForm.getFormData().attr(),'value')
										).then(
											self.options.onSuccess
										,	can.proxy(self.onFail,self)
										)
									}
								}
							)
				}

			,	' logout': function(el,ev)
				{
					this._clean(this.element)

					this
						.options
							.onLogout()
							.always(can.proxy(this._enable_login,this))
				}

			// ,	_update_form_values: function()
			// 	{
			// 		for (var name in localStorage)
			// 		{
			// 			var	$field
			// 			=	this.element.find('[name="'+name+'"]')

			// 			if	($field.length != 0)
			// 				$field.val(localStorage[name])
			// 		}	
			// 	}

			,	_disable_login: function()
				{
					this
						.element
							.find('input, select, a, button, textarea')
								.addClass('disabled')
				}

			,	_enable_login: function()
				{
					this
						.element
							.find('.disabled')
								.removeClass('disabled')
				}

			,	parseLoginForm: function(data)
				{
					var	loginData
					=	{}

					data
						.each(
							function(constructor,key)
							{
								loginData[key] = constructor.value
							}
						)

					return	loginData
				}

			,	onSuccess: function(data)
				{
					if	(can.isFunction(this.options.onSuccess))
						this.options.onSuccess(data)
					else
						steal.dev.log('Funcion onSuccess no proporcionada...') 
				}

			,	onFail: function(result)
				{
					var data 
					= 	can.isDeferred(result)
						? 	$.parseJSON(result.responseText)
						: 	result

					if	(can.isFunction(this.options.onFail))
						this.options.onFail(data)
					else{
						this
							.element
								.find('p.text-danger')
									.remove()
						this
							.element
								.find('.form-group:last')
									.after(
										can.$('<p>')
											.addClass('text-danger')
												.html(
													data.message
												)
									)
					}

				}

			,	onSignin: function(data)
				{
					this._disable_login()

					return	this
								.options
									.onSignin(this.parseLoginForm(data))
									.always(
										can.proxy(this._enable_login,this)
									)
				}
			
			// ,	'replica': function()
			// 	{
			// 		if	(
			// 				can.isFunction(this.options.onSignin)
			// 			&&	this.signinForm.isReadyToSubmit()
			// 		)
			// 		{

			// 			this._disable_login()

			// 			this.options.onSignin(this.signinForm.getFormData().form)
			// 				.done(
			// 					can.proxy(this._render_success,this)
			// 				)
			// 				.fail(
			// 					can.proxy(this._render_fail,this)
			// 				)
			// 				.always(
			// 					can.proxy(this._enable_login,this)
			// 				)
			// 			//rustico como las papas
			// 			//el localStorage.setItem debe ser forzado a tomar todo como string
						
			// 			var data_form
			// 			=this
			// 				.signinForm
			// 					.getFormData()
			// 						.form
						
			// 			if(data_form.remember_me=="")
							
			// 				localStorage
			// 					.setItem('dataform',JSON.stringify(aux))
						
			// 			// para recuperar data del localStorage debo usar
			// 			// JSON.parse(localStorage.getItem('dataform')
								
			// 		}	
			// 		else
			// 			{
			// 				this.signinForm._check_validations()
			// 				steal.dev.log("Funcion onSignin no proporcionada...")
			// 			}

			// 	}
			// ,	'.login-signin:not(".disabled") click':function()
			// 	{
			// 		this.replica()
			// 	}


			,	'.login-signup:not(".disabled") click': function()
				{
					this.signupForm
					=	new	Sigma.Form.Modal(
							can.$('<div>')
						,	{
								data:		this.options.data.attr('signup')
							,	title:		this.options.data.attr('signup_label')
							,	onSubmit:	this.options.onSignup
							}
						)
				}
			}
		)
	}
)
