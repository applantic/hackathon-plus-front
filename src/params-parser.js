export function getJsonFromUrl() {
  var query = window.location.search.substr(1);
  var result = {};
  if(query){
    query.split("&").forEach(function(part) {
      var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
  }
  return result;
}
