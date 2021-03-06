﻿if (Globals.getCookie("SystemUserId") == null) {
    alert("请登录");
    location.href = "login.html";
}
var systemuserid = Globals.getCookie("SystemUserId");
var roleid = Globals.getCookie("RoleId");
var page;
var GetList;
var projectid;
var privilege = JSON.parse(Globals.getCookie("privilege"));
if ($.getUrlParam("projectId") == null || $.getUrlParam("projectId")==undefined) {
    projectid = 0;
} else {
    projectid = $.getUrlParam("projectId");
}
if ($.getUrlParam("page") == null || $.getUrlParam("page") == undefined) {
    page = 1;
} else {
    page = $.getUrlParam("page");
}
$(function () {
    if (projectid == 0) {
        GetList="SelectTask"
    } else {
        GetList="GetTaskListByPId"
    }
    $("#login").click(function () {
        if (confirm("确定注销？")) {
            location.href = "login.html";
        }
    });
    $.ajax({
        type: "post",
        url: Globals.ServiceUrl + "GetTaskCount",
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
    Page((page - 1) * 10);
    var jsonPa = {
        roleId: roleid,
        systemuserId:systemuserid
    }
    $.ajax({
        type: "post",
        url: Globals.ServiceUrl + "GetProjectIdList",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(jsonPa),
        success: function (data) {;
            var projectList = JSON.parse(data.d);
            var option = $("#projectid").empty();
            option.append($("<option>").val(0).text("所有项目"));
            for (var i in projectList) {
                option.append($("<option>").val(projectList[i].ProjectId).text(projectList[i].Name))
            }
            $("#projectid option").attr("selected", false);
            $("#projectid option[val=" + projectid + "]").attr("selected", true);
            $("#projectid").val(projectid);
            $("#projectid").select2();
           
           
        }, error: function (xhr) {
            alert(xhr);
        }
    });
    $("#projectid").change(function () {
        location.href = "task-list.html?projectId=" + $("#projectid").val();
    })
    $(".first").click(function () {
        if ($("#PageNo").text() != 1) {
            $("#PageNo").text(1);
            location.href = "task-list.html?page=" + "1";
        }
    })
    $(".before").click(function () {
        if ($("#PageNo").text() > 1) {
            var number = parseInt($("#PageNo").text() - 1);
            $("#PageNo").text(number);
            location.href = "task-list.html?page=" + number;
        }
    })
    $(".last").click(function () {
        if ($("#PageNo").text() < $("#totalPageNo").text()) {
            var number = parseInt($("#totalPageNo").text());
            $("#PageNo").text(number);
            location.href = "task-list.html?page=" + number;
        }
    })
    $(".next").click(function () {
        if (($("#PageNo").text() < $("#totalPageNo").text())) {
            var number = parseInt($("#PageNo").text())+1;
            $("#PageNo").text(number);
            location.href = "task-list.html?page=" + number;
        }
    })
    $(".Go").click(function () {
        if (($("#totalPageNo").text() >= $("#pageNum").val() >= 1 && $("#pageNum").val() != $("#PageNo").val())) {
            var number = parseInt($("#pageNum").val());
            $("#PageNo").text(number);
            location.href = "task-list.html?page=" + number;
        }
    })



   
  
})
function Page(p) {
    var jsonPar = {
        number: p,
        systemuserId: systemuserid,
        roleId: roleid,
        projectId:projectid
    }
    $.ajax({
        type: "post",
        contentType: "application/json; charset=utf-8",
        url: Globals.ServiceUrl +GetList ,
        
        data: JSON.stringify(jsonPar),
        success: function (data) {
            var s = JSON.parse(data.d);
            var tbody = $(".table tbody").empty();
            for (var i in s) {
                var estart = Globals.datetime_is_null(s[i].EstimatedStart);
                var eend = Globals.datetime_is_null(s[i].EstimatedEnd); 

                var astart = Globals.datetime_is_null(s[i].ActualStart);
                var aend = Globals.datetime_is_null(s[i].ActualEnd);
                var con = "<td>" + s[i].Name + "</td><td>" + s[i].ProjectName + "</td><td>" + s[i].RoomName + "</td><td>" + s[i].Tester1IdName + "</td><td>" + s[i].Tester2IdName + "</td><td>" + estart +
                    "</td><td name='tester1'style='display:none'>"+s[i].Tester1+"</td><td name='tester2'style='display:none'>"+s[i].Tester2+"</td><td name='roomid'style='display:none'>"+s[i].RoomId+
                    "</td><td>" + eend + "</td><td>" + astart + "</td><td>" + aend + " <ul class='actions'><li class='last'><a href='#myModal' data-toggle='modal' class='task2 read1'style='display:none'>详情</a> <a class='task2 delete1'style='display:none'>删除</a></li></ul>" +
                    "</td><td style='display:none' name='taskid'>" + s[i].TaskId + "</td><td name='projectstatuscode'style='display:none'>"+s[i].ProjectStatusCode+"</td>"
                var row = document.createElement("tr");
                row.innerHTML = con;
                tbody.append(row)
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


            $(".task2.read1").click(function () {
                
                location.href = "task-profile.html?taskid=" + $(this).parent().parent().parent().parent().find("[name='taskid']").text() + "&projectstatuscode=" +
                    $(this).parent().parent().parent().parent().find("[name='projectstatuscode']").text()
                + "&tester1=" + $(this).parent().parent().parent().parent().find("[name='tester1']").text()
                + "&tester2=" + $(this).parent().parent().parent().parent().find("[name='tester2']").text()
                + "&roomid=" + $(this).parent().parent().parent().parent().find("[name='roomid']").text();
                })
      
           
            $(".task2.delete1").click(function () {
                var s = $(this).parent().parent().parent().parent().find("[name='projectstatuscode']").text()
                if (s > 2) {
                    alert("无法删除")
                } else {
                    if (confirm("删除吗？")) {
                        var jsonPar = {
                            taskid: $(this).parent().parent().parent().parent().find("[name='taskid']").text()
                        }
                        $.ajax({
                            type: "post",
                            url: Globals.ServiceUrl + "DeleteTask",
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify(jsonPar),
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
                }
           

            })

        }, error: function (xhr) {
            alert(xhr);
            return false;
        }
    })
}