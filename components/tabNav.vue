<template>
	<view class="navTabBox">
		<view class="longTab">
			<scroll-view 
			  scroll-x="true" 
				style="white-space: nowrap; display: flex;" 
				scroll-with-animation 
				:scroll-left="tabLeft" 
				show-scrollbar="true">
				<view class="longItem" 
				      :style='"width:"+isWidth+"rpx"' 
							:data-index="index" 
							:class="index===tabClick?'click':''"
							v-for="(item,index) in tabTitle"
							:key="index" :id="'id'+index" 
							@click="longClick(index,item.store_category_id,item.pid)">
							<view class="seleced-address" v-if='item.store_category_id ===240'>
								{{region[1].length===3?region[1].slice(0,2) : '同城'}}
								<view class="address">
									<picker mode="multiSelector" @change="bindRegionChange" @columnchange="bindMultiPickerColumnChange" :value="valueRegion"
									 :range="multiArray">
										<view class='acea-row'>
											<view class="picker"></view>
											<view class='iconfont icon-dizhi font-color'></view>
										</view>
									</picker>
								</view>
							</view>
							<text v-else>
								{{item.cate_name}}
							</text>
							</view>
				<view class="underlineBox" :style='"transform:translateX("+isLeft+"rpx);width:"+50+"rpx"'>
					<view class="underline bg-color-red"></view>
				</view>
			</scroll-view>
		</view>
	<!-- 	<view class="child-box" v-if="tabClick>0 && tabTitle[tabClick].children.length>0">
			<scroll-view scroll-x="true" style="white-space: nowrap; display: flex;align-items: center; height: 100%;" scroll-with-animation :scroll-left="tabLeft" show-scrollbar="false">
				<view class="wrapper">
					<view v-for="(item,index) in tabTitle[tabClick].children" class="child-item" :class="{on:index == childIndex}" @click="childTab(tabClick,index)">
						<image :src="item.pic" mode=""></image>
						<view class="txt">{{item.cate_name}}</view>
					</view>
				</view>
			</scroll-view>
		</view> -->
	</view>
</template>

