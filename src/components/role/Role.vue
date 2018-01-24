<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button @click="dialogVisible4AddRole=true">添加角色</el-button>
    <el-table border stripe
    :data="tableData"
    style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 所有的for循环都有key -->
          <el-row v-for="item in scope.row.children" :key="item.id">
            <el-col :span="3">
              <el-tag closable @close="deleteRight(scope.row, item.id)">{{item.authName}}</el-tag>
              <i v-if="item.children.length>0" class="el-icon-arrow-right arrow"></i>
            </el-col>
            <el-col :span="21" class="authlist">
              <el-row v-for="tag in item.children" :key="tag.id">
                <el-col :span="4">
                  <el-tag closable type="success" @close="deleteRight(scope.row, tag.id)">{{tag.authName}}</el-tag>
                  <i v-if="tag.children.length>0" class="el-icon-arrow-right arrow"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag v-for="btn in tag.children" :key="btn.id" closable type="warning" @close="deleteRight(scope.row, btn.id)">{{btn.authName}}</el-tag>
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
          <el-button size="mini" type="primary" plain title="编辑角色">
              <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" plain title="删除角色">
            <i class="el-icon-delete"></i>
          </el-button>
          <el-button size="mini" type="warning" plain title="授权角色" @click="getAllRoleGrent(scope.row)">
            <i class="el-icon-check"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible4AddRole"
      width="50%">
      <el-form :model="ruleFormAdd" :rules="rules" ref="ruleFormAdd" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="ruleFormAdd.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="ruleFormAdd.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4AddRole = false">取 消</el-button>
        <el-button type="primary" @click="submit4AddRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色弹框 -->
    <!-- 删除角色弹框 -->
    <!-- 授权角色弹框 -->
    <el-dialog
      title="授权角色"
      :visible.sync="dialogVisible4GrentRole"
      width="50%">
      <!-- selectTree是数组,数组中的id和node-key中的id是关联的, 将对应的id放到数组中,数组中的那个权限就会被选中-->
      <el-tree
        :data="treeData"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="selectTree"
        ref="tree"
        highlight-current
        :props="treeProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4GrentRole = false">取 消</el-button>
        <el-button type="primary" @click="submit4GrentRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getRolesData, addRoleData, getRightData, giveRoleRight, deleteRoleRightData} from '../../api/api.js'
export default {
  data () {
    return {
      // 列表数据
      tableData: [],
      dialogVisible4AddRole: false,
      dialogVisible4GrentRole: false,
      ruleFormAdd: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          {required: true, message: '请输入角色名', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '请输入描述', trigger: 'blur'}
        ]
      },
      // 后台获取的所有角色的所有数据
      treeData: [],
      // 要显示的数据 节点的名称和子节点数据
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 用户本身的权限,在角色权限授权的时候,显示用户本身具有的权限
      selectTree: [],
      // 当前用户
      currentRole: ''
    }
  },
  methods: {
    // 获取指定用户所具有的三级权限
    // 下划线其实就是只在当前用,不在组件中用,以示区分
    // 将在data中找到的需要的数据放到arr中
    _getThirdRightId (data, arr) {
      // 获取三级权限id
      var that = this
      data.forEach(function (item) {
        if (!item.children) {
          arr.push(item.id)
        } else {
          that._getThirdRightId(item.children, arr)
        }
      })
    },
    // 删除指定角色的指定权限
    // uData: 当前用户的所有权限(三级列表) rid:当前权限的id
    deleteRight (uData, rid) {
      deleteRoleRightData({roleId: uData.id, rightId: rid}).then(res => {
        if (res.meta.status === 200) {
          uData.children = res.data
        }
      })
    },
    // 点击授权按钮获取角色所有权限列表
    getAllRoleGrent (row) {
      getRightData({type: 'tree'}).then(res => {
        if (res.meta.status === 200) {
          // 初始化数据
          this.treeData = res.data
          // 设置树形结构中的默认选中的权限
          this._getThirdRightId(row.children, this.selectTree)
          // 显示弹框
          this.dialogVisible4GrentRole = true
          // 设置当前用户
          this.currentRole = row.id
        }
      })
    },
    // 授权角色点击确定按钮
    submit4GrentRole () {
      // 不能使用keys,因为后台需要pid,keys里面只获取了当前三级节点的id号
      // let rids = this.$refs['tree'].getCheckedKeys()
      // let result = rids.join(',')
      // console.log(result)
      // console.log(this.currentRole)
      // giveRoleRight({roleId: this.currentRole, rids: result}).then(res => {
      //   if (res.meta.status === 200) {
      //     // 刷新页面
      //     this.initList()
      //     // 关闭弹框
      //     this.dialogVisible4GrentRole = false
      //     // 返回数据
      //     this.$message({
      //       message: res.meta.msg,
      //       type: 'success'
      //     })
      //   }
      // })
      // 获取所有选中节点的数据对象列表
      // Nodes里面可以获取pid,即当前节点的父id,后台需要这个pid,所以这里必须需要nodes这个方法
      var list = this.$refs['tree'].getCheckedNodes()
      console.log(list)
      let ids = list.map(item => {
        return item.id + ',' + item.pid
      })
      // 数组去重(Set只允许放不重复的数据)Set的参数是数组
      let tmp = new Set(ids.join(',').split(','))
      let result = [...tmp].join(',')
      // 调用后台接口提交数据
      giveRoleRight({roleId: this.currentRole, rids: result}).then(res => {
        if (res.meta.status === 200) {
          // 刷新列表
          this.initList()
          // 关闭弹窗
          this.dialogVisible4GrentRole = false
          // 提示
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
        }
      })
    },
    // 添加角色
    submit4AddRole () {
      this.$refs['ruleFormAdd'].validate((valid) => {
        if (valid) {
          addRoleData(this.ruleFormAdd).then(res => {
            if (res.meta.status === 201) {
              // 关闭弹框
              this.dialogVisible4AddRole = false
              // 清空表单数据
              this.ruleFormAdd = {}
              // 刷新列表
              this.initList()
            }
          })
        }
      })
    },
    // 初始化角色列表
    initList () {
      getRolesData().then(res => {
        // console.log(res)
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
