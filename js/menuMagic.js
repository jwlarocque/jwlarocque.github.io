var pane1button, pane2button;

function initMenu(){
    pane1button = document.querySelector("#pane1button")
    pane1button.addEventListener("click", unshiftPane);
    pane2button = document.querySelector("#pane2button")
    pane2button.addEventListener("click", shiftPane);

    if (window.location.hash === "#projects") {
        shiftPane();
    }
}

function unshiftPane(event) {
    window.location = "#home";
    document.querySelector(".carousel").setAttribute("style", "transform: translate(0)");
    pane1button.setAttribute("class", "active");
    pane2button.setAttribute("class", "")
}

function shiftPane(event) {
    window.location = "#projects";
    document.querySelector(".carousel").setAttribute("style", "transform: translate(-50%)");
    pane1button.setAttribute("class", "");
    pane2button.setAttribute("class", "active");
}


