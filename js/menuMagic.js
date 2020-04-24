var pane1button, pane2button;

$('#menu-trigger-label').click(function () {
    $( "#line" ).delay(400).slideToggle();
});

function initMenu(){
    var switches = {
        "hamburger": "arrow",
        "arrow": "hamburger",
    };

    $("#menu-trigger-label").on("click", function (argument) {
        var $el = $(this).find(".menu-box").find(".menu-icon"),
        icon = $el.data("icon"),
        newIcon = switches[icon];

        if (newIcon) {
            $el.removeClass(icon).addClass(newIcon).data("icon", newIcon);
        }
    });

    pane1button = document.querySelector("#pane1button")
    pane1button.addEventListener("click", unshiftPane);
    pane2button = document.querySelector("#pane2button")
    pane2button.addEventListener("click", shiftPane);

    if (window.location.hash === "#projects") {
        shiftPane();
    }
}

function unshiftPane(event) {
    window.location = "";
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


