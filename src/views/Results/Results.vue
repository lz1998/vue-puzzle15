<template>
  <div class="results">
    <h2 style="text-align: center;">{{$t('results.title')}}</h2>
    <mt-button @click.native="chartControl" class="show-chart-button" type="primary" >{{$t('results.chart')}}</mt-button>
    <mt-button @click.native="rankControl" class="show-rank-button" type="primary" >{{$t('results.rank')}}</mt-button>
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
        <mt-button @click.native="changeChartTheme" class="change-theme-chart-button" type="primary" >{{$t('results.chartTheme')}}</mt-button>
        <mt-button @click.native="chartControl" class="close-chart-button" type="primary" >{{$t('results.close')}}</mt-button>
      </div>
    </div>
    <div class="rank-wrapper" v-show="rankShow">
      <div class="rank-main">

        <h2 style="text-align: center;">{{$t('results.rank')}}</h2>
        <div class="rank-list" v-show="rankList.length!=0">
          <div class="rank-item">
            <div class="rank">{{$t('results.rank')}}</div>
            <div class="figure"></div>
            <div class="nickname"></div>
            <div class="result">{{$t('results.result')}}</div>
            <div class="moves">{{$t('results.moves')}}</div>
          </div>
          <div class="rank-item" v-for="(item,index) in rankList">
            <div class="rank">{{index+1}}</div>
            <div class="figure"><img :src="item.figureurl" width="40" height="40"/></div>
            <div class="nickname">{{item.nickname}}</div>
            <div class="result">{{resultFormat(item.result)}}</div>
            <div class="moves">{{item.moves}}</div>
          </div>
          <div class="user-result">{{$t('results.result')}}:{{resultFormat(userResult.result)}}</div>
          <div class="user-rank">{{$t('results.rank')}}:{{userRank}}</div>
        </div>
      </div>
      <div class="rank-button">
        <mt-button @click.native="rankControl" class="close-rank-button" type="primary">{{$t('results.close')}}</mt-button>
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
                if(params[i].seriesName=="Result"){
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
            data:['Result','Moves','TPS'],
            selected:{
              'Result':true,
              'Moves':false,
              'TPS':false
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
              name: 'Result',
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
              lineStyle: {
                normal:{
                  width:1
                }
              }

            },
            {
              name: 'Moves',
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
              lineStyle: {
                normal:{
                  width:1
                }
              }
            },
            {
              name: 'TPS',
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
              lineStyle: {
                normal:{
                  width:1
                }
              }
            }
          ]

        },
        rankShow:false,
        rankList:[],
        userResult:{},
        userRank:-1

    }
    },
    computed:{
      results:{
        set(value){
          this.$store.commit('setResults',value)
        },
        get(){
          return this.$store.state.results;
        }
      },
      userid:{
        set(value){
          this.$store.commit('setUserid',value)
        },
        get(){
          return this.$store.state.userid;
        }
      }
    },
    methods:{
      resultFormat(ms){
        if(ms<=0 || ms==null){
          return "-1";
        }
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
            content: this.$t("results.upload"),
            style: { background: 'lightgray', color: '#fff' ,"font-size":"20px"},
            handler: () => {
              let result={};
              for(let i=0;i<this.results.length;i++){
                if(this.results[i].time==time){
                  result=this.results[i];
                }
              }
              console.log(result);
              if(result.userid==null || result.userid==""){
                this.$messagebox(this.$t("results.uploadResultAfterLogin"));
              }else{
                this.axios.get("/setResult",{params:result}).then(res=>{
                  if(res.data.status==true){
                    this.$messagebox(this.$t("results.uploadSuccess"));
                  }else{
                    this.$messagebox(this.$t("results.serverError"));
                  }
                }).catch(reason => {
                  this.$messagebox(this.$t("results.uploadFail"));
                })
              }
            }
          },
          {
            content: this.$t("results.del"),
            style: { background: 'red', color: '#fff',"font-size":"20px" },
            handler: () => {
              this.$store.commit("delResult",time);
              this.$messagebox(this.$t("results.deleted"));
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
        this.$messagebox(this.$t("results.copied"));
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
      },
      rankControl(){
        this.rankShow=!this.rankShow;
        if(this.rankShow==true){
          //获取成绩
          let params={
            userid:this.userid
          }
          this.axios.get("/getRank",{params:params}).then(res=>{
            let data=res.data;
            let status=data.status;
            if(status==true){
              this.rankList=data.rst;
              this.userResult=data.user_result;
              this.userRank=data.user_rank;
              if(this.userResult==null){
                this.userResult={result:-1};
              }
              if(this.userRank==null){
                this.userRank=-1;
              }
              this.$forceUpdate();

            }else{
              this.$messagebox(this.$t("results.serverError"));
            }
          }).catch(reason => {
            this.$messagebox(this.$t("results.serverError"));
          })
        }
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
      background :rgb(255,255,255)
      backdrop-filter :blur(10px)
      .chart-main
        width:100%
        .chart
          width:100%
      .chart-button
        margin:10px


    .rank-wrapper
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
      .rank-main
        width:100%
        .rank-list
          width:96%
          margin:2%
          .rank-item
            width:100%
            height:40px
            line-height:40px
            .rank
              float:left
              width:15%
              height:40px
              line-height:40px
              text-align :center
              overflow :hidden
            .figure
              float:left
              width:10%
              height:40px
              line-height:40px
              margin-left:10px
              text-align :center
              overflow :hidden
            .nickname
              float:left
              width:25%
              height:40px
              line-height:40px
              text-align :center
              overflow :hidden
            .result
              float:left
              width:25%
              height:40px
              line-height:40px
              text-align :center
              overflow :hidden
            .moves
              float:left
              width:15%
              height:40px
              line-height:40px
              text-align :center
              overflow :hidden


        .user-result
          float:left
          width:50%
          height:30px
          line-height :30px
          margin:30px 5%
        .user-rank
          float:left
          width:30%
          height:30px
          line-height :30px
          margin:30px 5%
      .rank-button
        margin:10px

</style>
