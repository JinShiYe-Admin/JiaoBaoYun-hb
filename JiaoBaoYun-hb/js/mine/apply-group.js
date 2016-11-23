mui.init()
var list=document.getElementById('groups-container');
mui.plusReady(function() {
	var search_group = document.getElementById('search-group');
	search_group.addEventListener('search', function() {
		//清空子数据
		clearChildren();
		var wd=plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_PostGList({
			vtp: 'ag', //要获取的项:cg(创建的群),ug(参与群),mg(协管的群),ag(所有的群),ig(群信息vvl对应群ID)
			vvl: search_group.value
		}, wd, function(data) {
			wd.close();
			console.log('申请入群获取的群数据：'+JSON.stringify(data));
			if(data.RspCode=='0000'){
				setData(data.RspData);
			}else{
				mui.toast(data.RspTxt);
			}
		})
	})
})
var setData=function(data){
	data.forEach(function(cell,i,data){
		var li=document.createElement('li');
		li.className='mui-table-view-cell';
		li.innerHTML=createInner(cell);
		list.appendChild(li);
	})
}
/**
 * 
 * @param {Object} cell (gid gname gimg)
 */
var createInner=function(cell){
	return  '<a class="mui-navigate-right">'+
	'<img src="'+cell.gimg?cell.gimg:'../../image/utils/default_personalimage.png'+'"/>'+cell.gname+'</a>'
}
var clearChildren=function(){
	while(list.firstElementChild){
		list.remove(list.firstElementChild);
	}
}
