<template>
  <div class="containers" ref="content">
    <div class="canvas" ref="canvas"></div>
    <div id="js-properties-panel" class="panel"></div>
  </div>
</template>

<script>
// 引入相关的依赖
// import BpmnViewer from 'bpmn-js'
import BpmnModeler from 'bpmn-js/lib/Modeler'
// 原有的 properties-panel 这个框
import propertiesPanelModule from 'bpmn-js-properties-panel'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
// 自定义的 properties-panel内容
import propertiesProviderModule from './properties-panel-extension/provider/authority'
import authorityModdleDescriptor from './properties-panel-extension/descriptors/authority'
import { xmlStr } from '../mock/xmlStr'
export default {
  name: '',
  components: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    this.init()
  },
  data() {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null
    }
  },
  // 方法集合
  methods: {
    init() {
      // 获取到属性ref为“content”的dom节点
      this.container = this.$refs.content
      // 获取到属性ref为“canvas”的dom节点
      const canvas = this.$refs.canvas
      // 建模
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        //添加控制板
        propertiesPanel: {
          parent: '#js-properties-panel'
        },
        additionalModules: [
          // 右边的工具栏(固定引入)
          propertiesPanelModule,
          // 自定义右边工作栏的内容
          propertiesProviderModule
        ],
        moddleExtensions: {
          // camunda: camundaModdleDescriptor,
          authority: authorityModdleDescriptor
        }
      })
      this.createNewDiagram()
    },
    createNewDiagram() {
      // 将字符串转换成图显示出来
      this.bpmnModeler.importXML(xmlStr, err => {
        if (err) {
          // console.error(err)
        } else {
          // 这里是成功之后的回调, 可以在这里做一系列事情
          this.success()
        }
      })
    },
    success() {
      // 给图绑定事件，当图有发生改变就会触发这个事件
      const that = this
      this.bpmnModeler.on('commandStack.changed', function() {
        that.saveDiagram(function(err, xml) {
          console.log(xml)
        })
      })
    },
    // 下载为bpmn格式,done是个函数，调用的时候传入的
    saveDiagram(done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        done(err, xml)
      })
    }
  },
  // 计算属性
  computed: {}
}
</script>

<style scoped>
.containers {
  background-color: #ffffff;
  width: 100%;
  height: calc(100vh - 52px);
}
.canvas {
  width: 100%;
  height: 100%;
}
.panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}
</style>