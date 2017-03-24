<template lang="pug">
  #amap
    #container
    .status {{ poiList }}
    .center
      svg(xmlns="http://www.w3.org/2000/svg" version="1.1")
        rect#pin-body(x="9.1" y="19.5" width="4" height="21.9")
        circle#pin-header(cx="11.1" cy="10.9" r="9.6")
        circle#pin-hole(cx="11.1" cy="10.9" r="5.1")
</template>

<script>
  // import config from './amap.conf'
  import converter from 'wgs2mars'
  /**
   * 高德地图组件，基于vue2.0 es6标准
   * created by lvjia on 20170318
   */
  export default {
    name: 'vue-amap',
    data () {
      return {
        // Global引用
        _globalAmap: null,
        // 本地map实例
        _map: null,
        // 本地geolocation实例
        _geolocation: null,
        // debug use
        poiList: '',
        markers: []
      }
    },
    props: {},
    methods: {
      /**
       * 初始化本地map实例，传入脚本运行后挂载的BMap对象
       * @param BMap
       */
      _initMap (AMap) {
        // var map, geolocation
        this._globalAmap = AMap
        // 加载地图，调用浏览器定位服务
        this._map = new AMap.Map('container', {
          resizeEnable: true
        })
        // 监听地图移动事件
        this._map.on('moveend', (e) => {
          // window.alert(JSON.stringify(e))
          // 查询城市信息
          this._map.getCity((data) => {
            if (data['province'] && typeof data['province'] === 'string') {
              // 发送当前城市信息
              this.$store.dispatch('amapSetCurrentCity', data)
            }
          })
          // 同步当前地图中心点
          this.$store.dispatch('amapSetMapCenter', this._map.getCenter())
          // 搜索周边
          this._globalAmap.service(['AMap.PlaceSearch'], () => {
            // 构造地点查询类
            let placeSearch = new this._globalAmap.PlaceSearch({
              pageSize: 10,
              type: '',
              pageIndex: 1,
              city: '海口市' // 城市
              // map: this._map
            })
            placeSearch.searchNearBy('', this._map.getCenter(), 200, (status, result) => {
              // window.alert(JSON.stringify(result))
              // 发送当前周边地址信息
              this.$store.dispatch('amapSetLocationSearchResults', result)
            })
          })

//          let marker = new AMap.Marker({ // 添加自定义点标记
//            map: this._map,
//            position: this._map.getCenter(), // 基点位置
//            offset: new AMap.Pixel(-17, -42), // 相对于基点的偏移位置
//            draggable: true,  // 是否可拖动
//            content: `<div class="marker-route marker-marker-bus-from">${this.count}</div>`   // 自定义点标记覆盖物内容
//          })
//          marker.setMap(this._map)
          // 搜索cloud poi
          let searchOptions = {
            // map: this._map,
            // panel: 'panel',
            keywords: '',
            pageSize: 5,
            orderBy: '_id:ASC'
          }
          // 获取当前视口bounds
          let bounds = this._map.getBounds()

          // 加载CloudDataSearch服务插件
          this._globalAmap.service(['AMap.CloudDataSearch'], () => {
            let search = new this._globalAmap.CloudDataSearch('58d215ec305a2a68100c996e', searchOptions)
            search.searchInPolygon([bounds.getNorthEast(), bounds.getSouthWest()], (status, result) => {
              // window.alert(JSON.stringify(result))
              // 清除上一次的marker
              this._map.remove(this.markers)
              // 显示marker
              this.poiList = JSON.stringify(result)
              if (status === 'no_data') {
              } else {
                for (let i = 0; i < result.datas.length; i++) {
                  let marker = new this._globalAmap.Marker({
                    map: this._map,
                    position: result.datas[i]._location,
                    // title: result.datas[i].count
                    content: `<div class="map-marker"><p>${result.datas[i].count}</p><div class="triangle-down"></div><div class="shadow-wrapper"><div class="triangle-shadow"></div></div></div>`
                  })
                  this.markers.push(marker)
                }
              }
              // 发送当前周边地址信息
              this.$store.dispatch('amapSetPoiSearchResults', result)
            })
          })
        })
        // 定位
        this._map.plugin('AMap.Geolocation', () => {
          this._geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000,          // 超过10秒后停止定位，默认：无穷大
            noIpLocate: 3,
            // noGeoLocation: 3,
            convert: false,
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB',
            showCircle: false,
            showMarker: false
          })
          // this._map.addControl(this._geolocation)
          this._geolocation.getCurrentPosition()
          AMap.event.addListener(this._geolocation, 'complete', this.onComplete) // 返回定位信息
          AMap.event.addListener(this._geolocation, 'error', this.onError)      // 返回定位出错信息
        })
      },
      // 解析定位结果
      onComplete (data) {
        let gcjloc = converter(data.position.getLng(), data.position.getLat())
        let marker = new this._globalAmap.Marker({
          icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          position: [gcjloc.lng, gcjloc.lat]
        })
        marker.setMap(this._map)
        this._map.setZoomAndCenter(18, [gcjloc.lng, gcjloc.lat])
        // 将定位信息发送到store
        this.$store.dispatch('amapSetMapCenter', [gcjloc.lng, gcjloc.lat])
        this.$store.dispatch('amapSetCurrentPosition', [gcjloc.lng, gcjloc.lat])
        // 发送loaded状态
        this.$store.dispatch('amapLoaded')
//        this._globalAmap.service(['AMap.PlaceSearch'], () => {
//          // 构造地点查询类
//          let placeSearch = new this._globalAmap.PlaceSearch({
//            pageSize: 10,
//            type: '',
//            pageIndex: 1,
//            city: '海口市' // 城市
//            // map: this._map
//          })
//
//          let cpoint = [gcjloc.lng, gcjloc.lat] // 中心点坐标
//          // let pixel = this._map.lnglatTocontainer([gcjloc.lng, gcjloc.lat])
//          window.alert(pixel.getX())
//          window.alert(pixel.getY())
//          placeSearch.searchNearBy('', cpoint, 200, (status, result) => {
//            // window.alert(JSON.stringify(result))
//            this.poiList = JSON.stringify(result)
//          })
//        })
      },
      // 解析定位错误信息
      onError (data) {
        // document.getElementById('tip').innerHTML = '定位失败'
      },
      // 手动刷新定位信息
      refresh () {
        this._geolocation.getCurrentPosition()
      },
      /**
       * 初始化地图脚本
       * @returns {*}
       */
      _loadScript () {
        if (!global.AMap) {
          return new Promise((resolve, reject) => {
            global._init = function () {
              resolve(global.AMap)
              global.document.body.removeChild($script)
              global._init = null
            }
            const $script = document.createElement('script')
            global.document.body.appendChild($script)
            $script.src = 'http://webapi.amap.com/maps?v=1.3&key=ACCESS_KEY&callback=_init'
            // http://cache.amap.com/lbs/static/addToolbar.js
//            const $scriptToolbar = document.createElement('script')
//            global.document.body.appendChild($scriptToolbar)
//            $scriptToolbar.src = 'http://cache.amap.com/lbs/static/addToolbar.js'
          })
        }
        return Promise.resolve(global.AMap)
      }
    },
    created () {
      console.log('created')
      const {_loadScript, _initMap} = this
      _loadScript().then(_initMap)
    },
    computed: {
      // 获取store中refresh标志
      needRefresh () {
        return this.$store.state.amap.status.needRefresh
      },
      // 获取省信息
      city () {
        return this.$store.state.amap.currentCity.city
      },
      // zoom
      zoom () {
        return this.$store.state.amap.zoom
      },
      center () {
        return this.$store.state.amap.mapCenter
      }
    },
    watch: {
      // 监视是否需要刷新
      needRefresh: function () {
        if (this.needRefresh) {
          // refresh
          this.refresh()
          // set to false
          this.$store.dispatch('amapRefreshCompleted')
        }
      },
      city: function () {
        this._map.setCity(this.city)
      },
      zoom: function () {
        this._map.setZoom(this.zoom)
      },
      center: function () {
        this._map.setCenter(this.center)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './amap.styl'
</style>

