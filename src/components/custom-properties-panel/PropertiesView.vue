<template>
  <div class="custom-properties-panel">
    <div class="empty" v-if="selectedElements.length<=0">请选择一个元素</div>
    <div class="empty" v-else-if="selectedElements.length>1">只能选择一个元素</div>
    <div v-else>
      <fieldset class="element-item">
        <label>id</label>
        <span>{{ element.id }}</span>
      </fieldset>
      <fieldset class="element-item">
        <label>name</label>
        <input :value="element.name" @change="(event) => changeField(event, 'name')" />
      </fieldset>
      <fieldset class="element-item">
        <label>customProps</label>
        <input :value="element.customProps" @change="(event) => changeField(event, 'customProps')" />
      </fieldset>
      <fieldset class="element-item">
        <label>节点颜色</label>
        <input type="color" :value="element.color" @change="(event) => changeField(event, 'color')" />
      </fieldset>
      <fieldset class="element-item" v-if="isEvent">
        <label>修改event节点类型</label>
        <select @change="changeEventType" :value="eventType">
          <option
            v-for="option in eventTypes"
            :key="option.value"
            :value="option.value"
          >{{ option.label }}</option>
        </select>
      </fieldset>
      <fieldset class="element-item" v-if="isTask">
        <label>修改Task节点类型</label>
        <select @change="changeTaskType" :value="taskType">
          <option
            v-for="option in taskTypes"
            :key="option.value"
            :value="option.value"
          >{{ option.label }}</option>
        </select>
      </fieldset>
    </div>
  </div>
</template>

<script>
import { START_EVENT } from 'bpmn-js/lib/features/replace/ReplaceOptions.js'
export default {
  name: 'PropertiesView',
  props: {
    modeler: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      selectedElements: [],
      element: null,
      eventTypes: [
        { label: '默认', value: '' },
        { label: 'MessageEventDefinition', value: 'bpmn:MessageEventDefinition' },
        { label: 'TimerEventDefinition', value: 'bpmn:TimerEventDefinition' },
        { label: 'ConditionalEventDefinition', value: 'bpmn:ConditionalEventDefinition' }
      ],
      eventType: '',
      taskTypes: [
        { label: 'Task', value: 'bpmn:Task' },
        { label: 'ServiceTask', value: 'bpmn:ServiceTask' },
        { label: 'SendTask', value: 'bpmn:SendTask' },
        { label: 'UserTask', value: 'bpmn:UserTask' }
      ],
      taskType: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const { modeler } = this
      console.log(modeler)
      console.log(START_EVENT)
      modeler.on('selection.changed', e => {
        this.selectedElements = e.newSelection
        this.element = e.newSelection[0]
        console.log(this.element)
        this.setDefaultProperties()
      })
      modeler.on('element.changed', e => {
        const { element } = e
        const { element: currentElement } = this
        if (!currentElement) {
          return
        }
        // update panel, if currently selected element changed
        if (element.id === currentElement.id) {
          this.element = element
        }
      })
    },
    setDefaultProperties() {
      const { element } = this
      if (element) {
        const { type, businessObject } = element
        if (this.verifyIsEvent(type)) {
          this.eventType = businessObject.eventDefinitions ? businessObject.eventDefinitions[0]['$type'] : ''
          console.log(this.eventType)
        } else if (this.verifyIsTask(type)) {
          this.taskType = type
        }
      }
    },
    verifyIsEvent(type) {
      return type.includes('Event')
    },
    verifyIsTask(type) {
      return type.includes('Task')
    },
    /**
     * 改变控件触发的事件
     * @param { Object } input的Event
     * @param { String } 要修改的属性的名称
     */
    changeField(event, type) {
      console.log(event)
      console.log(type)
      const value = event.target.value
      this.element[type] = value
      let properties = {}
      properties[type] = value
      if (type === 'color') {
        this.onChangeColor(value)
      }
      this.updateProperties(properties)
    },
    updateName(name) {
      const { modeler, element } = this
      const modeling = modeler.get('modeling')
      modeling.updateLabel(element, name)
    },
    onChangeColor(color) {
      console.log(color)
      const { modeler, element } = this
      const modeling = this.modeler.get('modeling')
      modeling.setColor(element, {
        fill: null,
        stroke: color
      })
    },
    changeEventType(event) {
      console.log(event)
      const { modeler, element } = this
      const value = event.target.value
      const bpmnReplace = modeler.get('bpmnReplace')
      this.eventType = value
      bpmnReplace.replaceElement(element, {
        type: element.businessObject.$type,
        eventDefinitionType: value
      })
    },
    changeTaskType(event) {
      console.log(event)
      const { modeler, element } = this
      const value = event.target.value
      const bpmnReplace = modeler.get('bpmnReplace')
      bpmnReplace.replaceElement(element, {
        type: value
      })
    },
    /**
     * 更新元素属性
     * @param { Object } 要更新的属性, 例如 { name: '' }
     */
    updateProperties(properties) {
      const { modeler, element } = this
      const modeling = modeler.get('modeling')
      modeling.updateProperties(element, properties)
    }
  },
  computed: {
    isEvent() {
      const { element } = this
      return this.verifyIsEvent(element.type)
    },
    isTask() {
      const { element } = this
      return this.verifyIsTask(element.type)
    }
  }
}
</script>

<style scoped>
.custom-properties-panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
  background-color: #fff9f9;
  border-color: rgba(0, 0, 0, 0.09);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 20px;
}
.empty {
  height: 200px;
  line-height: 200px;
  font-weight: 700;
}
.element-item {
  padding: 10px;
  margin-top: 5px;
  border: 1px solid;
  border-color: darkorange;
  border-radius: 8px;
}
.element-item:first-child {
  margin-top: 0;
}
.custom-properties-panel input,
.custom-properties-panel textarea {
  padding: 4px 11px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;
  outline: none;
}
.custom-properties-panel input:focus,
.custom-properties-panel button:focus,
.custom-properties-panel textarea:focus,
.custom-properties-panel [contenteditable]:focus {
  border-color: rgb(239, 112, 96);
  box-shadow: 0 0 1px 2px rgb(239, 112, 96, 0.2);
}
.custom-properties-panel label {
  font-weight: bold;
}

.custom-properties-panel label:after {
  content: ': ';
}

.custom-properties-panel button + button {
  margin-left: 10px;
}
</style>