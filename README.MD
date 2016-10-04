#app-butcher
##Project cleaner

1. Create config file like config.json:
```
{
	"projectPath": "/home/user/testProject",
	"remove": [
		"a.js",
		"b/c.js"
	],
	"clean": [
		"d.js"
	],
	"filter": [
		{
			"path": "e.js",
			"lines": 2,
			"match": "remove_me"
		}
	],
	"rmdirs": [
		"e"	
	]
}
```
2. run
```
node bin/appbutcher.js -f ~/config.json
```
