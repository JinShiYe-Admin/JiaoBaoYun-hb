Vue.component("file-item", {
	props: ['file','index'],
	template: '<li >' +
		'<span v-if="file.type==0">你好</span>' +
		'<img v-else v-bind:style="{\'background-image\':\'file.path\'}"/>' +
		'<p class="">{{file.fileName}}</p>' + '<span class="" v-on:click="delcell">删除</span>' + '</li>',
	methods:{
		delcell:function(){
			this.$emit('delcell',['index']);
		}
	}
})
var fileList=new Vue({
	el:'#filesList',
	data:{
		filesArr:[]
	},
	methods:{
		pushFilesArr:function(files){
			this.filesArr=files.concat(this.filesArr);
			console.log("获取数组的长度："+this.filesArr.length+"具体内容："+JSON.stringify(this.filesArr));
		},
		delFile:function(index){
			this.filesArr.splice(index,1);
		}
	}
})
