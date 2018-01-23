<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      border
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        property="authName"
        label="权限管理"
        width="120">
      </el-table-column>
      <el-table-column
        property="path"
        label="路径"
        width="120">
      </el-table-column>
      <el-table-column
        property="level"
        label="层级">
        <template slot-scope="scope">
          <span v-if='scope.row.level === "0"'>一级</span>
          <span v-else-if='scope.row.level === "1"'>二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getRightData} from '../../api/api.js'
export default {
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    initRight () {
      getRightData({
        type: 'list'
      }).then(res => {
        if (res.meta.status === 200) {
          this.tableData = res.data
        }
      })
    }
  },
  mounted () {
    this.initRight()
  }
}
</script>

<style scoped>
  .el-breadcrumb {
    background-color: #D3DCE6;
    height: 50px;
    line-height: 50px;
    padding-left: 10px;
  }
</style>
