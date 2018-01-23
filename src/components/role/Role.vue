<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button>添加角色</el-button>
    <el-table border stripe
    :data="tableData"
    style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 所有的for循环都有key -->
          <el-row v-for="item in scope.row.children" :key="item.id">
            <el-col :span="3">
              <el-tag closable>{{item.authName}}</el-tag>
              <i v-if="item.children.length>0" class="el-icon-arrow-right arrow"></i>
            </el-col>
            <el-col :span="21" class="authlist">
              <el-row v-for="tag in item.children" :key="tag.id">
                <el-col :span="4">
                  <el-tag closable type="success">{{tag.authName}}</el-tag>
                  <i v-if="tag.children.length>0" class="el-icon-arrow-right arrow"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag v-for="btn in tag.children" :key="btn.id"closable type="warning">{{btn.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="#"
        width="50">
      </el-table-column>
      <el-table-column
        label="角色名称" width="250"
        prop="roleName">
      </el-table-column>
      <el-table-column
        label="描述" width="500"
        prop="roleDesc">
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain>
              <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" plain>
            <i class="el-icon-delete"></i>
          </el-button>
          <el-button size="mini" type="warning" plain>
            <i class="el-icon-check"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getRolesData} from '../../api/api.js'
export default {
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    deleteRight () {

    },
    initList () {
      getRolesData().then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.tableData = res.data
        }
      })
    }
  },
  mounted () {
    // 注意:一定要写,在挂载好了之后加载页面
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
  .authlist {
    border-top: solid 1px #D3DCE6;
    padding-bottom: 5px;
  }
  .arrow {
    font-size: 18px;
    font-weight: bold;
  }
  .el-tag  {
    margin-left: 5px;
  }
</style>
