<template>
  <view class="g-container">
    <v-sign
      :width="winWidth + 'px'"
      height="400"
      bgColor="orange"
      @init="onSignInit"
    >
      <view class="control-area">
        <view>按钮组件：</view>
        <view class="section">
          <v-sign-action @save="save"></v-sign-action>
          <v-sign-action
            :border="false"
            @save="save"
            :customStyle="{ marginTop: '10rpx' }"
          ></v-sign-action>
        </view>
        <view>画笔组件：</view>
        <view class="section">
          <v-sign-pen></v-sign-pen>
          <v-sign-pen active-color="orange" :border="false"></v-sign-pen>
          <v-sign-pen type="line"></v-sign-pen>
          <v-sign-pen
            type="line"
            :border="false"
            active-color="orange"
          ></v-sign-pen>
        </view>
        <view>颜色选择器组件：</view>
        <view class="section">
          <v-sign-color></v-sign-color>
          <v-sign-color type="circle"></v-sign-color>
          <v-sign-color :tick="false" border></v-sign-color>
          <v-sign-color type="circle" border></v-sign-color>
        </view>
      </view>
    </v-sign>
  </view>
</template>

<script>
export default {
  name: "v-sign-component",
  data() {
    return {
      winWidth: 0,
    };
  },
  created() {
    const { windowWidth } = uni.getSystemInfoSync();
    this.winWidth = windowWidth;
  },
  methods: {
    onSignInit(signCtx) {
      console.log(signCtx);
      this.signCtx = signCtx;
    },
    save(res) {
      console.log(res);
    },
  },
};
</script>

<style lang="scss" scoped>
.g-container {
  width: 100vh;
  height: 100vh;

  .control-area {
  }

  .section {
    padding: 10rpx;
    background-color: lightblue;
  }
}
</style>
