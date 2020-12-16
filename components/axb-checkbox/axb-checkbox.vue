<template>
	<view class="style-flex style-flex-wrap">
		<filter-radio-item v-for="(item, idx) in items" :pid="item.pid" :key="idx" :name="item.cate_name" :value="item.store_category_id" :checked="item.checked||false" @change="radioChange"></filter-radio-item>
	</view>
</template>

<script>
	import filterRadioItem from './axb-checkbox-item.vue'
	export default {
		props:{
			list:{
				type:Array,
				default: []
			},
			multi:{
				type:Boolean,
				default:false
			}
		},
		components:{
			filterRadioItem
		},
		data() {
			return {
				items: this.list.map((item)=>{
					console.log(Object.assign(item,{checked:false}))
					return Object.assign(item,{checked:false})
				}),
				resMulti: [],
			};
		},
		created(){
debugger
		},
		computed:{
		},
		methods:{
			handleChange:function(val){
				const arr = []
				// 是否为全部
				if(val==='all'){
					debugger
					let allr = this.items.find((n) => n.store_category_id === val)
					this.items.forEach(function(item){
						debugger
						let re = {}
						re.cate_name = item.cate_name
						re.store_category_id = item.store_category_id
						re.checked= !allr.checked
						arr.push(re)
					})
				} else{
					for(let i =0; i<this.items.length;i++){
						let r = {}
						r.cate_name = this.items[i].cate_name
						r.store_category_id = this.items[i].store_category_id
						r.pid = this.items[i].pid
						if(this.multi){ // 多选
							if(this.items[i].store_category_id === val){ // 选中项处理
								r.checked = !this.items[i].checked
							}
							else{
								r.checked=this.items[i].checked
							}
						}else{ // 单选
							if(this.items[i].store_category_id === val){ // 选中项处理
								r.checked = !this.items[i].checked
								r.pid = this.items[i].pid
							}else{
								r.checked = false
							}	
						}
						arr.push(r)
					}
				}
				// 判断是否全选 全选按钮未全选
				if(this.multi&&arr[0].store_category_id==='all'){
					const select = arr.slice(1)
					let r = select.every(function(val){
						return val.checked
					})
					arr[0].checked = r
				}
				this.items = arr
			},
			radioChange: function (e) {
				debugger
				console.log('radio发生change事件，携带value值为：' + e)
				// 改变单击项 
				this.handleChange(e)
				const re = []
				if(this.multi){
					this.items.forEach(function(val){
						if(val.checked){
							re.push(val.store_category_id)
						}
					})
				}
				let r = this.items.find((val)=>{
					return val.store_category_id === e
				})
				let result = this.multi?re:r.checked ? {[r.pid]:e} : {[r.pid]:''}
				// 返回选择项
				this.$emit('change',result)
			},
			reset:function(){
				this.items=this.list
			},
			setItems:function(val){
				this.items = val
			}
		}
	}
</script>

<style>
/* .radio{
	display: inline-block;
	height: 60upx;
	line-height: 60upx;
	padding: 0 22upx;
	background: #f7f7f7;
	border: 1px solid #c3c3c3;
	border-radius: 10upx;
	font-size: 26upx;
	color: #7d7d7d;
	box-sizing: border-box;
 }
 .radio:not(:last-child){
	 margin: 0 20upx 30upx 0;
 }
 .radio-primay{
	 background: #d5e4fd;
	 color: #3c7ef6;
	 border: 1px solid #3c7ef6;
 }
 .radio-width-default{
	 width: 120upx;
	 text-align: center;
	 padding: 0;
 } */
</style>
