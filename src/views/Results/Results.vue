<template>
  <div class="results">
    <h2 style="text-align: center;">Results</h2>
    <mt-cell-swipe
      v-for="result in results"
      :right="rightButtons"
      :title="result.resultText"
      :label="result.moves+' moves'"
      :key="result.time"
      class="result">
    </mt-cell-swipe>
    <mt-button @click.native="chartControl" class="show-chart-button" type="primary" >折线图</mt-button>
    <mt-button v-clipboard:copy="outputText" v-clipboard:success="outputSuccess" v-clipboard:error="outputError" class="output-button" type="primary" >导出成绩</mt-button>
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
        rightButtons : [
          {
            content: '编辑',
            style: { background: 'lightgray', color: '#fff' ,"font-size":"20px"},
            handler: () => this.$messagebox('暂时不能编辑')
          },
          {
            content: '删除',
            style: { background: 'red', color: '#fff',"font-size":"20px" },
            handler: () => this.$messagebox('delete')
          }
        ],
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
          legend:{
            data:['折线图数据']
          },
          grid: {x:50,y: 70, y2:30, x2:30},
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
        for(let i=0;i<results.length;i++){
          let ms=(results[i].result%1000).toString();
          let sec=parseInt(results[i].result/1000).toString();
          let min=parseInt(sec/60).toString();
          sec=(sec%60).toString();

          min=min.length>1?min:'0'+min;
          sec=sec.length>1?sec:'0'+sec;
          ms=ms.length>2?ms:'0'+ms;
          ms=ms.length>2?ms:'0'+ms;
          results[i].resultText=min+":"+sec+"."+ms;
        }
        return results;
      },
      outputText(){
        return localStorage.getItem("results");
      }
    },

    methods:{
      chartControl(){

        let arr=[];
        this.results.forEach(function(item){


          let tmp=[item.time,item.result];
          arr.push(tmp);
          console.log(tmp);
        })
        //this.chartData=arr;
        this.chartOptions.series[0].data=arr;

        console.log(this.chartData)
        this.chartShow=!this.chartShow;
      },
      outputSuccess(){
        this.$messagebox("已复制");
      },
      outputError(){
        this.$messagebox("error");
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
      background :rgba(256,256,256,0.8)
      backdrop-filter :blur(10px)
      .chart-main
        width:100%
        .chart
          width:90%
          margin:10px auto
      .close-chart-button
        margin:10px

</style>
