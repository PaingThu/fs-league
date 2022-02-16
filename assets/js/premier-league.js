var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      matchData : [],
      playerInfo: "d-none"
    },
    methods: {
        getMatches: function(){
            console.log("Get Matches From Youtube.")
        }
    },
    async created() {
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1mNHaMt9Nk_HAKdy1dz4x_IhxfkpqrRTNuvRMcObwYlw/values/premier-league!A2:AB1094?key=AIzaSyBuoa3iAy6JtfpBUpcqL4k1gsrMT631TPw`)
      .then(res=>res.json())
      .then(response =>{
          var data = response.values;
          console.log("Data ", data)
          var tmpWeekList = []
          var tmpWeek = ""
          var oldTmpWeek = ""
          var tmpObjArr = []
          data.sort(function(a,b){
            return b[6]-a[6]
          }).map(e => {
            var hPlayer = player[e[0].trim()]
            var hPlayerId = playerId[hPlayer]
            var aPlayer = player[e[3].trim()]
            var aPlayerId = playerId[aPlayer]
            console.log("Home Player ",hPlayer)
            console.log("Home Player ",aPlayer)
            if(tmpWeek == e[6]){
              tmpObjArr.push({home:e[0],hGoal:e[1],aGoal:e[2],away:e[3],playDate:e[4],youtube:e[5]?e[5].split('/')[3]:"",homePlayer:hPlayer,homePlayerId:hPlayerId,awayPlayer:aPlayer, awayPlayerId:aPlayerId})
            }else if(tmpWeek == ""){
              tmpWeek = e[6]
              oldTmpWeek = e[6]
              tmpObjArr.push({home:e[0],hGoal:e[1],aGoal:e[2],away:e[3],playDate:e[4],youtube:e[5]?e[5].split('/')[3]:"",homePlayer:hPlayer,homePlayerId:hPlayerId,awayPlayer:aPlayer, awayPlayerId:aPlayerId})
            }else{
              tmpWeekList.push({week:"Week-"+oldTmpWeek,matchList:tmpObjArr}) 
              tmpWeek = e[6]
              oldTmpWeek = e[6]
              tmpObjArr = []
              tmpObjArr.push({home:e[0],hGoal:e[1],aGoal:e[2],away:e[3],playDate:e[4],youtube:e[5]?e[5].split('/')[3]:"",homePlayer:hPlayer,homePlayerId:hPlayerId,awayPlayer:aPlayer, awayPlayerId:aPlayerId})
            }
          })
          tmpWeekList.push({week:"Week-"+oldTmpWeek,matchList:tmpObjArr}) 
          this.matchData = tmpWeekList
          
      }).catch(err => {
  
      });
    }
  })