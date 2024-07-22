function preload_image(im_url) {
    let img = new Image();
    img.src = im_url;
};

var incby = 10;

function handle_click(im_url) {
    return function(e){
        e.preventDefault();
        window.open("../"+im_url,"_blank");
    };
}

function create_slide(im_url) {
    let div = document.createElement('div');
    div.onclick = handle_click(im_url);
    div.className = 'slide';
    let img = document.createElement('img');
    img.src = "../"+im_url;
    img.alt = im_url;
    div.appendChild(img);
    return div;
}

function page_link(page, pages){
    var a = document.createElement('a');
    a.innerHTML = page;
    a.style.cursor = 'pointer';
    if (page == '<<') {
        a.onclick = function(e){
            e.preventDefault();
            var page = window.location.hash.substring(1) || 1;
            var newpage = parseInt(page) - 1;
            window.location.hash = newpage < 1 ? pages : newpage;
        };
    }
    else if (page == '>>' ) {
        a.onclick = function(e){
            e.preventDefault();
            var page = window.location.hash.substring(1) || 1;
            var newpage = parseInt(page) + 1;
            window.location.hash = newpage > pages ? 1 : newpage;
        };
    }
    else {
        a.href = '#' + page;
        a.className = 'page-' + page;
    }

    return a;
}

function getPage(){
    var page = parseInt(window.location.hash.substring(1));
    return page || 1;
}

function load_slides(){
    var page = getPage();
    var activeNav = document.querySelectorAll('a.active');
    activeNav.forEach(function(e){e.className = e.className.replace('active', '')})
    var nav = document.getElementsByClassName('page-' + page);
    for (var i = 0; i < nav.length; i++) {
        nav[i].className += ' active';
    }
    let slideshow = document.getElementById('slideshow');
    slideshow.innerHTML = '';
    let req = new XMLHttpRequest();
    req.onload = function(){
        let list = this.responseText.split('\n');
        for(let i = page*incby - incby; i < page*incby; i++){
            if(!list[i]){
                continue;
            }
            div = create_slide(list[i]);
            slideshow.appendChild(div);
        }
    };
    req.open('GET', './index.list');
    req.send();
}

var req = new XMLHttpRequest();
req.onload = function(){
    var list = this.responseText.trim().split('\n');
    var pages = Math.ceil(list.length / incby);
    var nav = document.getElementById('nav');
    var navbot = document.getElementById('navbot');
    nav.appendChild(page_link('<<', pages));
    navbot.appendChild(page_link('<<', pages));
    for(var i = 1; i <= pages; i++){
        nav.appendChild(page_link(i));
        navbot.appendChild(page_link(i));
    }
    nav.appendChild(page_link('>>', pages));
    navbot.appendChild(page_link('>>', pages));
    load_slides();
};
req.open('GET', './index.list');
req.send();

window.onhashchange = function(){
    load_slides();
};
