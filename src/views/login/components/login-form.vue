<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form ref="formCom" class="form" :validation-schema='mySchema' v-slot={errors}>
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error:errors.account}" v-model="form.account" name='account' type="text" autocomplete="false" placeholder="请输入用户名或手机号" />
          </div>
         <div class="error" v-if="errors.account"><i class="iconfont icon-warning" />{{errors.account}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field :class="{error:errors.password}"  v-model="form.password" name='password' type="password" placeholder="请输入密码"/>
          </div>
           <div class="error" v-if="errors.password"><i class="iconfont icon-warning" />{{errors.password}}</div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field  v-model="form.mobile" name='mobile' type="text" placeholder="请输入手机号" />
          </div>
          <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{errors.mobile}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field  v-model="form.code" name='code' type="text" placeholder="请输入验证码"/>
            <span class="code" @click="send()">
              {{time===0?'发送验证码':`${time}秒后发送`}}
            </span>
          </div>
           <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{errors.code}}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <xtxCheckBox v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
      </div>
      <a href="javascript:;" class="btn" @click="login">登录</a>
    </Form>
    <div class="action">
      <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { onUnmounted, reactive, ref, watch } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import Message from '@/components/library/Message'
import { useIntervalFn } from '@vueuse/core'

export default {
  name: 'LoginForm',
  components: {
    Form, Field

  },
  setup () {
    // 切换段更新登录
    const isMsgLogin = ref(false)
    const formCom = ref(null)
    // 表单数据对象
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })
    // vee-validate 校验基本步骤
    // 1、导入from field 组件 将from 和 input 进行替换 需要加上name来这顶将来的校验规则函数
    // 2、Field 需要进行数据绑定
    // 3、定义Field的name属性指定的校验规则函数 Form的validation-schema接收校验规则
    const mySchema = {
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code
    }
    // 重置数据
    watch(isMsgLogin, () => {
      // 重置数据
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 如果Field组件没有被销毁 还需要重置表单验证状态
      formCom.value.resetForm()
    })
    // 获取当前实例
    // const { proxy } = getCurrentInstance()
    // 点击登录时整体校验
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const login = async () => {
      const valid = await formCom.value.validate()
      // Message({ type: 'error', text: '用户名或错误' })
      // proxy.$message({ text: '111' })
      if (valid) {
        try {
          let data = null
          if (isMsgLogin.value) {
          // 验证码登录
          // 1、发送验证码
          // 2、手机号登录
            const { mobile, code } = form
            data = await userMobileLogin({ mobile, code })
          } else {
          // 账号密码登录
          // 校验成功 发起登录请求
            const { account, password } = form
            data = await userAccountLogin({ account, password })
          }
          // 存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 跳转路由
          router.push(route.query.redirectUrl || '/')
          // 消息提示
          Message({ type: 'success', text: '登录成功' })
        } catch (error) {
          // 失败提示
          Message({ type: 'error', text: error.response.data.message || '登录失败' })
        }
      }
    }
    // vueuse 提供的倒计时方法
    // pause 暂停 resume 开始
    // useIntervalFn(回调函数，执行间隔，是否立即开启)
    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        // 销毁定时器
        pause()
      }
    }, 1000, { immediate: false })
    // 组件销毁 清除定时器
    onUnmounted(() => {
      pause()
    })
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过 发送验证码
        // 没有倒计时才能发送
        if (time.value === 0) {
          await userMobileLoginMsg(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          //  60秒内禁止再次触发
          time.value = 60
          // 开启定时器
          resume()
        }
      } else {
        // 失败 提示  使用vee的错误函数 显示错误信息
        formCom.value.setFieldError('mobile', valid)
      }
    }

    return { isMsgLogin, form, mySchema, formCom, login, send, time }
  }
}
</script>
<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
