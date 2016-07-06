﻿var userJs, userVar;
var action = $.getUrlParam("action");
var id = $.getUrlParam("id");
var invokeMethod = action == "Create" ? "CreateUser" : "0"


function initConfig() {
    //初始化模块JS
    userJs = new Globals.user();

    //页面变量
    userVar = {

    };

    (function () {


        $("#btnSave").click(function () {

            jsonPara = {
                user: {
                    Name: $("#txtName").val(),
                    Username: $("#txtUsername").val(),
                    Password: hex_md5($("#pwdPassword").val()),
                }
            };

            $.ajax({
                type: "post",
                url: Globals.ServiceUrl + invokeMethod,
                data: JSON.stringify(jsonPara),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data.d) {
                        alert("创建成功");
                        location.href = "user-list.html";
                    }
                    else {
                        alert("错误");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest.status);
                    alert(XMLHttpRequest.readyState);
                    alert(textStatus);
                }
            });
        });


    })();
}

$(function () {
    initConfig();
});


