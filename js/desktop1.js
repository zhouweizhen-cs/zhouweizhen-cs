$$.ready(function(){
    var feedBack=$("#float_tool").find(".i-icon-feedback");
    if(feedBack.size()>0){
    	feedBack.after("<span class='help_span'>帮助</span>");
    }
    var secret=$("#float_tool").find(".i-icon-user-secret");
    if(secret.size()>0){
    	secret.after("<span class='help_span'>委托</span>");
    }
    var publish=$("#float_tool").find(".i-icon-publish");
    if(publish.size()>0){
    	publish.after("<span class='help_span'>置顶</span>");
    }
    
    $(".tool_button").find("i").after('<p class="tool_button_p"></p>');
    $("#FormCommandReview").find(".tool_button_p").html("批注");
    $("#FormCommandSave").find(".tool_button_p").html("保存");
    $("#FormCommandPrint").find(".tool_button_p").html("打印");
    $("#FormCommandDownload").find(".tool_button_p").html("下载");
    $("#FormCommandPrintInvoice").find(".tool_button_p").html("打印小票");
    $("#FormCommandDebug").find(".tool_button_p").html("调试窗口");
    
    var myDate = new Date();
    var nowYear = myDate.getFullYear();
    var footerContent="Copyright "+nowYear+" South China Normal University. All Rights Reserved/华南师范大学 版权所有";
    $("#div_footer_copy_content").html(footerContent);
})