<template>
	<view class="radio1" :class="{'radio-width-default':widthDefault}" :style="checked?activeStyle :itemStyle" @click="handleChange">
		{{name}}
	</view>
</template>

<script>
	
	/**
 * 防抖
 * @param {*} fun 
 * @param {*} delay 
 * @param {*} immediate 
 */
const debounce = function (fun, delay, immediate) {
  var timer, lasttime, context, arg
  var later = function () {
    var now = new Date().getTime(),
      l = now - lasttime
    if (l < delay && l >= 0) {
      clearTimeout(timer)
      timer = setTimeout(later, delay - l)
    } else {
      clearTimeout(timer)
      timer = null
      if (!immediate) {
        fun.apply(context, arg)
        if (!timer) context = arg = null
      }
    }
  }
  return function () {
    context = this
    arg = arguments
    lasttime = new Date().getTime()
    var callNow = immediate && !timer
    if (!timer) timer=setTimeout(later, delay)
    if (callNow) {
      fun.apply(context, arg)
      context = arg = null
    }
  }
}
	export default {
		props: {
			name: {
				type: String,
				default: ''
			},
			value: {
				default: null,
			},
			checked: {
				type: [Boolean, Number],
				default: false
			},
		},
		computed: {
			widthDefault() {
				return this.name.length <= 3
			},
			activeStyle() {
				return `background: #FFE4E1;color: #EB3C3C;border-color: #EB3C3C;`
			},
			itemStyle() {
				return `background: #f7f7f7;color: #7d7d7d;`
			}
		},
		data() {
			return {

			};
		},
		methods: {
			handleChange: debounce(handleChange, 200,true)
		}
	}

	function handleChange() {
		this.$emit('change', this.value)
	}
</script>

<style>
	.radio1 {
		display: inline-block;
		height: 50rpx;
		line-height: 50rpx;
		padding: 0 10rpx;
		border-radius: 10rpx;
		font-size: 26rpx;
		margin-right: 10rpx;
		box-sizing: border-box;
		border: 1px solid #c3c3c3;
		margin-bottom: 10rpx;
	}

	.radio1:not(:last-child) {
		margin: 0 20rpx 30rpx 0;
	}


	.radio-width-default {
		/* width: 120upx; */
		text-align: center;
		padding: 0 10rpx;
		margin-bottom: 10rpx;
	}
</style>
