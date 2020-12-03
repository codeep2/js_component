const app = {
  oldNum: 0,
  mountElement: document.querySelector('.app'),

  setInitHtml (number) {
    let html = ''
    Array.from(number.toString()).forEach((item) => {
      html += `<div class="number">${item}</div>`
    })
    return html
  },

  setDigitNum (currentNum, targetNum) {
    const curNum = parseInt(currentNum)
    const tarNum = parseInt(targetNum)
    let digitDiv = ''
    if (curNum < tarNum) { // 如果当前数字小于目标数字,如3->5, 则生成3,4,5
      for (let i = curNum; i <= tarNum; i++) {
        digitDiv += `<div>${i}</div>`
      }
    } else { // 如果当前数字大于目标数字,如9->3, 则生成9,0,1,2,3
      const num = 10 - curNum + tarNum
      for (let i = curNum; i <= curNum + num; i++) {
        if (i > 9) {
          digitDiv += `<div>${(i).toString()[1]}</div>`
        } else {
          digitDiv += `<div>${i}</div>`
        }
      }
    }
    return digitDiv
  },

  setRoll (item, currentNum, targetNum) {
    const translateNum = this.getTransMove(currentNum, targetNum)
    const itemHeight = parseInt(getComputedStyle(item).height)

    item.style.cssText += 'transition-duration:0s; transform:translateY(0)'
    item.innerHTML = this.setDigitNum(currentNum, targetNum)
    setTimeout(() => {
      item.style.cssText += `transition-duration: 1s; transform: translateY(-${itemHeight * translateNum}px)`
    }, 50)
  },

  setExtraNum (diffNum) {
    const rollNumElement = this.mountElement.querySelector('.roll-num')
    // 倒序遍历多出来的数字,并在原来数字开头前插入
    Array.from(diffNum).reverse().forEach(item => {
      const firstDigitDiv = this.mountElement.querySelector('.number:first-child')
      const extraNumDiv = document.createElement('div')
      extraNumDiv.classList.add('number')
      extraNumDiv.innerText = item

      rollNumElement.insertBefore(extraNumDiv, firstDigitDiv)
    })
  },

  getTransMove (oldNum, newNum) {
    let translateNum = 0
    if (oldNum > newNum) { // 如果变化的数字小于原来的数字，比如5->4，则需要移动9
      translateNum = 10 - oldNum + newNum
    } else {
      translateNum = newNum - oldNum
    }
    return translateNum
  },

  digitRoll (newNum) {
    const diffLength = newNum.toString().length - this.oldNum.toString().length

    if (diffLength) { // 如果传递进来数字的长度大于原来的长度
      const diffNum = newNum.toString().slice(0, diffLength)
      this.setExtraNum(diffNum)
    }

    const newNumDivList = Array.from(this.mountElement.querySelectorAll('.number'))
    for (let index = 0; index < newNumDivList.length; index++) {
      let currentNum = parseInt(this.oldNum.toString()[index])
      const targetNum = parseInt(newNum.toString()[index])

      if (currentNum === targetNum) { continue }
      if (isNaN(currentNum)) { currentNum = 0 }

      const NumDiv = newNumDivList[index]
      this.setRoll(NumDiv, currentNum, targetNum)
    }
    this.oldNum = newNum
  },

  init (initNum) {
    const rollNum = this.mountElement.querySelector('.roll-num')
    this.oldNum = parseInt(initNum)
    rollNum.innerHTML = this.setInitHtml(this.oldNum)
  }
}

app.init(0)

let num = 1
setInterval(() => {
  num += 1
  app.digitRoll(num)
}, 1000)