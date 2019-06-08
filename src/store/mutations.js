export const setLang=(state,value)=>{
  if(value==null || value==='null'){
    value="zh";
  }
  state.lang=value;
  localStorage.setItem("lang",state.lang);
  // this.$i18n.locale=state.lang;
}
export const addResult=(state,value)=>{
  if(value==null || value==='null'){
    return;
  }
  state.results.push(value);
  localStorage.setItem("results",JSON.stringify(state.results));
}
export const delResult=(state,value)=>{
  for(let i=0;i<state.results.length;i++){
    if(state.results[i].time==value){
      state.results.splice(i,1);
    }
  }
  localStorage.setItem("results",JSON.stringify(state.results));
}
export const setResults=(state,value)=>{
  if(value==null || value==='null'){
    value=[];
  }
  state.results=value;
  localStorage.setItem("results",JSON.stringify(state.results));
}
export const setColor0=(state,value)=>{
  if(value==null || value==='null'){
    value="rgba(243,197,0,1)";
  }
  state.color0=value;
  localStorage.setItem("color0",state.color0);
  document.querySelector('body').setAttribute('style', 'background:'+state.color0);
}
export const setColor1=(state,value)=>{
  if(value==null || value==='null'){
    value="rgba(31,169,93,1)";
  }
  state.color1=value;
  localStorage.setItem("color1",state.color1);
}
export const setColor2=(state,value)=>{
  if(value==null || value==='null'){
    value="rgba(39,117,167,1)";
  }
  state.color2=value;
  localStorage.setItem("color2",state.color2);
}
export const setColor3=(state,value)=>{
  if(value==null || value==='null'){
    value="rgba(234,75,53,1)";
  }
  state.color3=value;
  localStorage.setItem("color3",state.color3);
}
export const setFontColor=(state,value)=>{
  if(value==null || value==='null'){
    value="rgba(0,0,0,1)";
  }
  state.fontColor=value;
  localStorage.setItem("fontColor",state.fontColor);
}
export const setPanelSetting=(state,value)=>{
  if(value==null || value==='null'){
    value="";
  }
  state.panelSetting=value;
  localStorage.setItem("panelSetting",state.panelSetting);
}

export const setUserid=(state,value)=>{
  if(value==null || value==='null'){
    value="";
  }
  state.userid=value;
  localStorage.setItem("userid",state.userid);
}

export const setAccess_token=(state,value)=>{
  if(value==null || value==='null'){
    value="";
  }
  state.access_token=value;
  localStorage.setItem("access_token",state.access_token);
}

export const setExpires_time=(state,value)=>{
  if(value==null || value==='null'){
    value="";
  }
  state.expires_time=value;
  localStorage.setItem("expires_time",state.expires_time);
}
