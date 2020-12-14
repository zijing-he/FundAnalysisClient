export default {
    managerNav2income: (_json, startDate) => {
        let legendData = []
        let xData = []
        let series = []
        for (let _id in _json) {
            for (let sub_id in _json[_id]) {
                legendData.push(_id + ':' + sub_id)
                xData = xData.concat(Object.keys(_json[_id][sub_id]))
            }
        }
        xData = [...new Set(xData.sort())]
        for (let _id in _json) {
            for (let sub_id in _json[_id]) {
                let yData = []
                let firstNav
                for (let datetime of xData) {
                    if (parseInt(datetime) < parseInt(startDate)) {
                        yData.push(undefined)
                        continue
                    }
                    if (_json[_id][sub_id].hasOwnProperty(datetime)) {
                        if (firstNav === undefined) {
                            firstNav = _json[_id][sub_id][datetime]
                        }
                        yData.push((_json[_id][sub_id][datetime] / firstNav - 1) * 100)
                    } else {
                        yData.push(undefined)
                    }
                }
                series.push({name: _id + ':' + sub_id, type: 'line', data: [...yData]})
            }
        }
        return {'legendData': legendData, 'xData': xData, 'series': series}
    },

    nav: (_json, startDate) => {
        console.log(_json)
        let legendData = []
        let xData = []
        let series = []
        for (let _id in _json) {
            for (let sub_id in _json[_id]) {
                legendData.push(_id + ':' + sub_id)
                xData = xData.concat(Object.keys(_json[_id][sub_id]))
            }
        }
        xData = [...new Set(xData.sort())]
        for (let _id in _json) {
            for (let sub_id in _json[_id]) {
                let yData = []
                let firstNav
                for (let datetime of xData) {
                    if (parseInt(datetime) < parseInt(startDate)) {
                        yData.push(undefined)
                        continue
                    }
                    if (_json[_id][sub_id].hasOwnProperty(datetime)) {
                        if (firstNav === undefined) {
                            firstNav = _json[_id][sub_id][datetime]
                        }
                        yData.push(_json[_id][sub_id][datetime])
                    } else {
                        yData.push(undefined)
                    }
                }
                series.push({name: _id + ':' + sub_id, type: 'line', data: [...yData]})
            }
        }
        return {'legendData': legendData, 'xData': xData, 'series': series}
    },
    nav2seriesData: (_json) =>{
      let seriesData = []
      let month = ['01','02','03','04','05','06','07','08','09','10','11','12']
      for (let _year in _json){
        let seriesYearData = []
        for (let index in month){
            let every_month = month[index]
            if (Object.keys(_json[_year]).indexOf((_year+every_month)) != -1){
             seriesYearData.push({data:Object.values(_json[_year][_year+every_month])})
            }else {
              seriesYearData.push({data:[]})
            }
        }
        seriesData.push({
          title:{text: _year+'全市场基金的净值分布情况'},
          series:seriesYearData
        })
      }
      return seriesData
    },
    asset2seriesData: (_json) =>{
      let seriesData = []
      for (let _year in _json){
        let seriesYearData = []
        for (let _range in _json[_year]['stock']){
          seriesYearData.push({data:_json[_year]['stock'][_range]})
        }
        for (let _range in _json[_year]['bond']){
          seriesYearData.push({data:_json[_year]['stock'][_range]})
        }
        for (let _range in _json[_year]['cash']){
          seriesYearData.push({data:_json[_year]['stock'][_range]})
        }
        seriesData.push({
          title:{text: _year+'全市场基金的资产配置(stock/bond/cash)分布图'},
          series:seriesYearData
        })
      }
      return seriesData
    },
    marketSector2echartsData: (_json) =>{
        let xData = Object.keys(_json)
        let timelineData = []
        let seriesData = []
        for (let _sector in _json){
          for (let _year in _json[_sector]){
            if (timelineData.indexOf(_year) == -1){
              timelineData.push(_year)
            }
          }
        }
        timelineData = timelineData.sort()
        for (let year_index in timelineData){
          let year = timelineData[year_index]
          let seriesYearData = []
          for (let sector_index in xData){
            let sector = xData[sector_index]
            if ((Object.keys(_json[sector])).indexOf(year) != -1){
              seriesYearData.push(_json[sector][year])
            }else {
              seriesYearData.push(0)
            }
          }
          seriesData.push({
            title: {text: year + '基金行业规模图'},
            series: {data:seriesYearData}
          })
        }
        return {'timelineData':timelineData ,'xData':xData, 'seriesData':seriesData}
      },
      managerSector2echartsData: (_json) => {
        let data = Object.values(_json)[0]
        let legendData = Object.keys(data)
        let seriesData = []
        for (let key in data){
          seriesData.push({value:data[key],name:key})
        }
        return {'legendData':legendData, 'seriesData':seriesData}
      },

    fundNav2echartsData: (_json, firstStartDate) => {
      let legendData = [Object.keys(_json)[0]]
      let xData = Object.keys(Object.values(_json)[0])
      xData = [...new Set(xData.sort())]
      let series = []
      for (let _id in _json) {
          let yData = []
          let firstNav
          for (let datetime of xData) {
            if (parseInt(datetime) < parseInt(firstStartDate)) {
              yData.push(undefined)
              continue
            }
            if (Object.keys(_json[_id]).indexOf(datetime) != -1) {
              if (firstNav === undefined) {
                firstNav = _json[_id][datetime]
              }
              yData.push((_json[_id][datetime] / firstNav - 1) * 100)
            } else {
              yData.push(undefined)
            }
          }
          series.push({name: _id, type: 'line', data: [...yData]})
      }
      return {'legendData': legendData, 'xData': xData, 'series': series}
    }
}
