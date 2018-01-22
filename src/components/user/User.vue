<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-input placeholder="请输入内容" class="search">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <!-- 添加用户 -->
      <el-button type="success" plain>添加用户</el-button>
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
        prop="role_name"
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
          <!-- 编辑用户信息 -->
          <el-button size="mini" type="primary" plain>
              <i class="el-icon-edit"></i>
          </el-button>
          <!-- 删除用户 -->
          <el-button size="mini" type="danger" plain>
            <i class="el-icon-delete"></i>
          </el-button>
          <!-- 设置用户权限 -->
          <el-button size="mini" type="warning" plain>
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
  </div>
</template>

<script>
import {getUsersData, toggleUserState} from '../../api/api.js'
export default {
  data () {
    return {
      currentPage: 1, // 当前页码
      pagesize: 5, // 每页显示条数
      total: 0, // 数据总条数
      tableData: []
    }
  },
  methods: {
    toggleUser (data) {
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
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.initList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.initList()
    },
    initList () {
      // 初始化数据列表
      getUsersData({
        query: '',
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
