<template>
  <div class="layout">
    <div class="title-logo">
      <div class="logo">
        <img src="../assets/images/milogo.png" alt />
      </div>
      <h4 class="title">小米帐号登录</h4>
    </div>
    <div class="login">
      <div class="username">
        <div class="area-code">
          <span class="code-txt">+86</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-right" />
          </svg>
        </div>
        <div class="input-username">
          <input type="text" :placeholder="placeholderTxt" />
        </div>
      </div>
      <div class="code">
        <div class="input-code">
          <input type="text" placeholder="短信验证码" />
        </div>
        <div class="get-code">{{ codeMsg }}</div>
      </div>
      <div class="login-btn-default">{{ mainBtn }}</div>
      <div class="login-btn" @click="changeBtn">{{ subBtn }}</div>
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
      codeMsg: '获取验证码'
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
    }
  },
  methods: {
    changeBtn() {
      this.isSmsLogin = !this.isSmsLogin
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
  .area-code {
    padding-right: 12px;
    padding-left: 12px;
  }
}
.code {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid $input-border-color;
  .get-code {
    padding-right: 18px;
    color: $code-color;
    font-size: 14px;
  }
}

.login-btn-default {
  margin-bottom: 28px;
  color: #fff;
  line-height: 42px;
  background-color: $login-btn-color;
  border-radius: 5px;
}
.login-btn {
  margin-bottom: 54px;
  line-height: 42px;
  border: 1px solid $login-btn-border-color;
  border-radius: 5px;
}
.other-login {
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
</style>
