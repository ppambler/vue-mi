<template>
  <div class="layout">
    <div class="title-logo">
      <div class="logo">
        <img src="../assets/images/milogo.png" alt />
      </div>
      <h4 class="title">小米帐号登录</h4>
    </div>
    <div class="login">
      <div class="username" :class="errMsgClasses" ref="username">
        <div class="area-code" v-show="isSmsLogin">
          <span class="code-txt">+86</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-right" />
          </svg>
        </div>
        <div class="input-username" @input="clearErr">
          <input
            type="text"
            v-model="username"
            :placeholder="placeholderTxt"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="code" ref="code" :class="errMsgClasses" v-show="isSmsLogin">
        <div class="input-code">
          <input
            type="text"
            v-model="code"
            @input="clearErr"
            placeholder="短信验证码"
            autocomplete="off"
          />
        </div>
        <div class="get-code" :class="codeClasses" @click="getCode">
          {{ codeMsg }}
        </div>
      </div>
      <div
        class="password"
        v-show="!isSmsLogin"
        ref="pwd"
        :class="errMsgClasses"
      >
        <input
          :type="pwdType"
          v-model="pwd"
          @input="clearErr"
          placeholder="密码"
          autocomplete="off"
        />
        <svg
          class="icon"
          :class="eyeClasses"
          aria-hidden="true"
          @click="toggleOpen"
        >
          <use :xlink:href="`#icon-${eyeIcon}`" />
        </svg>
      </div>
      <div v-show="errMsg" class="errMsg">
        <svg class="icon icon-warning" aria-hidden="true">
          <use xlink:href="#icon-warning" />
        </svg>
        <span class="errMsgTxt">{{ errMsg }}</span>
      </div>
      <div class="login-btn-default" @click="submit">{{ mainBtn }}</div>
      <div class="login-btn" @click="changeBtn">{{ subBtn }}</div>
      <div class="pre-condition" v-show="!isSmsLogin">
        <span class="register">立即注册</span>
        <span style="color: #000;font-size:14px;">|</span>
        <span class="forgot-password">忘记密码？</span>
      </div>
      <div class="other-login">
        <fieldset class="oth-tit">
          <legend align="center" class="oth-txt">其他方式登录</legend>
        </fieldset>
        <div class="icon-group">
          <svg class="icon icon-weibo" aria-hidden="true">
            <use xlink:href="#icon-weibo" />
          </svg>
          <svg class="icon icon-alipay" aria-hidden="true">
            <use xlink:href="#icon-alipay" />
          </svg>
          <svg class="icon icon-wechat" aria-hidden="true">
            <use xlink:href="#icon-wechat" />
          </svg>
        </div>
      </div>
    </div>
    <div class="footer">
      <ul>
        <li class="current">简体</li>
        <li>繁体</li>
        <li>English</li>
        <li>常见问题</li>
        <li>隐私政策</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import md5 from 'blueimp-md5'
