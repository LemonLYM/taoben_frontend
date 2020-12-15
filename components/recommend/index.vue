<template>
	<view class='recommend'>
		<!-- <view class='title acea-row row-center-wrapper'>
			<text class='iconfont icon-zhuangshixian'></text>
			<text class='name'>热门推荐</text>
			<text class='iconfont icon-zhuangshixian lefticon'></text>
		</view> -->
		<view class="common-hd">
			<view class="title">为你推荐</view>
		</view>
		<view class='recommendList acea-row row-between-wrapper' :class="indexP?'on':''">
			<view  class='left'>
			<view v-for="(item,index) in hostProduct" :key="index" hover-class='none' @tap="goDetail(item)">
				<view class="item" v-if="index%2 ==0">
					<view class='pictrue'>
						<image :src='item.image'></image>
						<text class="pictrue_log_big pictrue_log_class" v-if="item.activity && item.activity.type === '1'">秒杀</text>
						<text class="pictrue_log_big pictrue_log_class" v-if="item.activity && item.activity.type === '2'">砍价</text>
						<text class="pictrue_log_big pictrue_log_class" v-if="item.activity && item.activity.type === '3'">拼团</text>
					</view>
					<view class="text">
						<view class='name'><text v-if="item.merchant.is_trader" class="font-bg-red">自营</text>{{item.store_name}}</view>
						<view class="tag">
							6人，现代，恐怖，硬核，进阶，盒装，开放，欢乐，机制
						</view>
						<view class="acea-row row-middle price-favor">
							<view class='money font-color'>￥<text class='num'>{{item.price}}</text></view>
							<text class="coupon font-color-red" v-if="item.issetCoupon&&false">领券</text>
							<text class="favor-num">9999人想要</text>
						</view>
						<view class="user-info">
							<view class="avatr-img-wrapper">
								<image class="avatr-img" src='../../static/images/f.png'></image>
								<text>嘻嘻嘻李</text>
							</view>
							<text class="credibility">信誉极好</text>
						</view>
					</view>
				</view>
			</view>
			</view>
			<view  class=' right'>
			<view v-for="(item,index) in hostProduct" :key="index" hover-class='none' @tap="goDetail(item)">
				<view class="item" v-if="index%2 ==1">
					<view class='pictrue'>
						<image :src='item.image'></image>
						<text class="pictrue_log_big pictrue_log_class" v-if="item.activity && item.activity.type === '1'">秒杀</text>
						<text class="pictrue_log_big pictrue_log_class" v-if="item.activity && item.activity.type === '2'">砍价</text>
						<text class="pictrue_log_big pictrue_log_class" v-if="item.activity && item.activity.type === '3'">拼团</text>
					</view>
					<view class="text">
						<view class='name'><text v-if="item.merchant.is_trader" class="font-bg-red">自营</text>{{item.store_name}}</view>
						<view class="acea-row row-middle price-favor">
							<view class='money font-color'>￥<text class='num'>{{item.price}}</text></view>
							<text class="coupon font-color-red" v-if="item.issetCoupon&&false">领券</text>
							<text class="favor-num">9999人想要</text>
						</view>
						<view class="user-info">
							<view class="avatr-img-wrapper">
								<image class="avatr-img" src='../../static/images/f.png'></image>
								<text>嘻嘻嘻李</text>
							</view>
							<text class=" credibility">信誉极好</text>
						</view>
					</view>
				</view>
			</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapGetters} from "vuex";
	import { goShopDetail } from '@/libs/order.js'
	export default {
	computed: mapGetters(['uid']),
		props: {
			hostProduct: {
				type: Array,
				default: function() {
					return [];
				}
			},
			indexP:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			};
		},

		methods: {
			goDetail(item){
				goShopDetail(item,this.uid).then(res=>{
					uni.navigateTo({
						url:`/pages/goods_details/index?id=${item.product_id}`
					})
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.font-bg-red{
		display: inline-block;
		background: #E93424;
		color: #fff;
		font-size: 20rpx;
		width: 58rpx;
		text-align: center;
		line-height: 34rpx;
		border-radius: 5rpx;
		margin-right: 8rpx;
	}
	.common-hd {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 118rpx;
	
		.title {
			padding: 0 80rpx;
			font-size: 34rpx;
			color: $theme-color;
			font-weight: bold;
			background-image: url("~@/static/images/index-title.png");
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: left center;
		}
	}
	// .recommend {
	// 	background-color: #fff;
	// }

	// .recommend .title {
	// 	height: 135rpx;
	// 	font-size: 28rpx;
	// 	color: #282828;
	// }

	// .recommend .title .name {
	// 	margin: 0 28rpx;
	// }

	// .recommend .title .iconfont {
	// 	font-size: 170rpx;
	// 	color: #454545;
	// }

	// .recommend .title .iconfont.lefticon {
	// 	transform: rotate(180deg);
	// }

	.recommend .recommendList {
		padding: 0 20rpx;
		// width: 710rpx;
		display: flex;
		align-items: start;
	}
	.recommend .recommendList .left{
		// width: 340rpx;
	}
	.recommend .recommendList .right{
		// width: 340rpx;
	}
	.recommend .recommendList.on{
		padding: 0;
	}

	.recommend .recommendList .item {
		width: 340rpx;
		margin-bottom: 30rpx;
		background-color: #fff;
		border-radius: 16rpx;
		padding-bottom: 20rpx;
	}
	
	.recommend .recommendList .item .text{
		padding: 0 20rpx;
		margin-top: 10rpx;
		.user-info{
			.credibility{
				color: #5ab5ef;
				border: 1px solid #5ab5ef;
				border-radius: 50rpx;
				padding: 0 10rpx;
			}
			.avatr-img-wrapper{
				display: flex;
				align-items: center;
			}
			margin-top: 10rpx;
			font-size: 26rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.avatr-img{
				width: 36rpx;
				height: 36rpx;
				border-radius: 50%;
				margin-right: 6rpx;
			}
		}
	}
	
	.recommend .recommendList .item .coupon{
		background:rgba(255,248,247,1);
		border:1px solid rgba(233,51,35,1);
		border-radius:4rpx;
		font-size:20rpx;
		margin-left: 18rpx;
		padding: 1rpx 4rpx;
	}

	.recommend .recommendList .item .pictrue {
		position: relative;
		width: 100%;
		height: 345rpx;
	}

	.recommend .recommendList .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 16rpx 16rpx 0 0;
	}

	.recommend .recommendList .item .name {
		font-size: 28rpx;
		color: #282828;
		margin: 20rpx 0 0rpx 0;
		font-weight: bold;
	}
	.recommend .recommendList .item {
		.price-favor{
			justify-content: space-between;
		}
		.tag{
			font-size:24rpx
		}
	}

	.recommend .recommendList .item .favor-num{
		font-size: 22rpx;
	}
	.recommend .recommendList .item .money {
		font-size: 20rpx;
		font-weight: bold;
	}

	.recommend .recommendList .item .money .num {
		font-size: 34rpx;
	}
</style>
