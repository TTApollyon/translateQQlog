document.write("<script src='scripts/FileSaver.js'></script>");
document.write("<script src='scripts/jquery.wordexport.js'></script>");
document.write("<script src='scripts/bootstrap.js'></script>")

//Color Index
var colorList = "red;green;pink;orange;purple;black;blue;yellow;beige;brown;teal;navy;maroon;limegreen;white;fuchsia;silver".split(';');
var colorNameList = "红色;绿色;粉红;橘色;紫色;黑色;蓝色;黄色;米色;棕色;蓝绿;深蓝;紫红;莱姆;白色;桃红;灰色".split(';');

var contentList = [];
var plList = [];
var eseRecord = [];

var timeFilterBoolean = true;
var commandFilter = true;
var otherFilter = true;
var picTextFilter = true;
var paletteMode = false;

// var keeperContent = "";
var contentTemplate = "";

//用户储存
function PL(name,color){
    this.name = name;
    this.color = color;
    this.valid = true;
    /*this.isKp = false;*/
}

//对话信息
function isRecord(time,date,content,pl){
    this.time = time;
    this.date = date;
    this.content = content;
    this.pl = pl;
}

//添加用户
function addPL(name,color){
    plList[plList.length] = new PL(name,color);
}

//获得用户
function getPL(name){
    for(var i = 0; i < plList.length; i++){
        if(plList[i].name == name){
            return plList[i];
        }
    }
    return null;
}

//遍历检索pl是否存在，不存在创建
function hasPL(name){
    for(var i = 0; i < plList.length; i++){
        if(plList[i].name == name){
            return true;
        }
    }
    return false;
}

//设置当前顶部PL的对话
function setRecord(time,date,content,pl){
    eseRecord[eseRecord.length] = new isRecord(time,date,content,pl);
}


