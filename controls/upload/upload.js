steal(
	'controls/control'
,	'controls/upload/upload.css'
).then(
	function()
	{
		Sigma.Control(
			'Sigma.Upload'
		,	{
				pluginName: 'sigma_upload'
			,	defaults:
				{
					view:			'views/upload/init.mustache'
				,	view_upload:	'views/upload/upload.mustache'
				,	view_remove:	'views/upload/remove.mustache'
				,	view_reopen:	'views/upload/reopen.mustache'
				,	view_open:		'views/upload/open.mustache'
				,	view_ext_alert:	'views/upload/ext_alert.mustache'
				}
			}
		,	{
				_render_content: function(data)
				{
					this.$upload
					=	this.getUpload()

					this.$upload_control
					=	this.getUploadControl()

					this.$upload
						.appendTo(this.element)

					this.$upload_control
						.appendTo(this.element)

					this._render_open_button(this.$upload)

					this.changeFile = false
				}

			,	getUpload: function()
				{
					var	$upload
					=	can.$('<div>')
							.addClass('fileupload')
					,	$preview
					=	can.$('<div>')
							.addClass('fileupload-preview')
							.append(
								can.$('<span>')
									.addClass('preview-name text-info')
									.text('Seleccione un archivo...')
							)
							.appendTo($upload)
					,	$fileIcon
					=	can.$('<i>')
							.addClass('fa fa-file')
							.prependTo($preview)
					,	$input
					=	can.$('<input>').attr('type','file')
					,	$buttons
					=	can.$('<div>')
							.addClass('fileupload-buttons')
							.appendTo($upload)

					$input
						.hide()
						.appendTo($upload)

					return	$upload
				}

			,	getUploadControl: function()
				{
					var	$progress
					=	can.$('<div>')
							.addClass('progress')
							.addClass('progress-striped')
					
					can.$('<div>')
						.addClass('progress-bar')
						.css('width',this.options.completed)
						.appendTo(
							$progress
						)
					
					can.$('<span>')
						.text(this.options.completed)
							.appendTo(
								$progress
							)

					return	can.append(
								can.append(
									can.$('<div>')
										.addClass('upload-control')
										.hide()
								,	can.$('<p>')
										.addClass('text-muted')
								)
							,	$progress
							)
				}

			,	_render_open_button: function($upload)
				{
					can.$('<i>')
						.addClass('fa fa-folder-open')
						.prependTo(
							can.$('<button>')
								.attr('type','button')
								.addClass('btn btn-primary fileupload-open')
								.text(this.options.data.attr('open'))
								.appendTo(
									$upload
										.find('.fileupload-buttons')
								)
						)
				}

			,	_render_reopen_button: function($upload)
				{
					can.$('<i>')
						.addClass('fa fa-folder-open')
						.prependTo(
							can.$('<button>')
								.attr('type','button')
								.addClass('btn btn-primary fileupload-reopen')
								.text(this.options.data.attr('reopen'))
								.appendTo(
									$upload
										.find('.fileupload-buttons')
								)
						)
				}

			,	_render_remove_button: function($upload)
				{
					can.$('<i>')
						.addClass('fa fa-times')
						.prependTo(
							can.$('<button>')
								.attr('type','button')
								.addClass('btn btn-danger fileupload-remove')
								.text(this.options.data.attr('remove'))
								.appendTo(
									$upload
										.find('.fileupload-buttons')
								)
						)
				}

			,	validateFileExtension: function(file)
				{
					var	ext
					=	file.name.split('.').pop()

					if	(
							!can.isEmptyObject(this.options.fileExtension)
						&&	this.options.fileExtension.indexOf(ext)	!=	-1
						)
						{
							this.printError(
									"Extension no permitida."
								,	"Solo se permiten: " + this.options.fileExtension.join(', ').toUpperCase()
							)
							return	false
						}
					return	true
				}

			,	'button.fileupload-open click': function(el,ev)
				{
					this.$upload
						.find('input[type="file"]')
							.click()
				}

			,	'button.fileupload-reopen click': function(el,ev)
				{
					this.$upload
						.find('input[type="file"]')
							.click()
				}

			,	'input[type="file"] change': function(el,ev)
				{
					if	(ev.target.files.length != 0 && this.validateFileExtension(ev.target.files[0]))
					{
						if	(this.$upload.find('.fileupload-open').is(':visible'))
						{
							can.$(el).data('file',ev.target.files[0])

							this.$upload
									.find('.fileupload-open')
										.hide()

							this._render_reopen_button(this.$upload)

							this._render_remove_button(this.$upload)
						}	

						this.$upload
								.find('.preview-name')
									.text(ev.target.files[0].name)

					}
				}

			,	'.fileupload-remove click': function()
				{
					var	$input
					=	this.element.find('input[type="file"]').clone()

					$input.data('file',{})

					this.$upload
							.find('.preview-name')
								.text('Seleccione un archivo...')

					this.element
							.find('.fileupload-buttons .btn')
								.remove()

					this.$upload
							.find('input[type="file"]')
								.replaceWith(
									$input.hide()
								)

					this.$upload
							.change()

					this._render_open_button(this.$upload)
				}

			,	uploadFile: function(formData)
				{
					var	self
					=	this

					this.$upload_control
							.show()

					can.ajax(
						can.extend(
							{
								type:	'POST'
							,	url:	this.options.ajax.url
							,	data:	formData
							}
						,	this.getAjaxSetup()
						)
					).then(
						function(data)
						{
							can.trigger(
								self.element
							,	'upload_complete'
							,	data
							)
						}
					)
				}

			,	updateControl: function(completed)
				{
					this.$upload_control
							.find('.progress-bar')
								.css('width',completed)

					this.$upload_control
							.find('span')
								.text(completed)
				}

			,	onLoadstart: function(ev)
				{
					//	Comenzo el Upload
					steal.dev.log("Uploading File")

					this.$upload_control
							.find('p')
								.text(
									'Subiendo archivo...'
								)

					this.updateControl('0%')
					
					this.$upload_control
							.find('.progress-bar')
								.addClass('active')
								.removeClass('progress-bar-danger')
								.removeClass('progress-bar-success')
				}

			,	onProgress: function(ev)
				{
					//	Progreso del Upload
					//	->	ev.loaded	(Lo que se cargo)
					//	->	ev.total	(El total a subir)
					var	loaded
					=	ev.originalEvent.loaded
					,	total
					=	ev.originalEvent.total
					,	completed
					=	Math.ceil((loaded/total)*100)
					steal.dev.log("Uploaded "+loaded+" of "+total+" - Completed: "+Math.ceil((loaded/total)*100)+"%")
					
					this.updateControl(completed+'%')

					if	(completed == 100)
						can.trigger(
							this.element
						,	'upload_complete_but_waiting'
						)
				}

			,	onSuccess: function(ev)
				{
					//	Termino el upload de forma satisfactoria
					steal.dev.log("File Uploaded")
					this.$upload_control
							.find('p')
								.text(
									'Archivo Subido...'
								)
					
					this.updateControl('100%')
					
					this.$upload_control
							.find('.progress-bar')
								.addClass('progress-bar-success')
				}

			,	onError: function(ev)
				{
					//	Termino el upload con un error
					steal.dev.log("Upload Fail")

					this.$upload_control
							.find('p')
								.text(
									'Ocurrio un error. Por favor vuelva a intentarlo...'
								)

					this.updateControl('100%')
					
					this.$upload_control
							.find('.progress-bar')
								.addClass('progress-bar-danger')
				}

			,	onComplete: function(ev)
				{
					//	Termino el upload (Tanto de forma satisfactoria o con un error)
					steal.dev.log("Upload Complete")
					can.trigger(
						this.element
					,	'upload_complete'
					)
				}

			,	getAjaxSetup: function()
				{
					var	self
					=	this

					return	{
								processData: false
	  						,	contentType: false
							,	xhr: function(jqXHR)
								{
									var	xhr
									=	can.ajaxSettings.xhr()

									$(xhr.upload)
									 	.bind(
									 		{
									 			loadstart:	can.proxy(self.onLoadstart,self)
									 		,	progress:	can.proxy(self.onProgress,self)
											}
										)

									return xhr;
								}
							,	success:	can.proxy(self.onSuccess,self)
							,	error:		can.proxy(self.onError,self)
							,	complete:	can.proxy(self.onComplete,self)
							}	
				}
			}
		)
	}
)