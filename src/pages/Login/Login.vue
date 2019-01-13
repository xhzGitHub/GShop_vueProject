<template>
  <div class="off">
    <section class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">硅谷外卖</h2>
          <div class="login_header_title">
            <a href="javascript:;" :class="{on: loginway}" @click="loginway = true">短信登录</a>
            <a href="javascript:;" :class="{on: !loginway}" @click="loginway = false">密码登录</a>
          </div>
        </div>
        <div class="login_content">
          <form @submit.prevent="login">
            <div :class="{on: loginway}">
              <section class="login_message">
                <input type="tel" maxlength="11" v-model="phone" placeholder="手机号">
                <button :disabled="!rightPhone" class="get_verification" :class="{rightPhoneClass: rightPhone}" @click.prevent="getCode">
                  {{computeTime > 0 ? `已发送(${computeTime}s)`: '获取验证码'}}
                </button>
              </section>
              <section class="login_verification">
                <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
              </section>
              <section class="login_hint">
                温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:;">《用户服务协议》</a>
              </section>
            </div>
            <div :class="{on: !loginway}">
              <section>
                <section class="login_message">
                  <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
                </section>
                <section class="login_verification">
                  <input type="tel" maxlength="8" placeholder="密码" v-if="!showPwd" v-model="pwd">
                  <input type="password" maxlength="8" placeholder="密码" v-if="showPwd" v-model="pwd">
                  <div class="switch_button off" :class="showPwd?'on':'off'" @click="showPwd = !showPwd">
                    <div class="switch_circle" :class="{right: showPwd}"></div>
                    <span class="switch_text">{{showPwd?'abc':'...'}}</span>
                  </div>
                </section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                  <img class="get_verification" src="http://localhost:4000/captcha"
                       alt="captcha" ref="captcha" @click="getCaptcha">
                </section>
              </section>
            </div>
            <button class="login_submit">登录</button>
          </form>
          <a href="javascript:;" class="about_us">关于我们</a>
        </div>
        <a href="javascript:" class="go_back" @click="$router.back()">
          <!--$router.back() 代表路由向后退一个-->
          <i class="iconfont icon-jiantou2"></i>
        </a>
      </div>
      <AlertTip :alertText="alertText" v-show="showAlert" @closeTip="closeTip"></AlertTip>
    </section>
  </div>
</template>

<script>
    import AlertTip from '../../components/AlertTip/AlertTip'
    import {reqLoginSms, reqSendCode, reqPwdLogin} from "../../api";

    export default {
      name: "Login",
      components: {
        AlertTip,
      },
      data() {
          return {
            loginway: true,     // true代表短信登录，false代表密码登录
            phone: '',
            computeTime: 0,
            showPwd: true,      // 是否显示密码
            pwd: '',
            code: '',           // 短信验证码
            name: '',           // 用户名
            captcha: '',        // 图像验证码
            alertText: '',      // 提示文本
            showAlert: false,   // 是否显示提示框
          }
      },
      computed: {
        rightPhone(){
          return /^1\d{10}/g.test(this.phone);
        }
      },
      methods: {
        async getCode() {
          if (!this.computeTime) {
            // 启动倒计时
            this.computeTime = 30;
            const timer = setInterval(() => {
              if (this.computeTime == 0) {
                clearInterval(timer);
              }
              this.computeTime--;
            }, 1000)
            // 发送Ajax请求 发送短信
            const result = await reqSendCode(this.phone);
            // 如果请求失败
            if(result.code === 1){
              // 显示提示
              this.showAlerts(result.msg);
              // 停止倒计时
              if(this.computeTime){
                this.computeTime = 0;
                clearInterval(timer);
              }
            }

          }
        },
        showAlerts(alertText) {
          this.alertText = alertText;
          this.showAlert = true;
        },
        async login() {
          let result;

          if(this.loginway){      // 短信登录
            const {phone, code} = this;
            if(!this.rightPhone){
              // 提示手机号不正确
              this.showAlerts('手机号不正确');
            }else if(!/^\d{6}$/g.test(code)){
              // 验证码必须是6位数字
              this.showAlerts('验证码必须是6位数字');
            }
            // 进行短信登录
            result = await reqLoginSms(this.phone, this.code);

          }else{                  // 密码登录
            const {name, pwd, captcha} = this;
            if(!this.name){
              // 必须指定用户名
              this.showAlerts('必须指定用户名');
            }else if(!this.pwd){
              // 密码必须指定
              this.showAlerts('密码必须指定');
            }else if(!this.captcha){
              // 提示验证码
              this.showAlerts('提示验证码');
            }

            // 进行密码登录
            result = await reqPwdLogin(this.phone, this.pwd, this,captcha);
          }
          // 根据请求数据状态进行相应处理

          if(this.computeTime){
            this.computeTime = 0;
            clearInterval(timer);
          }

          // 如果请求成功
          if(result.code === 0) {
            const user = result.data;
            // 将user 保存在state
            this.$store.dispatch('receiveUsers', user);
            //跳转路由至个人中心
            this.$router.replace('/profile');

          }else{
            // 如果请求失败
            const msg = result.msg;
            this.showAlerts(msg);
            // this.getCaptcha();
          }
        },
        closeTip() {
          this.alertText = '';
          this.showAlert = false;
        },
        getCaptcha() {
          this.$refs.captcha.src = 'http://localhost:4000/captcha?time=' + Date.now();
          // 重要！如何当点击事件时，获取当前元素的属性并改变
        }
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.rightPhoneClass
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(30px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
