var req = new XMLHttpRequest();
req.onload = function(){
    console.log(this.responseText);
    var list = this.responseText.split('\n');
    var slideshow = document.getElementById('slideshow');
    for(var i = 0; i < list.length; i++){
        if(list[i] == '') continue;
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '../' + list[i];
        a.innerHTML = list[i];
        li.appendChild(a);
        slideshow.appendChild(li);
    }
};
req.open('GET', './index.list');
req.send();
