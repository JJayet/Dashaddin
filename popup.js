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
      if(input.type === 'password') {
        return {input : input, context : 'Password'};
      }
      else if (input.type === 'email') {
        return {input : input, context : "Email"};
      }
      else if (input.type === 'tel') {
        return {input : input, context : "Phone Number"};
      }
      return {input : input, context : "???"};
    }

    function getLabelForId(id) {
      console.log(dom.querySelector("label[for='" + id + "']"));
    }

    function getContextFromInputs(inputs) {

    }

    function getInputs() {
      var textInputs = dom.querySelectorAll('input:not([type="radio"]):not([type="hidden"]):not([type="checkbox"]):not([type="submit"])');
      var knownContextTextDiv = document.createElement('div');
      var unknownContextTextDiv = document.createElement('div');

      [].forEach.call(textInputs, function(elem) {
        var inputAndContext = getContextForInput(elem);
        var text = document.createTextNode(inputAndContext.input.outerHTML + ", " + inputAndContext.context);
        if (inputAndContext.context === '???') {
          unknownContextTextDiv.appendChild(text);
          unknownContextTextDiv.appendChild(document.createElement('br'));
        } else {
          knownContextTextDiv.appendChild(text);
          knownContextTextDiv.appendChild(document.createElement('br'));
        }
      });

      document.body.appendChild(knownContextTextDiv);
      document.body.appendChild(document.createElement('br'));
      document.body.appendChild(unknownContextTextDiv);
    }

    chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, getInputsAndContext);

  });
}, false);
