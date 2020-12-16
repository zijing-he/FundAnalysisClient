export default {
    managerNav2income: (_json, start) => {
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
        let startDate = xData[parseInt(xData.length * start / 100)]
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

    json2echartData: (_json) => {
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

    nav2seriesData: (_json) => {
        let seriesData = []
        let month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        for (let _year in _json) {
            let seriesYearData = []
            for (let index in month) {
                let every_month = month[index]
                if (Object.keys(_json[_year]).indexOf((_year + every_month)) !== -1) {
                    seriesYearData.push({data: Object.values(_json[_year][_year + every_month])})
                } else {
                    seriesYearData.push({data: []})
                }
            }
            seriesData.push({
                title: {text: _year + '全市场基金的净值分布情况'},
                series: seriesYearData
            })
        }
        return seriesData
    },

    asset2seriesData: (_json) => {
        let seriesData = []
        for (let _year in _json) {
            let seriesYearData = []
            for (let _range in _json[_year]['stock']) {
                seriesYearData.push({data: _json[_year]['stock'][_range]})
            }
            for (let _range in _json[_year]['bond']) {
                seriesYearData.push({data: _json[_year]['stock'][_range]})
            }
            for (let _range in _json[_year]['cash']) {
                seriesYearData.push({data: _json[_year]['stock'][_range]})
            }
            seriesData.push({
                title: {text: _year + '全市场基金的资产配置(stock/bond/cash)分布图'},
                series: seriesYearData
            })
        }
        return seriesData
    },

    marketSector2echartsData: (_json) => {
        let xData = Object.keys(_json)
        let timelineData = []
        let seriesData = []
        for (let _sector in _json) {
            for (let _year in _json[_sector]) {
                if (timelineData.indexOf(_year) === -1) {
                    timelineData.push(_year)
                }
            }
        }
        timelineData = timelineData.sort()
        for (let year_index in timelineData) {
            let year = timelineData[year_index]
            let seriesYearData = []
            for (let sector_index in xData) {
                let sector = xData[sector_index]
                if ((Object.keys(_json[sector])).indexOf(year) !== -1) {
                    seriesYearData.push(_json[sector][year])
                } else {
                    seriesYearData.push(0)
                }
            }
            seriesData.push({
                title: {text: year + '基金行业规模图'},
                series: {data: seriesYearData}
            })
        }
        return {'timelineData': timelineData, 'xData': xData, 'seriesData': seriesData}
    },
    managerSector2echartsData: (_json) => {
        _json = Object.values(_json)[0]
        let timelineData = Object.keys(_json)
        timelineData = timelineData.sort()
        let xData = []
        let optionsData = []
        let legendData = []
        let seriesData = []
        for (let _quarter in _json) {
            for (let _fund in _json[_quarter]) {
                if (legendData.indexOf(_fund) === -1) {
                    legendData.push(_fund)
                }
                for (let _sector in _json[_quarter][_fund]) {
                    if (xData.indexOf(_sector) === -1) {
                        xData.push(_sector)
                    }
                }
            }
        }
        for (let fund_index in legendData) {
            seriesData.push({name: legendData[fund_index], type: 'bar', stack: '总量'})
        }
        for (let quarter_index in timelineData) {
            let seriesFundsData = []
            let _quarter = timelineData[quarter_index]
            for (let fund_index in legendData) {
                let _fund = legendData[fund_index]
                let seriesYearData = []
                if (_fund in _json[_quarter]) {
                    for (let sector_index in xData) {
                        let sector = xData[sector_index]
                        if ((Object.keys(_json[_quarter][_fund])).indexOf(sector) !== -1) {
                            seriesYearData.push(_json[_quarter][_fund][sector])
                        } else {
                            seriesYearData.push(0)
                        }
                    }
                } else {
                    // eslint-disable-next-line no-unused-vars
                    for (let _ in xData) {
                        seriesYearData.push(0)
                    }
                }
                seriesFundsData.push({data: seriesYearData})
            }
            optionsData.push({
                title: {text: _quarter + '基金行业规模图'},
                series: seriesFundsData
            })
        }
        return {
            'legendData': legendData,
            'timelineData': timelineData,
            'xData': xData,
            'seriesData': seriesData,
            'optionsData': optionsData
        }
    },

    fundSector2echartsData: (_json) => {
        let timelineData = Object.keys(_json)
        timelineData = timelineData.sort()
        let xData = []
        let seriesData = []
        for (let _year in _json) {
            for (let _sector in _json[_year]) {
                if (xData.indexOf(_sector) === -1) {
                    xData.push(_sector)
                }
            }
        }
        for (let quarter_index in timelineData) {
            let quarter = timelineData[quarter_index]
            let seriesYearData = []
            for (let sector_index in xData) {
                let sector = xData[sector_index]
                if ((Object.keys(_json[quarter])).indexOf(sector) !== -1) {
                    seriesYearData.push(_json[quarter][sector])
                } else {
                    seriesYearData.push(0)
                }
            }
            seriesData.push({
                title: {text: quarter + '基金行业规模图'},
                series: {data: seriesYearData}
            })
        }
        return {'timelineData': timelineData, 'xData': xData, 'seriesData': seriesData}
    },

    fundNav2echartsData: (_json, start) => {
        let legendData = [Object.keys(_json)[0]]
        let xData = Object.keys(Object.values(_json)[0])
        let series = []
        xData = [...new Set(xData.sort())]
        let startDate = xData[parseInt(xData.length * start / 100)]
        for (let _id in _json) {
            let yData = []
            let firstNav
            for (let datetime of xData) {
                if (parseInt(datetime) < parseInt(startDate)) {
                    yData.push(undefined)
                    continue
                }
                if (Object.keys(_json[_id]).indexOf(datetime) !== -1) {
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
