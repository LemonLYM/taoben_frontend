<template>
	<view>
		<view class="publish-title">发布</view>
		<view class="publish-content">
			<textarea class="publish-textarea" value="" placeholder="请输入您要发布的商品介绍" />
			</view>
		<view class="publish-title">商品图片</view>
		<view class="publish-desc">(图片格式支持JPG、PNG、JPEG)</view>
		<view class=" item-new no-border publish-image-box">
				<view class='acea-row row-middle'>
					<view class="upload">
						<view class='pictrue' v-for="(item,index) in pics" :key="index" :data-index="index" @click="getPhotoClickIdx">
							<image :src='item'></image>
							<text class='iconfont icon-guanbi1' @click.stop='DelPic(index)'></text>
						</view>
						<view class='pictrue acea-row row-center-wrapper row-column' @click='uploadpic' v-if="pics.length < 6">
							<text class='iconfont icon-icon25201'></text>
							<view>上传图片</view>
						</view>
					</view>
				</view>		
		</view>
		<button type="primary" >发布</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pics:[]  //商品上传的图片
 			}
		},
		onLoad() {
			console.log('onload')
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
.publish-title{
	margin: 30rpx;
	margin-bottom: 0;
	font-size: 32rpx;
	color: #666;
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
	margin: 30rpx;
	padding: 20rpx;
	box-sizing: border-box;
	border: 1px solid #eee;
	.publish-textarea{
		font-size: 24rpx;
		width: 100%;
		height: 200rpx;
	}
}
.publish-image-box{
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx 30rpx;
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
