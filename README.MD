#app-butcher
##Project cleaner

[![Known Vulnerabilities](https://snyk.io/test/npm/app-butcher/badge.svg)](https://snyk.io/test/npm/app-butcher)
[![bitHound Overall Score](https://www.bithound.io/github/wygodny/app-butcher/badges/score.svg)](https://www.bithound.io/github/wygodny/app-butcher)
[![bitHound Dependencies](https://www.bithound.io/github/wygodny/app-butcher/badges/dependencies.svg)](https://www.bithound.io/github/wygodny/app-butcher/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/wygodny/app-butcher/badges/code.svg)](https://www.bithound.io/github/wygodny/app-butcher)
[![bitHound Dev Dependencies](https://www.bithound.io/github/wygodny/app-butcher/badges/devDependencies.svg)](https://www.bithound.io/github/wygodny/app-butcher/master/dependencies/npm)

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
