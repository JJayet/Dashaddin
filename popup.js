document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.getSelected(null, function(tab) {
    function doStuffWithDom(domContent) {
      var wrapper= document.createElement('div');
      wrapper.innerHTML= domContent;
      var pwdInputs = wrapper.querySelectorAll('input[type=password]');
      var textInputs = wrapper.querySelectorAll('input[type=text]');
      
      var pwdDiv = document.createElement('div');

      [].forEach.call(pwdInputs, function(elem) {
        pwdDiv.appendChild(document.createTextNode(elem.outerHTML));
        pwdDiv.appendChild(document.createElement('br'));  
      });

      var textDiv = document.createElement('div');
      
      [].forEach.call(textInputs, function(elem) {
        textDiv.appendChild(document.createTextNode(elem.outerHTML));
        textDiv.appendChild(document.createElement('br'));  
      });

      var pwdTitle = document.createElement('h2');
      pwdTitle.innerHTML = "Password inputs"
      document.body.appendChild(pwdTitle);
      document.body.appendChild(pwdDiv);

      var textTitle = document.createElement('h2');
      textTitle.innerHTML = "Text inputs"
      document.body.appendChild(textTitle);
      document.body.appendChild(textDiv);
    }

    chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
    
  });
}, false);

