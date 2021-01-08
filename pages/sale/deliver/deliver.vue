<template>
	<view>
		<form @submit="deliverygood" report-submit='true'>
			<view class="ChangePassword">
				<view class="list">
					<view class="item">
						<picker @change="bindPickerChange" :value="index" :range="array" range-key='label' style="height: 100%;">
						  <view class="uni-input" style="line-height: 110rpx;font-size: 32rpx;">{{array[index].label}}</view>
						</picker>
					</view>
					<view class="item">
						<input type='number' placeholder='填写物流单号' placeholder-class='placeholder' v-model="code"></input>
					</view>
				</view>
				<button form-type="submit" class="confirmBnt bg-color">确定</button>
			</view>
		</form>
		<!-- #ifdef MP -->
		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize>
		<!-- #endif -->
	</view>
</template>

<script>
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import {
		bindingPhone,
		verifyCode,
		getDeliverList,
		deliveryGood
	} from '@/api/api.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import { registerVerify } from '@/api/user.js'
	import {
		mapGetters
	} from "vuex";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	export default {
		mixins: [sendVerifyCode],
		components: {
			// #ifdef MP
			authorize
			// #endif
		},
		data() {
			return {
				code:'',   //手机号
				array:[{label:'请选择物流公司',value:0}],
				index:0,
				id:0,
				validate:false,
				orderId: 0
			};
		},
		computed: mapGetters(['isLogin']),
		onLoad(opts) {
			if (this.isLogin) {
				// verifyCode().then(res=>{
				// 	this.$set(this, 'key', res.data.key)
				// });
				this.orderId = opts.id
				this.deliverList()
			} else {
				// #ifdef H5 || APP-PLUS
				toLogin();
				// #endif 
				// #ifdef MP
				this.isAuto = true;
				this.$set(this, 'isShowAuth', true)
				// #endif
			}
		},
		methods: {
			validateForm: function() {
				let that = this
				if (this.index==0) return that.$util.Tips({
					title: '请选择物流公司'
				});
				if (!this.code) return that.$util.Tips({
					title: '请输入物流单号'
				});
				that.validate = true;
				return true;
			},
			onLoadFun:function(){
				this.isShowAuth = false;
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			deliverList:function(e){
				getDeliverList().then(res=>{
				   this.array =this.array.concat(res.data) 
				});
			},
			bindPickerChange:function(e){
				this.index= e.detail.value
				this.id = this.array[this.index].value
			},
			
			deliverygood:function(e){
				if (this.validateForm() && this.validate) {
					deliveryGood(this.orderId, {
						delivery_type:1,
						delivery_name	:this.id,
						delivery_id	:this.code
					}).then(res=>{
						if(res.status ===200){
							uni.navigateTo({
								url: `/pages/sale/sale`
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff !important;
	}

	.ChangePassword .phone {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		margin-top: 55rpx;
		width: 150rpx;
		border: 1px solid #fff;
		
	}

	.ChangePassword .list {
		width: 580rpx;
		margin: 53rpx auto 0 auto;
	}

	.ChangePassword .list .item {
		width: 100%;
		height: 110rpx;
		border-bottom: 2rpx solid #f0f0f0;
	}

	.ChangePassword .list .item input {
		width: 100%;
		height: 100%;
		font-size: 32rpx;
	}

	.ChangePassword .list .item .placeholder {
		color: #b9b9bc;
	}

	.ChangePassword .list .item input.codeIput {
		width: 340rpx;
	}

	.ChangePassword .list .item .code {
		font-size: 32rpx;
		background-color: #fff;
	}

	.ChangePassword .list .item .code.on {
		color: #b9b9bc !important;
	}

	.ChangePassword .confirmBnt {
		font-size: 32rpx;
		width: 580rpx;
		height: 90rpx;
		border-radius: 45rpx;
		color: #fff;
		margin: 92rpx auto 0 auto;
		text-align: center;
		line-height: 90rpx;
	}
	.ChangePassword{
		.item-new{
			margin-top: 24rpx;
		}
		.no-border {
			border-bottom: none;
			padding-left: 0;
			padding-right: 0;
		}
		.id-card{
			.item-title{
				color: #B2B2B2;
				font-size: 32rpx;
			}
			.item-desc{
				color: #B2B2B2;
				font-size: 22rpx;
				margin-top: 9rpx;
				line-height: 36rpx;
				width: 100%;
			}
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

		}

	}
</style>
