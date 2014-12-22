export default Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, escapeExpression=this.escapeExpression, buffer = '';
  data.buffer.push("<div class='message'>");
  stack1 = helpers._triageMustache.call(depth0, "view.message", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
  if (stack1 != null) { data.buffer.push(stack1); }
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.raw", {"name":"_triageMustache","hash":{
    'unescaped': ("true")
  },"hashTypes":{'unescaped': "STRING"},"hashContexts":{'unescaped': depth0},"types":["ID"],"contexts":[depth0],"data":data})));
  data.buffer.push("</div>\n<a ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "close", {"name":"action","hash":{
    'target': ("view")
  },"hashTypes":{'target': "STRING"},"hashContexts":{'target': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
  data.buffer.push(" class=\"close\">&times;</a>\n");
  return buffer;
},"useData":true})