Sk.builtins.RESET = new Sk.builtin.str("\u001b[ 0;2;0;0;0 m");

Sk.builtins.RED = new Sk.builtin.str("\u001b[ 38;2;255;0;0 m");
Sk.builtins.BLACK = new Sk.builtin.str("\u001b[ 38;2;0;0;0 m");
Sk.builtins.WHITE = new Sk.builtin.str("\u001b[ 38;2;255;255;255 m");
Sk.builtins.RED = new Sk.builtin.str("\u001b[ 38;2;255;0;0 m");
Sk.builtins.GREEN = new Sk.builtin.str("\u001b[ 38;2;0;255;0 m");
Sk.builtins.BLUE = new Sk.builtin.str("\u001b[ 38;2;0;0;255 m");
Sk.builtins.CYAN = new Sk.builtin.str("\u001b[ 38;2;0;255;255 m");
Sk.builtins.YELLOW = new Sk.builtin.str("\u001b[ 38;2;255;255;0 m");
Sk.builtins.MAGENTA = new Sk.builtin.str("\u001b[ 38;2;255;0;255 m");
Sk.builtins.ORANGE = new Sk.builtin.str("\u001b[ 38;2;255;165;0 m");
Sk.builtins.PURPLE = new Sk.builtin.str("\u001b[ 38;2;127;0;255 m");
    
Sk.builtins.HL_BLACK = new Sk.builtin.str("\u001b[ 48;2;0;0;0 m");
Sk.builtins.HL_WHITE = new Sk.builtin.str("\u001b[ 48;2;255;255;255 m");
Sk.builtins.HL_RED = new Sk.builtin.str("\u001b[ 48;2;255;0;0 m");
Sk.builtins.HL_GREEN = new Sk.builtin.str("\u001b[ 48;2;0;255;0 m");
Sk.builtins.HL_BLUE = new Sk.builtin.str("\u001b[ 48;2;0;0;255 m");    
Sk.builtins.HL_CYAN = new Sk.builtin.str("\u001b[ 48;2;0;255;255 m");
Sk.builtins.HL_YELLOW = new Sk.builtin.str("\u001b[ 48;2;255;255;0 m");
Sk.builtins.HL_MAGENTA = new Sk.builtin.str("\u001b[ 48;2;255;0;255 m");
Sk.builtins.HL_ORANGE = new Sk.builtin.str("\u001b[ 48;2;255;165;0 m");
Sk.builtins.HL_PURPLE = new Sk.builtin.str("\u001b[ 48;2;127;0;255 m");
    
Sk.builtins.BOLD = new Sk.builtin.str("\u001b[ 1;2;0;0;0 m");    
Sk.builtins.ITALICS = new Sk.builtin.str("\u001b[ 3;2;0;0;0 m");    
Sk.builtins.UNDERLINE = new Sk.builtin.str("\u001b[ 4;2;0;0;0 m");    

