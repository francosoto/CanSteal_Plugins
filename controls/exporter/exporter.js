steal(
	'lib'
,	'can/control'
).then(
	function()
	{
		can.Control(
			'Sigma.Exporter'
		,	{
				defaults:
				{
					template:
					{
						excel:	'<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
					}
				,	uri:
					{
						excel:	'data:application/vnd.ms-excel;base64,'
					,	csv:	'data:application/csv;base64,'
					}
				}
			}
		,	{
				init: function(element,options)
				{
					steal.dev.log(this.constructor.fullName)
				}

			,	getBase64:	function(s)
				{
					return	window.btoa(unescape(encodeURIComponent(s)))
				}

			,	getFormat:	function(s, c)
				{
					return	s
								.replace(
									/{(\w+)}/g
								,	function(m, p)
									{
										return c[p];
									}
								)
				}

			,	tableToCSV:	function(table)
				{
					var	data
					=	""
					
					for (var i = 0, row; row = table.rows[i]; i++)
					{
						for (var j = 0, col; col = row.cells[j]; j++)
						{
							data = data + (j ? ',' : '') + col.html()
						}
						data = data + "\n"
					}

					return data;
				}

			,	toExcel: function(fileName, table, workSheetName,fix_table_fn)
				{
					var table_all
					=	table	

					if(table.length > 1)
					{
						table_all
						=	$('<table border="1px solid"></table>')

						_.forEach(
							table
						,	function(ts)
							{
								table_all
									.append(
										'<tbody><tr><td colspan="10"></td></tr></tbody>'+$(ts).html()
									)
							}	
						)
					}

					if(_.isFunction(fix_table_fn))
						fix_table_fn(table_all)

					var	ctx
					= 	{
							worksheet: workSheetName || 'Worksheet'
						,	table: table_all.html()
						}
					,	hrefvalue
					=	this.options.uri.excel
					+	this
							.getBase64(
								this
									.getFormat(
										this.options.template.excel
									,	ctx
									)
							)
					
					this
						.element
							.attr(
								{
									href:		hrefvalue
								,	download:	fileName+'.xls'
								}
							)
				}

			,	toCSV: function(fileName,table)
				{
					var	csvData
					=	this.tableToCSV(table)
					,	hrefvalue
					=	uri.csv
					+	this.getBase64(csvData)

					this
						.element
							.attr(
								{
									href:		hrefvalue
								,	download:	fileName+'.csv'
								}
							)
				}
			}
		)
	}
)