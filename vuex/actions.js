/**
 * 异步操作
 * @param commit
 */

export const amapLoaded = ({ commit }) => {
  commit('AMAP_LOADED')
}

export const amapNeedRefresh = ({ commit }) => {
  commit('AMAP_NEED_REFRESH')
}

export const amapRefreshCompleted = ({ commit }) => {
  commit('AMAP_REFRESH_COMPLETED')
}

export const amapSetCurrentCity = ({ commit }, cityData) => {
  commit('AMAP_SET_CURRENT_CITY', cityData)
}

export const amapSetCurrentPosition = ({ commit }, position) => {
  commit('AMAP_SET_CURRENT_POSITION', position)
}

export const amapSetZoom = ({ commit }, zoom) => {
  commit('AMAP_SET_ZOOM', zoom)
}

export const amapSetMapCenter = ({ commit }, center) => {
  commit('AMAP_SET_MAP_CENTER', center)
}

export const amapSetLocationSearchResults = ({ commit }, results) => {
  commit('AMAP_SET_LOCATION_SEARCH_RESULTS', results)
}

export const amapSetPoiSearchResults = ({ commit }, results) => {
  commit('AMAP_SET_POI_SEARCH_RESULTS', results)
}
