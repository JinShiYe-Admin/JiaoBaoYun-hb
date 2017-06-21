Vue.component("file-item", {
	props: ['file','index'],
	template: '<li class="mui-table-view-cell" v-bind:style="{display:\'flex\',display:\'-webkit-flex\',\'align-items\':\'center\',\'min-height\':\'60px\'}" >' +
		'<span v-if="true" v-bind:class="[\'iconfont\',file.icon]" v-bind:style="{\'font-size\':\'42px\'}"></span>' +
		'<img  v-else v-bind:src="file.path"  v-bind:style="{width:\'42px\',height:\'42px\'}"/>' +
		'<p v-bind:style="{width:\'50%\',\'flex-grow\':\'1\',\'padding-left\':\'5px\',\'padding-right\':\'5px\',\'word-wrap\':\'break-word\',\'word-break\':\'break-all\'}">{{file.fileName}}</p>' +
		'<span class="iconfont icon-shanchu" v-on:click="delcell(index)" v-bind:style="{color:\'#13b7f6\',\'font-size\':\'20px\',\'padding-left\':\'5px\'}"></span>' + '</li>',
	methods:{
		delcell:function(index){
			this.$emit('delcell',index);
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
			console.log("删除的时第几个："+index)
			this.filesArr.splice(index,1);
		}
	}
})