//通过select达到修改输入框的内容
$(function(){
    $("#leftSetting").hide();
    $("#rightSetting").hide();
    $("#timeFilterButton").addClass('disabled');
    $("#settingButton").addClass('disabled');
    $("#outputButton").addClass('disabled');
    $("#timeSwitch").addClass('disabled');
    $("#picSwitch").addClass('disabled');
    $("#commandSwitch").addClass('disabled');
    $("#otherSwitch").addClass('disabled');
    // $("#keeperSetButton").addClass('disabled');
    $("#contentSetButton").addClass('disabled');
    $("#change").trigger("change");

     //打印切割字符串
    $("#btn_done").click(function(){
        if($("#text_log").val()!=null && $("#text_log").val()!=""){
            //消息处理
            $("#timeFilterButton").removeClass('disabled');
            $("#settingButton").removeClass('disabled');
            $("#outputButton").removeClass('disabled');
            $("#timeSwitch").removeClass('disabled');
            $("#picSwitch").removeClass('disabled');
            $("#commandSwitch").removeClass('disabled');
            $("#otherSwitch").removeClass('disabled');
            $("#contentSetButton").removeClass('disabled');

            dealRecord();
            AllPlSetting();

            if(eseRecord[0]!=null){
                $("#startDate").val(eseRecord[0].date);
            }

            if(plList.length!=0){
                // $("#keeperSetButton").removeClass('disabled');contentSetButton
            }
        }else{
            alert("请将qqLog或将log内容复制至文本框");
        }
        //消息处理（旧）
        /*var beginNum = 0;
        var data = $("#text_log").val();
        var reg = /(.+?)[:：](.*)/;
        var dataList = data.split("\n");
        var momentContent = "";
        var name = "";
        
        for(var i = 0; i < dataList.length; i++){
            var res = dataList[i].match(reg);
            if(res!=null){
                var nameInfo = res[2].trim().split(" ");
            }
            if(res!=null&&momentContent!=""&&nameInfo[2]!=null&&nameInfo[3]==null){
                contentList[beginNum] = momentContent;
                beginNum++;
                momentContent = "";
                name = "";                     
            }
            //处理用户名
            if(res!=null){
                if(nameInfo[2]!=null&&nameInfo[3]==null){
                    name = nameInfo[2].replace(/\([^\)]*\)/g,"");
                    hasPL(name);
                }
                if(nameInfo[2]==null||nameInfo[3]!=null){
                    momentContent += nameInfo;
                }
            }
            //处理输出
            //骰属性特殊情况
            if(res!=null){
                if(dataList[i+1].match(reg)!=null){
                    setRecord("",dataList[i+1],getPL(name));
                }
            }
            //正常输出
            if(res==null&&dataList[i]!=""){
                momentContent = momentContent +" "+ dataList[i];
                setRecord("",momentContent,getPL(name));
            }

            contentSetting();
        }*/

        /*//测试聊天记录表
        for(var i = 0; i < eseRecord.length;i++){
            alert(eseRecord[i].pl.name+","+eseRecord[i].content);
        }*/
        //测试pl表
        /*for(var i = 0; i < plList.length;i++){
            alert(plList[i].name);
        }*/

        
    });
    //使用word导出log按钮
    $("#outputButton").click(function(){
        
        $("#outputLog").wordExport("log生成");
    });

    //设置按钮集
    $("#settingButton").click(function(){
        if($("#outputLog").html()!=null&&$("#outputLog").html()!=""){
            $("#settingModal").modal("show");
        }else{
            alert("没用用户");
        }
    });

    //显示时间筛选
    $("#timeFilterButton").click(function(){
        $("#timeFilterModal").modal("show");
    });

    /*$("#keeperSetButton").click(function(){
        $("#keeperModal").modal("show");
    });*/

    $("#contentSetButton").click(function(){
        $("#contentModal").modal("show");
    });

    $("#timeSwitch").click(function(){
        if(!timeFilterBoolean){
            $(this).removeClass("btn-info");
            $(this).text("时间 OFF");
            $(this).addClass("btn-warning");
        }else{
            $(this).removeClass("btn-warning");
            $(this).text("时间  ON");
            $(this).addClass("btn-info");
        }
        timeFilterBoolean = !timeFilterBoolean;
        dealRecord();
    });

    $("#picSwitch").click(function(){
        if(!picTextFilter){
            $(this).removeClass("btn-info");
            $(this).text("[图片] OFF");
            $(this).addClass("btn-warning");
        }else{
            $(this).removeClass("btn-warning");
            $(this).text("[图片]  ON");
            $(this).addClass("btn-info");
        }
        picTextFilter = !picTextFilter;
        dealRecord();
    });

    $("#commandSwitch").click(function(){
        if(!commandFilter){
            $(this).removeClass("btn-info");
            $(this).text("指令 OFF");
            $(this).addClass("btn-warning");
        }else{
            $(this).removeClass("btn-warning");
            $(this).text("指令  ON");
            $(this).addClass("btn-info");
        }
        commandFilter = !commandFilter;
        dealRecord();
    });

    $("#otherSwitch").click(function(){
        if(!otherFilter){
            $(this).removeClass("btn-info");
            $(this).text("括号内容 OFF");
            $(this).addClass("btn-warning");
        }else{
            $(this).removeClass("btn-warning");
            $(this).text("括号内容  ON");
            $(this).addClass("btn-info");
        }
        otherFilter = !otherFilter;
        dealRecord();
    });

    $("#timeFilterModalButton").click(function(){
        timefilter();
    });
})
$('#change').change(function(){
    $('#test1').val($(this).find('option:selected').data('test1'));
})


//读取拖拽文件js代码
function init(){
    var dest = document.getElementById("inputLog");
    dest.addEventListener("dragover", function(ev) 
    {
        ev.stopPropagation();
        ev.preventDefault();
    }, false);

    dest.addEventListener("dragend", function(ev) 
    {
        ev.stopPropagation();
        ev.preventDefault();
    }, false);

    dest.addEventListener("drop",function(ev){
        ev.stopPropagation();
        ev.preventDefault();

        var file = ev.dataTransfer.files[0];
        var reader = new FileReader();

        if (file.type.substr(0, 5) == "image") {
            reader.onload = function (event) {
                dest.style.background = 'url(' + event.target.result + ') no-repeat center';
                dest.innerHTML = "";
            };
            reader.readAsDataURL(file);
        }
        else if(file.type.substr(0,4) == "text") {

                reader.readAsText(file);
                reader.onload = function(f){
                    document.getElementById("text_log").value=this.result;
                }
            }
            else {
                dest.innerHTML = "暂不支持此类文件的预览";
                dest.style.background = "white";
            }
        },false);
    }

