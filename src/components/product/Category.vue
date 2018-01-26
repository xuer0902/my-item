<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-button type="success" plain @click="AddCate">添加分类</el-button>
    </div>
    <!-- 表格 引入老师给的组件-->
    <div>
      <!-- columns:表示所有的列 tree-structure:表示数据格式,有tree和list两种,默认是tree data-source:数据源,表示实际的列表数据  deleteCate处理删除操作，showForm处理编辑操作，refresh处理刷新操作 -->
      <tree-grid :columns="columns" :tree-structure="true" :data-source="dataSource" @deleteCate="deleteCategory" @showForm="showEditForm" @refresh="initList"></tree-grid>
    </div>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentpage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加分类弹框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisibleAddCate"
      width="50%">
      <div>
        <span>分类名称: </span>
        <el-input class="cname" v-model="cate.cat_name"></el-input>
        <div>
          <span>父级名称: </span>
          <span class="block">
            <el-cascader
              :options="cateData"
              :props="propData"
              v-model="selectedCate"
              @change="handleChange">
            </el-cascader>
          </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAddCate = false">取 消</el-button>
        <el-button type="primary" @click="submitAddCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TreeGrid from './TreeGrid.vue'
import {initProductCateList, addCateData, delCateData} from '../../api/api.js'
export default {
  data () {
    return {
      total: 10, // 数据总条数
      pagesize: 5, // 每页数据条数
      currentpage: 1, // 当前页码
      dialogVisibleAddCate: false,
      // 数据的每一列名
      columns: [
        {
          text: '分类名称',
          dataIndex: 'cat_name',
          width: 500
        }, {
          text: '是否有效',
          dataIndex: 'cat_deleted',
          width: 100
        }, {
          text: '排序',
          dataIndex: 'cat_level',
          width: 100
        }
      ],
      // 表格数据
      dataSource: [],
      cate: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      // 点击添加分类按钮获取级联菜单的数据(数据内容可根据props属性定制)
      cateData: [],
      propData: {
        value: 'cat_id',
        label: 'cat_name'
      },
      selectedCate: []
    }
  },
  methods: {
    // 添加分类
    AddCate () {
      initProductCateList({type: 2}).then(res => {
        if (res.meta.status === 200) {
          // 将数据填充
          this.cateData = res.data
          // 打开弹框
          this.dialogVisibleAddCate = true
        }
      })
    },
    // 点击确定添加按钮,触发事件
    submitAddCate () {
      // 层级是0 1 2  pid是在当前要建立的最后一层的id
      // 例如要建一级分类,层级为0, pid为0;要建二级分类,层级为1, pid为一级分类的id;要建三级分类,层级为2, pid为二级分类的id
      console.log(this.selectedCate)
      // 处理分类参数
      if (this.selectedCate.length === 0) {
        this.cate.cat_pid = 0
        this.cate.cat_level = 0
      } else {
        this.cate.cat_pid = this.selectedCate[this.selectedCate.length - 1]
        // 设置层级
        this.cate.cat_level = this.selectedCate.length === 1 ? 1 : 2
      }
      addCateData(this.cate).then(res => {
        console.log(res)
        if (res.meta.status === 201) {
          this.dialogVisibleAddCate = false
          this.initList()
          this.cate = {}
        }
      })
    },
    // 点击级联菜单里的二级菜单,触发的事件
    handleChange (value) {
      console.log(value)
    },
    // 删除分类
    deleteCategory (cid) {
      delCateData({id: cid}).then(res => {
        if (res.meta.status === 200) {
          this.initList()
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
        }
      })
    },
    // 编辑
    showEditForm () {
      console.log('显示编辑列表')
    },
    // 获取分类列表
    initList () {
      initProductCateList({type: 3, pagenum: this.currentpage, pagesize: this.pagesize}).then(res => {
        if (res.meta.status === 200) {
          this.dataSource = res.data.result
          this.pagesize = res.data.pagesize
          this.total = res.data.total
        }
      })
    },
    // 页码大小处理触发
    handleSizeChange (val) {
      this.pagesize = val
      this.initList()
    },
    // 当前页改变触发
    handleCurrentChange (val) {
      this.currentpage = val
      this.initList()
    }
  },
  components: {
    TreeGrid
  },
  mounted () {
    this.initList()
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
  .cname {
    width: 300px;
    margin-bottom: 20px;
  }
</style>
