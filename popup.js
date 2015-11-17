document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.getSelected(null, function(tab) {
    var dom;

    function getInputsAndContext(domContent) {
      dom = document.createElement('div');
      dom.innerHTML = domContent;
      getInputs();
    }

    function getLabelForId(id) {
      return dom.querySelector("label[for='" + id + "']");
    }

    function getContextWithoutLabel(input) {
      var ariaLabel = input.getAttribute("aria-label");
      if (ariaLabel !== '') {
        return ariaLabel;
      } else {
        return '???';
      }
    }

    function getContextForInput(input) {
      var label = getLabelForId(input.id);
      if (label === null) {
        return {input : input, context : getContextWithoutLabel(input)};
      }
      return {input : input, context : label.innerText};
    }

    function getInputs() {
      var textInputs = dom.querySelectorAll('input:not([type="radio"]):not([type="hidden"]):not([type="checkbox"]):not([type="button"]):not([type="submit"])');
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
