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
        ]
        // results:[
        //   {
        //     time:"00:10.000",
        //     moves:"60"
        //   },
        //   {
        //     time:"00:30.440",
        //     moves:"30"
        //   },
        //   {
        //     time:"00:34.077",
        //     moves:"40"
        //   }
        // ]
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
          let ms=(results[i].time%1000).toString();
          let sec=parseInt(results[i].time/1000).toString();
          let min=parseInt(sec/60).toString();
          sec=(sec%60).toString();

          min=min.length>1?min:'0'+min;
          sec=sec.length>1?sec:'0'+sec;
          ms=ms.length>2?ms:'0'+ms;
          ms=ms.length>2?ms:'0'+ms;
          results[i].resultText=min+":"+sec+"."+ms;
        }
        return results;
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
</style>
