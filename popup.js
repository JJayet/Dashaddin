document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.getSelected(null, function(tab) {
    var dom;
    var pwdTerms = ['password', 'pass', 'pwd'];
    var userTerms = ['e-mail', 'email', 'user', 'username'];

    function getInputsAndContext(domContent) {
      dom = document.createElement('div');
      dom.innerHTML = domContent;
      getInputs();
    }

    function getContextForInput(input) {
      if(input.type == "password") {
        return {input : input, context : "Password"};
      }
      return {input : input, context : "???"};
    }

    function getLabelForId(id) {
      console.log(dom.querySelector("label[for='" + id + "']"));
    }

    function getContextFromInputs(inputs) {

    }

    function getInputs() {
      var textInputs = dom.querySelectorAll('input:not([type="radio"]):not([type="hidden"])');
      var textDiv = document.createElement('div');

      [].forEach.call(textInputs, function(elem) {
        var inputAndContext = getContextForInput(elem);
        var text = document.createTextNode(inputAndContext.input.outerHTML + ", " + inputAndContext.context);
        textDiv.appendChild(text);
        textDiv.appendChild(document.createElement('br'));
      });

      var textTitle = document.createElement('h2');
      textTitle.innerHTML = "Inputs"
      document.body.appendChild(textTitle);
      document.body.appendChild(textDiv);
    }

    chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, getInputsAndContext);

  });
}, false);