function outputf(n) {
    var text = "";
    var color;
    var bgcolor;
    var italics;
    var bold;
    var underlined;
                  
    i = 0;
    while (n.length > 0)
    {
        if (n[0] == "\u001b")
        {
            i++;
            if (text.length > 0)
                pyConsole.appendChild(createColouredTextSpanElement(text, color, bgcolor, italics, bold, underlined));                
            text = "";
            
            var escPattern = /\[ (\d+);2;(\d+);(\d+);(\d+) m/;                          
            var match = n.match(escPattern);
            
            if (typeof(match) !== 'undefined')
            {
                code = parseInt(match[1]);
                if (code == 0)
                {
                    // reset
                    color = "rgb(255,255,255)";
                    bgcolor = "rgb(0,0,0)";                    
                    bold = false;
                    italics = false;
                    underlined = false;
                }
                else if (code == 38)
                {
                    color = "rgb(" + parseInt(match[2]) + "," + parseInt(match[3]) + "," + parseInt(match[4]) + ")"; 
                }
                else if (code == 48)
                {
                    bgcolor = "rgb(" + parseInt(match[2]) + "," + parseInt(match[3]) + "," + parseInt(match[4]) + ")"; 
                }
                else if (code == 1)
                {
                    // bold
                    bold = true;
                }
                else if (code == 3)
                {
                    // italics
                    italics = true;
                }
                else if (code == 4)
                {
                    // underlined
                    underlined = true;
                }                
                i = match.index + match[0].length;
            }
            n = n.substring(i);
        }
        else
        {
            text += n[0];
            n = n.substring(1);
        }                
    }
    if (text.length > 0)
        pyConsole.appendChild(createColouredTextSpanElement(text, color, bgcolor, italics, bold, underlined));                           
    
    // force scroll to bottom
    document.getElementById("consoleWrapper").scrollTop = document.getElementById("consoleWrapper").scrollHeight;
}

function inputf(n) {
    inputPromise = new Promise((function(n, e) {                    
                inputElement = document.createElement("span");
                inputElement.setAttribute("contenteditable", "true");
                inputElement.setAttribute("autocapitalize", "off");
                inputElement.style.color = "rgb(255,255,255)";
                inputElement.style.fontSize = "14pt";
                inputElement.style.outlineStyle = "none";
                pyConsole.appendChild(inputElement);
                inputElement.focus();
                inputElement.addEventListener("keyup", (function(e) {
                    e.preventDefault();
                    if (e.key ==="Enter") {
                        userResponse = this.innerText.replace(/\n+$/, "");
                        this.remove();
                        outputf(userResponse);
                        outputf("\n");
                        n(userResponse);
                    }
                }))
            }));
    return inputPromise;
}
    
var fontColour = "rgba(255, 255, 255, 1)";
var fontBgColour = "rgba(0, 0, 0, 1)";
var fontItalics = false;
var fontBold = false;
var fontUnderlined = false;
var fontSize = "14pt";

var spinner = document.getElementById("spinner");
spinner.style.display = "none";

function resetConsole()
{
    fontColour = "rgba(255, 255, 255, 1)";
    fontBgColour = "rgba(0, 0, 0, 1)";
    fontItalics = false;
    fontBold = false;
    fontUnderlined = false;
    fontSize = "14pt";    
    clearConsole();
}

function createColouredTextSpanElement(n, color, bgcolor, italics, bold, underlined) {
    let t = document.createTextNode(n);        
    let e = document.createElement("span");    
    
    if (typeof(color) !== 'undefined')
    {
        fontColour = color;
    }    
    
    if (typeof(bgcolor) !== 'undefined')
    {
        fontBgColour = bgcolor;
    }
    
    if (typeof(italics) !== 'undefined')
    {
        if (italics)
        {
            fontItalics = "italic";
        }
        else
        {
            fontItalics = "normal";
        }            
    }
    
    if (typeof(bold) !== 'undefined')
    {
        if (bold)
        {
            fontBold = "bold";
        }
        else
        {
            fontBold = "normal";
        }    
    }    

    if (typeof(underlined) !== 'undefined')
    {
        if (underlined)
        {
            fontUnderlined = "underline";
        }
        else
        {
            fontUnderlined = "none";
        }    
    }  
    
    e.style.textDecoration = fontUnderlined;
    e.style.fontWeight = fontBold;
    e.style.fontStyle = fontItalics;
    e.style.backgroundColor = fontBgColour;
    e.style.color = fontColour;
    e.style.fontSize = fontSize;
    
    e.appendChild(t);        
    return e;
}

/////////////////////// image functions //////////////////////////

function createImageElement(url, width, height, onload, onerror) {
    let e = document.createElement("img");  
    e.id = (Math.random() + 1).toString(36).substring(7);
    e.src = url;
    e.style.display = "none";
    if (width !== null) {
        e.width = width;
    }
    if (height !== null) {
        e.height = height;
    }
    e.onload = onImageLoaded;
    e.addEventListener("load", onload);
    e.onerror = onImageError;

    e.addEventListener("afterDialogClose", onerror);

    document.getElementById("errDialog").setAttribute("source", e.id);

    return e ;
}

function addImage(url, width, height, onload, onerror) {
    showSpinner();
    pyConsole.appendChild(createImageElement(url, width, height, onload, onerror));      
}

function onImageLoaded() {
    this.style.display = "block";
    // hide the spinner after image has loaded
    hideSpinner();
}

function onImageError() {
    showErrorDialog("There was an error loading: " + this.src, hideSpinner);    
}

/////////////////////// audio functions //////////////////////////
var audioElement = null;
function stopSound() {
    if (audioElement !== null && audioElement.parentNode === document.body) {
      audioElement.onerror = null; 
      document.body.removeChild(audioElement);
      audioElement.pause();
      audioElement.currentTime = 0;
      audioElement.src ="";
      audioElement = null;        
    }
  }

function createAudioElement(url, loop, onload, onerror) {
    stopSound();
    showSpinner();
    audioElement = new Audio(url);
    audioElement.id = (Math.random() + 1).toString(36).substring(7);
    audioElement.loop = loop;
    audioElement.oncanplaythrough = onAudioCanPlaythrough;
    audioElement.addEventListener("canplaythrough", onload);
    audioElement.addEventListener("afterDialogClose", onerror);    
    audioElement.onerror = onAudioError; 
    document.getElementById("errDialog").setAttribute("source", audioElement.id);  
    document.body.appendChild(audioElement);
}

function onAudioError() {
    showErrorDialog("There was an error loading: " + this.src, hideSpinner);    
}

function onAudioCanPlaythrough() {
    audioElement.play();  
    
    // hide the spinner after image has loaded
    hideSpinner();
}

function playFreeSound(id, onload, onerror) {
    //mod.loadingSound = true;

    // stop current sound
    showSpinner()

    var xhr = new XMLHttpRequest();      
    const requestURL =  "https://freesound.org/apiv2/sounds/" + id + "/?fields=previews&format=json&token=Vzf4dkU29E5ltPX1sfi2aqCkzG1aKgbITklKHROh";
    console.log(requestURL);
    xhr.open("GET", requestURL, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.timeout = 10000; // time in milliseconds

    xhr.ontimeout = (e) => {
      console.log("Timeout");
      showErrorDialog("There was an error loading freesound id: " + id, hideSpinner);
      onerror();
    };    
  
    xhr.onerror = function() {
      console.log("Error");
      showErrorDialog("There was an error loading freesound id: " + id, hideSpinner);
      onerror();
    }
    
    xhr.onreadystatechange = function() {
      console.log("Response:" + xhr.responseText);
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        if (xhr.responseText.length == 0) {
        }
        else {            
          const response = JSON.parse(xhr.responseText);
          const url = response["previews"]["preview-hq-ogg"];

          createAudioElement(url, false, onload, onerror);                   
        }
      }
      else if (this.status !== 200) {
        // 404 or some other status code
        console.log("Error");
        hideSpinner();
        showErrorDialog("There was an error loading freesound id: " + id, onerror);    
          
      }
    } 
    
    xhr.send();        
}


//////////////////////// spinner functions /////////////////////

function showSpinner() {
    // already spinning
    if (spinner.parentNode == pyConsole) {
        return;
    }
    spinner.style.display = "block";
    pyConsole.appendChild(spinner);
    document.getElementById("consoleWrapper").scrollTop = document.getElementById("consoleWrapper").scrollHeight;
}

function hideSpinner() {
    // already hidden
    if (spinner.parentNode != pyConsole) {
        return;
    }    
    spinner.style.display = "none";
    pyConsole.removeChild(spinner);
    // readjust console scroll height
    document.getElementById("consoleWrapper").scrollTop = document.getElementById("consoleWrapper").scrollHeight;    
}
///////////////////////// exported helper functions //////////////////////////

Sk.builtins.clear = function() {
    clearConsole();
}

Sk.builtins.showSpinner = function() {
    showSpinner();
}

Sk.builtins.hideSpinner = function() {
    hideSpinner();
}

// FIXME: need to preserve CSS stylings of the div
Sk.builtins.print_screen = function() {
    var divContents = document.getElementById("consoleWrapper").innerHTML;
    var a = window.open('', '', 'height=500, width=500');
    a.document.write('<html>');
    a.document.write('<body >');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
    a.print();
}