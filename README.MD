#app-butcher
##Project cleaner

###Create config file like config.json:
```
{
	"projectPath": "/home/{userName}/testProject",
	"steps": [
		{
			"type": "remove",
			"paths": [
				{ "path": "file.js" },
				{ "path": "dir/file.js" }
			]
		}, {
			"type": "clean",
			"paths": [
				{ "path": "file2.js" }
			]
		}, {
			"type": "filter",
			"paths": [
				{ "path": "file3.js", "lines": 2, "match": "remove_me" }
			]
		}, {
			"type": "rmdir",
			"paths": [
				{ "path": "dir-path" }
			]
		}
	]
}
```

###Install
```
git clone https://github.com/wygodny/app-butcher.git
cd app-butcher
sudo npm link
```

###Run
```
appbutcher -f ~/config.json
```

###Steps
- remove - Remove files 
- clean - Set empty file content
- filter - Remove number of lines from file
- rmdir - Remove directory recursively
