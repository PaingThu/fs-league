var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      matchData : [],
      playerInfo: "d-none",

      keyWordByWeek: '',
      keyWordByTeam: '',
      keyWordByPlayer: '',
    },
    methods: {
        getMatches: function(){
            console.log("Get Matches From Youtube.")
        },
        configureMatchData: function(data){
            console.log("Data ", data)
            var tmpWeekList = []
            var tmpWeek = ""
            var oldTmpWeek = ""
            var tmpObjArr = []
            data.sort(function(a,b){
                return b[6]-a[6]
            }).map(e => {
                // console.log("The value of e : ",e)
                var hIndex = premierLeagueData.findIndex(pInfo => pInfo.team == e[0].trim())
                var aIndex = premierLeagueData.findIndex(pInfo => pInfo.team == e[3].trim())
                console.log("hhhh ",premierLeagueData[hIndex].name)
                console.log("index ",hIndex)
                var hPlayer = premierLeagueData[hIndex].name
                var hPlayerId = premierLeagueData[hIndex].id
                var aPlayer = premierLeagueData[aIndex].name
                var aPlayerId = premierLeagueData[aIndex].id
                // console.log("Home Player ",hPlayer)
                // console.log("Home Player ",aPlayer)
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
        },
        search: async function(){
            // console.log("Select",e.target.id)
            console.log("Search By Week ", this.keyWordByWeek)
            console.log("Search By Team ", this.keyWordByTeam)
            console.log("Search By Player ", this.keyWordByPlayer)
            await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1mNHaMt9Nk_HAKdy1dz4x_IhxfkpqrRTNuvRMcObwYlw/values/premier-league!A2:AB1094?key=AIzaSyBuoa3iAy6JtfpBUpcqL4k1gsrMT631TPw`)
            .then(res=>res.json())
            .then(response =>{
                var data = response.values
                if(this.keyWordByWeek){
                    data = data.filter(e => e[6] == this.keyWordByWeek)
                }
                if(this.keyWordByTeam){
                    data = data.filter(e => e[0] == this.keyWordByTeam || e[3] == this.keyWordByTeam)
                }
                if(this.keyWordByPlayer){
                    data = data.filter(e =>
                        premierLeagueData.find(d => d.team === e[0].trim()).name == this.keyWordByPlayer || premierLeagueData.find(d => d.team === e[3].trim()).name == this.keyWordByPlayer
                    )
                }
                this.configureMatchData(data)
            }).catch(err => {
        
            });
        }
    },
    async created() {
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1mNHaMt9Nk_HAKdy1dz4x_IhxfkpqrRTNuvRMcObwYlw/values/premier-league!A2:AB1094?key=AIzaSyBuoa3iAy6JtfpBUpcqL4k1gsrMT631TPw`)
        .then(res=>res.json())
        .then(response =>{
            var data = response.values
            this.configureMatchData(data)
        }).catch(err => {
    
        });
    }
})