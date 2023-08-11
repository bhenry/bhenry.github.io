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
    if (page == '<<') {
        a.onclick = function(e){
            e.preventDefault();
            var page = window.location.hash.substring(1);
            var newpage = parseInt(page) - 1;
            window.location.hash = newpage < 1 ? pages : newpage;
        };
        a.style.cursor = 'pointer';
    }
    else if (page == '>>' ) {
        a.onclick = function(e){
            e.preventDefault();
            var page = window.location.hash.substring(1);
            var newpage = parseInt(page) + 1;
            window.location.hash = newpage > pages ? 1 : newpage;
        };
        a.style.cursor = 'pointer';
    }
    else {
        a.href = '#' + page;
    }

    return a;
}

function load_slides(page){
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
    var page = window.location.hash.substring(1);
    load_slides(page || 1);
};
req.open('GET', './index.list');
req.send();

window.onhashchange = function(){
    var page = window.location.hash.substring(1);
    load_slides(page || 1);
};
