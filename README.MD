#app-butcher
##Project cleaner

###Create config file like config.json:
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
###run
```
node bin/appbutcher.js -f ~/config.json
```