<script>
	import {
		getCity
	} from '@/api/api.js';
	let app = getApp();
	export default {
		name: 'navTab',
		props: {
			tabTitle: {
				type: Array,
				default: []
			}

		},
		data() {
			return {
				valueRegion: [0, 0, 0],
				multiArray:[],
				multiIndex: [0, 0, 0],
				region: ['北京市','北京市'],
				tabClick: 0, //导航栏被点击
				isLeft: 0, //导航栏下划线位置
				isWidth: 90, //每个导航栏占位
				tabLeft:0,
				swiperIndex:0,
				childIndex:0,
				childID:0
			};
		},
		created() {
			
			var that = this
			this.getCityList();
			// 获取设备宽度
			uni.getSystemInfo({
				success(e) {
					// that.isWidth = e.windowWidth / 5 
				}
			})
		},
		methods: {
			// 地址数据
			getCityList: function() {
				let that = this;
				getCity().then(res => {
					this.district = res.data
					that.initialize();
				})
			},
			initialize: function() {
				let that = this,
					province = [],
					city = [],
					area = [];
				if (that.district.length) {
					let cityChildren = that.district[0].children || [];
					let areaChildren = cityChildren.length ? (cityChildren[0].children || []) : [];
					that.district.forEach(function(item) {
						province.push(item.name);
					});
					cityChildren.forEach(function(item) {
						city.push(item.name);
					});
					areaChildren.forEach(function(item) {
						area.push(item.name);
					});
					this.multiArray = [province, city, area]
				}
			},
			bindRegionChange: function(e) {
				let multiIndex = this.multiIndex,
					province = this.district[multiIndex[0]] || {
						children: []
					},
					city = province.children[multiIndex[1]] || {
						city_id: 0
					},
					multiArray = this.multiArray,
					value = e.detail.value;
			
				this.region = [multiArray[0][value[0]], multiArray[1][value[1]], multiArray[2][value[2]]]
				// this.$set(this.region,0,multiArray[0][value[0]]);
				// this.$set(this.region,1,multiArray[1][value[1]]);
				// this.$set(this.region,2,multiArray[2][value[2]]);
				this.cityId = city.city_id
				this.valueRegion = [0, 0, 0]
				this.initialize();
			},
			bindMultiPickerColumnChange: function(e) {
				let that = this,
					column = e.detail.column,
					value = e.detail.value,
					currentCity = this.district[value] || {
						children: []
					},
					multiArray = that.multiArray,
					multiIndex = that.multiIndex;
				multiIndex[column] = value;
				switch (column) {
					case 0:
						let areaList = currentCity.children[0] || {
							children: []
						};
						multiArray[1] = currentCity.children.map((item) => {
							return item.name;
						});
						multiArray[2] = areaList.children.map((item) => {
							return item.name;
						});
						break;
					case 1:
						let cityList = that.district[multiIndex[0]].children[multiIndex[1]].children || [];
						multiArray[2] = cityList.map((item) => {
							return item.name;
						});
						break;
					case 2:
			
						break;
				}
				// #ifdef MP
				this.$set(this.multiArray, 0, multiArray[0]);
				this.$set(this.multiArray, 1, multiArray[1]);
				this.$set(this.multiArray, 2, multiArray[2]);
				// #endif
				// #ifdef H5
				this.multiArray = multiArray;
				// #endif
			
			
			
				this.multiIndex = multiIndex
				// this.setData({ multiArray: multiArray, multiIndex: multiIndex});
			},
			// 导航栏点击
			longClick(index,id,fid){
				app.globalData.fid = fid;
				this.childIndex = 0;
				if(this.tabTitle.length>5){
					var tempIndex = index - 2;
					tempIndex = tempIndex<=0 ? 0 : tempIndex;
					this.tabLeft = (index-2) * this.isWidth //设置下划线位置
				}
				this.tabClick = index //设置导航点击了哪一个
				this.isLeft = index * this.isWidth //设置下划线位置
				
				// let obj = {
				// 	type:'big',  //大标题
				// 	index:index
				// }
				let obj = {
					index:index,
					pid:id//自己的id
				}
				
				this.parentEmit(obj);
				
				// this.$parent.currentTab = index //设置swiper的第几页
			},
			// 导航子类点击
			// childTab(tabClick,index){
			// 	this.childIndex = index
			// 	let obj = {
			// 		parentIndex:tabClick,
			// 		childIndex:index,
			// 		type:'small' //小标题
			// 	}
			// 	this.parentEmit(obj)
			// }
			parentEmit(obj){
				this.$emit('changeTab', obj);
			}
		}
	}
</script>

<style lang="scss">
	.seleced-address{
		display: flex;
		.iconfont{
			font-size: 12px;
		}
	}
	.navTabBox {
		width: 100%;
		color: rgba(255, 255, 255, 1);
		.click {
			color: white;
		}
		.longTab {
			width: 100%;
			/* #ifdef H5 */
			padding-bottom: 20rpx;
			/* #endif */
			/* #ifdef MP */
			padding-top: 12rpx;
			padding-bottom: 12rpx;
			/* #endif */
			.longItem{ 
				vertical-align: bottom;
				height: 50upx; 
				display: inline-block;
				line-height: 50upx;
				text-align: left;
				font-size: 28rpx;
				color: #333333;
				max-width: 180rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				&.click{
					font-weight: bold;
					font-size: 30rpx;
					color: #E93323;
				}
			}
			// .longItem:last{
			// 	width: 50px !important;
			// }
			.underlineBox {
				height: 3px;
				width: 20%;
				display: flex;
				align-content: center;
				justify-content: center;
				transition: .5s;
				.underline {
					width: 33rpx;
					height: 4rpx;
				}
			}
		}
	}
	.child-box{
		width: 100%;
		position: relative;
		// height: 152rpx;
		background-color: #fff;
		/* #ifdef H5 */
		box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.02);
		/* #endif */
		/* #ifdef MP */
		box-shadow: 0 2rpx 3rpx 1rpx #f9f9f9;
		/* #endif */
		
		.wrapper{
			display: flex;
			align-items: center;
			padding: 20rpx 0;
			background: #fff;
			/* #ifdef H5 */
			//box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.06);
			/* #endif */
		}
		.child-item{
			flex-shrink: 0;
			width:140rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-left: 10rpx;
			image{
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
			}
			.txt{
				font-size: 24rpx;
				color: #282828;
				text-align: center;
				margin-top: 10rpx;
			}
			&.on{
				image{
					border: 1px solid $theme-color-opacity;
				}
				.txt{
					color: $theme-color;
				}
			}
		}
	}
</style>
