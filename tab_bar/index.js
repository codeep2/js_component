const app = {
  activeIndex: 0,
  tabElementList: [],
  tabsLists: ['Tab', '短', '很长很长很长的标签栏'],
  contentLists: ['<p>段落</p>', '<h2>标题</h2>', '3'],
  mountElement: document.querySelector('.app'),

  setHtml () {
    const html = `
      <div class="tab-inner">
        <div class="tab-scroll">
          <ul class="tab-lists"></ul>
          <div class="active-bar"></div>
        </div>
      </div>
      <div class="content"></div>
    `
    this.mountElement.innerHTML = html
  },

  setTabLists () {
    const tabListsElement = document.querySelector('.tab-lists')

    this.tabsLists.forEach((value, index) => {
      const tabItem = this.setTabItem(value, index)

      tabListsElement.style.transform = 'translateX(0px)'
      tabListsElement.appendChild(tabItem)
      this.tabElementList.push(tabItem)
      this.bindTabClick(tabItem, index)
    })
  },

  setTabItem (value, index) {
    const tabElement = document.createElement('li')

    if (index === this.activeIndex) {
      tabElement.classList.add("selected")
      this.setContentPanel()
    }
    tabElement.textContent = value
    tabElement.setAttribute('data-type', 'tab-item')

    return tabElement
  },

  setActiveBarAnimation (activeTab, index) {
    const activeBar = document.querySelector('.active-bar')
    const activeTabStyle = window.getComputedStyle(activeTab)
    let slideWidth = 0

    for (let i = 0; i < index; i++) {
      const tabElement = this.tabElementList[i]
      const tabElementStyle = window.getComputedStyle(tabElement)
      const tabElementWidth = parseFloat(tabElementStyle.width)
      const tabElementPaddingRight = parseFloat(tabElementStyle.paddingRight)
      const activeTabPaddingLeft = parseFloat(activeTabStyle.paddingLeft)

      slideWidth += (tabElementWidth + tabElementPaddingRight + activeTabPaddingLeft)
    }

    activeBar.style.width = activeTabStyle.width
    activeBar.style.transform = `translateX(${slideWidth}px)`
  },

  bindTabClick (activeTab, index) {
    activeTab.addEventListener('click', () => {
      if (index === this.activeIndex) { return }
      this.setActiveBarAnimation(activeTab, index)
      this.tabElementList[this.activeIndex].classList.remove('selected')
      activeTab.classList.add('selected')
      this.activeIndex = index
      this.setContentPanel()
    })
  },

  setContentPanel () {
    const content = document.querySelector('.content')
    content.innerHTML = `<div>${this.contentLists[this.activeIndex]}</div>`
  },

  init () {
    if (this.tabsLists.length !== this.contentLists.length) {
      console.error("The tab length don't match")
      return
    }
    this.setHtml()
    this.setTabLists()
    this.setActiveBarAnimation(this.tabElementList[this.activeIndex], this.activeIndex)
  }
}

app.init()