document.ondragover = function(e){e.preventDefault();};
document.ondrop = function(e){e.preventDefault();};

window.onload=init;

function getSelectsHTML(id){
    var selectId = "select_"+id;
    var html = "";
    html += "<select class='form-control' id='"+selectId+"' name='"+id+"' style='background-color:"+plList[id].color+";' onchange='changeColor("+id+")'>";
    for(var i = 0; i < colorList.length; i++){
        html += '<option value="'+colorList[i]+'" style="background-color:'+colorList[i]+';" ';
        if(colorList[i]==plList[id].color){
            html+='selected="selected"';
        }
        html +='>'+colorNameList[i] + '</option>';
    }
    html += "</select>";
    return html;
}

function validButtonSet(id){
    var bool = plList[id].valid;
    if(bool){
        return "<button class='btn btn-success button_player' id='valid_"+id+"' name='"+id+"' onclick='validUpdate("+id+");'> ON</button>";
    }else{
        return "<button class='btn btn-default button_player' id='valid_"+id+"' name='"+id+"' onclick='validUpdate("+id+");'>OFF</button>";
    }
}

function plSetting(name,id){
    var html = "";
    html = $("#plSetting").html().replace(/&name/g, name)
                .replace(/&id/g, id).replace('&select',getSelectsHTML(id))
                .replace('&validset',validButtonSet(id));
    return html;
}

function AllPlSetting(){
    var html = "";
    for(var i = 0; i < plList.length; i++){
        if(i%2==0){
            html += "<div class='row'>";
        }
        html+=plSetting(plList[i].name,i);
        if(i%2==1){
            html += "</div>";
        }
    }
    /*plSet();*/
    $("#colorselect").html(html);
}

