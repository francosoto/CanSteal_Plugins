steal(
	'jquery'
).then(
	'qunit/qunit-1.12.0.css'
,	'qunit/qunit-1.12.0.js'
).then(
	function()
	{
		QUnit.load()
	}
)