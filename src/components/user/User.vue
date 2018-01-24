<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <!-- 后台规定用query -->
      <el-input v-model="query" placeholder="请输入内容" class="search">
        <el-button slot="append" @click="findUser" icon="el-icon-search"></el-button>
      </el-input>
      <!-- 添加用户 -->
      <el-button type="success" plain @click="dialogVisibleAddUser = true">添加用户</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      border>
      <el-table-column
        type="index"
        label="#"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        width="180"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        width="180"
        label="用户状态">
        <template slot-scope="scope">
          <!-- 作用域插槽，可以定制数据显示 -->
          <!-- scope指的是所有数据,即是tableData, scope.row指的是所在的那一行,用程序表示是一个对象-->
          <el-switch @change='toggleUser(scope.row)' v-model="scope.row.mg_state"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <!-- 要是相加文字,就写title属性 -->
          <!-- 编辑用户信息 -->
          <el-button @click="editHeader(scope.row)" size="mini" type="primary" plain title="编辑用户">
              <i class="el-icon-edit"></i>
          </el-button>
          <!-- 删除用户 -->
          <el-button @click="deleteHeader(scope.row)" size="mini" type="danger" plain title="删除用户">
            <i class="el-icon-delete"></i>
          </el-button>
          <!-- 设置用户权限 -->
          <el-button size="mini" type="warning" plain title="权限设置">
            <i class="el-icon-check"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 添加用户弹框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisibleAddUser"
      width="50%"
      :before-close="handleCloseAddUser">
      <el-form :model="addUser" :rules="rules" ref="addUserForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUser.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAddUser = false">取 消</el-button>
        <el-button type="primary" @click="submitAddUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户弹框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="dialogVisibleEditUser"
      width="50%"
      :before-close="handleCloseEditUser">
      <el-form :model="editUser" :rules="rules" ref="editUserForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input disable v-model="editUser.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEditUser = false">取 消</el-button>
        <el-button type="primary" @click="submitEditUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getUsersData, toggleUserState, addUserData, getUsersDataById, editUserData, deleteUserData} from '../../api/api.js'
export default {
  data () {
    return {
      query: '', // 查询的参数
      currentPage: 1, // 当前页码
      pagesize: 10, // 每页显示条数
      total: 0, // 数据总条数
      tableData: [],
      // 用户弹窗显示与否
      dialogVisibleAddUser: false,
      dialogVisibleEditUser: false,
      // 添加的用户信息
      addUser: {
        username: '',
        password: '',
        email: '',
        moblie: ''
      },
      // 编辑的用户信息
      editUser: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        moblie: [
          { required: true, message: '请输入手机', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 查询用户
    findUser () {
      this.initList()
    },
    // 提交添加用户信息
    submitAddUser () {
      this.$refs['addUserForm'].validate((valid) => {
        if (valid) {
          addUserData(this.addUser).then(res => {
            console.log(res)
            if (res.meta.status === 201) {
              this.dialogVisibleAddUser = false
              this.initList()
            }
          })
        }
      })
    },
    // 提交编辑用户信息
    submitEditUser () {
      this.$refs['editUserForm'].validate((valid) => {
        if (valid) {
          editUserData(this.editUser).then(res => {
            if (res.meta.status === 200) {
              this.dialogVisibleEditUser = false
              this.initList()
            }
          })
        }
      })
    },
    // 根据id查询用户最新的数据
    editHeader (row) {
      getUsersDataById({id: row.id}).then(res => {
        if (res.meta.status === 200) {
          this.editUser.id = res.data.id
          this.editUser.username = res.data.username
          this.editUser.email = res.data.email
          this.editUser.mobile = res.data.mobile
          // 显示弹框
          this.dialogVisibleEditUser = true
        }
      })
    },
    // 删除单个用户
    deleteHeader (row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用后台接口,删除数据
        deleteUserData(row).then(res => {
          if (res.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 刷新列表
            this.initList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 关闭添加用户弹框事件
    handleCloseAddUser (done) {
      done()
    },
    // 关闭编辑用户弹框事件
    handleCloseEditUser (done) {
      done()
    },
    // 用户状态切换
    toggleUser (data) {
      console.log(data)
      toggleUserState({
        id: data.id,
        state: data.mg_state
      }).then(res => {
        if (res.meta.status === 200) {
          // 成功
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
        }
      })
    },
    handleSizeChange (val) {
      // 改变每页显示条数
      this.pagesize = val
      this.initList()
    },
    handleCurrentChange (val) {
      // 改变当前页码
      this.currentPage = val
      this.initList()
    },
    initList () {
      // 初始化数据列表
      getUsersData({
        query: this.query,
        pagenum: this.currentPage,
        pagesize: this.pagesize
      }).then(res => {
        if (res.meta.status === 200) {
          this.tableData = res.data.users
          this.total = res.data.total
          this.currentPage = res.data.pagenum
        }
      })
    }
  },
  mounted () {
    // 首次加载页面,初始化列表
    this.initList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-breadcrumb {
    background-color: #D3DCE6;
    height: 50px;
    line-height: 50px;
    padding-left: 10px;
  }
  .el-pagination {
    background-color: #D3DCE6;
    padding-top: 10px;
    height: 35px;
    line-height: 35px;
  }
  .search {
    width: 300px;
  }
</style>
