const https = require("https");
const fs = require("fs");

function saveData(cb) {
  https
    .get(
      "https://gist.githubusercontent.com/marshyski/d5839816c2ea730185b0af3570cbc2f7/raw/d6aebfc3f0c202b17fe6b27aae023297d9ba6a67/sentences.json",
      (res) => {
        res.on("data", (d) => {
          fs.writeFileSync('./file.json',d);
          cb();
        });
      }
    )
    .on("error", (e) => {
      console.error(e);
    });
}
function index(cb){
  fs.readFile('./file.json',{encoding: 'utf8'}, (err, data) => {
    if(data){
      data = JSON.parse(data);
    }
    cb({
      data:data?.sentences,
      error:err?.message
    });  
  });
}
function search(searchString, cb){
  fs.readFile('./file.json',{encoding: 'utf8'}, (err, data) => {
    let sentences;
    if(data){
      data = JSON.parse(data);
      sentences=data.sentences.sort((a,b) => {
        let aCount = a.split(' ').filter(s => s.toUpperCase() === searchString.toUpperCase()).length;
        //console.log(a,aCount);
        let bCount = b.split(' ').filter(s => s.toUpperCase() === searchString.toUpperCase()).length;
        return bCount - aCount;
      })
    }
    cb({
      searchString,
      results:sentences,
      error:err?.message
    });  
  });
}
saveData(() =>{
  search('sentence.',console.log);

})

/* If not using function index, the way to improve this program would be to remove it. The saveData function works fine, and I'm not aware of a way to improve upon it.
The search function could be improved depending on how sophisticated we wanted the search to be. We could have a pass where we'd remove all punctuation and then perform a search.
For instance, I have to include a '.' to search for sentence. We could also use regular expressions and perform a regex.match, which would return the count of results. This would 
eliminate the concern of spaces and punctuation, but we would end up with instances where a word would be part of another word. ex: 'love' would show up if searching for 'loves'. */




