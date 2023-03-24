interface SubscribeType {
  [key: string]: ((...args: any[]) => void)[]
}

class EventBus {
  subscribe : SubscribeType = {}
  
  on(event: string, fn: (...args: any[]) => void) {
    if (this.subscribe[event]) {
      this.subscribe[event].push(fn)
    } else {
      this.subscribe[event] = [fn]
    }
    console.log(event, this.subscribe[event])
  }

  off(event: string, fn: (...args: any[]) => void) {
    if (this.subscribe[event]) {
      this.subscribe[event] = this.subscribe[event].filter(value => value !== fn)
    }
  }

  emit(event: string, ...args: any[]) {
    if (this.subscribe[event]) {
      this.subscribe[event].forEach(fn => fn.apply(this, args))
    }
  }
}

const eventbus = new EventBus();

export default eventbus;