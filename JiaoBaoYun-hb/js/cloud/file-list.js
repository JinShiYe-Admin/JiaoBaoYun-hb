Vue.component("file-item", {
	props: ['file','index'],
	template: '<li class="mui-table-view-cell" v-bind:style="{display:\'flex\',display:\'-webkit-flex\',\'align-items\':\'center\'}" >' +
		'<span v-if="file.type==0">你好</span>' +
		'<img v-bind:src="file.path"  v-bind:style="{width:\'50px\',height:\'50px\'}"/>' +
		'<p v-bind:style="{width:\'50%\',\'flex-grow\':\'1\',\'padding-left\':\'5px\',\'padding-right\':\'5px\'}">{{file.fileName}}</p>' + '<span class="" v-on:click="delcell">删除</span>' + '</li>',
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
