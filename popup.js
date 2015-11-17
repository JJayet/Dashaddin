document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.getSelected(null, function(tab) {
    var dom;
    var userTerms = ['e-mail', 'email', 'user', 'username'];
    var addressTerms = ['address'];
    var companyTerms = ['company', 'corporation', 'corp'];
    var zipTerms = ['zip', 'postal'];
    var cityTerms = ['city', 'town'];
    var stateTerms = ['state'];

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
        return {input : input, context : 'Email'};
      }
      else if (input.type === 'tel') {
        return {input : input, context : 'Phone Number'};
      }
      else {
        return {input : input, context : getContextWithoutLabel(input)};
      }
    }

    function getContextUsingArray(textToUse, arrayToCheckFrom, associatedResult) {
      var result = '???';
      arrayToCheckFrom.forEach(function(toCompare) {
        if (toCompare.toLowerCase().indexOf(textToUse) > -1)
          result = associatedResult;
        else if (textToUse.toLowerCase().indexOf(toCompare) > -1)
          result = associatedResult;
      });
      return result;
    }

    function getContextWithoutLabel(input) {
      var textToUse =
        input.id === '' ? input.name.toLowerCase() : input.id.toLowerCase();

      if (textToUse === '')
        return '???';
      else {
        var user = getContextUsingArray(textToUse, userTerms, 'UserName');
        var company = getContextUsingArray(textToUse, companyTerms, 'Company');
        var address = getContextUsingArray(textToUse, addressTerms, 'Address');
        var zip = getContextUsingArray(textToUse, zipTerms, 'Zip Code');
        var city = getContextUsingArray(textToUse, cityTerms, 'City');
        var state = getContextUsingArray(textToUse, stateTerms, 'State');

        if(user !== '???')
          return user;
        else if(company !== '???')
          return company;
        else if(address !== '???')
          return address;
        else if(zip !== '???')
          return zip;
        else if(city !== '???')
          return city;
        else if(state !== '???')
          return state;
        else
          return '???';
      }
    }

    function getLabelForId(id) {
      return dom.querySelector("label[for='" + id + "']");
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
