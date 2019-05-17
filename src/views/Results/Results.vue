<template>
  <div class="results">
    <h2 style="text-align: center;">{{$t('results.title')}}</h2>
    <mt-button @click.native="chartControl" class="show-chart-button" type="primary" >{{$t('results.chart')}}</mt-button>
    <mt-button v-clipboard:copy="getOutputText()" v-clipboard:success="outputSuccess" v-clipboard:error="outputError" class="output-button" type="primary" >{{$t('results.exportResult')}}</mt-button>
    <mt-cell-swipe
      v-for="result in getReversedResults()"
      :right="getRightButtons(result.time)"
      :title="resultFormat(result.result)"
      :label="result.moves+$t('results.moves')"
      :key="result.time"
      class="result">
    </mt-cell-swipe>

    <div class="chart-wrapper" v-show="chartShow">
      <div class="chart-main">
        <chart :options="chartOptions" :autoresize="true" class="chart" :theme="chartThemeList[chartThemeIndex]"></chart>
      </div>

      <div class="chart-button">
        <mt-button @click.native="changeChartTheme" class="change-theme-chart-button" type="primary" >更换主题</mt-button>
        <mt-button @click.native="chartControl" class="close-chart-button" type="primary" >{{$t('results.chartClose')}}</mt-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "Results",
    data(){
      return{
        color0:"rgba(243,197,0,1)",
        chartShow:false,
        chartData:[],
        chartThemeList:['','light','dark','infographic','macarons','roma','shine','vintage'],
        chartThemeIndex:0,
        chartOptions:{
          title: {
            text: this.$t('results.chart')
          },
          tooltip : {
            trigger: 'axis',
            formatter(params){
              let ret=""
              let resultFormatter=function(result){
                let ms=(result%1000).toString();
                let sec=parseInt(result/1000).toString();
                let min=parseInt(sec/60).toString();
                sec=(sec%60).toString();

                ms=ms.length>2?ms:'0'+ms;
                ms=ms.length>2?ms:'0'+ms;
                if(min==0){
                  return sec+"."+ms;
                }
                else{
                  min=min.length>1?min:'0'+min;
                  sec=sec.length>1?sec:'0'+sec;
                  return min+":"+sec;
                }
              }
              for(let i=0;i<params.length;i++){
                if(params[i].seriesName=="成绩"){
                  ret+=params[i].marker+params[i].seriesName+":"+resultFormatter(params[i].data[1])+"<br/>"
                }else{
                  ret+=params[i].marker+params[i].seriesName+":"+params[i].data[1]+"<br/>"
                }
              }
              let date = new Date(params[0].value[0]);
              ret+=date.getFullYear() + '-';
              ret+= (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
              ret+= (date.getDate()<10?("0"+date.getDate()):date.getDate())+' ';
              ret+= (date.getHours()<10?("0"+date.getHours()):date.getHours()) + ':';
              ret+= (date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes())+":";
              ret+= (date.getSeconds()<10?("0"+date.getSeconds()):date.getSeconds());
              return ret;
            }
          },
          toolbox:{
            show:true,
            feature:{
              restore : {
                show : true,
                title : '还原'
              }
            }
          },
          dataZoom: {
            type:"slider",
            show: true,
            start : 0,
            labelFormatter(value){console.log(value);return value},
          },
          legend:{
            data:['成绩','步数','手速'],
            selected:{
              '成绩':true,
              '步数':true,
              '手速':false
            },
          },
          grid: {x:50,y: 70, x2:50, y2:60},
          xAxis: {
            type: 'category',
            axisLabel:{
              formatter:function(timestamp){
                let time = new Date(timestamp);
                let str=time.getFullYear() + '-';
                str+= (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-';
                str+= (time.getDate()<10?("0"+time.getDate()):time.getDate())+' ';
                str+= (time.getHours()<10?("0"+time.getHours()):time.getHours()) + ':';
                str+= (time.getMinutes()<10?("0"+time.getMinutes()):time.getMinutes());

                return str;
              }
            }
          },
          yAxis: [
            {
            type: 'value',
            axisLabel:{
              formatter:function(result){
                let ms=(result%1000).toString();
                let sec=parseInt(result/1000).toString();
                let min=parseInt(sec/60).toString();
                sec=(sec%60).toString();

                ms=ms.length>2?ms:'0'+ms;
                ms=ms.length>2?ms:'0'+ms;
                if(min==0){
                  return sec+"."+ms;
                }
                else{
                  min=min.length>1?min:'0'+min;
                  sec=sec.length>1?sec:'0'+sec;
                  return min+":"+sec;
                }
              }
            }
            },
            {
              type: 'value'
            },
            {
              type: 'value'
            }
          ],
          series: [
            {
            name: '成绩',
            type: 'line',
            data:[],
            markLine: {
              symbol:'none',
              data: [
                {type: 'average', name: '平均值'}
              ],
              label:{
                formatter(param){
                  let ms=parseInt(param.data.value%1000).toString();
                  let sec=parseInt(param.data.value/1000).toString();
                  let min=parseInt(sec/60).toString();
                  sec=(sec%60).toString();
                  ms=ms.length>2?ms:'0'+ms;
                  ms=ms.length>2?ms:'0'+ms;
                  let str='';
                  if(min==0){
                    str= sec+"."+ms;
                  }
                  else{
                    min=min.length>1?min:'0'+min;
                    sec=sec.length>1?sec:'0'+sec;
                    str= min+":"+sec+"."+ms;
                  }
                  return str;
                }
              }

            },
            markPoint : {
              data : [
                {type : 'max', name: '最大值',symbolOffset:[0,-6],symbolRotate:180,label:{offset:[0,-15]}},
                {type : 'min', name: '最小值',symbolOffset:[0,6],label:{offset:[0,20]}},
              ],
              symbolSize:10,
              symbol:'triangle',
              label:{
                formatter(param){
                  let ms=parseInt(param.data.value%1000).toString();
                  let sec=parseInt(param.data.value/1000).toString();
                  let min=parseInt(sec/60).toString();
                  sec=(sec%60).toString();
                  ms=ms.length>2?ms:'0'+ms;
                  ms=ms.length>2?ms:'0'+ms;
                  let str='';
                  if(min==0){
                    str= sec+"."+ms;
                  }
                  else{
                    min=min.length>1?min:'0'+min;
                    sec=sec.length>1?sec:'0'+sec;
                    str= min+":"+sec+"."+ms;
                  }
                  return str;
                }
              }

            },
          },
            {
              name: '步数',
              type: 'line',
              yAxisIndex:1,
              data:[],
              markLine: {
                symbol:'none',
                data: [
                  {type: 'average', name: '平均值'}
                ],

              },
              markPoint : {
                data : [
                  {type : 'max', name: '最大值',symbolOffset:[0,-6],symbolRotate:180,label:{offset:[0,-15]}},
                  {type : 'min', name: '最小值',symbolOffset:[0,6],label:{offset:[0,20]}},
                ],
                symbolSize:10,
                symbol:'triangle',
              },
            },
            {
              name: '手速',
              type: 'line',
              yAxisIndex:2,
              data:[],
              markLine: {
                symbol:'none',
                data: [
                  {type: 'average', name: '平均值'}
                ],

              },
              markPoint : {
                data : [
                  {type : 'max', name: '最大值',symbolOffset:[0,-6],symbolRotate:180,label:{offset:[0,-15]}},
                  {type : 'min', name: '最小值',symbolOffset:[0,6],label:{offset:[0,20]}},
                ],
                symbolSize:10,
                symbol:'triangle',


              },
            }
          ]

        }

    }
    },
    computed:{
      results(){
        let results=localStorage.getItem("results");
        if(results==null){
          results=[];
        }else{
          results=JSON.parse(results);
        }
        return results;
      },
    },

    methods:{
      resultFormat(ms){
        //格式化成绩
        let sec=parseInt(ms/1000).toString();
        ms=(ms%1000).toString();
        let min=parseInt(sec/60).toString();
        sec=(sec%60).toString();

        min=min.length>1?min:'0'+min;
        sec=sec.length>1?sec:'0'+sec;
        ms=ms.length>2?ms:'0'+ms;
        ms=ms.length>2?ms:'0'+ms;
        return min+":"+sec+"."+ms;
      },
      timeFormat(timestamp){
        let time = new Date(timestamp);
        let str=time.getFullYear() + '-';
        str+= (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-';
        str+= (time.getDate()<10?("0"+time.getDate()):time.getDate())+' ';
        str+= (time.getHours()<10?("0"+time.getHours()):time.getHours()) + ':';
        str+= (time.getMinutes()<10?("0"+time.getMinutes()):time.getMinutes());

        return str;
      },
      getReversedResults(){
        //反转成绩，为了防止使用缓存，不能用计算属性
        let reversedResults=[];
        this.results.forEach((item) => reversedResults.unshift(item));
        return reversedResults;
      },
      getRightButtons(time) {
        //查看、删除按钮
        return [
          {
            content: '查看',
            style: { background: 'lightgray', color: '#fff' ,"font-size":"20px"},
            handler: () => {
              this.$messagebox(this.timeFormat(time));
            }
          },
          {
            content: '删除',
            style: { background: 'red', color: '#fff',"font-size":"20px" },
            handler: () => {
              for(let i=0;i<this.results.length;i++){
                if(this.results[i].time==time){
                  this.results.splice(i,1);
                }
              }
              localStorage.setItem("results",JSON.stringify(this.results));
              this.$messagebox("已删除");
              console.log(this.results);
              console.log(this.outputText);
              this.$forceUpdate();//强制刷新reversedResults
            }
          }
        ]
      },
      getOutputText(){
        //导出成绩
        return JSON.stringify(this.results);
      },
      outputSuccess(){
        this.$messagebox("已复制");
      },
      outputError(){
        this.$messagebox("error");
      },
      changeChartTheme(){
        this.chartThemeIndex++;
        this.chartThemeIndex%=this.chartThemeList.length;
        console.log(this.chartThemeList[this.chartThemeIndex]);
      },
      chartControl(){
        //控制是否显示折线图
        let arrResult=[];
        let arrMoves=[];
        let arrTps=[];
        this.results.forEach(function(item){
          let tmp=[item.time,item.result];
          arrResult.push(tmp);
          tmp=[item.time,item.moves];
          arrMoves.push(tmp);
          tmp=[item.time,parseInt(100000*item.moves/item.result)/100];
          arrTps.push(tmp);
        })
        this.chartOptions.series[0].data=arrResult;
        this.chartOptions.series[1].data=arrMoves;
        this.chartOptions.series[2].data=arrTps;
        this.chartShow=!this.chartShow;
      }
    },
    mounted() {
      this.color0=localStorage.getItem("color0");
      if(this.color0==null || this.color0==='null'){
        this.color0="rgba(243,197,0,1)";
      }
      document.querySelector('body').setAttribute('style', 'background:'+this.color0);
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .mint-cell-wrapper
    .mint-cell-title
      .mint-cell-text
        height:24px
        line-height :24px
        font-size:24px
      .mint-cell-label
        height:18px
        line-height :18px
        font-size:18px
  .results
    padding:10px
    padding-bottom:100px
    .output-button
      margin:10px
    .show-chart-button
      margin:10px
    .chart-wrapper
      position :fixed
      z-index:100
      top:0
      left :0
      width :100%
      height:100%
      overflow :auto
      transition: all 0.5s
      background :rgb(255,255,255)
      backdrop-filter :blur(10px)
      .chart-main
        width:100%
        .chart
          width:100%
      .chart-button
        margin:10px


</style>
