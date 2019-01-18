<template>
  <div class="app-container">
    <div>
      <img :src="imgPath">
    </div>
    <div>
      <el-upload :action="api.uploadUrl" :on-success="handleSuccess" class="upload-demo">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </div>
    <div>
      <el-input v-model="send.data"/>
      <el-button type="primary" @click="sendMsg">发送</el-button>
    </div>
    <div>
      <div v-for="(data, index) in receive.datas" :key="index">
        {{ data }}
      </div>
    </div>
    <el-button @click="dialogFormVisible = !dialogFormVisible"/>
    <el-dialog :visible.sync="dialogVisible" title="提示" width="30%">
      <el-form :model="userInfo">
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="userInfo.username" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="姓名" label-width="120px">
          <el-input v-model="userInfo.realName" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <el-form label="上传图片" label-width="120px">
        <el-upload :action="api.uploadUrl" :on-success="handleSuccess" class="upload-demo">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="getUserInfo">获取用户信息</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/index'
import { updateUserInfo } from '@/api/user'
import { getUserInfo } from '@/api/login'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      api: {
        uploadUrl: api.fileUpload
      },
      send: {
        data: ''
      },
      receive: {
        datas: []
      },
      chat: {
        socket: null,
        init: function() {

        },
        chatting: function() {

        }
      },
      imgPath: '',
      userInfo: {
        userId: '',
        username: '',
        realName: '',
        avatar: ''
      },
      dialogVisible: false,
      dataContent: {
        action: '',
        message: {
          senderId: '',
          receiverId: '',
          msg: '',
          msgId: ''
        },
        extend: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'token', 'userId'
    ])
  },
  mounted() {
    this.chat.init = this.init
    this.chat.chatting = this.chatting
    this.chat.init()
  },
  methods: {
    init() {
      if (window.WebSocket) {
        this.chat.socket = new WebSocket('ws://10.70.1.103.:8088/ws')
        this.chat.socket.onopen = () => {
          debugger
          console.log('建立连接成功。。。。')
          // 构建dataContent
          this.dataContent.action = 1
          this.dataContent.message.senderId = this.userId
          this.chat.chatting(JSON.stringify(this.dataContent))
        }
        this.chat.socket.onclose = () => {
          console.log('连接关闭。。。。')
        }
        this.chat.socket.onmessage = e => {
          console.log('接收到消息： ' + e.data)
          this.receive.datas.push(e.data)
        }
        this.chat.socket.onerror = () => {
          console.log('发生错误。。。。')
        }
      } else {
        alert('浏览器不支持websocket')
      }
    },
    chatting(data) {
      this.chat.socket.send(data)
    },
    handleSuccess(response, file, fileList) {
      this.userInfo.avatar = `http://10.0.30.60:9999/group1/${response}`
    },
    handleUpdateSubmit() {
      updateUserInfo(this.userInfo).then(response => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
      }).catch(e => {
        this.$message({
          message: '更新失败',
          type: 'error'
        })
      })
    },
    getUserInfo() {
      getUserInfo(this.token).then(response => {
        for (const [key] of Object.entries(this.userInfo)) {
          this.userInfo[key] = response[key]
        }
        this.$message({
          message: '获取用户信息成功',
          type: 'success'
        })
      }).catch(e => {
        this.$message({
          message: '获取用户信息失败',
          type: 'error'
        })
      })
    },
    sendMsg() {
      this.dataContent.message.senderId = this.userId
      this.dataContent.message.receiverId = '9c937ea1644f499180c591f06d3548ea'
      this.dataContent.message.msg = '123111'
      this.dataContent.action = 2
      this.chat.socket.send(JSON.stringify(this.dataContent))
    }
  }
}
</script>
