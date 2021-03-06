﻿if (Globals.getCookie("SystemUserId") == null) {
    alert("请登录");
    location.href = "login.html";
}
var userJs, userVar;
var page;
var privilege = JSON.parse(Globals.getCookie("privilege"));
var roleid = Globals.getCookie("RoleId");
if ($.getUrlParam("page") == null || $.getUrlParam("page") == undefined) {
    page = 1;
} else {
    page = $.getUrlParam("page");
}
function initConfig() {
    //初始化模块JS
    userJs = new Globals.user();

    //页面变量
    userVar = {
    };

    (function () {
        $("#login").click(function () {
            if (confirm("确定注销？")) {
                location.href = "login.html";
            }
        });
        $("#btnNew").click(function () {
            location.href = "new-user.html";
        })
        $(document).ready(function () {
            $.ajax({
                type: "post",
                url: Globals.ServiceUrl + "GetUserCount",
                async: false,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    var s = JSON.parse(data.d);
                    if (s == 0) {
                        s=1
                    }
                    var pa = Math.ceil(s / 10);
                    $("#PageNo").text(page);
                    $("#totalPageNo").text(pa);
                }, error: function (xhr) {
                    alert("请联系管理员");
                    return false;
                }
            })
            Page((page-1)*10);
            $(".first").click(function () {
                if ($("#PageNo").text() != 1) {
                    $("#PageNo").text(1);
                    location.href = "user-list.html?page=" + "1";
                }
            })
            $(".before").click(function () {
                if ($("#PageNo").text() > 1) {
                    var number = parseInt($("#PageNo").text() - 1);
                    $("#PageNo").text(number);
                    location.href = "user-list.html?page=" + number;
                }
            })
            $(".last").click(function () {
                if ($("#PageNo").text() < $("#totalPageNo").text()) {
                    var number = parseInt($("#totalPageNo").text());
                    $("#PageNo").text(number);
                    location.href = "user-list.html?page=" + number;
                }
            })
            $(".next").click(function () {
                if (($("#PageNo").text() < $("#totalPageNo").text())) {
                    var number = parseInt($("#PageNo").text())+1;
                    $("#PageNo").text(number);
                    location.href = "user-list.html?page=" + number;
                }
            })
            $(".Go").click(function () {
                if (($("#totalPageNo").text() >= $("#pageNum").val() >= 1 && $("#pageNum").val() != $("#PageNo").val())) {
                    var number = parseInt($("#pageNum").val());
                    $("#PageNo").text(number);
                    location.href = "user-list.html?page=" + number;
                }
            })
           
        });


    })();
}

$(function () {
    initConfig();
});


function Page(p) {
    var jsonPar = {
        number:p
    }
    $.ajax({
        type: "post",
        url: Globals.ServiceUrl + "GetUserListA",
        //async: false,
        data:JSON.stringify(jsonPar),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var userList = JSON.parse(data.d);
            var tbody = $("#divUserList table tbody").empty();

            for (i in userList) {
                var content = "<td>" + userList[i].Name + "</td><td>" + userList[i].Username + "</td><td style='display:none' name='Id'>" + userList[i].SystemUserId + "</td><td style='display:none'name='roleid'>" +userList[i].RoleId+"</td><td>"+
                    userList[i].RoleIdName + "</td><td>" + userList[i].Email + "<ul class='actions'><li class='last'><a class='systemuser2 read1'style='display:none'>详情</a>  <a class='systemuser2 delete1' style='display:none' >删除</a></li></ul>" + "</td>";
                var row = document.createElement("tr");
                row.innerHTML = content;
                tbody.append(row);
            }
            for (var i in privilege) {
                if (privilege[i].CanDelete == true) {
                    $("." + privilege[i].Tablename + 2 + ".delete1").attr({ style: "display:inline" });
                }
                if (privilege[i].CanCreate == true) {
                    $("." + privilege[i].Tablename + 2 + ".create1").attr({ style: "display:inline" });
                }
                if (privilege[i].CanWrite == true) {
                    $("." + privilege[i].Tablename + 2 + ".edit1").attr({ style: "display:inline" });
                }
                if (privilege[i].CanRead == true) {
                    $("." + privilege[i].Tablename + 2 + ".read1").attr({ style: "display:inline" });

                }
            };
         

            $(".read1").click(function () {
                location.href = "user-profile.html?id=" + $(this).parent().parent().parent().parent().find("[name='Id']").text()
                + "&roleId=" + $(this).parent().parent().parent().parent().find("[name='roleid']").text()
            })

            $(".delete1").click(function () {
                if (confirm("确定删除？")) {
                    var jsonPara = {
                        userid: parseInt($(this).parent().parent().parent().parent().find("[name='Id']").text())
                    }
                    $.ajax({
                        type: "post",
                        url: Globals.ServiceUrl + "DeleteUser",
                        data: JSON.stringify(jsonPara),
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            var s = JSON.parse(data.d);
                            if (s) {
                                alert("删除成功");
                                window.location.reload();
                            } else {
                                alert("删除失败");
                                return false;
                            }
                        }, error: function (xhr) {
                            alert("请联系管理员");
                            return false;
                        }

                    })
                }
            })
        }
    
    });
}