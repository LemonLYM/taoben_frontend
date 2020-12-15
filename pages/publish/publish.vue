<template>
	<view class="publish-wrapper">
		<view class="publish-item">
			<view class="name">
				剧本名称
			</view>
			<input class='bookName rightbox' name='bookName' v-model="bookName" placeholder="请输入剧本名称"/>
		</view>
		<view class="publish-item">
			<view class="name">
				售价
			</view>
			<input class='curPrice rightbox' name='curPrice' type='number' v-model="curPrice" placeholder="请输入售价"/>
		</view>
		<text class="tips" v-if='curPrice'>平台会收取5%的服务费，实际到手价格{{curPrice*0.95}}</text>
		<view class="publish-item">
			<view class="name">
				入手价
			</view>
			<input class='prePrice rightbox' name='prePrice' type="number" v-model="prePrice" placeholder="请输入入手价"/>
		</view>
		<view class="publish-item">
			<view class="name">
				数量
			</view>
			<input class='num rightbox' name='num' type="number" v-model="num" placeholder="请输入数量"/>
		</view>
		<view class="publish-item">
			<view class="name">
				新旧程度
			</view>
			<view class="rightbox">
				  <picker @change="bindPickerChange" :value="index" :range="array">
				    <view class="uni-input">{{array[index]}}</view>
				  </picker>
			</view>
		</view>
		
		<view class="publish-title">商品描述</view>
		<view class="publish-content">
			<textarea class="publish-textarea" v-model="textContext" placeholder="请输入您要发布的商品介绍" />
		</view>
		<view class="publish-title-pic">商品图片</view>
		<view class="publish-desc">(图片格式支持JPG、PNG、JPEG)</view>
		<view class=" item-new no-border publish-image-box">
				<view class='acea-row row-middle'>
					<view class="upload">
						<view class='pictrue' v-for="(item,index) in pics" :key="index" :data-index="index" @click="getPhotoClickIdx">
							<image :src='item'></image>
							<text class='iconfont icon-guanbi1' @click.stop='DelPic(index)'></text>
						</view>
						<view class='pictrue acea-row row-center-wrapper row-column' @click='uploadpic' v-if="pics.length < 10">
							<text class='iconfont icon-icon25201'></text>
							<view>上传图片</view>
						</view>
					</view>
				</view>		
		</view>
		<view class="publish-item">
			<view class="name">
				运费
			</view>
			<view class="deliverPriceWrapper">
				<input class="deliverPrice" type="number" name='deliverPrice' v-model="deliverPrice"/>
				<checkbox-group @change="checkboxChange">
				<label >
					<checkbox value="0"  /><text>包邮</text>
				</label>
				</checkbox-group>
			</view>
		</view>
		<view class="publish-item">
			<view class="name">
				所在城市
			</view>
			<view class="address">
				{{region[1]}}
				<picker mode="multiSelector" @change="bindRegionChange" @columnchange="bindMultiPickerColumnChange" :value="valueRegion"
				 :range="multiArray">
					<view class='acea-row'>
						<view class="picker"></view>
						<view class='iconfont icon-dizhi font-color'></view>
					</view>
				</picker>
			</view>
		</view>
		<button type="primary" @click="formSubmit">发布</button>
	</view>
</template>

<script>
	import {
		getCity
	} from '@/api/api.js';
	export default {
		data() {
			return {
				bookName:'',//剧本名称
				curPrice:'',//售价
				prePrice:'',//原价
				num:'',//数量
				index:0,
				array:['请选择','三成新','五成新','七成新','九成新','全新'],
				textContext:'',//商品描述
				pics:[],  //商品上传的图片
				deliverPrice:'',//运费
				valueRegion: [0, 0, 0],
				multiArray:[],
				multiIndex: [0, 0, 0],
				region: ['',''],
				validate:false //校验状态
 			}
		},
		onLoad() {
			console.log('onload')
			this.getCityList();
		},
		//tabbar点击就会触发
		onTabItemTap(e){
			console.log(e)
		},
		//页面每次显示都会触发
		onShow() {
			console.log('onshow')
		},
		methods: {
			checkboxChange:function(e){
				debugger
				let value =  e.detail.value
				if(value.length == 0){
					this.deliverPrice = ''
				}else{
					this.deliverPrice = value[0]
				}

			},
			validateForm: function() {
				debugger
				let that = this
				if (!this.bookName) return that.$util.Tips({
					title: '请请输入剧本名称'
				});
				if (!this.curPrice) return that.$util.Tips({
					title: '请输入售价'
				});
				if (!this.prePrice) return that.$util.Tips({
					title: '请输入入手价'
				});
				if (!this.num) return that.$util.Tips({
					title: '请输入数量'
				});
				if (!this.index) return that.$util.Tips({
					title: '请选择新旧程度'
				});
				if (!this.textContext) return that.$util.Tips({
					title: '请输入商品描述'
				});
				if (this.pics.length === 0) return that.$util.Tips({
					title: '请上传商品图片'
				});
				if (this.deliverPrice === '') return that.$util.Tips({
					title: '请输入运费'
				});
				if(!this.region[1])return that.$util.Tips({
					title: '请选择所在城市'
				});
				that.validate = true;
				return true;
			},
			formSubmit: function(e) {
				let that = this;
				if (that.validateForm() && that.validate) {
			// 		create({
			// 			phone: that.merchantData.phone,
			// 			mer_name: that.merchantData.enterprise_name,
			// 			name: that.merchantData.user_name,
			// 			code: that.merchantData.yanzhengma,
			// 			merchant_category_id: that.merchantData.classification,
			// 			images: that.pics
			// 		}).then(data => {
			// 			if (data.status == 200) {
			// 				title: '发布成功',
			// 				that.loading = true;
			// 				this.timer = setTimeout(() => {
			// 					that.successful = true;
			// 				}, 1000)
			// 			}
			
			// 		}).catch(res=>{
			// 			that.$util.Tips({
			// 				title: res
			// 			});
			// 		})
				}
			},
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
			bindPickerChange:function(e){
				this.index = e.detail.value
			},
			//点击上传照片
			uploadpic: function() {
				let that = this;
				that.$util.uploadImageOne({url:'upload/image',count:6}, function(res) {
					console.log(res);
					that.pics.push(res.data.path);
					that.$set(that, 'pics', that.pics);
				});
			
			},
			getPhotoClickIdx(e) {
				let _this = this;
				let idx = e.currentTarget.dataset.index;
				_this.imgPreview(_this.pics, idx);
			},
			// 图片预览
			imgPreview: function(list, idx) {
				// list：图片 url 数组
				if (list && list.length > 0) {
					uni.previewImage({
						current: list[idx], //  传 Number H5端出现不兼容 
						urls: list
					});
				}
			},
			//删除照片
			DelPic: function(index) {
				pic = this.pics[index];
				this.pics.splice(index, 1);
				this.$set(that, 'pics', that.pics);
			}
		}
	}
