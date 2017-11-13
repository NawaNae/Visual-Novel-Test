if(typeof novelList == "undefined")
    var novelList = new Array();

function initialVisualNovel()
{
    
    Array.from(document.querySelectorAll(".visualNovel")).forEach
    (ele=>
        {
            Novel = new VisualNovel();
            var startBtn = document.createElement("button");
            startBtn.innerText = "START";
            startBtn.onclick = () => { Novel.start(); }
            ele.append(startBtn);
            novelList.push(Novel);
            Novel.contentSrc = ele.dataset.src;
            Novel.appendTo(ele);
        });

}
$(document).ready(function () {
    initialVisualNovel();
});

class VisualNovel {
    constructor() {
        this._content = new Object();
        this._background = document.createElement("div");
        this._background.classList.add("background");
        this._chap = 0;
        this._cmd = 0;
        this.character = new Character();
        this.dialog = document.createElement("div");
        this.dialog.classList.add("dialog")
        this.voiceOver = document.createElement("div");
        this.voiceOver.classList.add("voiceOver");
        this.father;
    }
    set contentSrc(url) {
        var that = this;
        $.getJSON(url, data => {
            that._content  = data;
        })
        
    }
    set backgroundImage(url) {
        var str = "url('" + url + "')";
        this._background.style.background = str ;
    }
    get backgroundImage() {
        return window.getComputeStyle(this._background).getPropertyValue("background-image");
    }
    set dialogText(text) {
        this.dialog.innerText = text;
    }
    get dialogText() {
        return this.dialog.innerText;
    }
    set VoiceOverText(text) {
        this.voiceOver.innerText = text;
    }
    get VoiceOverText() {
        return this.voiceOver.innerText;
    }

    showVoiceOver() {
        this.show(this.voiceOver);
    }
    hideVoiceOver() {
        this.hide(this.voiceOver);
    }
    showDialog() {
        this.show(this.dialog);
    }
    hideDialog() {
        this.hide(this.dialog);
    }
    showCharacter() {
        this.character.show();
    }
    hideCharacter() {
        this.character.hide();
    }
    show(htmElement) {
        htmElement.style.display = "block";
    }
    hide(htmElement) {
        htmElement.style.display = "none";
    }
    isWaitingCmd(cmd)
    {
        return cmd.type == "text" || cmd.type == "talk";
    }
    next()
    {
        var end = false;
        do {
            if (this._cmd >= this._content[this._chap].length)//章節結束 
                this._cmd = 0, this._chap++;
            if (this._chap >= this._content.length)//故事結束
            {
                end = true;
                break;
            }
            var cmd = this._content[this._chap][this._cmd];

            this.parseCmd(cmd);//執行當前指令

             this._cmd++;//下一步驟
        } while (!this.isWaitingCmd(cmd))//如果該步驟不需要等待使用者觀看 則繼續
        if (end)
            this.end();
    }
    end()
    {
        //do something
    }
    start() {
        this._chap = 0;
        this._cmd = 0;
        var that = this;
        this.father.onclick = () => { that.next() };
    }
    parseCmd(cmd)
    {
        switch (cmd.type) {
            case "background":
                this.backgroundImage = cmd.url;
                break;
            case "character":
                this.character.imageUrl = cmd.url;
                this.character.name = cmd.name;
                break;
            case "talk":
                this.dialogText = cmd.text;
                break;
            case "text":
                this.VoiceOverText = cmd.text;
                break;
            case "show":
                switch (cmd.object) {
                    case "character":
                        this.showCharacter();
                        break;
                    case "talk":
                        this.showDialog();
                        break;
                    case "text":
                        this.showVoiceOver();
                        break;
                }
                break;
            case "hide":
                switch (cmd.object) {
                    case "character":
                        this.hideCharacter();
                        break;
                    case "talk":
                        this.hideDialog();
                        break;
                    case "text":
                        this.hideVoiceOver();
                        break;
                }
        }
    }
    appendTo(father)
    {
        this.father = father;
        father.append(this._background);
        this.character.appendTo(father);
        father.append(this.dialog);
        father.append(this.voiceOver);
    }
}
class Character
{
    constructor()
    {
        this._image = document.createElement("img");
        this._image.classList.add("characterImage");
        this._name = "";
        this._nameBox = document.createElement("div");
        this._nameBox.classList.add("nameBox");
    }
    set imageUrl(src)
    {
        this._image.src=src;
    }
    get imageUrl()
    {
        return this._image.src;
    }
    set nameBox(name)
    {
        this._nameBox.innerText=name;
    }
    get nameBox()
    {
        return this._nameBox;    
    }
    set name(name)
    {
        this._name = name;
        this._nameBox.innerText = name;
    }
    get name()
    {
        return this._name;
    }
    show ()
    {
        this._image.style.display="block";
        this._nameBox.style.display="block";
    }
    hide()
    {
        this._image.style.display="none";
        this._nameBox.style.display="none";
    }
    appendTo(father)
    {
        father.append(this._image);
        father.append(this._nameBox);
    }
}