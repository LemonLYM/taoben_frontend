<template>
	<view>
		<form @submit="editPwd" report-submit='true'>
			<view class="ChangePassword">
				<view class="list">
					<view class="item">
						<input type='number' placeholder='填写手机号码' placeholder-class='placeholder' v-model="phone"></input>
					</view>
					
					<view class="item acea-row row-between-wrapper">
						<input type='number' placeholder='填写验证码' placeholder-class='placeholder' class="codeIput" v-model="captcha"></input>
						<button class="code font-color" :class="disabled === true ? 'on' : ''" :disabled='disabled' @click="code">
							{{ text }}
						</button>
					</view>
					<view class="item-new no-border id-card">
						<view class='acea-row row-middle'>
							<view class="item-title">请上传身份证正反面照片</view>
							<view class="item-desc">(图片格式支持JPG、PNG、JPEG)</view>
							<view class="upload">
								<view class='pictrue' v-for="(item,index) in pics" :key="index" :data-index="index" @click="getPhotoClickIdx">
									<image :src='item'></image>
									<text class='iconfont icon-guanbi1' @click.stop='DelPic(index)'></text>
								</view>
								<view class='pictrue acea-row row-center-wrapper row-column' @click='uploadpic' v-if="pics.length < 2">
									<text class='iconfont icon-icon25201'></text>
									<view>上传图片</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<button form-type="submit" class="confirmBnt bg-color">认证</button>
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
		verifyCode
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
				phone:'',   //手机号
				captcha:'',//验证码
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				key: '',
				pics:[] //上传的身份证的正反面照片
			};
		},
		computed: mapGetters(['isLogin']),
		onLoad() {
			if (this.isLogin) {
				// verifyCode().then(res=>{
				// 	this.$set(this, 'key', res.data.key)
				// });
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
			//点击上传照片
			uploadpic: function() {
				let that = this;
				that.$util.uploadImageOne('upload/image', function(res) {
					that.pics.push(res.data.path);
					// that.$set(that, 'pics', that.pics);
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
				let that = this,
					pic = this.pics[index];
				that.pics.splice(index, 1);
				that.$set(that, 'pics', that.pics);
			},
			onLoadFun:function(){
				this.isShowAuth = false;
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			//认证的方法
			editPwd: function() {
				let that = this;
				if (!that.phone) return that.$util.Tips({
					title: '请填写手机号码！'
				});
				if (!(/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.phone))) return that.$util.Tips({
					title: '请输入正确的手机号码！'
				});
				if (!that.captcha) return that.$util.Tips({
					title: '请填写验证码'
				});
				if(this.pics.length === 0){
					return this.$util.Tips({
					title: '请上传身份证正反面照片'
				  });
				}
				bindingPhone({
					phone: that.phone,
					sms_code: that.captcha,
					idCardImages:this.pics //身份证正反面的照片
				}).then(res => {
					//
					if (res.data !== undefined && res.data.is_bind) {
						uni.showModal({
							title: '是否进行认证',
							content: res.msg,
							confirmText: '认证',
							success(res) {
								if (res.confirm) {
									bindingPhone({
										phone: that.phone,
										captcha: that.captcha,
										idCardImages:this.pics,
										step: 1
									}).then(res => {
										return that.$util.Tips({
											title: res.msg,
											icon: 'success'
										}, {
											tab: 5,
											url: '/pages/users/user_info/index'
										});
									}).catch(err => {
										return that.$util.Tips({
											title: err
										});
									})
								} else if (res.cancel) {
									return that.$util.Tips({
										title: '您已取消认证！'
									}, {
										tab: 5,
										url: '/pages/users/user_info/index'
									});
								}
							}
						});
					} else
						return that.$util.Tips({
							title: '绑定成功！',
							icon: 'success'
						}, {
							tab: 5,
							url: '/pages/users/user_info/index'
						});
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				})
			},
			
      //发送验证码
			async code() {
				let that = this;
				if (!this.phone) return that.$util.Tips({
					title: '请填写手机号码！'
				});
				if (!(/^1(3|4|5|7|8|9|6)\d{9}$/i.test(this.phone))) return that.$util.Tips({
					title: '请输入正确的手机号码！'
				});
				
				await registerVerify({
					phone:this.phone,
					key:this.key, 
					code:this.captcha,
					type: 'binding',
				}).then(res => {
					that.$util.Tips({
						title: res.msg
					});
					//这个函数通过mixin的方式加入
					that.sendCode();
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				});
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
