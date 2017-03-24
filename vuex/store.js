import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'

Vue.use(Vuex)

// 定义全局state
const state = {
  amap: {
    status: {
      // 加载完成标志
      loaded: false,
      // 需要刷新标志
      needRefresh: false
    },
    // 当前城市信息
    currentCity: {
      // 省
      province: '',
      // 市
      city: '',
      // 城市编码
      citycode: '',
      // 区
      district: ''
    },
    // 当前定位坐标
    currentPosition: [],
    // 地图缩放比例
    zoom: 0,
    // 地图中心点
    mapCenter: [],
    // 周边地址搜索结果
    locationSearchResults: {},
    // 周边POI数据库搜索结果
    poiSearchResults: {}
  }
}

// 定义同步操作
const mutations = {
  // 设置Loaded
  AMAP_LOADED (state) {
    state.amap.status.loaded = true     // 新增
  },
  // 设置刷新标志
  AMAP_NEED_REFRESH (state) {
    state.amap.status.needRefresh = true
  },
  // 设置刷新完成标志
  AMAP_REFRESH_COMPLETED (state) {
    state.amap.status.needRefresh = false
  },
  AMAP_SET_CURRENT_CITY (state, cityData) {
    state.amap.currentCity = cityData
  },
  AMAP_SET_CURRENT_POSITION (state, position) {
    state.amap.currentPosition = position
  },
  AMAP_SET_ZOOM (state, zoom) {
    state.amap.zoom = zoom
  },
  AMAP_SET_MAP_CENTER (state, center) {
    state.amap.mapCenter = center
  },
  AMAP_SET_LOCATION_SEARCH_RESULTS (state, results) {
    state.amap.locationSearchResults = results
  },
  AMAP_SET_POI_SEARCH_RESULTS (state, results) {
    state.amap.poiSearchResults = results
  }
}

// 获取active note
// const getters = {
//   activeNote: state => state.activeNote
// }

export default new Vuex.Store({
  state,
  mutations,
  actions
  // getters
})