</script>

<style lang="scss">
.publish-wrapper{
	padding: 0 30rpx;
	// font-size: 32rpx;
	.publish-item{
		justify-content: space-between;
		display: flex;
		padding: 30rpx;
		border-top: 1rpx solid #eee;
		align-items: center;
		// width: 475rpx;
		font-size: 30rpx;
		.deliverPriceWrapper{
			flex: 1;
			display: flex;
			input{
				flex: 1;
			}
			label{
				width: 200rpx;
			}
		}
	}
	.name{
		    width: 195rpx;
		    font-size: 30rpx;
		    color: #333;
	}
	.address{
		display: flex;
		flex: 1;
	}
	.bookName{
		// width: 400rpx;
	}
	.rightbox{
		flex:1;
	}
	.tips{
		margin-left: 30rpx;
	}
}
.publish-title{
	margin-bottom: 0;
	padding: 30rpx;
	font-size: 30rpx;
	border-top: 1rpx solid #eee;
	
}
.publish-title-pic{
	margin-bottom: 0;
	padding: 30rpx;
	padding-bottom: 0;
	font-size: 30rpx;
}
.publish-desc{
	color: #B2B2B2;
	font-size: 22rpx;
	margin-top: 9rpx;
	line-height: 36rpx;
	width: 100%;	
	margin-left: 30rpx;
}	
.publish-content{
	padding: 20rpx;
	box-sizing: border-box;
	border: 1px solid #eee;
	// margin-left: 30rpx;
	.publish-textarea{
		font-size: 24rpx;
		width: 100%;
		height: 200rpx;

	}
}
.publish-image-box{
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx 0rpx;
	margin-left: 30rpx;
	.upload {
		display: -webkit-box;
		display: -moz-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-lines: multiple;
		-moz-box-lines: multiple;
		-o-box-lines: multiple;
		-webkit-flex-wrap: wrap;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
		margin-top: 20rpx;
	}
	.pictrue{
		width: 130rpx;
		height: 130rpx;
		margin: 24rpx 22rpx 0 0;
		position: relative;
		font-size: 11px;
		color: #bbb;
		
		&:nth-child(4n) {
			margin-right: 0;
		}
		
		&:nth-last-child(1) {
			border: 0.5px solid #ddd;
			box-sizing: border-box;
		}
		
		
		uni-image,
		image {
			width: 100%;
			height: 100%;
			border-radius: 1px;
		
			img {
				-webkit-touch-callout: none;
				-webkit-user-select: none;
				-moz-user-select: none;
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				opacity: 0;
				width: 100%;
				height: 100%;
			}
		}
		
		.icon-guanbi1 {
			font-size: 33rpx;
			position: absolute;
			top: -10px;
			right: -10px;
		}
	}
	.publish-image-item{
		position: relative;
		width: 33.33%;
		height: 0;
		padding-top: 33.33%;
		box-sizing: border-box;
		// border: 1px solid red;
	}
	.close-icon{
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		right: 0;
		top:0;
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		background-color: #ff5a5f;
		z-index: 2;
		
	}
	.image-box{
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		bottom: 10rpx;
		left: 10rpx;
		border: 1px solid #eee;
		border-radius: 5px;
		overflow: hidden;
		image{
			width: 100%;
			height: 100%;
		}
	}
}
.publish-button{
	margin: 0 30rpx;
	background-color: $uni-bg-color-mask;
}
</style>