function dealRecord(){
    eseRecord = [];
    var beginNum = 0;
    var logList = [];
    var data = $("#text_log").val();
    var regHeader = /\d{4}-\d{2}-\d{2} (\d{1,2}:\d{2}:\d{2}) (AM|PM)? ?([^\(]*)/;// 2016-01-03 \d{2}:\d{2}:\d{2}/g name
    var regHeader2 = /(.*?)(\([0-9]+\))? +(\d{1,2}:\d{2}:\d{2}).*/;// \d{2}:\d{2}:\d{2}/
    var regDiscard = /^(\.r|\.R|\/me|\.help|\.ww|。r|。R|、me|。ww).*/;
    var regOther = /^(\(|（).*/;
    var regPicText = /\[图片\]/;
    
    var dataList = data.split("\n");
    var momentContent = "";
    var name = "";
    var time = "";
    var date = "";
    var colorNum = 0;

    for(var i = 0;i<dataList.length; i++) {
        if(dataList[i].length == 0){continue;}
        var res = dataList[i].match(regHeader);
        var res2 = dataList[i].match(regHeader2);

        if(res != null|| res2 != null){
            if(res != null){
                name = res[3].trim();
                time = res[1];
                date = res[0].substr(0,10);
            }else if(res2 != null){
                name = res2[1].trim();
                time = res2[3];
            }
            if(name != "" && name != "系统消息"){
                if(!hasPL(name)){
                    addPL(name,colorList[colorNum]);
                    colorNum ++;
                }
            }
        }else{
            if(name == ""){continue;}
            if(name == "消息提醒"){continue;}

            if(commandFilter){
                var discard = dataList[i].match(regDiscard);
                if(discard != null){
                    continue;
                }
            }
            
            if(otherFilter){
                var other = dataList[i].match(regOther);
                if(other != null){
                    continue;
                }
            }
            
            if(picTextFilter){
                dataList[i] = dataList[i].replace(regPicText,"");
                if(dataList[i].length == 0){continue;}
            }

            if(time.length != 8){time = ' '+time;}

            setRecord(time,date,dataList[i],getPL(name));
        }
    }
    contentSetting();
}

function contentSetting(){
    $("#outputLog").html("");
    var html = "";
    var temporaryContent = "";
    for(var i = 0; i < eseRecord.length; i++){
        if(eseRecord[i].pl.valid){
            html += "<span style='color:"+eseRecord[i].pl.color+"'>";
            if(!timeFilterBoolean){
                html +="("+eseRecord[i].time+")";
            }
            //用户编辑模板
            if($("#contentTemplate").val()==""){
                html += eseRecord[i].pl.name;
                html += ":" + eseRecord[i].content;
            }else{
                temporaryContent = contentTemplate.replace(/&pl/g,eseRecord[i].pl.name).replace(/&content/g,eseRecord[i].content);
                html += temporaryContent;
            }

            //keeper预设模板（删）
            /*if(eseRecord[i].pl.isKp){
                temporaryContent = keeperContent.replace(/&kp/g,eseRecord[i].pl.name).replace(/&content/g,eseRecord[i].content);
                html += temporaryContent;
            }else if(!eseRecord[i].pl.isKp){
                html += eseRecord[i].pl.name;
                html += ":" + eseRecord[i].content;
            }*/
            html += "</span></br>";
        }
    }
    $("#outputLog").html(html);
}


function timefilter(){
    var startTime = $("#startTime").val();
    var startDate = $("#startDate").val();
    var endTime = $("#endTime").val();
    var newEseRecord = [];

    for(var i = 0; i < eseRecord.length; i++){
        if(startDate==eseRecord[i].date){
            if(eseRecord[i].time>=startTime&&eseRecord[i].time<=endTime){
                newEseRecord[newEseRecord.length] = eseRecord[i];
            }
        }
    }

    eseRecord = newEseRecord;
    contentSetting();
    $("#timeFilterModal").modal("hide");
}

function fixPlColorAndDisplay(){
    var select_Id = "#colorselect>div>div>#select_";
    var inputName = "#plname_";
    for(var i = 0; i < plList.length; i++){
        plList[i].color = $(select_Id+i).val();
        plList[i].name = $(inputName+i).val();

        var valid_id = "#valid_"+i;
        if($(valid_id).html()==" ON"){
            plList[i].valid = true;
        }else if($(valid_id).html()=="OFF"){
            plList[i].valid = false;
        }
    }

    AllPlSetting();
    contentSetting();
    $("#settingModal").modal("hide");
}

//当on按钮被点击时触发该事件
function validUpdate(id){
    var valid_id = "#valid_"+id;

    if($(valid_id).html()==" ON"){
        $(valid_id).removeClass("btn-success");
        $(valid_id).html("OFF");
        $(valid_id).addClass("btn-default");
    }else{
        $(valid_id).removeClass("btn-default");
        $(valid_id).html(" ON");
        $(valid_id).addClass("btn-success");
    }
}


//当修改颜色的时候调用该函数
function changeColor(id){
    var select_Id = "#colorselect>div>div>#select_"+id;
    $(select_Id).css("background-color",$(select_Id).val());
}


/*function plSet(){
    var html = "<select class='form-control' id='keeperSet'>";
        for(var i=0; i<plList.length;i++){
            html+="<option value='"+plList[i].name+"'>"+plList[i].name+"</option>"
        }
    html += "</select>";
    $("#plSet").html(html);
}*/

/*function keeperSet(){
    for(var i=0;i<plList.length;i++){
        plList[i].isKp = false;
        if(plList[i].name==$("#keeperSet").val()){
            plList[i].isKp = true;
        }
    }
    keeperContent = $("#keepTemplate").val();
    $("#keeperModal").modal("hide");
    contentSetting();
}*/

function contentSet(){
    contentTemplate = $("#contentTemplate").val();
    $("#contentModal").modal("hide");
    contentSetting();
}