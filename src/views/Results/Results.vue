<template>
  <div class="results">
    <h2 style="text-align: center;">Results</h2>
    <mt-button @click.native="chartControl" class="show-chart-button" type="primary" >折线图</mt-button>
    <mt-button v-clipboard:copy="getOutputText()" v-clipboard:success="outputSuccess" v-clipboard:error="outputError" class="output-button" type="primary" >导出成绩</mt-button>
    <mt-cell-swipe
      v-for="result in getReversedResults()"
      :right="getRightButtons(result.time)"
      :title="resultFormat(result.result)"
      :label="result.moves+' moves'"
      :key="result.time"
      class="result">
    </mt-cell-swipe>

    <div class="chart-wrapper" v-show="chartShow">
      <div class="chart-main">
        <chart :options="chartOptions" :autoresize="true" class="chart"></chart>
      </div>
      <div class="chart-close">
        <mt-button @click.native="chartControl" class="close-chart-button" type="primary" >关闭</mt-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "Results",
    data(){
      return{
        chartShow:false,
        chartData:[],
        chartOptions:{
          title: {
            text: '折线图'
          },
          tooltip : {
            trigger: 'axis',
            formatter(params){
              let ms=(params[0].value[1]%1000).toString();
              let sec=parseInt(params[0].value[1]/1000).toString();
              let min=parseInt(sec/60).toString();
              sec=(sec%60).toString();

              ms=ms.length>2?ms:'0'+ms;
              ms=ms.length>2?ms:'0'+ms;
              let str='';
              if(min==0){
                str= "Time:"+sec+"."+ms;
              }
              else{
                min=min.length>1?min:'0'+min;
                sec=sec.length>1?sec:'0'+sec;
                str= "Time:"+min+":"+sec+"."+ms;
              }
              str=str+"<br/>";
              let date = new Date(params[0].value[0]);
              str+=date.getFullYear() + '-';
              str+= (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
              str+= (date.getDate()<10?("0"+date.getDate()):date.getDate())+' ';
              str+= (date.getHours()<10?("0"+date.getHours()):date.getHours()) + ':';
              str+= (date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes())+":";
              str+= (date.getSeconds()<10?("0"+date.getSeconds()):date.getSeconds());
              return str;
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
            data:['折线图数据']
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
          yAxis: {
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
                  return min+":"+sec+"."+ms;
                }
              }
            }
          },
          series: [{
            name: '折线图数据',
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
          }]
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
              this.$messagebox("暂时没用");
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
      chartControl(){
        //控制是否显示折线图
        let arr=[];
        this.results.forEach(function(item){
          let tmp=[item.time,item.result];
          arr.push(tmp);
        })
        this.chartOptions.series[0].data=arr;
        this.chartShow=!this.chartShow;
      }
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
      background :rgba(256,256,256,0.9)
      backdrop-filter :blur(10px)
      .chart-main
        width:100%
        .chart
          width:100%
          margin:10px auto
      .close-chart-button
        margin:10px

</style>
