var files=(function(mod){
	mod.getFilesByWWW=function(){
		mod.getFiles(plus.io.PRIVATE_WWW);
	};
	mod.getFilesByDOC=function(){
		mod.getFiles(plus.io.PRIVATE_DOC);
	};
	mod.getFilesPDOC=function(){
		mod.getFiles(plus.io.PUBLIC_DOCUMENTS);
	};
	mod.getFilesDownload=function(){
		mod.getFiles(plus.io.PUBLIC_DOWNLOADS);
	};
	mod.getFiles=function(type){
		plus.io.requestFileSystem(type, function( fs ) {
			// 可通过fs进行文件操作 
			mod.readDirectory(fs.root)
			console.log( "files"+fs.name );
		}, function ( e ) {
			alert( "Request file system failed: " + e.message );
		} );
	}
	mod.readDirectory=function(directory){
		var directoryReader = directory.createReader();
	 	var entries = [];
	 	console.log("whatever")
	  	directoryReader.readEntries( function( entries ){
				var i;
				for( i=0; i < entries.length; i++ ) {
					console.log(JSON.stringify(entries[i].name) );
				}
			}, function ( e ) {
				alert( "Read entries failed: " + e.message );
			} );
			
	}
	mod.getFileByPath=function(path){
		
		plus.io.resolveLocalFileSystemURL(path,function(entry){
			console.log(JSON.stringify(entry))
		},function(){
			
		})
	}
	return mod;
})(window.files||{})
