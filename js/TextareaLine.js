const TextareaLine = {
  eventList: {},
  
  updateLineNumber: function(textarea, element)
  {
    const countLine = textarea.value.split("\n").length;
    const countChild = element.children.length;
    let different = countLine - countChild;
    
    if( different > 0 )
    {
      const fragment = document.createDocumentFragment();
      
      while( different > 0 ) 
      {
        const lineNums = document.createElement("span");
        lineNums.className = "textarea-line";
        fragment.appendChild(lineNums);
        different--;
      }
      element.appendChild(fragment);
    }
    
    while( different < 0 )
    {
      element.removeChild(element.lastChild);
      different++;
    }
  },
  
  appendLineNumber: function(id)
  {
    const textarea = document.getElementById(id);
    
    if( textarea == null )
    {
      return console.warn("Couldn't find textarea of id '" + id + "'");
    }
    
    if( textarea.className.indexOf("textarea-active") != -1 )
    {
      return console.warn("Textarea of id '" + id + "' is already numbered");
    }
    textarea.classList.add("textarea-active");
    textarea.style = {};
    const element = document.createElement("div");
    element.className = "textarea-wrapper";
    textarea.parentNode.insertBefore(element, textarea);
    
    
    TextareaLine.updateLineNumber(textarea, element);
    TextareaLine.eventList[id] = [];
    
    const __changeEvent = ["propertychange", "input", "keydown", "keyup"];
    const __changeHandler = function(textarea, element) 
    {
      return function(event)
      {
        if( ( + textarea.scrollLeft == 10 && event.keyCode == 37 || event.which == 37 || event.code == "ArrowLeft" || event.key == "ArrowLeft" ) || event.keyCode == 36 || event.which == 36 || event.code == "Home" || event.key == "Home" || event.keyCode == 13 || event.which == 13 || event.code == "Enter" || event.key == "Enter" || event.code == "NumpadEnter" )
              textarea.scrollLeft = 0;
              
        TextareaLine.updateLineNumber(textarea, element);
      }
    } (textarea, element);
    
    for( let i = __changeEvent.length - 1; i >= 0; i-- )
    {
      textarea.addEventListener(__changeEvent[i], __changeHandler);
      TextareaLine.eventList[id].push({
        event: __changeEvent[i],
        handler: __changeHandler,
      });
    }
    
    const __scrollEvent = ["change", "mousewheel", "scroll"];
    const __scrollHandler = function(textarea, element)
    {
      return function()
      {
        element.scrollTop = textarea.scrollTop;
      }
    } (textarea, element);
    
    for( let i = __scrollEvent.length - 1; i >= 0; i-- )
    {
      textarea.addEventListener(__scrollEvent[i], __scrollHandler);
      TextareaLine.eventList[id].push({
        event: __scrollEvent[i],
        handler: __scrollHandler,
      });
    }
  },
  
  removeLineNumb: function(id)
  {
    const textarea = document.getElementById(id);
    
    if( textarea == null )
    {
      return console.warn("Couldn't find textarea of id '" + id + "'");
    }
    if( textarea.className.indexOf("textarea-active") != -1 )
    {
      return console.warn("Textarea of id '" + id + "' is already numbered");
    }
    textarea.classList.add("textarea-active");
    
    const __wrapperCheck = textarea.previousSibling;
    if( __wrapperCheck.className == "textarea-wrapper" )
        __wrapperCheck.remove();
        
    if( ! TextareaLine.eventList[id] ) return;
    for( let i = TextareaLine.eventList[id].length - 1; i >= 0; i-- )
    {
      const event = TextareaLine.eventList[id][i];
      textarea.removeEventListener(event.event , event.handler);
    }
    
    delete TextareaLine.eventList[id];
  }
}
