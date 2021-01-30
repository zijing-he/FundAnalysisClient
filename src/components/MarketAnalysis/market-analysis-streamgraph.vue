
<template>
  <div id="market_streamgraph"></div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "MarketAnalysisStramGraph",
  props: {},
  components: {},
  data() {
    return {
      svg: null,
      margin: {  top: 20, right: 20, bottom: 20, left: 20  },
      width: 1018,
      height: 120,
      data: [
        {
          year: "1880",
          Amanda: "241",
          Ashley: "0",
          Betty: "117",
          Deborah: "12",
        },
        {
          year: "1881",
          Amanda: "263",
          Ashley: "0",
          Betty: "112",
          Deborah: "14",
        },
        {
          year: "1882",
          Amanda: "288",
          Ashley: "0",
          Betty: "123",
          Deborah: "15",
        },
        {
          year: "1883",
          Amanda: "287",
          Ashley: "0",
          Betty: "120",
          Deborah: "16",
        },
        {
          year: "1884",
          Amanda: "337",
          Ashley: "0",
          Betty: "144",
          Deborah: "13",
        },
        {
          year: "1885",
          Amanda: "339",
          Ashley: "0",
          Betty: "155",
          Deborah: "10",
        },
        {
          year: "1886",
          Amanda: "370",
          Ashley: "0",
          Betty: "167",
          Deborah: "10",
        },
        {
          year: "1887",
          Amanda: "338",
          Ashley: "0",
          Betty: "178",
          Deborah: "15",
        },
        {
          year: "1888",
          Amanda: "404",
          Ashley: "0",
          Betty: "214",
          Deborah: "26",
        },
        {
          year: "1889",
          Amanda: "413",
          Ashley: "0",
          Betty: "189",
          Deborah: "12",
        },
        {
          year: "1890",
          Amanda: "392",
          Ashley: "0",
          Betty: "216",
          Deborah: "24",
        },
        {
          year: "1891",
          Amanda: "371",
          Ashley: "0",
          Betty: "239",
          Deborah: "15",
        },
        {
          year: "1892",
          Amanda: "455",
          Ashley: "0",
          Betty: "255",
          Deborah: "16",
        },
        {
          year: "1893",
          Amanda: "387",
          Ashley: "0",
          Betty: "298",
          Deborah: "24",
        },
        {
          year: "1894",
          Amanda: "418",
          Ashley: "0",
          Betty: "298",
          Deborah: "18",
        },
        {
          year: "1895",
          Amanda: "431",
          Ashley: "0",
          Betty: "350",
          Deborah: "13",
        },
        {
          year: "1896",
          Amanda: "367",
          Ashley: "0",
          Betty: "342",
          Deborah: "18",
        },
        {
          year: "1897",
          Amanda: "354",
          Ashley: "0",
          Betty: "367",
          Deborah: "23",
        },
        {
          year: "1898",
          Amanda: "371",
          Ashley: "0",
          Betty: "421",
          Deborah: "21",
        },
        {
          year: "1899",
          Amanda: "326",
          Ashley: "0",
          Betty: "410",
          Deborah: "11",
        },
        {
          year: "1900",
          Amanda: "377",
          Ashley: "0",
          Betty: "664",
          Deborah: "26",
        },
        {
          year: "1901",
          Amanda: "317",
          Ashley: "0",
          Betty: "474",
          Deborah: "21",
        },
        {
          year: "1902",
          Amanda: "301",
          Ashley: "0",
          Betty: "580",
          Deborah: "21",
        },
        {
          year: "1903",
          Amanda: "247",
          Ashley: "0",
          Betty: "596",
          Deborah: "21",
        },
        {
          year: "1904",
          Amanda: "294",
          Ashley: "0",
          Betty: "707",
          Deborah: "23",
        },
        {
          year: "1905",
          Amanda: "311",
          Ashley: "0",
          Betty: "807",
          Deborah: "18",
        },
        {
          year: "1906",
          Amanda: "260",
          Ashley: "0",
          Betty: "865",
          Deborah: "25",
        },
        {
          year: "1907",
          Amanda: "285",
          Ashley: "0",
          Betty: "1018",
          Deborah: "21",
        },
        {
          year: "1908",
          Amanda: "260",
          Ashley: "0",
          Betty: "1128",
          Deborah: "25",
        },
        {
          year: "1909",
          Amanda: "271",
          Ashley: "0",
          Betty: "1082",
          Deborah: "26",
        },
        {
          year: "1910",
          Amanda: "278",
          Ashley: "0",
          Betty: "1389",
          Deborah: "33",
        },
        {
          year: "1911",
          Amanda: "280",
          Ashley: "0",
          Betty: "1456",
          Deborah: "36",
        },
        {
          year: "1912",
          Amanda: "310",
          Ashley: "0",
          Betty: "2011",
          Deborah: "32",
        },
        {
          year: "1913",
          Amanda: "346",
          Ashley: "0",
          Betty: "2239",
          Deborah: "42",
        },
        {
          year: "1914",
          Amanda: "375",
          Ashley: "0",
          Betty: "2933",
          Deborah: "62",
        },
        {
          year: "1915",
          Amanda: "412",
          Ashley: "0",
          Betty: "4182",
          Deborah: "106",
        },
        {
          year: "1916",
          Amanda: "421",
          Ashley: "0",
          Betty: "5136",
          Deborah: "90",
        },
        {
          year: "1917",
          Amanda: "445",
          Ashley: "5",
          Betty: "6639",
          Deborah: "89",
        },
        {
          year: "1918",
          Amanda: "397",
          Ashley: "0",
          Betty: "8802",
          Deborah: "92",
        },
        {
          year: "1919",
          Amanda: "379",
          Ashley: "0",
          Betty: "10107",
          Deborah: "70",
        },
        {
          year: "1920",
          Amanda: "379",
          Ashley: "0",
          Betty: "14017",
          Deborah: "82",
        },
        {
          year: "1921",
          Amanda: "392",
          Ashley: "0",
          Betty: "17637",
          Deborah: "94",
        },
        {
          year: "1922",
          Amanda: "341",
          Ashley: "0",
          Betty: "20893",
          Deborah: "71",
        },
        {
          year: "1923",
          Amanda: "362",
          Ashley: "0",
          Betty: "25990",
          Deborah: "118",
        },
        {
          year: "1924",
          Amanda: "341",
          Ashley: "0",
          Betty: "30602",
          Deborah: "125",
        },
        {
          year: "1925",
          Amanda: "310",
          Ashley: "0",
          Betty: "32817",
          Deborah: "82",
        },
        {
          year: "1926",
          Amanda: "310",
          Ashley: "0",
          Betty: "32959",
          Deborah: "116",
        },
        {
          year: "1927",
          Amanda: "234",
          Ashley: "0",
          Betty: "35422",
          Deborah: "91",
        },
        {
          year: "1928",
          Amanda: "247",
          Ashley: "0",
          Betty: "36078",
          Deborah: "130",
        },
        {
          year: "1929",
          Amanda: "209",
          Ashley: "0",
          Betty: "36669",
          Deborah: "161",
        },
        {
          year: "1930",
          Amanda: "196",
          Ashley: "0",
          Betty: "38239",
          Deborah: "165",
        },
        {
          year: "1931",
          Amanda: "209",
          Ashley: "0",
          Betty: "36102",
          Deborah: "158",
        },
        {
          year: "1932",
          Amanda: "213",
          Ashley: "0",
          Betty: "34411",
          Deborah: "208",
        },
        {
          year: "1933",
          Amanda: "199",
          Ashley: "0",
          Betty: "31526",
          Deborah: "243",
        },
        {
          year: "1934",
          Amanda: "189",
          Ashley: "0",
          Betty: "31078",
          Deborah: "280",
        },
        {
          year: "1935",
          Amanda: "211",
          Ashley: "0",
          Betty: "28673",
          Deborah: "279",
        },
        {
          year: "1936",
          Amanda: "192",
          Ashley: "0",
          Betty: "25863",
          Deborah: "299",
        },
        {
          year: "1937",
          Amanda: "176",
          Ashley: "0",
          Betty: "25328",
          Deborah: "323",
        },
        {
          year: "1938",
          Amanda: "192",
          Ashley: "7",
          Betty: "25502",
          Deborah: "410",
        },
        {
          year: "1939",
          Amanda: "185",
          Ashley: "0",
          Betty: "23639",
          Deborah: "443",
        },
        {
          year: "1940",
          Amanda: "218",
          Ashley: "0",
          Betty: "22074",
          Deborah: "469",
        },
        {
          year: "1941",
          Amanda: "223",
          Ashley: "6",
          Betty: "20900",
          Deborah: "608",
        },
        {
          year: "1942",
          Amanda: "295",
          Ashley: "8",
          Betty: "21654",
          Deborah: "676",
        },
        {
          year: "1943",
          Amanda: "284",
          Ashley: "10",
          Betty: "21595",
          Deborah: "788",
        },
        {
          year: "1944",
          Amanda: "238",
          Ashley: "12",
          Betty: "19757",
          Deborah: "1293",
        },
        {
          year: "1945",
          Amanda: "280",
          Ashley: "10",
          Betty: "18383",
          Deborah: "1464",
        },
        {
          year: "1946",
          Amanda: "274",
          Ashley: "7",
          Betty: "19714",
          Deborah: "2470",
        },
        {
          year: "1947",
          Amanda: "310",
          Ashley: "11",
          Betty: "18962",
          Deborah: "5838",
        },
        {
          year: "1948",
          Amanda: "306",
          Ashley: "13",
          Betty: "16622",
          Deborah: "11246",
        },
        {
          year: "1949",
          Amanda: "333",
          Ashley: "11",
          Betty: "14946",
          Deborah: "19208",
        },
        {
          year: "1950",
          Amanda: "379",
          Ashley: "15",
          Betty: "13614",
          Deborah: "29073",
        },
        {
          year: "1951",
          Amanda: "409",
          Ashley: "15",
          Betty: "12820",
          Deborah: "42045",
        },
        {
          year: "1952",
          Amanda: "418",
          Ashley: "24",
          Betty: "12125",
          Deborah: "49809",
        },
        {
          year: "1953",
          Amanda: "428",
          Ashley: "15",
          Betty: "11367",
          Deborah: "52196",
        },
        {
          year: "1954",
          Amanda: "428",
          Ashley: "21",
          Betty: "10615",
          Deborah: "54674",
        },
        {
          year: "1955",
          Amanda: "452",
          Ashley: "8",
          Betty: "9928",
          Deborah: "52314",
        },
        {
          year: "1956",
          Amanda: "643",
          Ashley: "25",
          Betty: "9213",
          Deborah: "47829",
        },
        {
          year: "1957",
          Amanda: "667",
          Ashley: "27",
          Betty: "8474",
          Deborah: "40065",
        },
        {
          year: "1958",
          Amanda: "796",
          Ashley: "38",
          Betty: "7709",
          Deborah: "32936",
        },
        {
          year: "1959",
          Amanda: "858",
          Ashley: "37",
          Betty: "7317",
          Deborah: "29552",
        },
        {
          year: "1960",
          Amanda: "977",
          Ashley: "57",
          Betty: "6503",
          Deborah: "25269",
        },
        {
          year: "1961",
          Amanda: "1057",
          Ashley: "80",
          Betty: "5580",
          Deborah: "24092",
        },
        {
          year: "1962",
          Amanda: "948",
          Ashley: "95",
          Betty: "4765",
          Deborah: "22893",
        },
        {
          year: "1963",
          Amanda: "1035",
          Ashley: "108",
          Betty: "4154",
          Deborah: "21062",
        },
        {
          year: "1964",
          Amanda: "1275",
          Ashley: "180",
          Betty: "4067",
          Deborah: "19306",
        },
        {
          year: "1965",
          Amanda: "1650",
          Ashley: "218",
          Betty: "3565",
          Deborah: "17083",
        },
        {
          year: "1966",
          Amanda: "2329",
          Ashley: "263",
          Betty: "2948",
          Deborah: "16250",
        },
        {
          year: "1967",
          Amanda: "2663",
          Ashley: "386",
          Betty: "2543",
          Deborah: "14007",
        },
        {
          year: "1968",
          Amanda: "2430",
          Ashley: "544",
          Betty: "2134",
          Deborah: "12286",
        },
        {
          year: "1969",
          Amanda: "2817",
          Ashley: "643",
          Betty: "2133",
          Deborah: "11186",
        },
        {
          year: "1970",
          Amanda: "3550",
          Ashley: "932",
          Betty: "1967",
          Deborah: "9853",
        },
        {
          year: "1971",
          Amanda: "4133",
          Ashley: "1164",
          Betty: "1763",
          Deborah: "8675",
        },
        {
          year: "1972",
          Amanda: "4181",
          Ashley: "1176",
          Betty: "1366",
          Deborah: "6279",
        },
        {
          year: "1973",
          Amanda: "5627",
          Ashley: "1253",
          Betty: "1323",
          Deborah: "4984",
        },
        {
          year: "1974",
          Amanda: "7476",
          Ashley: "1626",
          Betty: "1130",
          Deborah: "4345",
        },
        {
          year: "1975",
          Amanda: "12653",
          Ashley: "1988",
          Betty: "1021",
          Deborah: "3415",
        },
        {
          year: "1976",
          Amanda: "15591",
          Ashley: "2292",
          Betty: "908",
          Deborah: "2994",
        },
        {
          year: "1977",
          Amanda: "18280",
          Ashley: "2706",
          Betty: "807",
          Deborah: "2677",
        },
        {
          year: "1978",
          Amanda: "20522",
          Ashley: "3484",
          Betty: "715",
          Deborah: "2479",
        },
        {
          year: "1979",
          Amanda: "31927",
          Ashley: "4450",
          Betty: "711",
          Deborah: "2181",
        },
        {
          year: "1980",
          Amanda: "35819",
          Ashley: "7296",
          Betty: "658",
          Deborah: "1938",
        },
        {
          year: "1981",
          Amanda: "34373",
          Ashley: "8877",
          Betty: "662",
          Deborah: "1905",
        },
        {
          year: "1982",
          Amanda: "34210",
          Ashley: "14851",
          Betty: "635",
          Deborah: "1842",
        },
        {
          year: "1983",
          Amanda: "33754",
          Ashley: "33290",
          Betty: "563",
          Deborah: "1605",
        },
        {
          year: "1984",
          Amanda: "33906",
          Ashley: "38759",
          Betty: "503",
          Deborah: "1468",
        },
        {
          year: "1985",
          Amanda: "39050",
          Ashley: "47007",
          Betty: "502",
          Deborah: "1401",
        },
        {
          year: "1986",
          Amanda: "40522",
          Ashley: "49674",
          Betty: "407",
          Deborah: "1284",
        },
        {
          year: "1987",
          Amanda: "41786",
          Ashley: "54845",
          Betty: "435",
          Deborah: "1203",
        },
        {
          year: "1988",
          Amanda: "39451",
          Ashley: "49963",
          Betty: "395",
          Deborah: "1056",
        },
        {
          year: "1989",
          Amanda: "36827",
          Ashley: "47585",
          Betty: "399",
          Deborah: "1076",
        },
        {
          year: "1990",
          Amanda: "34405",
          Ashley: "45553",
          Betty: "406",
          Deborah: "1094",
        },
        {
          year: "1991",
          Amanda: "28887",
          Ashley: "43482",
          Betty: "345",
          Deborah: "1014",
        },
        {
          year: "1992",
          Amanda: "25034",
          Ashley: "38452",
          Betty: "296",
          Deborah: "919",
        },
        {
          year: "1993",
          Amanda: "20809",
          Ashley: "34847",
          Betty: "292",
          Deborah: "797",
        },
        {
          year: "1994",
          Amanda: "18715",
          Ashley: "30278",
          Betty: "275",
          Deborah: "740",
        },
        {
          year: "1995",
          Amanda: "16345",
          Ashley: "26603",
          Betty: "234",
          Deborah: "660",
        },
        {
          year: "1996",
          Amanda: "13973",
          Ashley: "23676",
          Betty: "217",
          Deborah: "633",
        },
        {
          year: "1997",
          Amanda: "12239",
          Ashley: "20895",
          Betty: "189",
          Deborah: "638",
        },
        {
          year: "1998",
          Amanda: "10908",
          Ashley: "19871",
          Betty: "194",
          Deborah: "553",
        },
        {
          year: "1999",
          Amanda: "9741",
          Ashley: "18132",
          Betty: "182",
          Deborah: "524",
        },
        {
          year: "2000",
          Amanda: "8550",
          Ashley: "17997",
          Betty: "174",
          Deborah: "545",
        },
        {
          year: "2001",
          Amanda: "6963",
          Ashley: "16524",
          Betty: "153",
          Deborah: "489",
        },
        {
          year: "2002",
          Amanda: "6132",
          Ashley: "15339",
          Betty: "127",
          Deborah: "474",
        },
        {
          year: "2003",
          Amanda: "5339",
          Ashley: "14512",
          Betty: "142",
          Deborah: "421",
        },
        {
          year: "2004",
          Amanda: "4677",
          Ashley: "14370",
          Betty: "136",
          Deborah: "427",
        },
        {
          year: "2005",
          Amanda: "4088",
          Ashley: "13270",
          Betty: "132",
          Deborah: "425",
        },
        {
          year: "2006",
          Amanda: "3355",
          Ashley: "12340",
          Betty: "135",
          Deborah: "423",
        },
        {
          year: "2007",
          Amanda: "3038",
          Ashley: "11423",
          Betty: "134",
          Deborah: "371",
        },
        {
          year: "2008",
          Amanda: "2439",
          Ashley: "9402",
          Betty: "137",
          Deborah: "355",
        },
        {
          year: "2009",
          Amanda: "1952",
          Ashley: "7811",
          Betty: "148",
          Deborah: "346",
        },
        {
          year: "2010",
          Amanda: "1655",
          Ashley: "6306",
          Betty: "132",
          Deborah: "354",
        },
        {
          year: "2011",
          Amanda: "1409",
          Ashley: "5398",
          Betty: "167",
          Deborah: "332",
        },
        {
          year: "2012",
          Amanda: "1228",
          Ashley: "4696",
          Betty: "140",
          Deborah: "336",
        },
        {
          year: "2013",
          Amanda: "1064",
          Ashley: "3936",
          Betty: "174",
          Deborah: "329",
        },
        {
          year: "2014",
          Amanda: "1048",
          Ashley: "3547",
          Betty: "193",
          Deborah: "369",
        },
        {
          year: "2015",
          Amanda: "1013",
          Ashley: "3409",
          Betty: "186",
          Deborah: "346",
        },
      ],
    };
  },

  mounted: function () {
    this.renderInit();
    this.renderUpdate();
  },
  methods: {
    renderInit() {
      this.svg = d3
        .select("#market_streamgraph")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, this.width, this.height])
        .append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    },
    renderUpdate() {
      // Remove all groups in svg
      this.svg.selectAll("g").remove();

      // Configuration
      let innerWidth = this.width - this.margin.left - this.margin.right;
      let innerHeight = this.height - this.margin.top - this.margin.bottom;

      var keys = ["Amanda", "Ashley", "Betty", "Deborah"];

      // Add X axis
      let xScale = d3
        .scaleLinear()
        .domain(d3.extent(this.data, (d) => d.year))
        .range([0, innerWidth]);

      this.svg
        .append("g")
        .attr("transform", `translate(0,${innerHeight * 0.8})`)
        .call(
          d3
            .axisBottom(xScale)
            .tickSize(-innerHeight * 0.7)
            .tickValues([1900, 1925, 1975, 2000])  //只显示这几个时间点
        )
        .select(".domain")
        .remove();

      // Customization
      this.svg.selectAll(".tick line").attr("stroke", "#b8b8b8");

      // Add X axis label:
      this.svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", innerWidth)
        .attr("y", innerHeight )
        .text("Time (year)");

      // Add Y axis
      let yScale = d3
        .scaleLinear()
        .domain([-100000, 100000])
        .range([innerHeight, 0]);

      // color palette
      let color = d3.scaleOrdinal().domain(keys).range(d3.schemeDark2);

      //stack the data?
      let stackedData = d3.stack().offset(d3.stackOffsetSilhouette).keys(keys)(
        this.data
      );
        
        // console.log(this.data);
        // console.log(stackedData);

      // create a tooltip
      let Tooltip = this.svg
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .style("opacity", 0)
        .style("font-size", 17)
        .style("fill","red")
        ;
        
      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseenter = function (d,i) {
          // console.log(d);
          Tooltip.text(i.key);
        Tooltip.style("opacity", 1).style("fill",color(i.key));
        d3.selectAll(".streamGraph").style("opacity", 0.2);
        d3.select(this).style("stroke", "black").style("opacity", 1);
      };
     
      var mouseleave = function (d) {
        Tooltip.style("opacity", 0);
        d3.selectAll(".streamGraph")
          .style("opacity", 1)
          .style("stroke", "none");
      };

      // Area generator
      let area = d3
        .area()
        .x((d) => xScale(d.data.year))
        .y0((d) => yScale(d[0]))
        .y1((d) => yScale(d[1]));

      // Show the areas
      this.svg
        .selectAll("streamGraphLayers")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", "streamGraph")
        .style("fill",d => color(d.key))
        .attr("d", area)
        .on("mouseenter", mouseenter)
        .on("mouseleave", mouseleave);
    },
  },
};
</script>

<style scoped>
</style>