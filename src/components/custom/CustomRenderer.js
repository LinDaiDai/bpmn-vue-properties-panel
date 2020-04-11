import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

const HIGH_PRIORITY = 1500

const propertiesConfig = {
  'bpmn:StartEvent': {
    fill: '#12c2e9'
  },
  'bpmn:Task': {
    stroke: '#c471ed',
    strokeWidth: 2,
  },
  'bpmn:EndEvent': {
    stroke: '#f64f59',
    fill: '#f64f59'
  }
}

export default class CustomRenderer extends BaseRenderer {
    constructor(eventBus, bpmnRenderer) {
        super(eventBus, HIGH_PRIORITY);

        this.bpmnRenderer = bpmnRenderer;
    }

    canRender(element) {
        // ignore labels
        return !element.labelTarget;
    }
    drawShape(parentNode, element) {
        let shape = this.bpmnRenderer.drawShape(parentNode, element)
        setShapeProperties(shape, element) // 在此修改shape
        return shape
    }

    getShapePath(shape) {
      return this.bpmnRenderer.getShapePath(shape);
    }
}

function setShapeProperties (shape, element) {
  const type = element.type // 获取到的类型
  if (propertiesConfig[type]) {
    const properties = propertiesConfig[type]
    Object.keys(properties).forEach(prop => {
      shape.style.setProperty(prop, properties[prop])
    })
  }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];