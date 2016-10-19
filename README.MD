#app-butcher
##Project cleaner

[![Known Vulnerabilities](https://snyk.io/test/npm/app-butcher/badge.svg)](https://snyk.io/test/npm/app-butcher)

###Install
```
sudo npm install -g app-butcher
```

###Create app-butcher.conf config file inside project main dir:
```
remove file.js
remove dir.file.js
clean file2.js
filter file3.js 2 remove_me
rmdir dir-path
```

###or create config file like config.json:
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

###Run
```
appbutcher -p /my-project-dir-path
```
or
```
appbutcher -f ~/config.json
```

###Steps
- remove - Remove files 
- clean - Set empty file content
- filter - Remove number of lines from file
- rmdir - Remove directory recursively
