var files = (function(mod) {
	mod.getFilesByWWW = function() {
		mod.getFiles(plus.io.PRIVATE_WWW);
	};
	mod.getFilesByDOC = function() {
		mod.getFiles(plus.io.PRIVATE_DOC);
	};
	mod.getFilesPDOC = function() {
		mod.getFiles(plus.io.PUBLIC_DOCUMENTS);
	};
	mod.getFilesDownload = function() {
		mod.getFiles(plus.io.PUBLIC_DOWNLOADS);
	};
	mod.getFiles = function(type) {
		plus.io.requestFileSystem(type, function(fs) {
			// 可通过fs进行文件操作 
			mod.readDirectory(fs.root)
			console.log("files" + fs.name);
		}, function(e) {
			alert("Request file system failed: " + e.message);
		});
	}
	mod.readDirectory = function(directory) {
		var directoryReader = directory.createReader();
		var entries = [];
		console.log("whatever")
		directoryReader.readEntries(function(entries) {
			var i;
			for(i = 0; i < entries.length; i++) {
				console.log(JSON.stringify(entries[i].name));
			}
		}, function(e) {
			alert("Read entries failed: " + e.message);
		});

	}
	mod.getFileByPath = function(path,callback) {
		plus.io.resolveLocalFileSystemURL(path, function(entry) {
//			console.log(JSON.stringify(entry.File.fileName))
				// Read data from file
			var reader = null;
			entry.file(function(file) {
				reader = new plus.io.FileReader();
				console.log("getFile:" + JSON.stringify(file));
				reader.onloadend = function(evt) {
					console.log("Read success:"+evt.target.result);
					// Get data
					var fileStream=window.btoa(evt.target.result)
					
					console.log(fileStream);
					
					callback(fileStream);
				};
//				reader.readAsBinaryString(file)
				reader.readAsText(file,'UTF-8');
			}, function(e) {
				console('获取文件流错误：'+e.message);
			});
		}, function(e) {
			consle.log(e.message)
		})
	}
	return mod;
})(window.files || {})