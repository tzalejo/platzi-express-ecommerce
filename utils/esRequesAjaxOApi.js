function esRequesAjaxOApi(req){
  // si req no acepta html o req xhr
  return !req.accepts('html') || req.xhr;
}

module.exports = esRequesAjaxOApi;