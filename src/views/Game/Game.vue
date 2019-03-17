<template>
  <div class="game" :style="{color:this.fontColor}" @touchmove.prevent="">
    <div class="title">Puzzle15</div>
    <div class="game-panel">
      <div class="row" v-for="row in game_map">
        <div :style="getBlockStyle(num)" v-for="num in row" @touchstart="onTouch(num)" @click="onTouch(num)" @mouseover="onTouch(num)">
          <span v-text="num" class="num"></span>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="status">
        <p class="time" v-text="resultFormat(result)"></p>
        <p class="moves" v-text="'Moves:'+movesCount"></p>
      </div>
      <mt-button class="scramble-button" @click.native="scramble" type="primary">打乱</mt-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "Game",
    data() {
      return{
        color0:"rgba(243,197,0,1)",
        color1:"rgba(31,169,93,1)",
        color2:"rgba(39,117,167,1)",
        color3:"rgba(234,75,53,1)",
        fontColor:"rgba(0,0,0,1)",
        game_map:[
          [1,2,3,4],
          [5,6,7,8],
          [9,10,11,12],
          [13,14,15,0]
        ],
        movesCount:0,
        startTime:0,
        endTime:0,
        result:0,
        isStart:false,
        isScramble:false,
        timer:null,
      }
    },
    methods:{
      resultFormat(ms){
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
      getBlockStyle(num){
        let s = {
          "width":" 23%",
          "height":" 92%",
          "margin":" 1%",
          "padding":" 0px",
          "text-align":" center",
          "float":"left",
          "display":"table",
          "border-radius":" 2vw",
          "user-select":"none",
          "background":"rgba(243,197,0,1)"
        };

        let col = (num - 1) % 4;
        let row = parseInt((num - 1) / 4);
        if(num==0){
          s["background"]='rgba(0,0,0,0)';
          s["color"]='rgba(0,0,0,0)';
        }
        else if(col==0 || row==0){
          s["background"]=this.color3;
        }
        else if(col==1 || row==1){
          s["background"]=this.color2;
        }
        else if(col==2 || row==2){
          s["background"]=this.color1;
        }
        return s;

      },
      onTouch (num) {
        if(this.isScramble){
          this.isScramble=false;
          this.isStart=true;
          this.startTime=(new Date()).getTime();
        }
        //console.log(num)
        if(num!==0){

          let row0,col0,row,col;
          for(let i=0;i<4;i++)
            for(let j=0;j<4;j++){
              if(this.game_map[i][j]===num)
              {
                row=i;
                col=j;
              }
              else if(this.game_map[i][j]===0){
                row0=i;
                col0=j;
              }
            }

          if(row0===row)
          {
            if(col>col0)
            {
              for(let j=col0;j<col;j++) {
                //这里不用考虑实时显示问题，如果movesCount改变，会自动刷新整个页面
                this.game_map[row][j]=this.game_map[row][j+1];
                this.movesCount++;
              }
              this.game_map[row][col]=0;
            }
            if(col<col0) {
              for (let j = col0; j > col; j--) {
                //这里不用考虑实时显示问题，如果movesCount改变，会自动刷新整个页面
                this.game_map[row][j] = this.game_map[row][j - 1];
                this.movesCount++;
              }
              this.game_map[row][col] = 0;
            }
          }
          else if(col0===col)
          {
            if(row>row0)
            {
              for(let i=row0;i<row;i++) {
                //这里不用考虑实时显示问题，如果movesCount改变，会自动刷新整个页面
                this.game_map[i][col]=this.game_map[i+1][col];
                this.movesCount++;
              }
              this.game_map[row][col]=0;
            }
            if(row<row0)
            {
              for(let i=row0;i>row;i--) {
                //这里不用考虑实时显示问题，如果movesCount改变，会自动刷新整个页面
                this.game_map[i][col]=this.game_map[i-1][col];
                this.movesCount++;
              }
              this.game_map[row][col]=0;
            }
          }
        }
        else
          return;
        if(this.isWin() && this.isStart){
          this.isStart=false;//停止游戏
          this.endTime=(new Date()).getTime();
          this.result=this.endTime-this.startTime;
          this.isScramble=false;

          //保存成绩
          let results=localStorage.getItem("results");
          if(results==null){
            results=[];
          }else{
            results=JSON.parse(results);
          }
          results.push({
            time:this.startTime,
            result:this.result,
            moves:this.movesCount
          });
          localStorage.setItem("results",JSON.stringify(results))
        }
        //这里不需要强制刷新界面，如果movesCount改变，会自动刷新，不改变就不需要刷新
        //this.$forceUpdate();
      },
      isSolvable(nums){
        //判断是否可解，计算逆序数，偶数可解
        let sum=0;
        for(let i=0;i<16;i++){
          if(nums[i]===0){
            sum+=parseInt(i/4)+(i+1)%4;
            continue;
          }
          for(let j=0;j<16-i;j++)
            if(nums[j+i]<nums[i])
              sum++;
        }
        return sum%2===0;
      },
      scramble () {
        //打乱
        let nums=[];
        for(let i=0;i<16;i++)
          nums.push(i);

        //随机打乱
        // nums.sort((a,b)=>{return Math.random() > 0.5 ? -1 : 1;});
        for(let i=15;i>0;i--){
          let rnd=Math.floor(Math.random()*i);
          let t=nums[rnd];
          nums[rnd]=nums[i];
          nums[i]=t;
        }

        //如果不可被还原，交换任意2个不为0的数字
        if(!this.isSolvable(nums)){
          let r1=Math.floor(Math.random()*16);
          if(nums[r1]===0)
            if(++r1>15)
              r1=0;
          let r2=Math.floor(Math.random()*16);
          while(r1===r2 || nums[r2]===0)
            if(++r2>15)
              r2=0;
          let t;
          t=nums[r1];
          nums[r1]=nums[r2];
          nums[r2]=t;
        }

        for(let i=0;i<16;i++){
          //Vue中数组必须使用$set方法或者最后调用this.$forceUpdate()，否则不会界面不会随着data改变刷新
          this.$set(this.game_map[parseInt(i/4)],i%4,nums[i]);
          //this.game_map[parseInt(i/4)][i%4]=nums[i];
        }
        this.isStart=false;
        this.movesCount=0;
        this.isScramble=true;
        //this.$forceUpdate();
      },
      isWin(){
        if(this.game_map[0][0]!=1)return false;
        if(this.game_map[0][1]!=2)return false;
        if(this.game_map[0][2]!=3)return false;
        if(this.game_map[0][3]!=4)return false;
        if(this.game_map[1][0]!=5)return false;
        if(this.game_map[1][1]!=6)return false;
        if(this.game_map[1][2]!=7)return false;
        if(this.game_map[1][3]!=8)return false;
        if(this.game_map[2][0]!=9)return false;
        if(this.game_map[2][1]!=10)return false;
        if(this.game_map[2][2]!=11)return false;
        if(this.game_map[2][3]!=12)return false;
        if(this.game_map[3][0]!=13)return false;
        if(this.game_map[3][1]!=14)return false;
        if(this.game_map[3][2]!=15)return false;
        if(this.game_map[3][3]!=0)return false;
        return true;
      },
    },
    mounted(){
      const timer = setInterval(() => {
        if(this.isStart)
          this.result=(new Date()).getTime()-this.startTime;
      },93);
      this.$once('hook:beforeDestroy', () => {
        clearInterval(timer);
      })
      this.color0=localStorage.getItem("color0");
      this.color1=localStorage.getItem("color1");
      this.color2=localStorage.getItem("color2");
      this.color3=localStorage.getItem("color3");
      this.fontColor=localStorage.getItem("fontColor");
      if(this.color0==null || this.color0==='null'){
        this.color0="rgba(243,197,0,1)";
      }
      if(this.color1==null || this.color1==='null'){
        this.color1="rgba(31,169,93,1)";
      }
      if(this.color2==null || this.color2==='null'){
        this.color2="rgba(39,117,167,1)";
      }
      if(this.color3==null || this.color3==='null'){
        this.color3="rgba(234,75,53,1)";
      }
      if(this.fontColor==null || this.fontColor==='null'){
        this.fontColor="rgba(0,0,0,1)";
      }
      document.querySelector('body').setAttribute('style', 'background:'+this.color0);
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .game
    margin:0
    padding:10px 0 10px 0
    width:100%
    .title
      font-size: 8vh;
      text-align: center;
    .game-panel
      box-sizing: border-box;
      width: 90vw;
      height: 90vw;
      margin: 1vh auto 0;
      padding: 0;
      border-radius: 15px;
      .row
        margin: 0px;
        padding: 0px;
        width: 100%;
        height: 25%;
        overflow: hidden;
        .num
          display: table-cell;
          vertical-align: middle;
          width: 100%;
          height: 100%;
          font-size: 10vw;

    .container
      width: 90vw;
      height: 20vw;
      margin: 2vh auto 0;
      padding: 0;
      .status
        width: 45%;
        height: 80%;
        margin: 0;
        padding: 2vw;
        float: left;
        .time
          margin: 0 auto;
          padding: 0px;
          font-size: 8vw;
          text-align: center;
        .moves
          margin: 0 auto;
          padding: 0px;
          font-size: 3vw;
          text-align: center;
      .scramble-button
        width: 36%;
        height: 80%;
        margin: 2vw;
        float: right;
        font-size: 8vw;
</style>
