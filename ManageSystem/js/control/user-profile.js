﻿/// <reference path="../../Page/child/edit-user.html" />
if (Globals.getCookie("SystemUserId") == null) {
    alert("请登录");
    location.href = "login.html";
}
var userJs, userVar;
var id = $.getUrlParam("id");
var roleid = $.getUrlParam("roleId");
var SystemUserId = Globals.getCookie("SystemUserId");
    function initConfig() {
        //初始化模块JS
        userJs = new Globals.user();

        //页面变量
        userVar = {

        };

        (function () {


            $(document).ready(function () {
                $("#myModal .modal-body").load("child/edit-user.html");
                $("#login").click(function () {
                    if (confirm("确定注销？")) {
                        location.href = "login.html";
                    }
                });
                $("#changepwd").click(function () {
                    location.href = "changeuserpwd.html?id=" + id;
                })
                $.ajax({
                    type: "post",
                    url: Globals.ServiceUrl + "GetRoleList",
                   // async: false,
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        var s = JSON.parse(data.d);
                        var option = $("#role").empty();
                        for (var i in s) {
                            option.append($("<option>").val(s[i].RoleId).text(s[i].RoleName))
                        }
                        $('#role').selectpicker('refresh');
                        $("#role option").attr("selected", false);
                        $("#role option[value=" + roleid + "]").attr("selected", true);
                        $("#role").val(roleid);
                        $('#role').selectpicker('refresh');
                    }, error: function (xhr) {
                        alert("请联系管理员");
                        return false;
                    }
                });
                if (id != null && id != "") {           
                   var jsonPara = {
                        userId: id
                    };
                    $.ajax({
                        type: "post",
                        url: Globals.ServiceUrl + "GetUserById",
                        //async: false,
                        data: JSON.stringify(jsonPara),
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            var s = JSON.parse(data.d);
                            if (s == null) {
                                alert("用户不存在");
                                location.href = "user-list.html";
                            } else {
                                $("#txtName").val(s.Name);
                                $("#txtUsername").val(s.Username);
                                $("#pDescription").val(s.Description);
                                $("#UserCode").val(s.UserCode);
                                $("#rolename").val(s.RoleIdName);
                                $("#Email").val(s.Email);
                                $("#Description").text(s.Description);
                           
                                $("#name").val(s.Name);
                                $("#username").val(s.Username);
                                $("#usercode").val(s.UserCode);
                                $("#email").val(s.Email);
                                $("#description").val(s.Description);
                                $("#systemuserid").val(s.SystemUserId);
                            }
                           
                        }, error: function (xhr) {
                            alert("请联系管理员");
                            return false;
                        }
                    });
                } else {
                    alert("用户不存在");
                    location.href = "user-list.html";
                }
                });
                
          
            $(".customer2.delete1").click(function () {
                jsonPara = {
                    userId: id
                };

                if (confirm("确认要删除该用户?")) {
                    $.ajax({
                        type: "post",
                        url: Globals.ServiceUrl + "Delete",
                        data: JSON.stringify(jsonPara),
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            if (data.d) {
                                alert("删除成功");
                                location.href = "user-list.html";
                            }
                            else
                                alert("删除失败");
                            return false;
                        }, error: function (xhr) {
                            alert("请联系管理员");
                            return false;
                        }
                        
                        
                    });
                }
            });
            $("#savechange").click(function () {
                var jsonPara = {
                    user: {
                        name: $("#name").val(),
                        usercode: Globals.trim($("#usercode").val()),
                        roleid: $("#role").val(),
                        email: $("#email").val(),
                        description: $("#description").val(),
                        systemuserid: $("#systemuserid").val(),
                        ModifiedBy:SystemUserId
                    }
                }

                $.ajax({
                    type: "post",
                    url: Globals.ServiceUrl + "UpdateUser",
                    data: JSON.stringify(jsonPara),
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        var s = JSON.parse(data.d);
                        if (s) {
                            alert("更新成功");
                            window.location.reload();
                        } else {
                            alert("更新失败");
                            return false;
                        }
                    }, error: function (xhr) {
                        alert("请联系管理员");
                        return false;
                    }
                })
            });
       
        })();
    }

    $(function () {
        initConfig();
    });