export default {
  data() {
    return {
      isSmsLogin: true,
      codeMsg: '获取验证码',
      isOpen: false,
      countdown: 60,
      timerId: null,
      errMsg: '',
      username: '',
      code: '',
      pwd: ''
    }
  },
  computed: {
    mainBtn() {
      return this.isSmsLogin ? '立即登录/注册' : '登录'
    },
    subBtn() {
      return this.isSmsLogin ? '用户名密码登录' : '手机短信登录/注册'
    },
    placeholderTxt() {
      return this.isSmsLogin ? '手机号码' : '邮箱/手机号码/小米ID'
    },
    pwdType() {
      return this.isOpen ? 'text' : 'password'
    },
    eyeIcon() {
      return this.pwdType === 'password' ? 'no-eyes' : 'eyes'
    },
    eyeClasses() {
      return {
        [`icon-${this.eyeIcon}`]: true
      }
    },
    codeClasses() {
      return {
        ['countdown']: this.countdown !== 60 ? true : false
      }
    },
    errMsgClasses() {
      return {
        ['errMsg-s']: this.errMsg ? true : false
      }
    }
  },
  methods: {
    changeBtn() {
      this.isSmsLogin = !this.isSmsLogin
      this.clearErr()
    },
    toggleOpen() {
      this.isOpen = !this.isOpen
    },
    getCode() {
      if (!this.username) {
        this.errMsg = '请输入手机号'
        return
      }
      // 如果有错误提示，那就不发请求哈！
      if (this.errMsg) {
        return
      }
      // 60s不能再发请求
      if (this.countdown !== 60) {
        return
      }
      let url = 'http://rap2api.taobao.org/app/mock/124878/api/v1/getCode'
      axios
        .post(url, {retry: 5, retryDelay: 1000})
        .then(res => {
          console.log(res)
          this.timerId = setInterval(() => {
            this.countdown--
            this.codeMsg = `重新发送(${this.countdown})`
            if (this.countdown === 0) {
              clearInterval(this.timerId)
              this.timerId = null
              this.countdown = 60
              this.codeMsg = '重新发送'
            }
          }, 1000)
        })
        .catch(err => {
          console.log(err)
        })
    },
    clearErr() {
      this.errMsg = ''
    },
    submit() {
      // 用户咩有输入手机号和用户名，一个字符都没有输入哈
      if (!this.username) {
        if (this.isSmsLogin) {
          this.errMsg = '请输入手机号'
          this.$nextTick(() => {
            this.$refs.code.classList.remove('errMsg-s')
          })
        } else {
          this.errMsg = '请输入账号'
          this.$nextTick(() => {
            this.$refs.pwd.classList.remove('errMsg-s')
          })
        }
        this.$refs.username.classList.add('errMsg-s')
        return
      } else {
        if (this.isSmsLogin) {
          let reg = /^[1][3,4,5,7,8][0-9]{9}$/
          if (!reg.test(this.username)) {
            this.errMsg = '手机号格式不正确'
            this.$refs.username.classList.add('errMsg-s')
            this.$nextTick(() => {
              this.$refs.code.classList.remove('errMsg-s')
            })
            return
          }
        } else {
          if (!this.pwd) {
            this.errMsg = '请输入密码'
            this.$refs.pwd.classList.add('errMsg-s')
            this.$nextTick(() => {
              this.$refs.username.classList.remove('errMsg-s')
            })
            return
          }
        }
      }

      // 校验短信验证码
      if (this.isSmsLogin) {
        if (!this.code) {
          this.errMsg = '请输入短信验证码'
          this.$refs.code.classList.add('errMsg-s')
          this.$nextTick(() => {
            this.$refs.username.classList.remove('errMsg-s')
          })
          return
        } else {
          let reg = /^\d{6}$/
          if (!reg.test(this.code)) {
            this.errMsg = '短信验证码不正确'
            this.$refs.code.classList.add('errMsg-s')
            this.$nextTick(() => {
              this.$refs.username.classList.remove('errMsg-s')
            })
            return
          }
        }
      }

      let data = {
        username: this.username
      }
      if (this.isSmsLogin) {
        data.code = this.code
      } else {
        data.pwd = this.pwd
      }
      let url = 'http://rap2api.taobao.org/app/mock/124878/api/v1/login'
      axios.post(url, data).then(res => {
        let status = res.data.status
        if (status === 200) {
          // todo：跳转到登录来源
          console.log(
            '跳转到登录来源，即你打开某个页面，然后提示你登录的那个位置'
          )
        } else {
          this.errMsg = res.data.message
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
$font-size: 18px;
$weibo-color: #ee9696;
$alipay-color: #6bb6ea;
$wechat-color: #00be00;
$footer-color: #c7c7c7;
$code-color: #2ea5e5;
$login-btn-color: #ff6700;
$login-btn-border-color: #d3d3d3;
$input-border-color: #c7c7c7;
$input-cursor-color: #000;
.layout {
  height: 100vh;
  padding: 0 12px;
  margin: 0 auto;
  font-size: 18px;
}
.title-logo {
  margin-top: 28px;
  text-align: center;
  .title {
    color: #000;
    font-weight: normal;
  }
}
.title {
  margin-top: 18px;
  margin-bottom: 30px;
}
.login {
  margin-bottom: 84px;
}
.username {
  display: flex;
  align-items: center;
  border-bottom: 1px solid $input-border-color;

  caret-color: $input-cursor-color;
  .area-code {
    display: inline-flex;
    padding-right: 12px;
    padding-left: 12px;
  }
  .input-username {
    width: 100%;
    input {
      width: 100%;
    }
  }
}
.code,
.password {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid $input-border-color;

  caret-color: $input-cursor-color;
  .input-code {
    width: 100%;
    input {
      width: 100%;
    }
  }
  .get-code {
    padding: 18px;
    color: $code-color;
    font-size: 14px;
    white-space: nowrap;
  }
}
.password {
  width: 100%;
  > input {
    width: 100%;
  }
}

.login-btn-default {
  margin-top: 24px;
  margin-bottom: 28px;
  color: #fff;
  line-height: 42px;
  background-color: $login-btn-color;
  border-radius: 5px;
}
.login-btn {
  line-height: 42px;
  border: 1px solid $login-btn-border-color;
  border-radius: 5px;
}
.pre-condition {
  margin-top: 12px;
  color: #b0b0b0;
  font-size: 16px;
  text-align: center;
  .register {
    padding-right: 10px;
  }
  .forgot-password {
    padding-left: 10px;
  }
}
.other-login {
  margin-top: 40px;
  .oth-tit {
    padding-top: 10px;
    border-top: 1px solid #f2f2f2;
    .oth-txt {
      color: #b0b0b0;
      font-size: 12px;
    }
  }
  .icon-group {
    .icon {
      width: 34px;
      height: 34px;
      margin-right: 7px;
      margin-left: 7px;
    }
    .icon-weibo {
      color: $weibo-color;
    }
    .icon-alipay {
      color: $alipay-color;
    }
    .icon-wechat {
      color: $wechat-color;
    }
  }
}

.footer {
  margin-bottom: 74px;
  ul {
    display: flex;
    justify-content: center;
    font-size: 14px;
    list-style: none;
    li {
      padding: 0 10px;
      color: #9b9b9b;
      white-space: nowrap;
      border-right: 1px solid #d3d3d3;
      border-left: 1px solid #d3d3d3;
    }
    li:first-child {
      border-left: none;
    }
    li:last-child {
      border-right: none;
    }
    .current {
      color: #4a4a4a;
    }
  }
}

.icon-no-eyes {
  color: #4a4a4a;
}
.icon-eyes {
  color: #ff6700;
}
.countdown {
  color: #858585 !important;
}
.errMsgTxt {
  margin-left: 0.2em;
  color: #f66;
}
.icon-warning {
  fill: #ff6700;
}
.errMsg {
  margin-top: 14px;
  font-size: 16px;
  text-align: start;
}
.errMsg-s {
  border-bottom: 1px solid #f66;
}
</style>
