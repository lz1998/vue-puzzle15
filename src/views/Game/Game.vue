<template>
  <div class="game" id="game" :style="{color:this.fontColor}" @touchmove.prevent="">
    <div class="title" @click="playTutorial">{{ $t('game.title') }}</div>
    <div class="game-panel">
      <div class="row" v-for="row in gameMap">
        <!--发布ios时这里不能同时写click、touchstart，否则会执行两次闪一下-->
        <div :style="getBlockStyle(num)" v-for="num in row" @touchstart="onTouch(num)">
          <span v-text="num" class="num"></span>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="status">
        <p class="time" v-text="resultFormat(result)"></p>
        <p class="moves" v-text="$t('game.moves')+':'+movesCount"></p>
      </div>
      <mt-button class="scramble-button" @click.native="scramble" type="primary">{{ $t('game.scramble') }}</mt-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "Game",
    data() {
      return{
        color0:this.$store.state.color0,
        color1:this.$store.state.color1,
        color2:this.$store.state.color2,
        color3:this.$store.state.color3,
        fontColor:this.$store.state.fontColor,
        panelSetting:this.$store.state.panelSetting,
        gameMap:[
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
        isiOS:false,
        tutorialPrompt:true
      }
    },
    computed:{
      userid:{
        set(value){
          this.$store.commit('setUserid',value)
        },
        get(){
          return this.$store.state.userid;
        }
      },
      results:{
        set(value){
          this.$store.commit('setResults',value)
        },
        get(){
          return this.$store.state.results;
        }
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
              if(this.gameMap[i][j]===num)
              {
                row=i;
                col=j;
              }
              else if(this.gameMap[i][j]===0){
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
                this.gameMap[row][j]=this.gameMap[row][j+1];
                this.movesCount++;
              }
              this.gameMap[row][col]=0;
            }
            if(col<col0) {
              for (let j = col0; j > col; j--) {
                //这里不用考虑实时显示问题，如果movesCount改变，会自动刷新整个页面
                this.gameMap[row][j] = this.gameMap[row][j - 1];
                this.movesCount++;
              }
              this.gameMap[row][col] = 0;
            }
          }
          else if(col0===col)
          {
            if(row>row0)
            {
              for(let i=row0;i<row;i++) {
                //这里不用考虑实时显示问题，如果movesCount改变，会自动刷新整个页面
                this.gameMap[i][col]=this.gameMap[i+1][col];
                this.movesCount++;
              }
              this.gameMap[row][col]=0;
            }
            if(row<row0)
            {
              for(let i=row0;i>row;i--) {
                //这里不用考虑实时显示问题，如果movesCount改变，会自动刷新整个页面
                this.gameMap[i][col]=this.gameMap[i-1][col];
                this.movesCount++;
              }
              this.gameMap[row][col]=0;
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
          this.$store.commit("addResult",{
            userid:this.userid,
            time:this.startTime,
            result:this.result,
            moves:this.movesCount
          });
        }
        //这里不需要强制刷新界面，如果movesCount改变，会自动刷新，不改变就不需要刷新
        this.$forceUpdate();
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
          this.$set(this.gameMap[parseInt(i/4)],i%4,nums[i]);
          //this.gameMap[parseInt(i/4)][i%4]=nums[i];
        }
        this.isStart=false;
        this.movesCount=0;
        this.isScramble=true;
        this.$forceUpdate();
      },
      isWin(){
        if(this.gameMap[0][0]!=1)return false;
        if(this.gameMap[0][1]!=2)return false;
        if(this.gameMap[0][2]!=3)return false;
        if(this.gameMap[0][3]!=4)return false;
        if(this.gameMap[1][0]!=5)return false;
        if(this.gameMap[1][1]!=6)return false;
        if(this.gameMap[1][2]!=7)return false;
        if(this.gameMap[1][3]!=8)return false;
        if(this.gameMap[2][0]!=9)return false;
        if(this.gameMap[2][1]!=10)return false;
        if(this.gameMap[2][2]!=11)return false;
        if(this.gameMap[2][3]!=12)return false;
        if(this.gameMap[3][0]!=13)return false;
        if(this.gameMap[3][1]!=14)return false;
        if(this.gameMap[3][2]!=15)return false;
        if(this.gameMap[3][3]!=0)return false;
        return true;
      },
      sleep(n){
        return new Promise(function (resolve,reject) {
          setTimeout(resolve,n);
        })
      },
      async showDescription(description,toastDuration) {
        console.log(description);
        console.log(toastDuration);
        if(description==null || description==""){
          return;
        }
        this.$toast({message:description,position:"bottom",duration:toastDuration})

        if(!this.isiOS){
          let audio = new Audio("http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&per=0&text=" + description);
          audio.play();
          while (!audio.ended) {
            await this.sleep(200);
          }
        }

      },
      async playTutorial(){

        this.isStart=false;
        this.isScramble=false;

        let tutorial=null;
        let _action="confirm";

        await this.$messagebox.prompt(this.$t('game.inputTurtorialUrl')).then(async ({value, action}) => {
          if (value == null || value == "") {
            tutorial = require("../../turtorial/tutorial.json");
          } else {
            await this.axios.get(value).then((res) => {
              tutorial = res.data;
            }).catch(reason => {
              this.$toast({message: reason, position: "bottom", duration: 1000})
            });
          }
        }).catch((action)=>{
          _action=action;
        })
        if(_action!="confirm"){
          return;
        }

        let u = navigator.userAgent;
        this.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if(this.isiOS){
          await this.showDescription("iOS不能播放语音",1000)
          await this.sleep(1500);
        }else{
          await this.showDescription("安卓可以开启语音",1000)
          await this.sleep(1500);
        }

        await this.showDescription("本教程由 "+tutorial.author+" 提供",1000)
        await this.sleep(1500);

        await this.showDescription("运行期间不要触摸屏幕",1000)
        await this.sleep(1500);

        await this.showDescription(tutorial.description,tutorial.toastDuration);
        await this.sleep(tutorial.toastDuration);

        for(let i=0;i<tutorial.beforeSteps.length;i++){
          await this.showDescription(tutorial.beforeSteps[i].description,tutorial.beforeSteps[i].toastDuration);
          await this.sleep(tutorial.beforeSteps[i].beforeSleep);
          this.color1=tutorial.beforeSteps[i].color1;
          this.color2=tutorial.beforeSteps[i].color2;
          this.color3=tutorial.beforeSteps[i].color3;
          this.gameMap=tutorial.beforeSteps[i].gameMap;
          await this.sleep(tutorial.beforeSteps[i].afterSleep);
        }

        this.gameMap=tutorial.gameMap;
        for(let i=0;i<tutorial.steps.length;i++){
          this.color1=tutorial.steps[i].color1;
          this.color2=tutorial.steps[i].color2;
          this.color3=tutorial.steps[i].color3;
          await this.showDescription(tutorial.steps[i].description,tutorial.steps[i].toastDuration);
          await this.sleep(tutorial.steps[i].beforeSleep)
          for(let j=0;j<tutorial.steps[i].moves.length;j++){
            this.onTouch(tutorial.steps[i].moves[j]);
            await this.sleep(tutorial.steps[i].moveSleep);
          }
          await this.sleep(tutorial.steps[i].afterSleep);
        }
        this.color1=this.$store.state.color1;
        this.color2=this.$store.state.color2;
        this.color3=this.$store.state.color3;
      }
    },
    mounted(){
      const timer = setInterval(async () => {
        if (this.isStart)
          this.result = (new Date()).getTime() - this.startTime;
        if (this.result > 180000 && this.tutorialPrompt) {
          this.tutorialPrompt = false;
          this.showDescription("可能你遇到了一点问题", 3000);
          await this.sleep(4000);
          this.showDescription("点击标题播放教程", 3000);

        }
      },93);
      this.$once('hook:beforeDestroy', () => {
        clearInterval(timer);
      })
      document.getElementById("game").setAttribute('style', this.panelSetting);
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .game
    margin:0
    padding:10px 0 10px 0
    width:100%
    .title
      font-size: 12vw;
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
        width: 40%;
        height: 70%;
        margin: 2vw;
        float: right;
        font-size: 6vw;
</style>
