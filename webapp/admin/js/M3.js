try{if(jQuery){}}catch(err){$('head').append('<script type="text/javascript" src="${pageContext.request.contextPath}/js/jQuery/jquery-1.11.3.min.js"></script>');}
;(function($){

    window.M3 = {
        tLog : tLog,
        urlToData : urlToData,
        postInfo : postInfo,
        tabFunc : tabFunc,
        addtable: addtable,
        serialize : serialize,
        addList : addList,
        paging : paging,
        checkAll : checkAll,
        formatDate : formatDate
    };
    // 输入 关键字 取得 url 中的相应 值，不输入关键字取得所有值。
    function urlToData(key){
        var dataObj = {};
        var url = location.href;
        var arr1 = url.split('?');
        var arr2 =  arr1[1].split('&');
        for(var i = 0; i < arr2.length; i++){
            var arr3 = arr2[i].split('=');
            dataObj[arr3[0]] = arr3[1];
        }
        if(key){
            return dataObj[key];
        }else {
            return dataObj;
        }
    }
    // 打印方法，依据 输入内容 在控制台打印 相应值。
    function tLog(str, num){
        if(num){
            if(typeof(str) === 'string'){
                console.log('第 ' + num + ' 行，' + '输出' + str);
            }else {
                console.log('第 ' + num + ' 行，');
                console.log(str);
            }
        }else {
            console.log(str);
        }
    }
    // 依据 输入内容 取得 后台数据 return 出来。
    function postInfo(urlStr/* 请求的url */, lastdata/* 发往后台的数据 */, successBack/* 成功后的回掉函数 */, errBack/* 请求失败的回掉函数 */){
        var dataObj = null;
        if(typeof(lastdata) === 'string'){
            var contType = 'application/x-www-form-urlencoded; charset=UTF-8';
            var nowData = lastdata;
            var type = 'post';
        }else if(typeof(lastdata) === 'object'){
            var contType = 'application/json;charset=UTF-8'; 
            var nowData = JSON.stringify(lastdata);
            var type = 'post';
        }

        $.ajax({
            type: type,
            async: false,
            url : '/control/' + urlStr + '.do',
            data: nowData,
            datatype: 'json',
            contentType: contType,
            success: function(data){
                var jdata = data;
                if(typeof(data) === 'string'){
                    jdata = JSON.parse(data);
                }
                dataObj = jdata;
                successBack(jdata);
            },
            error: function(e){
                if(errBack){
                    errBack();
                }
            }
        });
        if(dataObj != null){
            return dataObj;
        }
    }
    // tab 头需要加 class="tab_title_box" tab头下的子 加 tabId,
    // tab 体加 class="tab_content_box" tab 体下子加 tabItem, tabId值与tabItem值相对应。
    function tabFunc(){
        tLog('tabFunc 正在工作');
        
        $('.tab_title_box [tabId]').mousedown(function(){
            $(this).addClass('tab_select').siblings().removeClass('tab_select');
            var _index = $(this).attr('tabId');
            $('.tab_content_box [tabItem=' + _index + ']').removeClass('hide').siblings().addClass('hide');
        });
    }
    // 表格添加数据。
    function addtable(arr, listArr, $box, callback){
        $box.empty();
        var flag = true;
        $(arr).each(function(idx, item){
            var $tr = $('<tr></tr>');
            $(listArr).each(function(num, ele){
                for(var i in item){
                    if(i == ele){
                        var $td = $('<td data-key="' + ele + '">' + item[ele] + '</td>');
                        $tr.append($td);
                        flag = false;
                    }
                }
                if(flag){
                    var $td = $('<td data-key="' + ele + '">数据为空</td>');
                    $tr.append($td);
                }
            });
            $tr.append('<td data-key="control"></td>');
            $box.append($tr);
        });
        if(callback){
            callback($box, arr);
        }
    }
    // ul 列表数据
    function addList(arr, listArr/*排序数组*/, $box, callback){
        $box.empty();
        $(arr).each(function(idx, item){
            var $ul = $('<ul></ul>');
            $(listArr).each(function(num, ele){
                for(var i in item){
                    if(i == ele){
                        var $li = $('<li data-key="' + ele + '">' + item[ele] + '</li>');
                        $ul.append($li);
                    }
                }
            });
            $ul.append('<li class="control" data-key="control" data-id="' + item.id + '"></li>');
            $box.append($ul);
        });
        if(callback){
            callback($box,arr);
        }
    }

    
    // 表单序列化
    // function serialize($form/* 需要序列化的表单 */){
    //     var dataObj = {};
    //     $form.find('[M-form-select-key]').each(function(idx, item){
    //         var keyStr = $(item).attr('[M-form-select-key]');
    //         $(item).find('M-form-select-val').change(function(){
    //             $(this).
    //         });
    //     });
    //     $form.find('[M-form-select-key]').find('[M-form-select-val]').change(function(){
    //         var classStr = '';
    //         $(this).parent().find('[M-form-select-val]').each(function(i, item){
    //             classStr = $(item).attr('class');
    //             if( )
    //         })
    //     })
    //     $form.find('[M-form-key]').each(function(idx, item){
    //         var $that = $(item);
    //         if(item.tagName == 'INPUT'){
    //             dataObj[$(item).attr('M-form-key')] = $(item).attr('M-form-val')
    //         }
    //     });
    // }
    function serialize($form,callback){
        var dataObj = {};
        $form.find('[M-form-key]').each(function(i, item){
            dataObj[$(item).attr('M-form-key')] = $(item).val();
        });
        //callback(dataObj);
        return dataObj;
    }
    // 分页
    function paging($div, data, callback){
        if(!$div.createPage){
            $('head').append('<script type="text/javascript" src="${pageContext.request.contextPath}/js/jQuery/jquery.page.js"></script>');
        }
        $div.createPage({
            pageCount: data.totalPages,
            current: data.pageNum,
            backFn: function (p) {
                if(callback){
                    callback(p);
                }
            }
        });
    }
    // 多选按钮事件
    
    function checkAll($box, $allBtn, callback) {
        var allInputNum = $box.find('[type="checkbox"]').length;
        $box.find('[type="checkbox"]').unbind().click(function(e) {
            var nextNum = $box.find(':checked').length;
            if (nextNum != allInputNum) {
                $allBtn[0].checked = false;
            } else if (nextNum == allInputNum) {
                $allBtn[0].checked = true;
            }

            if (callback) {
                callback();
            }
        });
        $allBtn.unbind().click(function() {
            var flag = this.checked;
            $box.find('[type="checkbox"]').each(function(i, item) {
                item.checked = flag;
            });
            if (callback) {
                callback();
            }
        });
    }
    // 删除数组中的指定元素。
    function removeByValue(arr, val) {
        for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    }
    // 事件格式化控件
    function formatDate(date, fmt/* 格式 */){
        date = (date == undefined ? new Date() : parseInt(date)||date);
        date = (typeof date == 'number' ? new Date(date) : date);
        fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
        var obj =
        {
            'y': date.getFullYear(), // 年份，注意必须用getFullYear
            'M': date.getMonth() + 1, // 月份，注意是从0-11
            'd': date.getDate(), // 日期
            'q': Math.floor((date.getMonth() + 3) / 3), // 季度
            'w': date.getDay(), // 星期，注意是0-6
            'H': date.getHours(), // 24小时制
            'h': date.getHours() % 12 == 0 ? ("上午"+12): ("下午"+date.getHours() % 12), // 12小时制
            'm': date.getMinutes(), // 分钟
            's': date.getSeconds(), // 秒
            'S': date.getMilliseconds() // 毫秒
        };
        var week = ['日', '一', '二', '三', '四', '五', '六'];
        for(var i in obj)
        {
            fmt = fmt.replace(new RegExp(i+'+', 'g'), function(m)
            {
                var val = obj[i] + '';
                if(i == 'w') return (m.length > 2 ? '星期' : '周') + week[val];
                for(var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
                //return m.length == 1 ? val : val.substring(val.length - m.length);  //该句为截取，暂保留
                return val
            });
        }
        return fmt;
    };
})(jQuery);