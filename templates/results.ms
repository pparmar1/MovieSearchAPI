<!DOCTYPE html>
<html>
<head>
	<title>Results of movie</title>
	<!--<link rel="stylesheet" type="text/css" href="{{base}}/css/style.css">-->
</head>
<body>
<h1>View results here </h1>
	{{#results}}
		{{Title}}
		{{Year}}
		{{imdbID}}
	{{/results}}
</body>
</html>